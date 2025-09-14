import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { useSnackbar } from '@/context/StackedSnackbar'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import { SaveIcon } from 'lucide-react'
import EntityAutocomplete from '../autocomplete/entityAutocomplete'

export default function Deck3CRUD(props) {
  const [error, setError] = useState('')
  const [dataSaving, setDataSaving] = useState(false)
  const { addSnackbar } = useSnackbar()
  const { id, open, handleClose, onSave } = props

  const defaultError = {
    code: false,
    name: false,
    type: false,
    location: false,
    ip_address: false,
    port: false,
    stream_url: false
  }

  const [formData, setFormData] = useState({
    id: null,
    code: '',
    name: '',
    type: '',
    location: '',
    ip_address: '',
    port: '',
    stream_url: '',
    description: '',
    entity: null
  })

  const [errorField, setErrorField] = useState(defaultError)

  useEffect(() => {
    if (!open) return

    if (id) {
      const fetchRecordById = async () => {
        try {
          setDataSaving(true)
          const { data } = await axios.get('/deck3', { params: { id } })
          const savedData = data?.deck3 && data.deck3[0]
          if (savedData) {
            setFormData({ ...formData, ...savedData })
          } else {
            setError('Deck3 record not found')
          }
        } catch (error) {
          console.error(error)
          setError('Failed to load Deck3 data')
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
        type: '',
        location: '',
        ip_address: '',
        port: '',
        stream_url: '',
        description: '',
        entity: null
      })
      setError('')
      setErrorField(defaultError)
      setDataSaving(false)
    }
  }, [open])

  const handleChange = (event) => {
    let { name, value, checked, type } = event.target
    if (name === 'code' && value) value = value.toUpperCase()
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    setErrorField({
      ...errorField,
      [name]: !value
    })
  }

  const handleSubmit = async () => {
    formData.code = formData.code.trim()
    formData.name = formData.name.trim()

    setErrorField({
      code: !formData.code ? 'Code is required' : '',
      name: !formData.name ? 'Name is required' : '',
      type: !formData.type ? 'Type is required' : '',
      location: !formData.location ? 'Location is required' : '',
      ip_address: !formData.ip_address ? 'IP Address is required' : '',
      port: !formData.port ? 'Port is required' : '',
      stream_url: !formData.stream_url ? 'Stream URL is required' : '',
      entity: !formData.entity ? 'Entity is required' : ''
    })

    if (
      !formData.code ||
      !formData.name ||
      !formData.type ||
      !formData.location ||
      !formData.ip_address ||
      !formData.port ||
      !formData.stream_url ||
      !formData.entity
    )
      return

    setDataSaving(true)
    setError('')

    try {
      const temp = {
        ...formData,
        entity_id: formData.entity?.id
      }
      if (formData.id) {
        await axios.put(`/deck3/${id}`, temp)
      } else {
        await axios.post('/deck3', temp)
      }
      setDataSaving(false)
      addSnackbar(`Deck3 ${formData.id ? 'updated' : 'created'} successfully`)
      handleClose()
      onSave()
    } catch (err) {
      setDataSaving(false)
      setError(err.response?.data?.error || 'Failed to save Deck3')
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{id ? 'Edit Deck3' : 'New Deck3'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ flexDirection: 'column' }}>
          <Grid item>
            <TextField
              label='Code'
              name='code'
              disabled={!!formData.id}
              value={formData.code}
              error={!!errorField.code}
              helperText={errorField.code}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label='Name'
              name='name'
              value={formData.name}
              error={!!errorField.name}
              helperText={errorField.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label='Type'
              name='type'
              value={formData.type}
              error={!!errorField.type}
              helperText={errorField.type}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label='Location'
              name='location'
              value={formData.location}
              error={!!errorField.location}
              helperText={errorField.location}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label='IP Address'
              name='ip_address'
              value={formData.ip_address}
              error={!!errorField.ip_address}
              helperText={errorField.ip_address}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label='Port'
              name='port'
              value={formData.port}
              error={!!errorField.port}
              helperText={errorField.port}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label='Stream URL'
              name='stream_url'
              value={formData.stream_url}
              error={!!errorField.stream_url}
              helperText={errorField.stream_url}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
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
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Description'
              name='description'
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
        {error && <SCErrorSpan>{error}</SCErrorSpan>}
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button
          onClick={handleClose}
          variant='outlined'
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>

        <Button
          variant='contained'
          onClick={handleSubmit}
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
