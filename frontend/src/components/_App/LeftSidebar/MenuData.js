import React from 'react'
import GridViewIcon from '@mui/icons-material/GridView'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import SpokeIcon from '@mui/icons-material/Spoke'
import {
  Accessibility,
  AccountCircle,
  BarChart,
  Domain,
  LineAxis,
  LocationCity,
  LocationPin,
  Margin,
  Report,
  Sailing
} from '@mui/icons-material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import VideocamIcon from '@mui/icons-material/Videocam';


export const getMenuData = (org) => [
  {
    title: 'Dashboard',
    path: '/management-dashboard',
    icon: <GridViewIcon />,
    permissions: ['management-dashboard'],
    style:{
      MarginTop: '15px'
    }
  },
  {
    title:'Live Feeds',
    path: '/liveFeeds',
    icon: <VideocamIcon />,
    permissions: ['livefeeds']
  },
  {
    title: 'Ships',
    path: '/ships',
    icon: <Sailing />,
    permissions: ['management-dashboard']
  },
  {
    title: 'Alerts',
    path: '/alerts',
    icon: <Report />,
    permissions: ['alerts']
  },
  {
    title: 'Statistics',
    path: '/statistics',
    icon: <BarChart />,
    permissions: ['statistics']
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: <LineAxis />,
    permissions: ['reports']
  },
  {
    title: 'Master-Data',
    path: '/masterData',
    icon: <SettingsApplicationsIcon />,
    subNav: [
      {
        title: 'Roles',
        path: '/master-data/role',
        icon: <Accessibility />,
        permissions: ['role']
      },
      {
        title: 'Users',
        path: '/master-data/user',
        icon: <AccountCircle />,
        permissions: ['user']
      },
      {
        title: 'Category Master',
        path: '/master-data/categoryMaster',
        icon: <LocationCity />,
        permissions: ['category1', 'category2', 'category3']
      },
      {
        title: org.entity,
        path: '/master-data/entity',
        icon: <Domain />,
        permissions: ['entity']
      },
      {
        title: org.entity_section,
        path: '/master-data/entitySection',
        icon: <Domain />,
        permissions: ['entity-section']
      },
      {
        // title: 'Reference Master',
        title:'Ship Status',
        path: '/master-data/referenceMaster',
        icon: <SpokeIcon />,
        permissions: ['reference-master']
      },
      {
        title: 'Camera Master',
        path: '/master-data/camera',
        icon: <CameraAltIcon/>,
        permissions: ['camera']
      }
    ]
  },
  {
    title: 'Settings',
    path: '/settings/account',
    icon: <SettingsIcon />,
    subNav: []
  }
]
