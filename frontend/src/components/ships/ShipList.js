import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Ship, Wifi, WifiOff, MapPin, Wrench } from 'lucide-react'

export default function ShipList({
  ships,
  selectedShip,
  onSelectShip,
  isLoading
}) {
  const statusConfig = {
    active: { icon: Wifi, color: 'bg-green-100 text-green-800' },
    in_port: { icon: MapPin, color: 'bg-blue-100 text-blue-800' },
    maintenance: { icon: Wrench, color: 'bg-yellow-100 text-yellow-800' },
    offline: { icon: WifiOff, color: 'bg-red-100 text-red-800' }
  }

  // const [data, setData] = useState([])
  // using dummy data for now
 const [data, setData] = useState([
  {
    id: 1,
    name: "MV Tønsberg",
    imo_number: "9695910",
    flag: "Norway",
    status: "active",
    ship_type: "RoRo",
    current_location: { port: "Oslo", country: "Norway" },
    cameras_installed: 6,
    last_update: "2025-09-07 14:00:00",
    images: "./ship images/Car carrier.jpg",
  },
  {
    id: 2,
    name: "Figaro Vehicle Carrier",
    imo_number: "9634560",
    flag: "Norway",
    status: "active",
    ship_type: "RoRo",
    current_location: { port: "Bergen", country: "Norway" },
    cameras_installed: 5,
    last_update: "2025-09-06 10:30:00",
    images: "./ship images/ship images-2.jpg",
  },
  {
    id: 3,
    name: "CLDN Group's MV Celine",
    imo_number: "9701123",
    flag: "Luxembourg",
    status: "active",
    ship_type: "RoRo",
    current_location: { port: "Luxembourg City", country: "Luxembourg" },
    cameras_installed: 7,
    last_update: "2025-09-05 09:20:00",
    images: "./ship images/ship images-3.jpg",
  },
  {
    id: 4,
    name: "Eco Livorno",
    imo_number: "9687450",
    flag: "Italy",
    status: "maintenance",
    ship_type: "RoRo",
    current_location: { port: "Livorno", country: "Italy" },
    cameras_installed: 8,
    last_update: "2025-09-04 12:10:00",
    images: "./ship images/ship images-2.jpg",
  },
  {
    id: 5,
    name: "Morning Crown",
    imo_number: "9656740",
    flag: "Bahamas",
    status: "offline",
    ship_type: "RoRo",
    current_location: { port: "Nassau", country: "Bahamas" },
    cameras_installed: 6,
    last_update: "2025-09-03 15:25:00",
    images: "./ship images/Car carrier.jpg",
  },
  {
    id: 6,
    name: "MV Morning Crown",
    imo_number: "9656456",
    flag: "italy",
    status: "in_port",
    ship_type: "RoRo",
    current_location: { port:"Rotterdam", country: "Netherlands" },
    cameras_installed: 6,
    last_update: "2025-09-03 15:25:00",
    images: "./ship images/MV-Tonsberg.webp",
  }
])







  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // const response = await axios.get('/no-guards/entity', { params: { limit: 10, pageNo: 1 } })
      // setData(response.data.entities)
      setData(data)
      console.log('Fetched entities:', data)
    } catch (error) {
      console.error('Error fetching data', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-2 p-4'>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='flex items-center gap-3 p-3 rounded-lg'>
              <Skeleton className='w-8 h-8 rounded-full' />
              <div className='flex-1 space-y-4'>
                <Skeleton className='h-4 w-1/2'  />
                <Skeleton className='h-3 w-1/2' />
              </div>
            </div>
          ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className='text-center py-10 px-4'>
        <Ship className='w-12 h-12 text-slate-300 mx-auto mb-4' />
        <p className='text-slate-500 font-medium'>No ships found</p>
        <p className='text-sm text-slate-400'>Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className='space-y-1 p-2'>
      {data.map((ship) => {
        const config = statusConfig[ship.status] || statusConfig.offline
        const Icon = config.icon
        return (
          <button
            key={ship.id}
            onClick={() => onSelectShip(ship)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
              selectedShip?.id === ship.id
                ? 'bg-blue-100 shadow-sm'
                : 'hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${config.color}`}
            >
              <Icon className='w-4 h-4' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='font-semibold text-slate-800 truncate'>
                {ship.name}
              </p>
              <p className='text-xs text-slate-500'>IMO: {ship.imo_number}</p>
            </div>
            <Badge variant='outline' className='capitalize text-xs'>
              {ship.status.replace('_', ' ')}
            </Badge>
          </button>
        )
      })}

    </div>
  )
}
