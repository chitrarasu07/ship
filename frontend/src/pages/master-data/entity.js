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
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import { Delete } from '@mui/icons-material'
import { useSnackbar } from '@/context/StackedSnackbar'
import { useApp } from '@/context/AppContext'
import Category1Autocomplete from '@/components/autocomplete/category1Autocomplete'
import Category2Autocomplete from '@/components/autocomplete/category2Autocomplete'
import EntityCRUD from '@/components/master-data/entityCrud'

export default function Entity() {
  const rowsPerPage = 10
  const { org } = useApp()
  const { addSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [entity, setEntity] = useState(null)
  const [tablePage, setTablePage] = useState(0)
  const [entities, setEntities] = useState([])
  const [totalRecord, setTotalRecord] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)
  const [searchError, setSearchError] = useState('')
  const [deleteRow, setDeleteRow] = useState(null)
  const [searchData, setSearchData] = useState({
    code: '',
    name: '',
    isActive: true,
    category1: null,
    category2: null
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
    setEntity(null)
    setOpen(true)
  }

  const editRecord = (row) => {
    setEntity(row)
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
        setEntities([])
      }

      const res = await axios.get('/entity', {
        params: {
          ...searchData,
          getCount,
          pageNo: pageNo + 1,
          limit: rowsPerPage,
          category1: undefined,
          category2: undefined,
          category3: undefined,
          category1_id: searchData.category1?.id,
          category2_id: searchData.category2?.id
        }
      })
      setDataLoading(false)
      setEntities(res?.data?.entities || [])
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
      await axios.delete(`/entity/${deleteRow.id}`)
      setDeleteRow(null)
      searchRecord(true)
      addSnackbar(`${org.entity} - ${deleteRow.name} deleted Successfully`)
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
              label='Name'
              name='name'
              value={searchData.name}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item sm={6} md={2}>
            <Category1Autocomplete
              value={searchData.category1}
              AutocompleteProps={{
                onChange: (event, value) => {
                  setSearchData({
                    ...searchData,
                    category1: value,
                    category2: null
                  })
                }
              }}
            />
          </Grid>
          <Grid item sm={6} md={2}>
            <Category2Autocomplete
              value={searchData.category2}
              category1_id={searchData.category1?.id || null}
              AutocompleteProps={{
                onChange: (event, value) => {
                  setSearchData({
                    ...searchData,
                    category2: value,
                    category1: value?.category1 || null
                  })
                }
              }}
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
              label='Active Only'
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
      {!dataLoading && !entities.length && !searchError ? (
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
      {entities.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>SN.No</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                {/* <TableCell>Status</TableCell> */}
                <TableCell>IMO Number</TableCell>
                <TableCell>Flag</TableCell>
                <TableCell>Cameras Installed</TableCell>
                <TableCell>{org.category1}</TableCell>
                <TableCell>{org.category2}</TableCell>
                <TableCell>{org.category3}</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entities.map((row, index) => (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  key={row.id}
                >
                  <TableCell component='th' scope='row'>
                    {index + 1 + tablePage * rowsPerPage}
                  </TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  {/* <TableCell>{row.status}</TableCell> */}
                  <TableCell>{row.imo_number}</TableCell>
                  <TableCell>{row.flag}</TableCell>
                  <TableCell>{row.cameras_installed}</TableCell>
                  <TableCell>
                    {row.category1 &&
                      `${row.category1.name} (${row.category1.code})`}
                  </TableCell>
                  <TableCell>
                    {row.category2 &&
                      `${row.category2.name} (${row.category2.code})`}
                  </TableCell>
                  <TableCell>
                    {row.category3 &&
                      `${row.category3.name} (${row.category3.code})`}
                  </TableCell>
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
      <EntityCRUD
        open={open}
        handleClose={handleClose}
        id={entity?.id}
        onSave={() => searchRecord(true)}
      />
      <Dialog open={Boolean(deleteRow?.id)} onClose={() => setDeleteRow(null)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate {deleteRow?.name} {org.entity}?
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
