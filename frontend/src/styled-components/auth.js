import { Button, styled, Typography } from '@mui/material'

export const SCformText = styled('div')({
  position: 'relative',
  left: 0,
  bottom: 0,
  background: '#00002b',
  padding: '40px',
  width: '100%',
  float: 'left',
  '& img': {
    width: '150px'
  },
  '& p': {
    fontSize: '14px !important',
    lineHeight: '27px',
    textAlign: 'left',
    color: '#fff !important',
    '@media (max-width: 468px)': {
      fontSize: '12px !important'
    }
  },
  '& h1, & span': {
    fontSize: '30px',
    fontWeight: 300,
    lineHeight: '48px',
    letterSpacing: '0px',
    textAlign: 'left',
    color: '#fff',
    marginTop: '25px',
    marginBottom: '35px',
    '& span': {
      fontWeight: 600
    },
    '@media (max-width: 768px)': {
      fontSize: '32px',
      lineHeight: '40px',
      '& span': {
        fontWeight: 550
      }
    },
    '@media (max-width: 568px)': {
      fontSize: '28px',
      lineHeight: '36px',
      '& span': {
        fontWeight: 500
      }
    },
    '@media (max-width: 468px)': {
      fontSize: '24px',
      lineHeight: '32px',
      '& span': {
        fontWeight: 450
      }
    },
    '@media (max-width: 400px)': {
      fontSize: '18px',
      lineHeight: '28px',
      '& span': {
        fontWeight: 400
      }
    }
  }
})

export const SCformButton = styled(Button)({
  background: 'linear-gradient(270deg, #02e1b9 0%, #00acf6 100%)',
  width: '100%',
  borderRadius: '100px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '16px',
  letterSpacing: '0px',
  textAlign: 'center',
  border: 'none',
  minWidth: '130px',
  padding: '14px 16px'
})

export const SCformButtonSmall = styled(Button)({
  background: 'linear-gradient(270deg, #02e1b9 0%, #00acf6 100%)',
  width: '10%',
  borderRadius: '100px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '16px',
  letterSpacing: '0px',
  textAlign: 'center',
  border: 'none',
  minWidth: '130px',
  padding: '14px 16px'
})

export const SCformHeading = styled('h1')({
  padding: '15px',
  textAlign: 'center'
})

export const SCLoginform = styled('div')({
  display: 'flex !important',
  alignItems: 'center !important',
  justifyContent: 'center !important',
  backgroundColor: '#fff',
  paddingTop: '10%'
})

export const SCreSendOtpButton = styled('button')({
  border: 'none',
  backgroundColor: '#fff',
  cursor: 'pointer',
  padding: 'initial',
  color: '#1678FB'
})

export const SCreSendOtpText = styled('p')({
  fontSize: '14px',
  color: '#70757B',
  fontWeight: '400',
  textDecoration: 'underline'
})

export const SCsuccessMessage = styled(Typography)({
  fontWeight: '400',
  color: '#29564',
  textAlign: 'center',
  fontcolor: '#29564',
  backgroundColor: '#29564'
})
