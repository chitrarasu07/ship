import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  IconButton,
  Tooltip,
  Menu,
  Typography,
  Button,
  Link,
  Badge,
  Box
} from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import styles from './Notification.module.css'

const Notification = ({ id }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [markAsAllRead, setMarkAsAllRead] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const open = Boolean(anchorEl)

  useEffect(() => {
    if (markAsAllRead) {
      handleNotificationClick()
    }
  }, [markAsAllRead])

  const fetchNotificationCount = async () => {
    try {
      const res = await axios.get(`/notifications/unread-count/${id}`)
      setUnreadCount(res?.data?.unreadCount)
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  useEffect(() => {
    fetchNotificationCount()

    const intervalId = setInterval(fetchNotificationCount, 30000)

    return () => clearInterval(intervalId)
  }, [id])

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget)
    try {
      const res = await global.axios.get(`/notifications/${id}`)
      setNotifications(res?.data?.notifications)
      setUnreadCount(
        res?.data?.notifications.filter((notif) => !notif.isRead).length
      )
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
    setShowAll(false)
  }

  const handleNotificationClick = async (notifId, actionUrl) => {
    try {
      await global.axios.post(
        `/notifications/${markAsAllRead ? id : notifId}`,
        {
          markAsAllRead
        }
      )

      if (markAsAllRead) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        )
        setUnreadCount(0)
        setMarkAsAllRead(false)
      } else if (notifId) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, isRead: true } : notif
          )
        )
        setUnreadCount((prev) => prev - 1)
      }

      if (actionUrl) {
        window.location.href = actionUrl
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    } finally {
      handleClose()
    }
  }

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 4)

  const handleViewMoreLess = (event) => {
    event.stopPropagation()
    setShowAll(!showAll)
  }

  return (
    <React.Fragment>
      <Tooltip title='Notifications'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{
            backgroundColor: '#f5f5f5',
            width: '40px',
            height: '40px',
            p: 0
          }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          className='ml-2 for-dark-notification'
        >
          <Badge badgeContent={unreadCount} color='primary'>
            <NotificationsActiveIcon color='action' />
          </Badge>
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
            padding: '5px 20px 5px',
            borderRadius: '10px',
            boxShadow: '0px 10px 35px rgba(50, 110, 189, 0.2)',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            width: '330px',
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
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div className={styles.header}>
          <Typography variant='h4'>Notifications</Typography>
          <Button
            variant='text'
            disabled={notifications.length === 0}
            onClick={() => {
              setMarkAsAllRead(true)
            }}
          >
            Clear all
          </Button>
        </div>
        {notifications.length === 0 && (
          <Typography
            variant='h5'
            sx={{
              fontSize: '14px',
              color: '#260944',
              fontWeight: '400',
              m: 2
            }}
          >
            No new notifications to show up.
          </Typography>
        )}
        <Box
          className={styles.notification}
          sx={{
            maxHeight: '430px',
            maxWidth: '300px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1'
            }
          }}
        >
          {displayedNotifications.map((notif) => (
            <div
              className={styles.notificationList}
              key={notif.id}
              onClick={() => handleNotificationClick(notif.id, notif.actionUrl)}
            >
              <Typography
                variant='h5'
                sx={{
                  fontSize: '14px',
                  color: '#260944',
                  fontWeight: '500'
                }}
              >
                {notif.message}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#A9A9C8', mt: 0.5 }}>
                {new Date(notif.createdAt).toLocaleString()}
              </Typography>
            </div>
          ))}
          {notifications.length > 4 && (
            <Typography component='div' textAlign='center'>
              <Link
                underline='none'
                sx={{
                  fontSize: '13px',
                  color: '#757FEF',
                  fontWeight: '500',
                  mt: '10px',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}
                onClick={handleViewMoreLess}
              >
                {showAll ? 'View Less' : 'View More'}
                <span className={styles.rightArrow}>
                  <i className='ri-arrow-right-s-line'></i>
                </span>
              </Link>
            </Typography>
          )}
        </Box>
      </Menu>
    </React.Fragment>
  )
}

export default Notification
