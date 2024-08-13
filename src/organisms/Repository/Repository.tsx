import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import { useGetRepositoryByNameQuery } from '../../store/repository';

export function Repository({ owner, repo }: { owner: string; repo: string }) {
    const [search] = useSearchParams();

    const { data, isLoading, refetch } = useGetRepositoryByNameQuery({
        owner,
        name: repo,
    });

    useEffect(() => {
        refetch()
            .then(() => console.log('fetch repo successfully'))
            .catch((e: Error) => console.log(`refetch error: ${e.message}`));
    }, [search]);

    console.log(data);

    return (
        <div>
            {isLoading &&
            search.get('owner') !== '' &&
            search.get('repo') !== '' ? (
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
                                background: '#2196F3',
                                borderRadius: 10,
                                px: 1.5,
                                py: 0.5,
                                color: '#fff',
                                fontSize: 13,
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
                                            borderRadius: 10,
                                            px: 1.5,
                                            py: 0.5,
                                            color: '#000',
                                            fontSize: 13,
                                            mr: 1,
                                            mb: 1,
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
