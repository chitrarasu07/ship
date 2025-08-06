import { useEffect, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close'

import { useApp } from '@/context/AppContext'
import InputTypeNumber from '../common/InputTypeNumber'
import { useSnackbar } from '@/context/StackedSnackbar'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import Category1Autocomplete from '../autocomplete/category1Autocomplete'

export default function Category2CRUD(props) {
  const { org } = useApp()
  const { addSnackbar } = useSnackbar()
  const [error, setError] = useState('')
  const [dataSaving, setDataSaving] = useState(false)
  const { id, open, handleClose, onSave } = props
  const defaultError = {
    code: false,
    name: false
  }
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    name: '',
    sortOrder: '',
    category1: null
  })
  const [errorField, setErrorField] = useState(defaultError)

  useEffect(() => {
    if (!open) return

    if (id) {
      const fetchRecordById = async () => {
        try {
          setDataSaving(true)
          const { data } = await axios.get(`/category2`, {
            params: { id }
          })
          const savedDate = data?.categories2 && data.categories2[0]
          if (savedDate) {
            setFormData({
              ...formData,
              ...savedDate
            })
          } else {
            setError('Data not found in the DB')
          }
        } catch (error) {
          console.error(error)
          setError(error.response?.data?.error || error.response?.statusText)
        } finally {
          setDataSaving(false)
        }
      }

      fetchRecordById()
    } else {
      setFormData({
        id: null,
        code: '',
        name: '',
        sortOrder: 99,
        category1: null
      })
    }

    setError('')
    setErrorField(defaultError)
    setDataSaving(false)
  }, [open])

  const handleChange = (event) => {
    let { name, value, checked, type } = event.target
    if (name === 'code' && value) value = value.toUpperCase()
    setFormData({
      ...formData,
      [name]: type == 'checkbox' ? checked : value
    })
    setErrorField({
      ...errorField,
      [name]: !value
    })
  }

  const handleSave = async () => {
    formData.code = formData.code.trim()
    formData.name = formData.name.trim()
    setErrorField({
      code: !formData.code,
      name: !formData.name
    })
    if (!formData.code || !formData.name) return

    setDataSaving(true)
    setError('')

    try {
      const temp = {
        ...formData,
        category1: undefined,
        category1_id: formData.category1?.id
      }
      if (formData.id) {
        await axios.put(`/category2/${id}`, temp)
      } else {
        await axios.post('/category2', temp)
      }

      setDataSaving(false)
      addSnackbar(`${org.category2} - ${formData.name} saved Successfully`)
      handleClose()
      onSave()
    } catch (error) {
      setDataSaving(false)
      setError(error.response?.data?.error || error.response?.statusText)
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{org.category2}</DialogTitle>
      <DialogContent>
        <Box
          component='form'
          width='500px'
          sx={{
            '& .MuiTextField-root': { m: 1 }
          }}
          noValidate
          autoComplete='off'
        >
          <TextField
            autoFocus
            required
            label='Code'
            fullWidth
            name='code'
            disabled={!!formData.id}
            value={formData.code}
            error={errorField.code}
            onChange={handleChange}
          />
          <TextField
            required
            label='Name'
            fullWidth
            name='name'
            value={formData.name}
            error={errorField.name}
            onChange={handleChange}
          />
          <InputTypeNumber
            label='Sort Order'
            fullWidth
            name='Sort Order'
            value={formData.sortOrder}
            onChange={(value) => {
              handleChange({ target: { name: 'sortOrder', value } })
            }}
          />
          <Category1Autocomplete
            value={formData.category1}
            AutocompleteProps={{
              onChange: (event, value) => {
                setFormData({
                  ...formData,
                  category1: value
                })
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        {error && <SCErrorSpan>{error}</SCErrorSpan>}
        <Button
          onClick={handleClose}
          variant='outlined'
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
        <Button
          onClick={handleSave}
          variant='contained'
          disabled={dataSaving}
          startIcon={<SaveIcon />}
        >
          Save
          {dataSaving && <SCBtnLoader />}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
