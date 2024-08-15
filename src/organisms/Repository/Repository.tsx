import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useGetRepositoryByNameQuery } from '../../store/repository';
import { selectRow } from '../../store/tableSlice';
import { SelectedRepo } from '../Table/types';

// компонент репозитория
// прокидываю в компоненты props которые подргружают данные о выбранном репозитории
function Repository({ owner, repo }: SelectedRepo) {
    const dispatch = useDispatch();
    const { data, isLoading } = useGetRepositoryByNameQuery({
        owner,
        repo,
    });

    useEffect(() => {
        dispatch(selectRow({ selected: { repo, owner } }));
    }, []);

    return (
        <div>
            {isLoading && owner !== '' && repo !== '' ? (
                <div>Loading...</div>
            ) : (
                <Box sx={{ m: 3 }}>
                    <Typography sx={{ fontSize: 32 }}>
                        {data?.data.repository.name}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            pr: '20px',
                            mb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                background: 'rgba(33,150,243,1)',
                                borderRadius: '100px',
                                px: 1.5,
                                py: 1,
                                color: '#fff',
                                fontSize: 13,
                                cursor: 'pointer',
                                fontFamily: 'Roboto, sans-serif',
                                '&:hover': {
                                    background: 'rgba(33,130,243,1)',
                                },
                            }}
                        >
                            {data?.data.repository.primaryLanguage?.name ?? '-'}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                                fontFamily: 'Roboto, sans-serif',
                            }}
                        >
                            {' '}
                            <Star
                                sx={{ fontSize: 24, color: 'gold', pr: 1 }}
                            />{' '}
                            {data?.data.repository.stargazerCount ?? '0'}
                        </Box>
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
                            {data?.data.repository.repositoryTopics.edges.map(
                                (node) => (
                                    <Box
                                        key={node.node.topic.name}
                                        sx={{
                                            background: 'rgba(0,0,0,0.08)',
                                            borderRadius: '100px',
                                            px: 1.5,
                                            py: 1,
                                            color: '#000',
                                            fontSize: 13,
                                            mr: 1,
                                            mb: 1,
                                            fontFamily: 'Roboto, sans-serif',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                background: 'rgba(0,0,0,0.12)',
                                            },
                                        }}
                                    >
                                        {node.node.topic.name || '-'}
                                    </Box>
                                ),
                            )}
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 14 }}>
                                {data?.data.repository.licenseInfo?.name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </div>
    );
}

export default Repository;
