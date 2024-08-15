export type Order = 'asc' | 'desc';
export interface SelectedRepo {
    owner: string;
    repo: string;
}

export interface Data {
    id: string;
    language: number;
    stars: number;
    forks: number;
    name: string;
    updated: number;
}

export interface HeadCell {
    id: keyof Data;
    label: string;
    numeric: boolean;
}

export interface EnhancedTableProps {
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}
