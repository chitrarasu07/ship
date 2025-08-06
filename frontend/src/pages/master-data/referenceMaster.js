import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import {
  Button,
  Grid,
  Box,
  TextField,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  FormControlLabel,
  Switch,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination
} from '@mui/material'
import axios from 'axios'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'

export default function ReferenceMaster() {
  const rowsPerPage = 10
  const [refMaster, setRefMaster] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchError, setSearchError] = useState('')
  const [searchData, setSearchData] = useState({
    code: '',
    name: '',
    isActive: true
  })
  const [tablePage, setTablePage] = useState(0)
  const [totalRecord, setSotalRecord] = useState(0)
  const router = useRouter()

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

  const searchRecord = async (getCount, pageNo) => {
    pageNo = pageNo || 0
    setDataLoading(true)
    setSearchError('')
    try {
      setDataLoading(true)
      if (getCount) {
        setSotalRecord(0)
        setTablePage(0)
        setRefMaster([])
      }

      const res = await axios.get('/reference-master', {
        params: {
          ...searchData,
          getCount,
          pageNo: pageNo + 1,
          limit: rowsPerPage
        }
      })

      setDataLoading(false)
      setRefMaster(res?.data?.referenceMasters || [])
      getCount && setSotalRecord(res?.data?.total || 0)
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

  const newRecord = () => {
    router.push('/master-data/referenceMasterCurd')
  }

  const editRecord = (id) => {
    router.push(`/master-data/referenceMasterCurd?id=${id}`)
  }

  return (
    <>
      <div style={{ padding: '0 10px', margin: '0' }}>
        <Box
          sx={{
            backgroundColor: '#fff',
            p: '10px',
            borderRadius: '10px 10px 0 0'
          }}
        >
          <Grid container spacing={3} alignItems='center' flexDirection='row'>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                autoFocus
                fullWidth
                label='Code'
                name='code'
                value={searchData.code}
                onChange={handleSearchChange}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={searchData.name}
                onChange={handleSearchChange}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    name='isActive'
                    checked={searchData.isActive}
                    onChange={handleSearchChange}
                  />
                }
                label='Active'
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Box display='flex' alignItems='center'>
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
                  sx={{ ml: '10px' }}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  New
                </Button>
              </Box>
            </Grid>
            {searchError ? (
              <Grid item sm={12} md={4}>
                <SCErrorSpan>{searchError}</SCErrorSpan>
              </Grid>
            ) : null}
          </Grid>
        </Box>

        {!dataLoading && !refMaster.length && !searchError ? (
          <Typography
            variant='body2'
            color='error'
            align='center'
            sx={{ pt: '50px' }}
          >
            No record found
          </Typography>
        ) : (
          ''
        )}

        {refMaster.length ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {refMaster.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1 + tablePage * rowsPerPage}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => editRecord(row.id)}
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
      </div>
    </>
  )
}
