// Profile.js
import React, { useState } from 'react'
import {
  IconButton,
  Typography,
  Box,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Link
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import Settings from '@mui/icons-material/Settings'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Logout from '@mui/icons-material/Logout'
import { useRouter } from 'next/router'
import { Key } from '@mui/icons-material'
import PasswordChange from '../../Authentication/ChangePasswordAdmin'
import LogoutConfirmation from '../../Authentication/LogoutConfirmationAdmin'

const Profile = () => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [openPopUp, setOpenPopUp] = useState(false)
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickOpen = () => {
    setOpenPopUp(true)
  }

  const handlePopClose = () => {
    setOpenPopUp(false)
  }

  const logOut = () => {
    setOpenLogoutPopup(true)
  }

  const confirmLogout = () => {
    router.push('/authentication/logout')
    setOpenLogoutPopup(false)
  }

  return (
    <>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ p: 0 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          className='ml-2'
        >
          <Avatar
            src='/images/user1.png'
            alt='Adison Jeck'
            sx={{ width: 40, height: 40 }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '10px',
            boxShadow: '0px 10px 35px rgba(50, 110, 189, 0.2)',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: openPopUp || openLogoutPopup ? 'top' : 'bottom'
        }}
        className='for-dark-top-navList'
      >
        <MenuItem>
          <Avatar src='/images/user1.png' className='mr-1' />
          <Box>
            <Typography sx={{ fontSize: '11px', color: '#757FEF' }}>
              Admin
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#260944',
                fontWeight: '500'
              }}
            >
              Adison Jeck
            </Typography>
          </Box>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon sx={{ mr: '-8px', mt: '-3px' }}>
            <Key fontSize='small' />
          </ListItemIcon>
          Change Password
        </MenuItem>

        <Divider />

        <MenuItem onClick={logOut}>
          <ListItemIcon sx={{ mr: '-8px', mt: '-3px' }}>
            <Logout fontSize='small' />
          </ListItemIcon>

          <Link fontSize='13px' color='inherit' underline='none'>
            Logout
          </Link>
        </MenuItem>
      </Menu>

      <PasswordChange open={openPopUp} onClose={handlePopClose} />
      <LogoutConfirmation
        open={openLogoutPopup}
        onClose={() => setOpenLogoutPopup(false)}
        onLogout={confirmLogout}
      />
    </>
  )
}

export default Profile
