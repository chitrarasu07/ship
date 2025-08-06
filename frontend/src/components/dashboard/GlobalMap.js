import React from 'react'
import { Badge } from '@/components/ui/badge'
import { MapPin, Ship, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GlobalMap({ ships, alerts }) {
  // Mock world map with ship positions
  const regions = [
    { name: 'North Atlantic', ships: 5, alerts: 1, coords: '40°N, 30°W' },
    { name: 'Mediterranean', ships: 3, alerts: 0, coords: '35°N, 15°E' },
    { name: 'Pacific', ships: 8, alerts: 2, coords: '30°N, 140°E' },
    { name: 'Indian Ocean', ships: 4, alerts: 1, coords: '20°S, 70°E' },
    { name: 'South Atlantic', ships: 2, alerts: 0, coords: '30°S, 20°W' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MapPin className='w-5 h-5 text-blue-600' />
          Global Fleet Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='relative'>
          {/* Simplified world map representation */}
          <div className='bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-6 min-h-[300px] relative overflow-hidden'>
            {/* Ocean background */}
            <div className='absolute inset-0 bg-blue-100 rounded-lg'></div>

            {/* Land masses (simplified) */}
            <div className='absolute top-8 left-8 w-16 h-12 bg-green-200 rounded-lg opacity-60'></div>
            <div className='absolute top-12 right-16 w-20 h-16 bg-green-200 rounded-lg opacity-60'></div>
            <div className='absolute bottom-16 left-12 w-14 h-10 bg-green-200 rounded-lg opacity-60'></div>
            <div className='absolute bottom-8 right-8 w-18 h-14 bg-green-200 rounded-lg opacity-60'></div>

            {/* Ship positions */}
            {regions.map((region, index) => (
              <div
                key={region.name}
                className='absolute'
                style={{
                  top: `${20 + index * 15}%`,
                  left: `${15 + index * 18}%`
                }}
              >
                <div className='flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border'>
                  <Ship className='w-4 h-4 text-blue-600' />
                  <span className='text-sm font-medium'>{region.ships}</span>
                  {region.alerts > 0 && (
                    <AlertTriangle className='w-3 h-3 text-red-500' />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className='mt-4 grid grid-cols-2 lg:grid-cols-5 gap-3'>
            {regions.map((region) => (
              <div
                key={region.name}
                className='flex items-center justify-between p-2 bg-slate-50 rounded-lg'
              >
                <div>
                  <p className='font-medium text-xs'>{region.name}</p>
                  <p className='text-xs text-slate-500'>{region.coords}</p>
                </div>
                <div className='flex items-center gap-1'>
                  <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                    {region.ships}
                  </Badge>
                  {region.alerts > 0 && (
                    <Badge variant='outline' className='bg-red-50 text-red-700'>
                      {region.alerts}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
