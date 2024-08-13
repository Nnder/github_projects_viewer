import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IGitHubResponse, IRepoResponse, QueryParams } from './types';

const token = import.meta.env.VITE_GITHUB_TOKEN as string;

export const repositoryApi = createApi({
    reducerPath: 'repositoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.github.com/graphql',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            headers.set('Authorization', `bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Repository'],
    endpoints: (builder) => ({
        getRepositoriesByName: builder.query<IGitHubResponse, QueryParams>({
            query: (q: QueryParams) => ({
                url: 'https://api.github.com/graphql',
                method: 'POST',
                body: JSON.stringify({
                    query: `query SearchRepositories($query: String!, $first: Int!, $after: String) {
                search(query: $query, type: REPOSITORY, first: $first, after: $after) {
                  repositoryCount
                  edges {
                    cursor
                    node {
                      ... on Repository {
                        id
                        name
                        owner {
                          login
                        }
                        url
                        description
                        stargazerCount
                        forkCount
                        pushedAt
                        primaryLanguage {
                          name
                        }
                      }
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }`,
                    variables: {
                        query: q.name,
                        first: q.count,
                        after: q.after,
                    },
                }),
            }),
        }),

        getRepositoryByName: builder.query<
            { data: { repository: IRepoResponse } },
            { owner: string; name: string }
        >({
            query: ({ owner, name }: { owner: string; name: string }) => ({
                url: 'https://api.github.com/graphql',
                method: 'POST',
                body: JSON.stringify({
                    query: `query($owner: String!, $name: String!) {
                          repository(owner: $owner, name: $name) {
                            name
                            stargazerCount
                            url
                            primaryLanguage {
                              name
                            }
                            repositoryTopics(first: 5) {
                            edges {
                              node {
                                topic {
                                  name
                                  }
                                }
                              }
                            }
                            licenseInfo {
                              name
                              spdxId
                              url
                            }
                          }
                        }`,
                    variables: {
                        owner,
                        name,
                    },
                }),
            }),
        }),
    }),
});

export const { useGetRepositoriesByNameQuery, useGetRepositoryByNameQuery } =
    repositoryApi;
