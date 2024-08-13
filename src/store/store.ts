import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import { repositoryApi } from './repository';
import { counterSlice } from './tableSlice';

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
