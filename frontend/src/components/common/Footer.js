import React from 'react'
import { Stack, Box, Typography } from '@mui/material'
import Copyright from './Copyright'

export default function Footer() {
  return (
    <>
      <Stack
        sx={{
          p: '15px',
          textAlign: 'center',
          position: 'static',
          backgroundColor: '#fff'
        }}
        className='footer'
      >
        <Box>
          <Typography>
            <Copyright />
          </Typography>
        </Box>
      </Stack>
    </>
  )
}
