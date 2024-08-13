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
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    repositoryCount: number;
}

export interface IGitHubResponse {
    data: {
        search: ISeachQuery;
    };
}

export interface TableState {
    page: number;
    repositoryCount: number;
    rowsPerPage: number;
    order: 'asc' | 'desc';
    orderBy: string;
    cursor: string | null;
    selected: string;
}

export interface SetPagePayload {
    page: number;
    cursor: string | null;
}

export interface SetOrderPayload {
    order: 'asc' | 'desc';
    orderBy: string;
}

export interface SetRowsPerPagePayload {
    rowsPerPage: number;
}

export interface SetSelectedRow {
    selected: string;
}

export interface QueryParams {
    name: string;
    count: number;
    after: string | null;
}

export interface ILicense {
    name: string;
    spdxId: string;
    url: string;
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
