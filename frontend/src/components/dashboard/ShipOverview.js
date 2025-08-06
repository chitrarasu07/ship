import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Ship, MapPin, Camera, Wifi, WifiOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ShipOverview({ ships, detailed = false }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    in_port: 'bg-blue-100 text-blue-800 border-blue-200',
    maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    offline: 'bg-red-100 text-red-800 border-red-200'
  }

  const statusIcons = {
    active: <Wifi className='w-3 h-3' />,
    in_port: <MapPin className='w-3 h-3' />,
    maintenance: <Camera className='w-3 h-3' />,
    offline: <WifiOff className='w-3 h-3' />
  }

  if (!ships || ships.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Ship className='w-5 h-5 text-blue-600' />
            Ship Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-pulse'
                >
                  <div className='flex items-center gap-3'>
                    <Skeleton className='w-8 h-8 rounded-full' />
                    <div>
                      <Skeleton className='h-4 w-24 mb-1' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                  </div>
                  <Skeleton className='h-6 w-16 rounded-full' />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Ship className='w-5 h-5 text-blue-600' />
          Ship Overview
          <Badge variant='outline' className='ml-auto'>
            {ships.length} ships
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {ships.slice(0, detailed ? 20 : 8).map((ship) => (
            <div
              key={ship.id}
              className='flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                  <Ship className='w-4 h-4 text-blue-600' />
                </div>
                <div>
                  <p className='font-medium text-slate-900'>{ship.name}</p>
                  <p className='text-sm text-slate-500'>
                    {ship.current_location?.port ||
                      ship.current_location?.country ||
                      'At Sea'}
                  </p>
                  {detailed && (
                    <p className='text-xs text-slate-400'>
                      {ship.cameras_installed || 0} cameras • {ship.ship_type}
                    </p>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Badge
                  variant='outline'
                  className={`${
                    statusColors[ship.status]
                  } border flex items-center gap-1`}
                >
                  {statusIcons[ship.status]}
                  {ship.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
