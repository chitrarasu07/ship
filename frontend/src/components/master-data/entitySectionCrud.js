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
import { useSnackbar } from '@/context/StackedSnackbar'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import EntityAutocomplete from '../autocomplete/entityAutocomplete'

export default function EntitySectionCRUD(props) {
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
    comments: '',
    cameras_installed: 0,
    entity: null
  })
  const [errorField, setErrorField] = useState(defaultError)

  useEffect(() => {
    if (!open) return

    if (id) {
      const fetchRecordById = async () => {
        try {
          setDataSaving(true)
          const { data } = await axios.get(`/entity-section`, {
            params: { id }
          })
          const savedDate = data?.entitySections && data.entitySections[0]
          if (savedDate) {
            setFormData({
              ...formData,
              ...savedDate,
              // added for cameras_installed
              cameras_installed: savedDate.cameras_installed ?? 0
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
        comments: '',
        entity: null
      })
    }

    setError('')
    setErrorField(defaultError)
    setDataSaving(false)
  }, [open])

  const handleChange = (event) => {
    let { name, value, checked, type } = event.target
    if (name === 'code' && value) value = value.toUpperCase()
    if (name === 'cameras_installed') value = Number(value)
    setFormData({
      ...formData,
      [name]: type == 'checkbox' ? checked : value
    })
    setErrorField({
      ...errorField,
      [name]: !value
    })
  }

  const validateField = (name, value) => {
    setErrorField((prevData) => ({
      ...prevData,
      [name]: !value
    }))
  }

  const handleSave = async () => {
    formData.code = formData.code.trim()
    formData.name = formData.name.trim()
    setErrorField({
      code: !formData.code,
      name: !formData.name,
      entity: !formData.entity?.id
    })
    if (!formData.code || !formData.name || !formData.entity?.id) return

    setDataSaving(true)
    setError('')

    try {
      const temp = {
        ...formData,
        entity: undefined,
        entity_id: formData.entity?.id
      }
      if (formData.id) {
        await axios.put(`/entity-section/${id}`, temp)
      } else {
        await axios.post('/entity-section', temp)
      }

      setDataSaving(false)
      addSnackbar(`${org.entity_section} - ${formData.name} saved Successfully`)
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
      <DialogTitle>{org.entity_section}</DialogTitle>
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
          <TextField
            fullWidth
            multiline
            name='comments'
            label='Comments'
            value={formData.comments}
            onChange={handleChange}
          />
          <TextField
            label='Cameras Installed'
            fullWidth
            type='number'
            name='cameras_installed'
            inputProps={{ min: 0 }}
            value={formData.cameras_installed}
            onChange={handleChange}
          />
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
