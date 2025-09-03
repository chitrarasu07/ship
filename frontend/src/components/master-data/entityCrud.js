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
  MenuItem
} from '@mui/material'
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close'
import { useApp } from '@/context/AppContext'
import { useSnackbar } from '@/context/StackedSnackbar'
import { SCBtnLoader, SCErrorSpan } from '@/styled-components/common'
import Category1Autocomplete from '../autocomplete/category1Autocomplete'
import Category2Autocomplete from '../autocomplete/category2Autocomplete'
import Category3Autocomplete from '../autocomplete/category3Autocomplete'

export default function EntityCRUD(props) {
  const { org } = useApp()
  const { addSnackbar } = useSnackbar()
  const [error, setError] = useState('')
  const [dataSaving, setDataSaving] = useState(false)
  const { id, open, handleClose, onSave } = props
  const defaultError = {
    code: false,
    name: false,
    imo_number: false,
    flag: false,
    cameras_installed: false,
    category1: false,
    category2: false,
    category3: false,
    status: false
  }
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    name: '',
    comments: '',
    imo_number: '',
    flag: '',
    cameras_installed: '',
    category1: null,
    category2: null,
    category3: null,
    status: 'active'
  })
  const [errorField, setErrorField] = useState(defaultError)

  useEffect(() => {
    if (!open) return

    if (id) {
      const fetchRecordById = async () => {
        try {
          setDataSaving(true)
          const { data } = await axios.get(`/entity`, {
            params: { id }
          })
          const savedDate = data?.entities && data.entities[0]
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
        comments: '',
        imo_number: '',
        flag: '',
        cameras_installed: '',
        category1: null,
        category2: null,
        category3: null
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
      code: !formData.code ? 'Code is required' : '',
      name: !formData.name ? 'Name is required' : '',
      imo_number: !formData.imo_number ? 'IMO Number is required' : '',
      flag: !formData.flag ? 'Flag is required' : '',
      cameras_installed: !formData.cameras_installed ? 'Cameras Installed is required' : '',
      // status: !formData.status ? 'Status is required' : '',
      // category1: !formData.category1,
      // category2: !formData.category2,
      // category3: !formData.category3
    })

    if (
      !formData.code ||
      !formData.name ||
      !formData.imo_number ||
      !formData.flag ||
      !formData.cameras_installed ||
      !formData.status
      // !formData.category1 ||
      // !formData.category2 ||
      // !formData.category3
    )
      return

    setDataSaving(true)

    // already  writen this i commend this - >  setError('this is blocked')

    try {
      const temp = {
        ...formData,
        category1: undefined,
        category2: undefined,
        category3: undefined,
        category1_id: formData.category1?.id,
        category2_id: formData.category2?.id,
        category3_id: formData.category3?.id
      }
      if (formData.id) {
        await axios.put(`/entity/${id}`, temp)
      } else {
        await axios.post('/entity', temp)
      }

      setDataSaving(false)
      addSnackbar(`${org.entity} - ${formData.name} saved Successfully`)
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
      <DialogTitle>{org.entity}</DialogTitle>
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
            helperText={errorField.code}
          />
          <TextField
            required
            label='Name'
            fullWidth
            name='name'
            value={formData.name}
            error={errorField.name}
            onChange={handleChange}
            helperText={errorField.name}
          />
          {/* <TextField
            fullWidth
            multiline
            name='comments'
            label='Comments'
            value={formData.comments}
            onChange={handleChange}
          /> */}
          {/*  if status is required to create an new record means , we enable this textfield  */}
          {/* <TextField
            select
            fullWidth
            label='Status'
            name='status'
            value={formData.status}
            onChange={handleChange}
            required
            error={!!errorField.status}
            helperText={errorField.status}
            sx={{ m: 1 }}
          >
            <MenuItem value='active'>active</MenuItem>
            <MenuItem value='in_port'>in_port</MenuItem>
            <MenuItem value='maintenance'>maintenance</MenuItem>
            <MenuItem value='offline'>offline</MenuItem>
          </TextField> */}

          <TextField
            required
            fullWidth
            label='IMO Number'
            name='imo_number'
            value={formData.imo_number}
            error={!!errorField.imo_number}
            onChange={handleChange}
            helperText={errorField.imo_number}
          />
          <TextField
            required
            fullWidth
            label='Flag'
            name='flag'
            value={formData.flag}
            error={!!errorField.flag}
            onChange={handleChange}
            helperText={errorField.flag}
          />
          <TextField
            required
            fullWidth
            label='Cameras Installed'
            name='cameras_installed'
            value={formData.cameras_installed}
            error={!!errorField.cameras_installed}
            onChange={handleChange}
            helperText={errorField.cameras_installed}
          />
          <Category1Autocomplete
            value={formData.category1}
            // .................... this code is for show errors in that field..............//
            // InputProps={{
            //   error: errorField.category1
            // }}
            AutocompleteProps={{
              onChange: (event, value) => {
                setFormData({
                  ...formData,
                  category1: value,
                  category2: null
                })
                // setErrorField((prev) => ({
                //   ...prev,
                //   category1: value ? '' : 'Required field'
                // }))
              }
            }}
          />
          <Category2Autocomplete
            value={formData.category2}
            // InputProps={{
            //   error: errorField.category2
            // }}
            category1_id={formData.category1?.id || null}
            AutocompleteProps={{
              onChange: (event, value) => {
                setFormData({
                  ...formData,
                  category2: value,
                  category1: value?.category1 || null
                })
                // setErrorField((prev) => ({
                //   ...prev,
                //   category2: value ? '' : 'Required field'
                // }))
              }
            }}
          />
          <Category3Autocomplete
            value={formData.category3}
            // InputProps={{
            //   error: errorField.category3
            // }}
            category1_id={formData.category1?.id || null}
            category2_id={formData.category2?.id || null}
            AutocompleteProps={{
              onChange: (event, value) => {
                setFormData({
                  ...formData,
                  category3: value,
                  category2: value?.category2 || null,
                  category1: value?.category1 || null
                })
                // setErrorField({
                //   ...errorField,
                //   category3: value
                // })
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
