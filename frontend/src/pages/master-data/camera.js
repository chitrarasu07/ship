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
import Deck4 from './deck4'
import Deck5 from './deck5'
import Deck6 from './deck6'
import Deck7 from './deck7'
import Deck8 from './deck8'
import Deck9 from './deck9'
import Deck10 from './deck10'
import Deck11 from './deck11'
import Deck12 from './deck12'
import BridgeRoom from './bridgeRoom'
import ControlRoom from './controlRoom'
import MachineryRoom from './machineryRoom'
import Outdoor from './outdoor'
import Mooring from './mooring'

export default function CameraMaster() {
  const { org } = useApp() // Assuming org has deck1, deck2, deck3 names or provide static names
  const [value, setValue] = React.useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label='Camera Master' variant='scrollable'
        scrollButtons='auto'
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          px: 2,
          '& .MuiTab-root': {
            minWidth: 120,
            fontWeight: 600,
            color: '#3e4192',
            textTransform: 'none'
          }
        }}>
            <Tab label={org.deck1 || 'Deck 1'} value='1' />
            <Tab label={org.deck2 || 'Deck 2'} value='2' />
            <Tab label={org.deck3 || 'Deck 3'} value='3' />
            <Tab label={org.deck4 || 'Deck 4'} value='4' />
            <Tab label={org.deck5 || 'Deck 5'} value='5' />
            <Tab label={org.deck6 || 'Deck 6'} value='6' />
            <Tab label={org.deck7 || 'Deck 7'} value='7' />
            <Tab label={org.deck8 || 'Deck 8'} value='8' />
            <Tab label={org.deck9 || 'Deck 9'} value='9' />
            <Tab label={org.deck10 || 'Deck 10'} value='10' />
            <Tab label={org.deck11 || 'Deck 11'} value='11' />
            <Tab label={org.deck12 || 'Deck 12'} value='12' />
            <Tab label={org.bridgeroom || 'BridgeRoom'} value='13' />
            <Tab label={org.controlroom || 'ControlRoom'} value='14' />
            <Tab label={org.machineryroom || 'MachineryRoom'} value='15' />
            <Tab label={org.outdoor || 'OutdoorRoom'} value='16' />
            <Tab label={org.mooring || 'MooringRoom'} value='17' />
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
         <TabPanel value='4'>
          <Deck4 />
        </TabPanel>
        <TabPanel value='5'>
          <Deck5 />
        </TabPanel>
        <TabPanel value='6'>
          <Deck6 />
        </TabPanel>
       <TabPanel value='7'>
          <Deck7 />
        </TabPanel>
         <TabPanel value='8'>
          <Deck8 />
        </TabPanel>
        <TabPanel value='9'>
          <Deck9 />
        </TabPanel>
        <TabPanel value='10'>
          <Deck10 />
        </TabPanel>
        <TabPanel value='11'>
          <Deck11 />
        </TabPanel>
        <TabPanel value='12'>
          <Deck12 />
        </TabPanel>
        <TabPanel value='13'>
          <BridgeRoom />
        </TabPanel>
        <TabPanel value='14'>
          <ControlRoom />
        </TabPanel>
        <TabPanel value='15'>
          <MachineryRoom />
        </TabPanel>
        <TabPanel value='16'>
          <Outdoor />
        </TabPanel>
        <TabPanel value='17'>
          <Mooring />
        </TabPanel>

      </TabContext>
    </Box>
  )
}
