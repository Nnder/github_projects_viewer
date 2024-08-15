import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useGetRepositoryByNameQuery } from '../../store/repository';
import { selectRow } from '../../store/tableSlice';
import { SelectedRepo } from '../Table/types';
import classes from './Repository.module.scss';
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
                    <Box className={classes.lang__wrapper}>
                        <Box className={classes.lang__wrapper_item}>
                            {data?.data.repository.primaryLanguage?.name ?? '-'}
                        </Box>
                        <Box className={classes.lang__wrapper_counter}>
                            <Star className={classes.lang__wrapper_icon} />
                            {data?.data.repository.stargazerCount ?? '0'}
                        </Box>
                    </Box>
                    <Box>
                        <Box className={classes.topics__container}>
                            {data?.data.repository.repositoryTopics.edges.map(
                                (node) => (
                                    <Box
                                        key={node.node.topic.name}
                                        className={
                                            classes.topics__container_item
                                        }
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
