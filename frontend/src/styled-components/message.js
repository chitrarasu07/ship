import { CircularProgress, styled } from '@mui/material'

export const SCBtnLoader = styled(CircularProgress)({
  marginLeft: '15px',
  width: '20px !important',
  height: '20px !important'
})

export const SCMessage = styled('span')({
  margin: 0,
  display: 'flex',
  fontWeight: 400,
  fontSize: '0.75rem',
  lineHeight: '1.43',
  letterSpacing: '0.01071em',
  textAlign: 'center',
  color: '#4caf50', // Change color to green
  padding: '10px'
})
