import { Box, Button, TextField, Typography } from '@mui/material';
import EnhancedTable from '../../organisms/Table/ProjectsTable';
import classes from './Search.module.scss';
import { useSearchParams } from 'react-router-dom';

export const Search = () => {
	const [search, setSearch] = useSearchParams({ query: ''});
	const q = search.get('query');

    return (
        <>
            <div className={classes.search}>
                <div>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Введите поисковый запрос"
                        sx={{
                            backgroundColor: 'background.default',
                            borderRadius: '4px',
                            py: '1px',
                        }}
						value={q}
						onChange={e => setSearch(prev => {
							prev.set('query', e.target.value);
                            return prev;
						})}
                    />
                </div>
                <div>
                    <Button size="large" variant="contained" sx={{ ml: 1 }}>
                        искать
                    </Button>
                </div>
            </div>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    height: '100%',
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography
                        variant="h2"
                        sx={{ color: 'black', fontSize: [, 36, 48] }}
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

            <div className={classes.footer}></div>
        </>
    );
};
