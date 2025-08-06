import React, { useState, useEffect } from 'react'
import ShipFilters from '../components/ships/ShipFilters'
import ShipList from '../components/ships/ShipList'
import ShipDetails from '../components/ships/ShipDetails'
import { Ship as ShipIcon } from 'lucide-react'

export default function ShipsPage() {
  const [ships, setShips] = useState([])
  const [alerts, setAlerts] = useState([])
  const [selectedShip, setSelectedShip] = useState(null)
  const [filteredShips, setFilteredShips] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (ships.length > 0 && !selectedShip) {
      setSelectedShip(ships[0])
    }
  }, [ships, selectedShip])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const shipsData = [],
        alertsData = []
      setShips(shipsData)
      setFilteredShips(shipsData)
      setAlerts(alertsData)
      if (shipsData.length > 0) {
        setSelectedShip(shipsData[0])
      }
    } catch (error) {
      console.error('Error loading ship data:', error)
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

    if (filters.status !== 'all') {
      updatedShips = updatedShips.filter(
        (ship) => ship.status === filters.status
      )
    }

    if (filters.shipType !== 'all') {
      updatedShips = updatedShips.filter(
        (ship) => ship.ship_type === filters.shipType
      )
    }

    setFilteredShips(updatedShips)
    if (updatedShips.length > 0) {
      setSelectedShip(updatedShips[0])
    } else {
      setSelectedShip(null)
    }
  }

  return (
    <div className='flex h-screen bg-slate-50 overflow-hidden'>
      {/* Ship List and Filters */}
      <div className='w-full md:w-1/3 lg:w-1/4 xl:w-1/5 border-r border-slate-200 flex flex-col'>
        <div className='p-4 border-b border-slate-200'>
          <h2 className='text-xl font-bold text-slate-900 flex items-center gap-2'>
            <ShipIcon className='w-6 h-6 text-blue-600' />
            Fleet Overview
          </h2>
          <p className='text-sm text-slate-500'>
            {filteredShips.length} ships found
          </p>
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
