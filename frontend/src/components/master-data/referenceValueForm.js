import { useEffect, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import InputTypeNumber from '../common/InputTypeNumber'

export default function ReferenceValueForm(props) {
  const {
    referenceValue,
    open,
    handleClose,
    onSave,
    referenceValues,
    rowIndex
  } = props
  const defaultValue = {
    code: '',
    name: '',
    sortOrder: 99,
    isActive: true,
    description: '',
    relatedValue: ''
  }
  const [formData, setFormData] = useState(defaultValue)
  const [errorField, setErrorField] = useState({
    code: '',
    name: ''
  })

  useEffect(() => {
    if (!open) return

    if (referenceValue) {
      setFormData({
        ...referenceValue
      })
    } else {
      setFormData(defaultValue)
    }
    setErrorField({
      code: '',
      name: ''
    })
  }, [open])

  const handleChange = (event) => {
    let { name, value, checked, type } = event.target

    if (name === 'code' && value) value = value.toUpperCase()
    setFormData({
      ...formData,
      [name]: type == 'checkbox' ? checked : value
    })
    validateForm(name, value)
  }

  const validateForm = (name, value) => {
    if (name === 'sortOrder') {
      setErrorField({
        ...errorField,
        [name]: value < 0 ? 'Please enter sort order more than 0' : ''
      })
    } else {
      setErrorField({
        ...errorField,
        [name]: !value ? 'Enter the valid Data' : ''
      })
    }
  }

  const handleSave = async () => {
    formData.code = formData.code.trim()
    formData.name = formData.name.trim()
    formData.description = (formData.description || '').trim()
    setErrorField({
      code: !formData.code ? 'Enter the valid Data' : '',
      name: !formData.name ? 'Enter the valid Data' : '',
      sortOrder:
        formData.sortOrder < 0 ? 'Please enter sort order more than 0' : ''
    })
    if (!formData.code || !formData.name || formData.sortOrder < 0) return

    const matched = (referenceValues || []).find(
      (e, i) => e.code == formData.code && rowIndex != i
    )
    if (matched) {
      setErrorField({
        ...errorField,
        code: 'Deplicate reference value code'
      })
      return
    }

    onSave(formData)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Reference Value</DialogTitle>
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
            disabled={!!formData._id}
            value={formData.code}
            error={!!errorField.code}
            helperText={errorField.code}
            onChange={handleChange}
          />
          <TextField
            required
            label='Name'
            fullWidth
            name='name'
            value={formData.name}
            error={!!errorField.name}
            helperText={errorField.name}
            onChange={handleChange}
          />
          <TextField
            label='Description'
            fullWidth
            name='description'
            value={formData.description}
            onChange={handleChange}
          />
          <FormControlLabel
            sx={{ p: '10px' }}
            control={
              <Switch
                name='isActive'
                checked={formData.isActive}
                onChange={handleChange}
              />
            }
            label='Active'
          />
          <InputTypeNumber
            label='Sort Order'
            fullWidth
            name='sortOrder'
            value={formData.sortOrder}
            onChange={(value) => {
              console.log('valur....', value)
              handleChange({ target: { name: 'sortOrder', value } })
            }}
          />
          <TextField
            label='Related Value'
            fullWidth
            name='relatedValue'
            value={formData.relatedValue}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
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
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
