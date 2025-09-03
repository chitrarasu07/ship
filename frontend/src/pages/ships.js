import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ShipFilters from '../components/ships/ShipFilters'
import ShipList from '../components/ships/ShipList'
import ShipDetails from '../components/ships/ShipDetails'
import { Ship as ShipIcon } from 'lucide-react'

export default function ShipsPage() {
  const [ships, setShips] = useState([])
  const [alerts, setAlerts] = useState([])
  const [filteredShips, setFilteredShips] = useState([])
  const [selectedShip, setSelectedShip] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Auto-select first ship when ships load and none selected
    if (filteredShips.length > 0 && !selectedShip) {
      setSelectedShip(filteredShips[0])
    }
  }, [filteredShips, selectedShip])

  const loadData = async () => {
  setIsLoading(true)
  setError(null)
  try {
    const res = await axios.get('/no-guards/entity', { params: { limit: 20, pageNo: 1 } })
    const shipsData = res.data.entities || []   // ✅ fix key
    // const alertsData = res.data.alerts || []
    // dummy data and after that will reomve it , use above alertsdata
    const alertsData = [
  {
    id: 1,
    title: 'Engine Overheating',
    description: 'Engine temperature exceeded safe limits.',
    severity: 'critical',
    status: 'active',
    ship_id: 1,
    location: 'Engine Room',
    videoUrl: '../videos/fire-detect-1.mp4',
    created_date: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Hull Breach Detected',
    description: 'Minor breach detected near cargo bay.',
    severity: 'high',
    status: 'acknowledged',
    ship_id: 2,
    location: 'Cargo Bay',
    videoUrl: '../videos/fire-detect-2.mp4',
    created_date: new Date(Date.now() - 3600 * 1000).toISOString() // 1 hour ago
  },
  {
    id: 3,
    title: 'Navigation System Failure',
    description: 'Autopilot system malfunctioned.',
    severity: 'emergency',
    status: 'resolved',
    ship_id: 1,
    location: 'Bridge',
    videoUrl: '../videos/fire-detect-3.mp4',
    created_date: new Date(Date.now() - 24 * 3600 * 1000).toISOString() // 1 day ago
  }
];

  

    setShips(shipsData)
    setFilteredShips(shipsData)
    setAlerts(alertsData)
    if (shipsData.length > 0) setSelectedShip(shipsData[0])
  } catch (err) {
    setError('Failed to load ship data')
    console.error(err)
  }
  setIsLoading(false)
}


  const handleFilterChange = (filters) => {
    let updatedShips = [...ships]

    if (filters.searchTerm) {
      updatedShips = updatedShips.filter(
        (ship) =>
          ship.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          ship.imo_number.includes(filters.searchTerm)
      )
    }

    if (filters.status && filters.status !== 'all') {
      updatedShips = updatedShips.filter((ship) => ship.status === filters.status)
    }

    if (filters.shipType && filters.shipType !== 'all') {
      updatedShips = updatedShips.filter((ship) => ship.ship_type === filters.shipType)
    }

    setFilteredShips(updatedShips)
    setSelectedShip(updatedShips.length > 0 ? updatedShips[0] : null)
  }

  return (
    <div className='flex h-screen bg-slate-50 overflow-hidden'>
      {/* Sidebar */}
      <div className='w-full md:w-1/3 lg:w-1/4 xl:w-1/4 border-r border-slate-200 flex flex-col'>
        <div className='p-4 border-b border-slate-200'>
          <h2 className='text-xl font-bold text-slate-900 flex items-center gap-2'>
            <ShipIcon className='w-6 h-6 text-blue-600' />
            Fleet Overview
          </h2>
          <p className='text-sm text-slate-500'>{filteredShips.length ?? 0} ships found</p>
          {error && <p className='text-red-500'>{error}</p>}
        </div>
        <div className='p-4'>
          <ShipFilters onFilterChange={handleFilterChange} />
        </div>
        <div className='flex-1 overflow-y-auto'>
          <ShipList
            ships={filteredShips}
            selectedShip={selectedShip}
            onSelectShip={setSelectedShip}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Ship Details */}
      <div className='flex-1 overflow-y-auto'>
        <ShipDetails
          ship={selectedShip}
          alerts={alerts.filter((a) => a.ship_id === selectedShip?.id)}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
