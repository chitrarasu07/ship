import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'
import {
  Box,
  TextField,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material'
import {
  SCformButton,
  SCformHeading,
  SCLoginform
} from '@/styled-components/auth'
import Copyright from '../common/Copyright'
import { validateEmail } from '@/utils/commonUtils'

const SignInForm = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)

  //  validate password is there or not
  const validatePassword = (password) => {
    return password.length >= 1
  }

  // email event =>
  const handleEmailChange = (event) => {
    const inputEmail = event.target.value.trim()
    setEmail(inputEmail)
    setEmailError(!validateEmail(inputEmail))
  }
  //  password event =>
  const handlePasswordChange = (event) => {
    const inputPassword = event.target.value
    setPassword(inputPassword)
    setPasswordError(!validatePassword(inputPassword))
  }

  let callbackUrl = searchParams.get('callbackUrl')
  if (callbackUrl) {
    try {
      const url = new URL(callbackUrl)
      if (url.origin != globalThis.location?.origin) {
        callbackUrl = ''
      }
    } catch (e) {}
    if (callbackUrl.indexOf('logout') > -1) {
      callbackUrl = ''
    }
  }

  callbackUrl = callbackUrl || '/'
  const handleSubmit = async (event) => {
    event.preventDefault()
    setEmailError(!email)
    setPasswordError(!password)
    if (!password || !email) return

    try {
      setLoading(true)
      const result = await signIn('credentials', {
        emailid: email,
        password,
        callbackUrl,
        redirect: false
      })

      const clientSession = await getSession()
      if (result && result.status == 200 && clientSession?.user?.token) {
        setError('')
        router.push(callbackUrl)
      } else {
        if (result?.error) setError(decodeURIComponent(result.error))
        else setError('Invalid email id or password')
      }
    } catch (error) {
      setError(error.response?.data?.error || error.response?.statusText)
      console.error('Error saving user data:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleSubmit(event)
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleSubmit])

  return (
    <>
      <div style={{ backgroundColor: '#fff' }}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={12}>
            <Box
              component='div'
              sx={{ display: { xs: 'none', lg: 'block' } }}
            ></Box>
          </Grid>
          <Grid item md={12} lg={6} style={{ width: '100%', padding: '20px' }}>
            <SCLoginform style={{ paddingLeft: '10px' }}>
              <div>
                <div>
                  <SCformHeading>Login Your Admin account</SCformHeading>
                </div>

                <Box component='form' noValidate>
                  <Grid container alignItems='center' spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='off'
                        InputProps={{
                          style: { borderRadius: 8 }
                        }}
                        onChange={handleEmailChange}
                        error={emailError}
                        helperText={
                          emailError ? 'Enter the correct email address ' : ''
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='off'
                        InputProps={{
                          style: { borderRadius: 8 }
                        }}
                        onChange={handlePasswordChange}
                        error={passwordError}
                        helperText={
                          passwordError ? 'Please enter the password' : ''
                        }
                      />
                    </Grid>
                  </Grid>
                  <span>
                    {error && (
                      <Typography
                        variant='body2'
                        color='error'
                        align='center'
                        sx={{ mb: 2 }}
                      >
                        {error}
                      </Typography>
                    )}
                  </span>
                  <br />
                  <SCformButton
                    onClick={handleSubmit}
                    disabled={loading && email === '' && password === ''}
                  >
                    {loading ? (
                      <CircularProgress size={26} color='inherit' />
                    ) : (
                      'Login'
                    )}
                  </SCformButton>
                </Box>
                <Typography
                  fontSize='12px'
                  mt='20%'
                  textAlign='center'
                  color='#676B5F'
                >
                  <Copyright />
                </Typography>
              </div>
            </SCLoginform>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default SignInForm
