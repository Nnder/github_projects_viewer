import { Box, Button, TextField, Typography } from '@mui/material';
import EnhancedTable from '../../organisms/Table/ProjectsTable';
import classes from './Search.module.scss';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const token = import.meta.env.VITE_GITHUB_TOKEN;

export const Search = () => {
    const [search, setSearch] = useSearchParams({ query: '' });
    const q = search.get('query');


    // https://docs.github.com/en/graphql/overview/explorer

    async function getData(){
        const query = `query($name: String!, $owner: String!, $after: String) {
            repository(name: $name, owner: $owner) {
              stargazers(first: 10, after: $after) {
                edges {
                  cursor
                  node {
                    login
                  }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }`
          
          let variables = {
            name: "graphql-js",
            owner: "graphql"
          }

          
          let response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              "Authorization": `bearer ${token}`,
            },
            body: JSON.stringify({query: query, variables: variables})
          });
          
          
          let result = await response.json();
          console.log(result);
    }

    useEffect(()=>{
        getData()
    },[])

    

    

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
};
