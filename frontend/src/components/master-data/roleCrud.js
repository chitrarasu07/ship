import { useEffect, useState } from 'react'
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material'
import axios from 'axios'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar } from '@/context/StackedSnackbar'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'

export default function RoleCRUD(props) {
  const { addSnackbar } = useSnackbar()
  const [error, setError] = useState('')
  const [permissions, setPermissions] = useState([])
  const [dataSaving, setDataSaving] = useState(false)
  const [availablePerms, setAvailablePerms] = useState([])
  const { id, open, handleClose, onSave } = props
  const defaultError = {
    code: false,
    name: false,
    permissions: false,
    landing_page: false
  }
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    name: '',
    landing_page: ''
  })
  const [errorField, setErrorField] = useState(defaultError)

  useEffect(() => {
    if (!open) return

    if (id) {
      const fetchRecordById = async () => {
        try {
          setDataSaving(true)
          const { data } = await axios.get(`/role`, {
            params: { id, getPermissions: true }
          })
          const savedDate = data?.roles && data.roles[0]
          if (savedDate) {
            setFormData({
              ...formData,
              ...savedDate
            })
            setPermissions(data.permissions || [])
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
        landing_page: ''
      })
      setPermissions([])
    }

    async function getPermissions() {
      try {
        const rolesRes = await axios.get('/no-guards/all-roles')
        const roles = rolesRes.data?.allRoles || []
        setAvailablePerms(roles)
      } catch (error) {
        console.error(error)
        setError(error.response?.data?.error || error.response?.statusText)
      }
    }

    getPermissions()
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

  const togglePermission = (page) => {
    setPermissions((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    )
  }

  const handleSave = async () => {
    formData.code = formData.code.trim()
    formData.name = formData.name.trim()
    setErrorField({
      code: !formData.code,
      name: !formData.name,
      permissions: !permissions.length,
      landing_page: !formData.landing_page
    })
    if (
      !formData.code ||
      !formData.name ||
      !permissions ||
      !permissions.length ||
      !formData.landing_page
    )
      return

    setDataSaving(true)
    setError('')

    try {
      const temp = {
        ...formData,
        permissions
      }
      if (formData.id) {
        await axios.put(`/role/${id}`, temp)
      } else {
        await axios.post('/role', temp)
      }

      setDataSaving(false)
      addSnackbar(`Role - ${formData.name} saved Successfully`)
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
      <DialogTitle>Role</DialogTitle>
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
            label='Role Name'
            fullWidth
            name='name'
            value={formData.name}
            error={errorField.name}
            onChange={handleChange}
          />
          <Typography variant='subtitle1' mt={2}>
            Allowed Pages
            {errorField.permissions && (
              <SCErrorSpan sx={{ paddingLeft: 0 }}>
                Please select at least one Pages
              </SCErrorSpan>
            )}
          </Typography>
          {availablePerms.map((perm) => (
            <div key={perm.page}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.includes(perm.page)}
                    onChange={() => togglePermission(perm.page)}
                  />
                }
                label={perm.page}
              />
            </div>
          ))}
          <FormControl fullWidth sx={{ marginTop: '20px' }}>
            <InputLabel id='lp-select-label'>Landing Page</InputLabel>
            <Select
              labelId='lp-select-label'
              id='lp-select'
              name='landing_page'
              value={formData.landing_page}
              error={errorField.landing_page}
              onChange={handleChange}
            >
              {permissions.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
