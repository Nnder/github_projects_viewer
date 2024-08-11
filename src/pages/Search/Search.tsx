import { Box, Button, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import EnhancedTable from '../../organisms/Table/ProjectsTable';
import classes from './Search.module.scss';

const token = import.meta.env.VITE_GITHUB_TOKEN as string;

export function Search() {
    const [search, setSearch] = useSearchParams({ query: '' });
    const q = search.get('query');

    // https://docs.github.com/en/graphql/overview/explorer

    async function getData() {
        const query = `query searchRepositoriesByName($name: String!) {
                        search(query: $name, type: REPOSITORY, first: 5) {
                        edges {
                            node {
                            ... on Repository {
                                name
                                owner {
                                login
                                }
                                description
                                url
                                stargazerCount
                                forkCount
                                createdAt
                                updatedAt
                            }
                            }
                        }
                        }
                    }`;

        const variables = {
            name: q,
            // owner: "nnder"
        };

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `bearer ${token}`,
            },
            body: JSON.stringify({ query, variables }),
        });

        console.log(await response.json());
    }

    useEffect(() => {
        if (q) getData().catch((err) => console.log(err));
    }, [q]);

    return (
        <>
            <div className={classes.search}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Введите поисковый запрос"
                    className={classes.search__input}
                    value={q}
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
            <Box className={classes.table__wrapper}>
                <Box sx={{ p: 3 }}>
                    <Typography
                        variant="h2"
                        sx={{ color: 'black', fontSize: [28, 36, 48] }}
                    >
                        Результаты поиска
                    </Typography>
                    <EnhancedTable />
                </Box>
                <Box
                    sx={{
                        backgroundColor: 'background.default',
                    }}
                >
                    about data
                </Box>
            </Box>

            {/* <div className={classes.footer}></div> */}
        </>
    );
}
