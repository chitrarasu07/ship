import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import Deck1 from './deck1'
import Deck2 from './deck2'
import Deck3 from './deck3'
import { useApp } from '@/context/AppContext'

export default function CameraMaster() {
  const { org } = useApp() // Assuming org has deck1, deck2, deck3 names or provide static names
  const [value, setValue] = React.useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label='Camera Master'>
            <Tab label={org.deck1 || 'Deck 1'} value='1' />
            <Tab label={org.deck2 || 'Deck 2'} value='2' />
            <Tab label={org.deck3 || 'Deck 3'} value='3' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <Deck1 />
        </TabPanel>
        <TabPanel value='2'>
          <Deck2 />
        </TabPanel>
        <TabPanel value='3'>
          <Deck3 />
        </TabPanel>
      </TabContext>
    </Box>
  )
}
