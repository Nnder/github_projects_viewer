import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IGitHubResponse, QueryParams } from './types';

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
    }),
});

export const { useGetRepositoriesByNameQuery } = repositoryApi;
