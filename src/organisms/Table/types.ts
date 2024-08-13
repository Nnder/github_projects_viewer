import { ISeachQuery } from '../../store/types';

export type Order = 'asc' | 'desc';

export interface Data {
    id: number;
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

export interface ISeachProps {
    search: ISeachQuery;
}
