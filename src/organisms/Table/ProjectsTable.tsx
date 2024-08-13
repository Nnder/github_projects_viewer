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
import { Data, EnhancedTableProps, HeadCell, ISeachProps } from './types';
import {
    resetTable,
    setOrder as setOrderStore,
    setPage,
    setRowsPerPage,
} from '../../store/redux';
import { TableState } from '../../store/types';

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

export default function EnhancedTable({ search }: ISeachProps) {
    const dispatch = useDispatch();
    const [pageCounter, setPageCounter] = React.useState(0);

    const { rowsPerPage, orderBy, order, repositoryCount } = useSelector(
        ({ repos }: { repos: TableState }) => repos,
    );

    const [rowsOnPage, setRowsOnPage] = React.useState(rowsPerPage ?? 10);

    const { edges, pageInfo } = search;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        console.log(event.target, 'handle sort');
        const isDesc = orderBy === property && order === 'desc';
        dispatch(resetTable());
        dispatch(
            setOrderStore({
                order: isDesc ? 'asc' : 'desc',
                orderBy: property,
            }),
        );
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        console.log(event.target, 'clicked');
        alert(`${id} selected`);
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number,
    ) => {
        if (event) {
            dispatch(setPage({ page: newPage, cursor: pageInfo.endCursor }));
            setPageCounter(newPage);
        }
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsOnPage(parseInt(event.target.value, 10));
        dispatch(resetTable());
        dispatch(
            setRowsPerPage({ rowsPerPage: parseInt(event.target.value, 10) }),
        );
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
                justifyContent: 'space-between',
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
                        {edges.map(({ node }) => (
                            <TableRow
                                hover
                                onClick={(event) => handleClick(event, node.id)}
                                tabIndex={-1}
                                key={node.id}
                                sx={{ cursor: 'pointer' }}
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
                                    {node.pushedAt ?? '-'}
                                </TableCell>
                            </TableRow>
                        ))}
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
