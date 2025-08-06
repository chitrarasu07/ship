import { useEffect, useState } from 'react'
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch
} from '@mui/material'
import axios from 'axios'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar } from '@/context/StackedSnackbar'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import { validateEmail } from '@/utils/commonUtils'
import EntityAutocomplete from '../autocomplete/entityAutocomplete'
import { useApp } from '@/context/AppContext'
import RoleAutocomplete from '../autocomplete/roleAutocomplete'

export default function UserCRUD(props) {
  const { org } = useApp()
  const { addSnackbar } = useSnackbar()
  const [error, setError] = useState('')
  const [dataSaving, setDataSaving] = useState(false)
  const { id, open, handleClose, onSave } = props
  const defaultError = {
    code: false,
    name: false,
    role: false,
    emailid: false,
    entities: false
  }
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    name: '',
    role: null,
    emailid: '',
    entities: [],
    is_all_entity_access: false
  })
  const [errorField, setErrorField] = useState(defaultError)

  useEffect(() => {
    if (!open) return

    if (id) {
      const fetchRecordById = async () => {
        try {
          setDataSaving(true)
          const { data } = await axios.get(`/user`, {
            params: { id }
          })
          const savedDate = data?.users && data.users[0]
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
        role: null,
        emailid: '',
        entities: [],
        is_all_entity_access: false
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
      [name]: name == 'emailid' ? !value || !validateEmail(value) : !value
    })
  }

  const handleSave = async () => {
    formData.code = formData.code.trim()
    formData.name = formData.name.trim()
    setErrorField({
      code: !formData.code,
      name: !formData.name,
      role: !formData.role,
      entities: !formData.is_all_entity_access && !formData.entities.length
    })
    if (
      !formData.code ||
      !formData.name ||
      !formData.role ||
      (!formData.is_all_entity_access && !formData.entities.length)
    )
      return

    setDataSaving(true)
    setError('')

    try {
      const temp = {
        ...formData,
        role: undefined,
        role_id: formData.role?.id,
        entities: !formData.is_all_entity_access
          ? formData.entities.map((e) => e.id)
          : []
      }
      if (formData.id) {
        await axios.put(`/user/${id}`, temp)
      } else {
        await axios.post('/user', temp)
      }

      setDataSaving(false)
      addSnackbar(`User - ${formData.name} saved Successfully`)
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
      <DialogTitle>User</DialogTitle>
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
            required
            label='Email ID'
            fullWidth
            name='emailid'
            value={formData.emailid}
            error={errorField.emailid}
            onChange={handleChange}
          />
          <RoleAutocomplete
            value={formData.role}
            AutocompleteProps={{
              onChange: (event, value) => {
                setFormData({
                  ...formData,
                  role: value
                })
              }
            }}
          />
          <FormControlLabel
            control={
              <Switch
                name='is_all_entity_access'
                checked={formData.is_all_entity_access}
                onChange={handleChange}
              />
            }
            label={'Enable Access for all ' + org.entity}
          />
          {!formData.is_all_entity_access && (
            <EntityAutocomplete
              multiple='true'
              label={'Access enabled ' + org.entity}
              value={formData.entities}
              AutocompleteProps={{
                onChange: (event, value) => {
                  setFormData({
                    ...formData,
                    entities: value
                  })
                }
              }}
            />
          )}
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
