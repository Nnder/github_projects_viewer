import { Button, TextField } from "@mui/material"
import EnhancedTable from "../organisms/Table/ProjectsTable"

export const Search = () => {
  return (
    <>
    <div>
      <TextField/>
      <Button>искать</Button>
    </div>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div><EnhancedTable/></div>
      <div>about data</div>
    </div>
    </>
  )
}
