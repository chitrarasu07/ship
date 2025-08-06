import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import axios from 'axios'

const PasswordChange = ({ open, onClose }) => {
  const initialState = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const [formState, setFormState] = useState(initialState)
  const [serverError, setServerError] = useState(null)
  const [error, setError] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const updatePassword = async () => {
    setError({
      currentPassword: !formState.currentPassword
        ? 'Current Password is required'
        : '',
      newPassword:
        !formState.newPassword ||
        formState.newPassword.length < 8 ||
        formState.newPassword === formState.currentPassword
          ? 'This field is required and should be 8 digits in length, matching the current password.'
          : '',
      confirmPassword: !formState.confirmPassword
        ? 'This field is required and should be same as new password'
        : ''
    })

    if (
      formState.currentPassword === '' ||
      formState.newPassword.length < 8 ||
      formState.confirmPassword !== formState.newPassword ||
      formState.newPassword === formState.currentPassword
    ) {
      return
    }

    try {
      const { currentPassword, newPassword } = formState
      const data = { currentPassword, newPassword }

      await axios.post('/changePasswordAdmin', data)
      console.log("Admin's Password Updated Successfully")
      resetForm()
      onClose()
    } catch (error) {
      handleAxiosError(error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }))

    setError((prevError) => ({
      ...prevError,
      [name]:
        name === 'currentPassword'
          ? !value
            ? 'Current Password is required'
            : ''
          : name === 'newPassword'
            ? value === formState.currentPassword
              ? 'New Password must be different from Current Password'
              : value.length < 8
                ? 'Password should be at least 8 characters long'
                : ''
            : name === 'confirmPassword'
              ? value !== formState.newPassword
                ? 'INVALID: The Confirm Password and New Password must be the same.'
                : ''
              : ''
    }))
  }

  const handleAxiosError = (error) => {
    console.error('Error in Updating Customer Password', error)
    setServerError(
      error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'Server Error'
    )
  }

  const resetForm = () => {
    setFormState(initialState)
    setError({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setServerError(null)
  }

  useEffect(() => {
    return () => resetForm()
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle variant='h3' fontWeight='bold' textAlign='center'>
        Change Password
      </DialogTitle>
      <DialogContent>
        <Card
          sx={{
            boxShadow: 'none',
            borderRadius: '10px',
            mb: '15px',
            display: 'flex',
            p: '12px 12px',
            flexDirection: 'column',
            background: 'white'
          }}
        >
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            spacing={1}
          >
            <Grid
              item
              xs={12}
              sm={8}
              md={8}
              style={{ flexBasis: '60%', justifyContent: 'center' }}
            >
              <TextField
                required
                fullWidth
                id='currentPassword'
                label='Current Password'
                name='currentPassword'
                type='password'
                value={formState.currentPassword}
                onChange={handleInputChange}
                placeholder='Enter current password'
                error={Boolean(error.currentPassword)}
                helperText={error.currentPassword}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                required
                fullWidth
                id='newPassword'
                label='New Password'
                name='newPassword'
                type='password'
                value={formState.newPassword}
                onChange={handleInputChange}
                placeholder='Enter new password'
                error={Boolean(error.newPassword)}
                helperText={error.newPassword}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                required
                fullWidth
                label='Confirm Password'
                type='password'
                name='confirmPassword'
                value={formState.confirmPassword}
                onChange={handleInputChange}
                placeholder='Confirm new password'
                error={Boolean(error.confirmPassword)}
                helperText={error.confirmPassword}
                style={{ marginBottom: '16px' }}
              />
            </Grid>
          </Grid>
        </Card>
        {serverError && (
          <Typography
            variant='body2'
            color='error'
            fontWeight='bold'
            textAlign='center'
          >
            {serverError}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={updatePassword} color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PasswordChange
