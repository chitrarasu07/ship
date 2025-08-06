import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'

const AppContext = createContext(null)

export const AppProvider = ({ children, initialOrg, initialRole }) => {
  const [org, setOrg] = useState(initialOrg || null)
  const [role, setRole] = useState(initialRole || [])

  const router = useRouter()
  const isAuthRoute = router.pathname.startsWith('/authentication/')

  useEffect(() => {
    if (isAuthRoute) return

    const fetchRoles = async () => {
      try {
        const res = await axios.get('/no-guards/my-roles')
        if (res.data) {
          sessionStorage.setItem('my-roles', JSON.stringify(res.data))
          setRole(res.data.role)
          setOrg(res.data.organization)
        } else console.error(`can't fetch the Roles`)
      } catch (e) {
        console.error('fetchRoles error', e)
      }
    }

    if (!initialOrg || !initialRole) {
      const cached = sessionStorage.getItem('my-roles')
      if (cached) {
        const parsed = JSON.parse(cached)
        setRole(parsed.role)
        setOrg(parsed.organization)
      } else fetchRoles()
    } else {
      sessionStorage.setItem(
        'my-roles',
        JSON.stringify({ role: initialRole, organization: initialOrg })
      )
      setOrg(initialOrg)
      setRole(initialRole)
    }
  }, [initialOrg, initialRole, router.pathname])

  // Show loader if org is missing and we're not on an authentication page
  if (!org && !isAuthRoute) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <AppContext.Provider value={{ org, role }}>{children}</AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
