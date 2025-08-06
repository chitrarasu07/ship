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

export default function Category1CRUD(props) {
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
    sortOrder: ''
  })
  const [errorField, setErrorField] = useState(defaultError)

  useEffect(() => {
    if (!open) return

    if (id) {
      const fetchRecordById = async () => {
        try {
          setDataSaving(true)
          const { data } = await axios.get(`/category1`, {
            params: { id }
          })
          const savedDate = data?.categories1 && data.categories1[0]
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
        sortOrder: 0
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
      if (formData.id) {
        await axios.put(`/category1/${id}`, { ...formData })
      } else {
        await axios.post('/category1', { ...formData })
      }

      setDataSaving(false)
      addSnackbar(`${org.category1} - ${formData.name} saved Successfully`)
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
      <DialogTitle>{org.category1}</DialogTitle>
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
