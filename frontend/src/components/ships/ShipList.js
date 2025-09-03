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

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/no-guards/entity', { params: { limit: 10, pageNo: 1 } })
      setData(response.data.entities)

      console.log('Fetched entities:', response.data.entities)
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
