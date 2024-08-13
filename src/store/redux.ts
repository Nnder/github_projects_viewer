import {
    createSlice,
    configureStore,
    combineReducers,
    PayloadAction,
} from '@reduxjs/toolkit';
import {
    createApi,
    fetchBaseQuery,
    setupListeners,
} from '@reduxjs/toolkit/query/react';
import {
    IGitHubResponse,
    QueryParams,
    SetOrderPayload,
    SetPagePayload,
    SetRowsPerPagePayload,
    TableState,
} from './types';

export const counterSlice = createSlice({
    name: 'table',
    initialState: {
        page: 0,
        repositoryCount: 10,
        rowsPerPage: 10,
        order: 'desc',
        orderBy: 'name',
        cursor: '',
    } as TableState,
    reducers: {
        setRepositoryCount: (
            state,
            action: PayloadAction<{ repositoryCount: number }>,
        ) => {
            state.repositoryCount = action.payload.repositoryCount;
        },
        setCursor: (state, action: PayloadAction<{ cursor: string }>) => {
            state.cursor = action.payload.cursor;
        },
        setPage: (state, action: PayloadAction<SetPagePayload>) => {
            state.page = action.payload.page;
            state.cursor = action.payload.cursor;
        },
        setOrder: (state, action: PayloadAction<SetOrderPayload>) => {
            state.order = action.payload.order;
            state.orderBy = action.payload.orderBy;
        },
        setRowsPerPage: (
            state,
            action: PayloadAction<SetRowsPerPagePayload>,
        ) => {
            state.rowsPerPage = action.payload.rowsPerPage;
        },
        resetTable: (state) => {
            state.repositoryCount = 10;
            state.page = 0;
            state.rowsPerPage = 10;
            state.orderBy = 'name';
            state.order = 'desc';
        },
    },
});

export const {
    setRepositoryCount,
    setCursor,
    setPage,
    setOrder,
    setRowsPerPage,
    resetTable,
} = counterSlice.actions;

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

const rootReducer = combineReducers({
    [repositoryApi.reducerPath]: repositoryApi.reducer,
    repos: counterSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(repositoryApi.middleware),
});

setupListeners(store.dispatch);
