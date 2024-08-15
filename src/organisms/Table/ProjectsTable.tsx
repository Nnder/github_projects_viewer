import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Data, EnhancedTableProps, HeadCell } from './types';
import { ISeachQuery, TableState } from '../../store/types';
import {
    setOrder as setOrderStore,
    resetTable,
    setPage,
    setRowsPerPage,
    selectRow,
} from '../../store/tableSlice';

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        label: 'Название',
    },
    {
        id: 'language',
        numeric: true,
        label: 'Язык',
    },
    {
        id: 'forks',
        numeric: true,
        label: 'Число форков',
    },
    {
        id: 'stars',
        numeric: true,
        label: 'Число звезд',
    },
    {
        id: 'updated',
        numeric: true,
        label: 'Дата обновления',
    },
];

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;

    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    console.log(order, orderBy);

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </Box>
                            ) : null}

                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function EnhancedTable({ search }: { search: ISeachQuery }) {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    const { rowsPerPage, orderBy, order, repositoryCount, selected, page } =
        useSelector(({ repos }: { repos: TableState }) => repos);

    const [pageCounter, setPageCounter] = React.useState(page);
    const [rowsOnPage, setRowsOnPage] = React.useState(rowsPerPage ?? 10);

    const { edges, pageInfo } = search;

    console.log(orderBy, order);

    // sort:forks-asc
    // 1. sort:stars - сортировка по количеству звезд.
    // 2. sort:forks - сортировка по количеству форков.
    // 3. sort:updated - сортировка по дате последнего обновления.

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        console.log(event.target, 'handle sort');
        const isDesc = orderBy === property && order === 'desc';

        setPageCounter(0);
        dispatch(
            setOrderStore({
                order: isDesc ? 'asc' : 'desc',
                orderBy: property,
            }),
        );
        setParams((prev) => {
            prev.set('order', isDesc ? 'asc' : 'desc');
            prev.set('orderBy', property);
            return prev;
        });
    };

    const handleClick = (owner: string, repo: string) => {
        dispatch(selectRow({ selected: { repo, owner } }));
        setParams((prev) => {
            prev.set('owner', owner);
            prev.set('repo', repo);
            return prev;
        });
        console.log(params);
    };

    // Через Graphql получаю первый и последний cursor, по ним перехожу на следующею и предыдущею страницу.
    // также записываю их в store

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number,
    ) => {
        if (event) {
            if (
                newPage > pageCounter &&
                pageInfo.hasNextPage &&
                pageInfo.endCursor
            ) {
                setPageCounter(newPage);
                setParams((prev) => {
                    prev.set('after', pageInfo.endCursor);
                    prev.set('before', '');
                    prev.set('page', newPage.toString());
                    return prev;
                });

                dispatch(
                    setPage({
                        page: newPage,
                        after: pageInfo.endCursor,
                        before: null,
                    }),
                );
            } else if (
                newPage < pageCounter &&
                pageInfo.hasPreviousPage &&
                pageInfo.startCursor
            ) {
                setPageCounter(newPage);
                setParams((prev) => {
                    prev.set('after', '');
                    prev.set('before', pageInfo.startCursor ?? '');
                    prev.set('page', newPage.toString());
                    return prev;
                });

                dispatch(
                    setPage({
                        page: newPage,
                        after: null,
                        before: pageInfo.startCursor,
                    }),
                );
            } else {
                setPageCounter(0);
                console.log('No more pages');
            }
        }
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const rows = parseInt(event.target.value, 10);
        setRowsOnPage(rows);
        setPageCounter(0);
        dispatch(resetTable());
        dispatch(setRowsPerPage({ rowsPerPage: rows }));
        setParams((prev) => {
            prev.set('rows', rows.toString());
            prev.set('after', '');
            prev.set('before', '');
            prev.set('page', '0');
            return prev;
        });
    };

    const emptyRows =
        pageCounter > 0
            ? Math.max(0, (1 + pageCounter) * rowsPerPage - repositoryCount)
            : 0;

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <TableContainer>
                <Table sx={{ minWidth: 480 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={edges.length}
                    />
                    <TableBody>
                        {edges.map(({ node }) => {
                            const s =
                                selected.owner === node.owner.login &&
                                selected.repo === node.name;
                            return (
                                <TableRow
                                    hover
                                    onClick={() =>
                                        handleClick(node.owner.login, node.name)
                                    }
                                    tabIndex={-1}
                                    key={node.id}
                                    sx={{
                                        cursor: 'pointer',
                                        backgroundColor: s
                                            ? 'rgba(33, 150, 243, 0.1)'
                                            : 'inherit',
                                    }}
                                >
                                    <TableCell align="left">
                                        {node.name.length > 30
                                            ? `${node.name.slice(0, 28)}...`
                                            : (node.name ?? '-')}
                                    </TableCell>
                                    <TableCell align="left">
                                        {node.primaryLanguage
                                            ? node.primaryLanguage.name
                                            : '-'}
                                    </TableCell>
                                    <TableCell align="left">
                                        {node.forkCount ?? '0'}
                                    </TableCell>
                                    <TableCell align="left">
                                        {node.stargazerCount ?? '0'}
                                    </TableCell>
                                    <TableCell align="left">
                                        {dayjs(node.pushedAt).format(
                                            'DD.MM.YYYY',
                                        ) ?? '-'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div"
                count={Math.round(repositoryCount)}
                rowsPerPage={rowsOnPage}
                page={pageCounter}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
}
