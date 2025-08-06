import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

const LogoutPopup = ({ open, onClose, onLogout }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '330px',
          maxWidth: '90vw'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h9' sx={{ fontSize: '20px' }}>
          Logout
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant='h8' sx={{ color: '#333' }}>
          Are you sure you want to logout?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' variant='outlined'>
          Cancel
        </Button>
        <Button onClick={onLogout} color='primary' variant='outlined'>
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LogoutPopup
