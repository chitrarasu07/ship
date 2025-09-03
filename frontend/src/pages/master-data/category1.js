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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import axios from 'axios'
import Category1CRUD from '../../components/master-data/category1Crud'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import { Delete } from '@mui/icons-material'
import { useSnackbar } from '@/context/StackedSnackbar'
import { useApp } from '@/context/AppContext'

export default function Category1() {
  const rowsPerPage = 10
  const { org } = useApp()
  const { addSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [category1, setCategory1] = useState(null)
  const [tablePage, setTablePage] = useState(0)
  const [categories1, setCategories1] = useState([])
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
    setCategory1(null)
    setOpen(true)
  }

  const editRecord = (row) => {
    setCategory1(row)
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
        setCategories1([])
      }

      const res = await axios.get('/category1', {
        params: {
          ...searchData,
          getCount,
          pageNo: pageNo + 1,
          limit: rowsPerPage
        }
      })
      setDataLoading(false)
      setCategories1(res?.data?.categories1 || [])
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
      await axios.delete(`/category1/${deleteRow.id}`)
      setDeleteRow(null)
      searchRecord(true)
      addSnackbar(`${org.category1} - ${deleteRow.name} deleted Successfully`)
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
              label='Ship Type'
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
      {!dataLoading && !categories1.length && !searchError ? (
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
      {categories1.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>SN.No</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Ship Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories1.map((row, index) => (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  key={row.id}
                >
                  <TableCell component='th' scope='row'>
                    {index + 1 + tablePage * rowsPerPage}
                  </TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  

                  <TableCell>
                    <Button
                      onClick={() => editRecord(row)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteRow(row)}
                      startIcon={<Delete />}
                      color='error'
                    >
                      Delete
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
      <Category1CRUD
        open={open}
        handleClose={handleClose}
        id={category1?.id}
        onSave={() => searchRecord(true)}
      />
      <Dialog open={Boolean(deleteRow?.id)} onClose={() => setDeleteRow(null)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate {deleteRow?.name}{' '}
            {org.category1}?
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
