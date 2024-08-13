import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
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
