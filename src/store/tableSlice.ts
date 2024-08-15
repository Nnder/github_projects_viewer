import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
    SetOrderPayload,
    SetPagePayload,
    SetRowsPerPagePayload,
    SetSelectedRow,
    SetTablePayload,
    TableState,
} from './types';

// store для таблицы
export const counterSlice = createSlice({
    name: 'table',
    initialState: {
        page: 0,
        repositoryCount: 10,
        rowsPerPage: 10,
        order: 'desc',
        orderBy: 'name',
        after: null,
        before: null,
        selected: { repo: '', owner: '' },
    } as TableState,
    reducers: {
        setTable: (state, action: PayloadAction<SetTablePayload>) => {
            state.rowsPerPage = action.payload.rowsPerPage;
            state.page = action.payload.page;

            state.order = action.payload.order;
            state.orderBy = action.payload.orderBy;

            state.after = action.payload.after;
            state.before = action.payload.before;
        },
        setRepositoryCount: (
            state,
            action: PayloadAction<{ repositoryCount: number }>,
        ) => {
            state.repositoryCount = action.payload.repositoryCount;
        },
        setCursor: (
            state,
            action: PayloadAction<{ after: string; before: string }>,
        ) => {
            state.after = action.payload.after;
            state.before = action.payload.before;
        },
        setPage: (state, action: PayloadAction<SetPagePayload>) => {
            state.page = action.payload.page;
            state.after = action.payload.after;
            state.before = action.payload.before;
        },
        setOrder: (state, action: PayloadAction<SetOrderPayload>) => {
            state.order = action.payload.order;
            state.orderBy = action.payload.orderBy;
            state.page = 0;
        },
        setRowsPerPage: (
            state,
            action: PayloadAction<SetRowsPerPagePayload>,
        ) => {
            state.rowsPerPage = action.payload.rowsPerPage;
        },
        selectRow: (state, action: PayloadAction<SetSelectedRow>) => {
            state.selected = action.payload.selected;
        },
        resetTable: (state) => {
            state.repositoryCount = 10;
            state.page = 0;
            state.rowsPerPage = 10;
            state.orderBy = 'name';
            state.order = 'desc';
            state.after = null;
            state.before = null;
        },
    },
});

export const {
    setTable,
    setRepositoryCount,
    setCursor,
    setPage,
    setOrder,
    setRowsPerPage,
    selectRow,
    resetTable,
} = counterSlice.actions;
