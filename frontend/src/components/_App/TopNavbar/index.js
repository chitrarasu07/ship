import * as React from 'react'
import { AppBar, Toolbar, IconButton, Stack, Typography } from '@mui/material'
import Profile from './Profile'
import Tooltip from '@mui/material/Tooltip'
import CurrentDate from './CurrentDate'
import { useSession } from 'next-auth/react'
import Notification from '@/components/common/Notification'

const TopNavbar = ({ toogleActive }) => {
  const { data: session } = useSession()
  const id = session?.user?.id

  return (
    <>
      <div id='topnavbardark'>
        <AppBar
          color='inherit'
          sx={{
            backgroundColor: '#fff',
            boxShadow: '0px 4px 20px rgba(47, 143, 232, 0.07)',
            py: '6px',
            mb: '30px',
            position: 'sticky'
          }}
          className='top-navbar-for-dark'
        >
          <Toolbar>
            <Tooltip title='Hide/Show' arrow>
              <IconButton
                size='sm'
                edge='start'
                color='inherit'
                onClick={toogleActive}
              >
                <i className='ri-align-left'></i>
              </IconButton>
            </Tooltip>
            <Typography component='div' sx={{ flexGrow: 1 }}></Typography>
            <Stack direction='row' spacing={2}>
              <Notification id={id} />
              <CurrentDate />
              <Profile />
            </Stack>
          </Toolbar>
        </AppBar>
      </div>
    </>
  )
}

export default TopNavbar
