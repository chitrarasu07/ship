import { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  Grid,
  Box,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableFooter,
  TablePagination,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import axios from 'axios'
import { Delete } from '@mui/icons-material'
import { useSnackbar } from '@/context/StackedSnackbar'
import RoleCRUD from '@/components/master-data/roleCrud'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

export default function Role() {
  const rowsPerPage = 10
  const { addSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState(null)
  const [roles, setRoles] = useState([])
  const [tablePage, setTablePage] = useState(0)
  const [totalRecord, setTotalRecord] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)
  const [searchError, setSearchError] = useState('')
  const [deleteRow, setDeleteRow] = useState(null)
  const [searchData, setSearchData] = useState({
    code: '',
    name: '',
    sortOrder: '',
    isActive: true
  })

  useEffect(() => {
    searchRecord(true)
  }, [])

  const handleSearchChange = (event) => {
    const { name, value, checked, type } = event.target
    setSearchData({
      ...searchData,
      [name]:
        name === 'code'
          ? value.toUpperCase()
          : type === 'checkbox'
            ? checked
            : value
    })
  }

  const newRecord = () => {
    setRole(null)
    setOpen(true)
  }

  const editRecord = (row) => {
    setRole(row)
    setOpen(true)
  }

  const searchRecord = async (getCount, pageNo) => {
    try {
      pageNo = pageNo || 0
      setDataLoading(true)
      setSearchError('')

      if (getCount) {
        setTotalRecord(0)
        setTablePage(0)
        setRoles([])
      }

      const res = await axios.get('/role', {
        params: {
          ...searchData,
          getCount,
          pageNo: pageNo + 1,
          limit: rowsPerPage
        }
      })
      setDataLoading(false)
      setRoles(res?.data?.roles || [])
      getCount && setTotalRecord(res?.data?.total || 0)
    } catch (error) {
      setDataLoading(false)
      setSearchError(error.response?.data?.error || error.response?.statusText)
      console.error(error)
    }
  }

  const handleChangePage = (event, newPage) => {
    setTablePage(newPage)
    searchRecord(false, newPage)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = async () => {
    try {
      setSearchError('')
      setDataLoading(true)
      await axios.delete(`/role/${deleteRow.id}`)
      setDeleteRow(null)
      searchRecord(true)
      addSnackbar(`Role - ${deleteRow.name} deleted Successfully`)
    } catch (error) {
      setDataLoading(false)
      setSearchError(error.response?.data?.error || error.response?.statusText)
      console.error(error)
    }
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#fff',
          p: '20px',
          borderRadius: '10px 10px 0 0'
        }}
      >
        <Grid container spacing={3}>
          <Grid item sm={6} md={2}>
            <TextField
              autoFocus
              fullWidth
              label='Code'
              name='code'
              value={searchData.code}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item sm={6} md={2}>
            <TextField
              fullWidth
              label='Role Name'
              name='name'
              value={searchData.name}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            container
            direction='row'
            alignItems='flex-end'
          >
            <FormControlLabel
              control={
                <Switch
                  name='isActive'
                  checked={searchData.isActive}
                  onChange={handleSearchChange}
                />
              }
              label='Active only'
            />
            <Button
              variant='outlined'
              onClick={() => searchRecord(true)}
              disabled={dataLoading}
              startIcon={<SearchIcon />}
            >
              Search
              {dataLoading && <SCBtnLoader />}
            </Button>
            <Button
              variant='outlined'
              onClick={newRecord}
              sx={{ ml: '25px' }}
              startIcon={<AddCircleOutlineIcon />}
            >
              New
            </Button>
          </Grid>
        </Grid>
        {searchError ? (
          <Grid item sm={12} md={4}>
            <SCErrorSpan>{searchError}</SCErrorSpan>
          </Grid>
        ) : (
          ''
        )}
      </Box>
      {!dataLoading && !roles.length && !searchError ? (
        <Typography
          variant='body2'
          color='error'
          align='center'
          sx={{ mt: '50px' }}
        >
          No record found
        </Typography>
      ) : (
        ''
      )}
      {roles.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>SN.No</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Role Name</TableCell>
                <TableCell>Landing Page</TableCell>
                <TableCell>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((row, index) => (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  key={row.id}
                >
                  <TableCell component='th' scope='row'>
                    {index + 1 + tablePage * rowsPerPage}
                  </TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.landing_page}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => setDeleteRow(row)}
                      startIcon={<Delete />}
                      color='error'
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => editRecord(row)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[rowsPerPage]}
                  colSpan={4}
                  count={totalRecord}
                  rowsPerPage={rowsPerPage}
                  page={tablePage}
                  onPageChange={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        ''
      )}
      <RoleCRUD
        open={open}
        handleClose={handleClose}
        id={role?.id}
        onSave={() => searchRecord(true)}
      />
      <Dialog open={Boolean(deleteRow?.id)} onClose={() => setDeleteRow(null)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate {deleteRow?.name} Role?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRow(null)}>Cancel</Button>
          <Button color='error' onClick={handleDelete}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
