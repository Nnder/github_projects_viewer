import { Order, SelectedRepo } from '../organisms/Table/types';

type Cursor = string | null;

export interface TableState {
    page: number;
    repositoryCount: number;
    rowsPerPage: number;
    order: Order;
    orderBy: string;
    after: Cursor;
    before: Cursor;
    selected: SelectedRepo;
}

export interface SetTablePayload {
    rowsPerPage: number;
    page: number;
    order: Order;
    orderBy: string;
    after: Cursor;
    before: Cursor;
}

export interface SetPagePayload {
    page: number;
    after: Cursor;
    before: Cursor;
}

export interface SetOrderPayload {
    order: Order;
    orderBy: string;
}

export interface SetRowsPerPagePayload {
    rowsPerPage: number;
}

export interface SetSelectedRow {
    selected: SelectedRepo;
}

export interface QueryParams {
    name: string;
    count: number | null;
    after: Cursor;
    before: Cursor;
    last: number | null;
}

export interface ILicense {
    name: string;
    spdxId: string;
    url: string;
}

export interface IRepository {
    id: string;
    name: string;
    description: string;
    stargazerCount: number;
    forkCount: number;
    pushedAt: string;
    owner: { login: string };
    primaryLanguage: { name: string } | null;
}

export interface ISeachQuery {
    edges: [{ cursor: string; node: IRepository }];
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        endCursor: string;
        startCursor: string;
    };
    repositoryCount: number;
}

export interface IGitHubResponse {
    data: {
        search: ISeachQuery;
    };
}

export interface IRepoResponse {
    name: string;
    url: string;
    stargazerCount: number;
    primaryLanguage: { name: string } | null;
    repositoryTopics: {
        edges: { node: { topic: { name: string } } }[];
    };
    licenseInfo: ILicense | null;
}
