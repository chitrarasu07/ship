import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import subMenu from './SubMenu.module.css'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const SidebarLabel = styled('span')(() => ({
  position: 'relative',
  color: 'white',
  alignItems: 'center',
  marginTop: '5px'
}))

const SubMenu = ({ item, onMenuClick, currentPath }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (item.subNav) {
      setOpen(item.subNav.some((subItem) => subItem.path === currentPath))
    }
  }, [currentPath, item.subNav])

  const handleMenuClick = (ele) => {
    if (!ele.subNav || ele.subNav.length === 0) {
      onMenuClick(ele.path)
      return
    }
    setOpen(!open)
  }

  const handleSubmenuClick = (ele) => {
    onMenuClick(ele.path)
  }

  return (
    <div>
      <div
        onClick={() => handleMenuClick(item)}
        className={`${subMenu.sidebarLink} ${
          currentPath === item.path ? subMenu.sidebarLinkActive : ''
        }`}
      >
        <div>
          {item.icon && <SidebarLabel>{item.icon}</SidebarLabel>}
          <SidebarLabel className='ml-1'>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && open ? (
            <KeyboardArrowDownIcon />
          ) : item.subNav ? (
            <KeyboardArrowRightIcon />
          ) : null}
        </div>
      </div>
      {open &&
        item.subNav?.map((subNavItem, index) => (
          <div
            key={index}
            onClick={() => handleSubmenuClick(subNavItem)}
            className={`${subMenu.sidebarLink2} ${
              currentPath === subNavItem.path && subMenu.sidebarLinkActive
            }`}
          >
            {subNavItem.icon && <SidebarLabel>{subNavItem.icon}</SidebarLabel>}
            {subNavItem.title}
          </div>
        ))}
    </div>
  )
}

export default SubMenu
