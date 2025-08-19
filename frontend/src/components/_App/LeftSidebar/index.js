import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'
import SubMenu from './SubMenu'
import { getMenuData } from './MenuData'
import { hasPermission } from '@/utils/authUtils'
import { useApp } from '@/context/AppContext'

const SidebarNav = styled('nav')(({ theme }) => ({
  background: '#00002B',
  boxShadow: '0px 4px 20px rgba(47, 143, 232, 0.07)',
  width: '300px',
  padding: '30px 10px',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  transition: '350ms',
  zIndex: '10',
  overflowY: 'auto'
}))

const SidebarWrap = styled('div')(({ theme }) => ({
  width: '100%'
}))

const Sidebar = ({ toogleActive }) => {
  const { org } = useApp()
  const router = useRouter()
  const [menus, setMenus] = useState([])
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(router.asPath)
    const tempMenus = []
    getMenuData(org).forEach((s) => {
      if (s.permissions?.length && hasPermission(s.permissions)) {
        tempMenus.push(s)
      } else if (s.subNav?.length) {
        const subNav = []
        s.subNav.forEach((sn) => {
          if (sn.permissions?.length && hasPermission(sn.permissions)) {
            subNav.push(sn)
          }
        })

        if (subNav.length) {
          tempMenus.push({
            ...s,
            subNav
          })
        }
      }
    })

    setMenus(tempMenus)
  }, [router])

  const handleLinkClick = (path) => {
    router.push(path)
    const screenWidth = window.innerWidth
    if (
      screenWidth <= 1200 &&
      toogleActive &&
      typeof toogleActive === 'function'
    ) {
      toogleActive()
    }
  }

  return (
    <>
      <div id='leftsidebardark'>
        <SidebarNav className='LeftSidebarNav'>
          <SidebarWrap>
            <Box
              sx={{
                mb: '10px',
                px: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Link href='/'>
                <img
                  src='/logo/Logo-Main.png'
                  alt='Logo'
                  className='black-logo'
                />
                {/* For Dark Variation */}
                <img
                  src='/logo/Logo-Main.png'
                  alt='Logo'
                  className='white-logo'
                />
              {/* <Typography sx={{ 
                fontSize: {
                  xs: '8px',
                  sm: '10px',
                md: '15px'},
                position: { xs: 'absolute',
      sm: 'absolute',
      md: 'absolute',
    },
    top: {
      xs: '80px',
      sm: '80px',
      md: '108px',
    },
    left: {
      xs: '85px',
      sm: '85px',
      md: '114px',
    }}}>Maritime Intelligence</Typography> */}

              </Link>
              {/* Conditionally render the toggle button based on screen size */}
              <IconButton
                onClick={toogleActive}
                size='small'
                sx={{
                  backgroundImage:
                    'linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)',
                  display: {
                    xs: 'flex',
                    sm: 'flex',
                    md: 'flex',
                    lg: 'none'
                  },
                  ml: 4
                }}
              >
                <ClearIcon />
              </IconButton>
            </Box>
            {menus.map((item, index) => (
              <SubMenu
                key={index}
                item={item}
                onMenuClick={handleLinkClick}
                currentPath={currentPath}
              />
            ))}
          </SidebarWrap>
        </SidebarNav>
      </div>
    </>
  )
}

export default Sidebar
