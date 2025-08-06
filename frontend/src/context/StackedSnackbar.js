import { Snackbar, Stack } from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import React, { createContext, useContext, useState } from 'react'

const StackedSnackbarContext = createContext(undefined)

export const StackedSnackbarProvider = ({ children }) => {
  const [stackedSnackbars, setStackedSnackbars] = useState([])

  const addSnackbar = (message, severity) => {
    const key = `snackbar-${stackedSnackbars.length + 1}${Math.random()}`
    setStackedSnackbars((prev) => [...prev, { key, message, severity }])
    setTimeout(() => removeSnackbar(key), 5000) // Auto-close after 5 seconds
  }

  const removeSnackbar = (key) => {
    setStackedSnackbars((prev) => prev.filter((item) => item.key !== key))
  }

  const contextValue = {
    stackedSnackbars,
    addSnackbar,
    removeSnackbar
  }

  return (
    <StackedSnackbarContext.Provider value={contextValue}>
      {children}
    </StackedSnackbarContext.Provider>
  )
}

export const useSnackbar = () => {
  const context = useContext(StackedSnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a StackedSnackbarProvider')
  }
  return context
}

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
))

export function StackedSnackbar() {
  const { stackedSnackbars, removeSnackbar } = useSnackbar()

  return (
    <Stack
      spacing={2}
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 9999 // Adjust as needed
      }}
    >
      {stackedSnackbars.map(({ key, message, severity }) => (
        <Alert
          key={key}
          onClose={() => removeSnackbar(key)}
          severity={severity || 'success'}
          sx={{ width: '300px' }}
        >
          {message}
        </Alert>
      ))}
    </Stack>
  )
}
