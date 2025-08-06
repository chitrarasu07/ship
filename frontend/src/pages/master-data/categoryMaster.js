import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import Category1 from './category1'
import Category2 from './category2'
import Category3 from './category3'
import { useApp } from '@/context/AppContext'

export default function CategoryMaster() {
  const { org } = useApp()
  const [value, setValue] = React.useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label='Category Master'>
            <Tab label={org.category1} value='1' />
            <Tab label={org.category2} value='2' />
            <Tab label={org.category3} value='3' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Category1 />
        </TabPanel>
        <TabPanel value='2'>
          <Category2 />
        </TabPanel>
        <TabPanel value='3'>
          <Category3 />
        </TabPanel>
      </TabContext>
    </Box>
  )
}
