import React, { useEffect, useState } from 'react'
import '../_axios'

// for remixicon (icons)
import '../styles/remixicon.css'
// Globals Styles
import '../styles/globals.css'
// Rtl Styles
import '../styles/rtl.scss'
// Dark Mode Styles
import '../styles/dark.scss'
// Theme Styles
import theme from '../styles/theme'

import '../styles/index.css'

import Layout from '@/components/_App/Layout'
import { SessionProvider } from 'next-auth/react'
import {
  ThemeProvider,
  CssBaseline,
  Backdrop,
  CircularProgress
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { useRouter } from 'next/router'
import {
  StackedSnackbar,
  StackedSnackbarProvider
} from '@/context/StackedSnackbar'
import { AppProvider } from '@/context/AppContext'

function MyApp({
  Component,
  pageProps: { session, role, organization, ...pageProps }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => {
      setLoading(true)
    }

    const handleComplete = () => {
      setLoading(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <main>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SessionProvider session={session}>
          <AppProvider initialOrg={organization} initialRole={role}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <StackedSnackbarProvider>
                <StackedSnackbar />
                <Backdrop
                  sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                  }}
                  open={loading}
                >
                  <CircularProgress color='inherit' />
                </Backdrop>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </StackedSnackbarProvider>
            </LocalizationProvider>
          </AppProvider>
        </SessionProvider>
      </ThemeProvider>
    </main>
  )
}

export default MyApp
