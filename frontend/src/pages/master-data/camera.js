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
import CameraCRUD from '../../components/master-data/cameraCrud' // you'll create this component
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import { Delete, Edit } from '@mui/icons-material'
import { useSnackbar } from '@/context/StackedSnackbar'
import { useApp } from '@/context/AppContext'


export default function Camera() {
  const rowsPerPage = 10
  const { org } = useApp()
  const { addSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [camera, setCamera] = useState(null)
  const [tablePage, setTablePage] = useState(0)
  const [cameras, setCameras] = useState([])
  const [totalRecord, setTotalRecord] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)
  const [searchError, setSearchError] = useState('')
  const [deleteRow, setDeleteRow] = useState(null)
  const [searchData, setSearchData] = useState({
    name: '',
    location: '',
    isActive: true
  })

  useEffect(() => {
    searchRecords(true)
  }, [])

  const handleSearchChange = (event) => {
    const { name, value, checked, type } = event.target
    setSearchData({
      ...searchData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const newRecord = () => {
    setCamera(null)
    setOpen(true)
  }

  const editRecord = (row) => {
    setCamera(row)
    setOpen(true)
  }

  const searchRecords = async (getCount, pageNo) => {
    try {
      pageNo = pageNo || 0
      setDataLoading(true)
      setSearchError('')

      if (getCount) {
        setTotalRecord(0)
        setTablePage(0)
        setCameras([])
      }

      const res = await axios.get('/camera', {
        params: {
          ...searchData,
          getCount,
          pageNo: pageNo + 1,
          limit: rowsPerPage
        }
      })
      setDataLoading(false)
      setCameras(res?.data?.cameras || [])
      getCount && setTotalRecord(res?.data?.total || 0)
    } catch (error) {
      setDataLoading(false)
      setSearchError(error.response?.data?.error || error.response?.statusText)
      console.error(error)
    }
  }

  const handleChangePage = (event, newPage) => {
    setTablePage(newPage)
    searchRecords(false, newPage)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = async () => {
    try {
      setSearchError('')
      setDataLoading(true)
      await axios.delete(`/camera/${deleteRow.id}`)
      setDeleteRow(null)
      searchRecords(true)
      addSnackbar(`Camera - ${deleteRow.name} deleted Successfully`)
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
          <Grid item sm={6} md={3}>
            <TextField
              autoFocus
              fullWidth
              label='Name'
              name='name'
              value={searchData.name}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item sm={6} md={3}>
            <TextField
              fullWidth
              label='Location'
              name='location'
              value={searchData.location}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  name='isActive'
                  checked={searchData.isActive}
                  onChange={handleSearchChange}
                />
              }
              label='Active Only'
            />
          </Grid>
          <Grid item sm={12} md={3} container alignItems='flex-end'>
            <Button
              variant='outlined'
              onClick={() => searchRecords(true)}
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

      {!dataLoading && !cameras.length && !searchError ? (
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

      {cameras.length  ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='camera table'>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Port</TableCell>
                {/* <TableCell>Status</TableCell> */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cameras.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1 + tablePage * rowsPerPage}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.ip_address}</TableCell>
                  <TableCell>{row.port}</TableCell>
                  {/* <TableCell>{row.isActive ? 'Active' : 'Inactive'}</TableCell> */}
                  <TableCell>
                    <Button onClick={() => editRecord(row)} startIcon={<Edit />} color='primary'>
                      Edit
                    </Button>
                    <Button onClick={() => setDeleteRow(row)}
                    startIcon={<Delete />}
                    color='error'>
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

      <CameraCRUD
        open={open}
        handleClose={handleClose}
        id={camera?.id}
        onSave={() => searchRecords(true)}
      />

      <Dialog open={Boolean(deleteRow?.id)} onClose={() => setDeleteRow(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteRow?.name}?
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
