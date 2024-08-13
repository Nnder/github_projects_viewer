import { Box, Button, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EnhancedTable from '../../organisms/Table/ProjectsTable';
import classes from './Search.module.scss';

import { TableState } from '../../store/types';
import { useGetRepositoriesByNameQuery } from '../../store/repository';
import { resetTable, setRepositoryCount } from '../../store/tableSlice';

export function Search() {
    const dispatch = useDispatch();
    const [search, setSearch] = useSearchParams({
        query: '',
        cursor: '',
        selected: '',
    });

    const [query, setQuery] = useState('');

    const { rowsPerPage, orderBy, order, cursor, page } = useSelector(
        ({ repos }: { repos: TableState }) => repos,
    );

    const { data, isLoading, refetch } = useGetRepositoriesByNameQuery({
        name: `${query} in:name sort:${orderBy}-${order}` ?? '',
        count: rowsPerPage,
        after: cursor ?? null,
    });

    if (data?.data?.search?.repositoryCount) {
        dispatch(
            setRepositoryCount({
                repositoryCount: data?.data?.search?.repositoryCount,
            }),
        );
    }

    useEffect(() => {
        refetch()
            .then(() => console.log('data refetch successfully'))
            .catch((e: Error) => console.log(`refetch error: ${e.message}`));
    }, [rowsPerPage, orderBy, order, page]);

    useEffect(() => {
        setQuery(search.get('query') ?? '');
        if (!query) {
            dispatch(resetTable());
        }
    }, [search]);

    // sort:forks-asc
    // 1. sort:stars - сортировка по количеству звезд.
    // 2. sort:forks - сортировка по количеству форков.
    // 3. sort:updated - сортировка по дате последнего обновления.

    // через graphql не получилось точно искать по имени репозитория, выдает репозитории и по другим полям (description, url, ...)

    return (
        <div>
            <div className={classes.search}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Введите поисковый запрос"
                    className={classes.search__input}
                    value={query}
                    onChange={(e) =>
                        setSearch((prev) => {
                            prev.set('query', e.target.value);
                            return prev;
                        })
                    }
                />
                <div>
                    <Button size="large" variant="contained" sx={{ ml: 1 }}>
                        искать
                    </Button>
                </div>
            </div>

            {query !== '' ? (
                <Box className={classes.table__wrapper}>
                    <Box sx={{ p: 3 }}>
                        <Typography
                            variant="h2"
                            sx={{ color: 'black', fontSize: [28, 36, 48] }}
                        >
                            Результаты поиска
                        </Typography>
                        {!isLoading && data ? (
                            <EnhancedTable search={data.data.search} />
                        ) : (
                            'loading'
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: 'background.default',
                        }}
                    >
                        about data
                    </Box>
                </Box>
            ) : (
                <div className={classes.welcome}>
                    <Typography className={classes.welcome__text}>
                        Добро пожаловать
                    </Typography>
                </div>
            )}

            <div className={classes.footer} />
        </div>
    );
}
