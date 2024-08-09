import { Box, Button, TextField } from "@mui/material"
import EnhancedTable from "../../organisms/Table/ProjectsTable"
import classes from './Search.module.scss';

export const Search = () => {
  return (
    <>
		<div className={classes.search}>
			<Box sx={{
				width: '100%',
			}}>
				<TextField size="small" fullWidth placeholder="Введите поисковый запрос"
				sx={{
					backgroundColor: '#F2F2F2',
					borderRadius: '4px',
					p:0,
				}}/>
			</Box>
				
			<Box sx={{
				ml:1
			}}>
				<Button size="large" variant="contained">искать</Button>
			</Box>
		</div>
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: '2fr 1fr',
				height: '100%',
			}}
		>
			<Box sx={{p:3}}>
				<EnhancedTable/>
			</Box>
			<Box>
				about data
			</Box>
		</Box>
		<div className={classes.footer}></div>
    </>
  )
}
