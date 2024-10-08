import { Box, Button, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EnhancedTable from '../../organisms/Table/ProjectsTable';
import classes from './Search.module.scss';

import { TableState } from '../../store/types';
import { useGetRepositoriesByNameQuery } from '../../store/repository';
import {
    resetTable,
    setRepositoryCount,
    setTable,
} from '../../store/tableSlice';
import { LazyRepository } from '../../organisms/Repository/Repository.lazy';

export function Search() {
    const dispatch = useDispatch();
    const [search, setSearch] = useSearchParams();

    const [inputData, setInputData] = useState(search.get('query') ?? '');
    const [query, setQuery] = useState(search.get('query') ?? '');

    const { rowsPerPage, orderBy, order, after, before, page } = useSelector(
        ({ repos }: { repos: TableState }) => repos,
    );

    // получаю данные из параметров
    useEffect(() => {
        dispatch(
            setTable({
                rowsPerPage:
                    search.get('rows') === null
                        ? 10
                        : parseInt(search.get('rows')!),
                after: search.get('after') ?? null,
                before: search.get('before') ?? null,
                page:
                    search.get('page') === null
                        ? 0
                        : parseInt(search.get('page')!),
                order: search.get('order') === 'desc' ? 'desc' : 'asc',
                orderBy: search.get('order') ?? 'name',
            }),
        );
    }, []);

    const count = after === before || !!after ? rowsPerPage : null;
    const last = before ? rowsPerPage : null;

    const { data, isLoading, refetch } = useGetRepositoriesByNameQuery({
        name:
            `${search.get('query') ?? ''} in:name sort:${
                search.get('orderBy') ?? orderBy
            }-${search.get('order') ?? order}` ?? '',

        count: !!count || last === null ? rowsPerPage : null,
        after: !!after || after === before ? after : null,
        before: before || null,
        last,
        page: (!!count || last === null ? rowsPerPage : null) ? 'next' : 'prev',
    });

    // при изменении параметров таблицы делаем новый запрос и обновляем кол-во репозиториев
    useEffect(() => {
        if (query) {
            refetch()
                .then((newData) => {
                    console.log('data refetch successfully');
                    dispatch(
                        setRepositoryCount({
                            repositoryCount:
                                newData?.data?.data?.search?.repositoryCount ||
                                0,
                        }),
                    );
                })
                .catch((e: Error) =>
                    console.log(`refetch error: ${e.message}`),
                );
        }
    }, [rowsPerPage, orderBy, order, page, after, before]);

    // при новом поиске очищаем старые параметры, проверяем есть ли имя репозитория и делаем запрос
    const handleClick = () => {
        setSearch((prev) => {
            prev.set('query', inputData);
            prev.set('after', '');
            prev.set('before', '');
            prev.set('page', '');
            prev.set('orderBy', orderBy ?? 'name');
            prev.set('order', order ?? 'desc');
            return prev;
        });
        setQuery(search.get('query') ?? '');

        if (!query) {
            dispatch(resetTable());
        } else {
            dispatch(
                setTable({
                    after: '',
                    before: '',
                    page: 0,
                    rowsPerPage: rowsPerPage ?? 10,
                    order: order ?? 'desc',
                    orderBy: orderBy ?? 'name',
                }),
            );
        }

        if (query) {
            refetch()
                .then(() => console.log('data refetch by button successfully'))
                .catch((e: Error) =>
                    console.log(`refetch error: ${e.message}`),
                );
        }
    };

    return (
        <div>
            <div className={classes.search}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Введите поисковый запрос"
                    className={classes.search__input}
                    value={inputData}
                    onChange={(e) => {
                        setInputData(e.target.value || '');
                    }}
                    // добавил отправление на по Enter для удобства
                    onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                />
                <div>
                    <Button
                        size="large"
                        variant="contained"
                        sx={{ ml: 1 }}
                        onClick={handleClick}
                    >
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
                        {search.get('owner') &&
                        search.get('owner') !== '' &&
                        search.get('repo') &&
                        search.get('repo') !== '' ? (
                            <Box>
                                <Suspense>
                                    <LazyRepository
                                        owner={search.get('owner')!}
                                        repo={search.get('repo')!}
                                    />
                                </Suspense>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography sx={{ color: '#4F4F4F' }}>
                                    Выберите репозиторий
                                </Typography>
                            </Box>
                        )}
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
