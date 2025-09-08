import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Typography,
  TextField,
  Switch,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import ClearIcon from '@mui/icons-material/Clear'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ReferenceValueForm from '@/components/master-data/referenceValueForm'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import { useSnackbar } from '@/context/StackedSnackbar'
import { Delete } from '@mui/icons-material'
import EntityAutocomplete from '@/components/autocomplete/entityAutocomplete'
import ReferenceValuesAutocomplete from '@/components/autocomplete/referenceValuesAutocomplete'

export default function ReferenceMasterCurd() {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    code: '',
    entity: '',
    description: ''
  })
  const [errorField, setErrorField] = useState({
    code: false,
    name: false,
    entity: false
  })
  const router = useRouter()
  const { addSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [rowIndex, setRowIndex] = useState(-1)
  const [tableData, setTableData] = useState([])
  const [dataSaving, setDataSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [referenceValue, setReferenceValue] = useState(null)

  useEffect(() => {
    const { id } = router.query
    if (!id) return

    const fetchRecordById = async (id) => {
      try {
        setDataSaving(true)
        const { data } = await axios.get(`/reference-master`, {
          params: { id, getRefValues: true }
        })
        const recordData = data?.referenceMasters && data.referenceMasters[0]

        console.log('recordData', recordData, data)
        setFormData({
          ...formData,
          ...recordData
        })

        setTableData(data.referenceValues || [])
      } catch (error) {
        console.error(error)
        setErrorMessage(
          error.response?.data?.error || error.response?.statusText
        )
      } finally {
        // setFormData({
        //   id: null,
        //   code: '',
        //   name: '',
        //   description: ''
        // })
        // setTableData([])   -> clear table data
        setDataSaving(false)
      }
    }

    fetchRecordById(id)
  }, [router.query])

  const handleRemoveRow = (index) => {
    const updatedTableData = [...tableData]
    updatedTableData.splice(index, 1)
    setTableData(updatedTableData)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: name === 'code' ? value.toUpperCase() : value
    })
    setErrorField({
      ...errorField,
      [name]: !value
    })
  }

  const handleAddRow = () => {
    setRowIndex(-1)
    setReferenceValue(null)
    setOpen(true)
  }

  const editRecord = (row, index) => {
    setRowIndex(index)
    setReferenceValue(row)
    setOpen(true)
  }
  const validateField = (name, value) => {
    setErrorField((prevData) => ({
      ...prevData,
      [name]: !value
    }))
  }

  const onReferenceValueSave = (newRefValue) => {
    setOpen(false)
    if (rowIndex == -1) {
      setTableData([...tableData, { ...newRefValue }])
      return
    }

    if (!tableData[rowIndex]) return
    tableData[rowIndex].name = newRefValue.name
    tableData[rowIndex].isActive = newRefValue.isActive
    tableData[rowIndex].sortOrder = newRefValue.sortOrder
    tableData[rowIndex].description = newRefValue.description
    tableData[rowIndex].relatedValue = newRefValue.relatedValue
    setTableData([...tableData])
  }

  const handleSave = async () => {
    formData.code = formData.code.trim()
    formData.name = formData.name.trim()
    formData.description = (formData.description || '').trim()
    setErrorField({
      code: !formData.code,
      name: !formData.name
    })

    if (!formData.code || !formData.name) return
    if (!tableData || !tableData.length) {
      setErrorMessage('Add at least one reference values.')
      return
    }

    const areReferenceValuesValid = tableData.every(
      (value) => value.code && value.name
    )

    if (!areReferenceValuesValid) {
      setErrorMessage('Code and Name are required for all reference values.')
      return
    }

    try {
      setDataSaving(true)
      setErrorMessage('')
      const temp = {
        ...formData,
        entity_id: formData.entity?.id || null,
        referenceValues: tableData
      }
      delete temp.entity // Remove the full entity object

      if (formData.id) {
        await axios.put(`/reference-master/${formData.id}`, temp)
      } else {
        await axios.post('/reference-master', temp)
      }

      addSnackbar('Reference Master Saved Successfully!')
      router.push('/master-data/referenceMaster')
    } catch (error) {
      console.error(error)
      setErrorMessage(error.response?.data?.error || error.response?.statusText)
    }
    setDataSaving(false)
  }

  // console.log('fo', formData)
  return (
    <>
      <div style={{ overflow: 'hidden', padding: '0px 20px' }}>
        <Box container sx={{ backgroundColor: '#fff' }}>
          <Box style={{ paddingTop: '10px' }}>
            <Typography
              variant='h6'
              fontWeight='bold'
              style={{ marginLeft: '1rem' }}
            >
              Reference Master
            </Typography>
            <br />
            <Grid container spacing={2} style={{ padding: '0.5rem' }}>
              <Grid item xs={12} sm={6} md={2} lg={3}>
                <TextField
                  label='Code'
                  name='code'
                  type='string'
                  value={formData.code}
                  disabled={!!formData.id}
                  onChange={handleFormChange}
                  style={{ textTransform: 'capitalize' }}
                  fullWidth
                  error={errorField.code}
                  helperText={errorField.code && 'Code is required'}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2} lg={3}>
                <TextField
                  label='Name'
                  name='name'
                  value={formData.name}
                  onChange={handleFormChange}
                  fullWidth
                  error={errorField.name}
                  helperText={errorField.name && 'Name is required'}
                  required
                />
              </Grid>
              <EntityAutocomplete
                value={formData.entity}
                InputProps={{
                  error: errorField.entity
                }}
                AutocompleteProps={{
                  required: true,
                  onChange: (event, value) => {
                    setFormData({
                      ...formData,
                      entity: value
                    })
                    validateField('entity', value)
                  }
                }}
              />
              {/* <Grid item xs={12} sm={6} md={2} lg={3}>
                <TextField
                  label='Description'
                  name='description'
                  value={formData.description}
                  onChange={handleFormChange}
                  fullWidth
                />
              </Grid> */}
              {/* <ReferenceValuesAutocomplete
                value={formData.reference}
                onChange={(_event, value) => {
                  setFormData((prev) => ({ ...prev, reference: value }))
                  validateField('reference', value)
                }}
                label='Ship Status'
                error={errorField.reference}
                helperText={errorMessage.reference}
              /> */}
            </Grid>
          </Box>
          <Box sx={{ display: 'flex', p: '10px' }}>
            <Typography variant='h6' fontWeight='bold' sx={{ flexGrow: 1 }}>
              Reference Value
            </Typography>
            <Box>
              <Button
                variant='contained'
                onClick={handleAddRow}
                startIcon={<AddCircleOutlineIcon />}
              >
                Add Row
              </Button>
            </Box>
          </Box>
          <Box fullWidth>
           
              <Grid item xs={12}>
                <TableContainer fullWidth>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Name</TableCell>
                        {/* <TableCell>Description</TableCell> */}
                        <TableCell>Status</TableCell>
                        {/* <TableCell>Sort Order</TableCell>
                        <TableCell>Related Value</TableCell> */}
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.code}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          {/* <TableCell>{row.description}</TableCell> */}
                          <TableCell>
                            {row.isActive ? 'Active' : 'Inactive'}
                          </TableCell>
                          {/* <TableCell>{row.sortOrder}</TableCell>
                          <TableCell>{row.relatedValue}</TableCell> */}
                          <TableCell>
                            <Button
                              startIcon={<EditIcon />}
                              onClick={() => editRecord(row, index)}
                            >
                              Edit
                            </Button>

                            <Button
                              startIcon={<Delete />}
                              onClick={() => handleRemoveRow(index, row.id)}
                              color='error'
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
          
            <Box sx={{ display: 'flex', p: '10px' }}>
              <Box sx={{ flexGrow: 1 }}>
                {errorMessage && <SCErrorSpan>{errorMessage}</SCErrorSpan>}
              </Box>
              <Box>
                <Button
                  onClick={() => router.push('/master-data/referenceMaster')}
                  variant='outlined'
                  startIcon={<ClearIcon />}
                  sx={{ marginRight: '15px' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  type='submit'
                  variant='contained'
                  disabled={dataSaving}
                  startIcon={<SaveIcon />}
                >
                  Save
                  {dataSaving && <SCBtnLoader />}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
      <ReferenceValueForm
        open={open}
        rowIndex={rowIndex}
        handleClose={() => {
          setOpen(false)
        }}
        referenceValues={tableData}
        referenceValue={referenceValue}
        onSave={onReferenceValueSave}
      />
    </>
  )
}
