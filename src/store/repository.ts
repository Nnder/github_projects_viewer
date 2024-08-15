import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IGitHubResponse, IRepoResponse, QueryParams } from './types';
import { SelectedRepo } from '../organisms/Table/types';

const token = import.meta.env.VITE_GITHUB_TOKEN as string;

const nextQuery = `query SearchRepositories($query: String!, $first: Int!, $after: String) {
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
                    endCursor
                    hasNextPage
                    startCursor
                    hasPreviousPage
                  }
                }
              }`;

const prevQuery = `query SearchRepositories($query: String!, $last: Int!, $before: String) {
                search(query: $query, type: REPOSITORY, last: $last, before: $before) {
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
                    endCursor
                    hasNextPage
                    startCursor
                    hasPreviousPage
                  }
                }
              }`;

// получение данных с GitHub GraphQL api
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
                    query: q.count ? nextQuery : prevQuery,
                    variables: {
                        query: q.name,
                        first: q.count,
                        after: q.after,
                        before: q.before,
                        last: q.last,
                    },
                }),
            }),
        }),

        getRepositoryByName: builder.query<
            { data: { repository: IRepoResponse } },
            SelectedRepo
        >({
            query: ({ owner, repo }: SelectedRepo) => ({
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
                        name: repo,
                    },
                }),
            }),
        }),
    }),
});

export const { useGetRepositoriesByNameQuery, useGetRepositoryByNameQuery } =
    repositoryApi;
