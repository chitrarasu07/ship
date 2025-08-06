import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Anchor, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function GeographicInsights({ ships, alerts }) {
  // Mock geographic data
  const regionData = [
    { region: 'North Atlantic', ships: 6, alerts: 12, uptime: 98.2 },
    { region: 'Pacific', ships: 8, alerts: 8, uptime: 98.8 },
    { region: 'Mediterranean', ships: 4, alerts: 5, uptime: 97.9 },
    { region: 'Indian Ocean', ships: 3, alerts: 7, uptime: 98.5 },
    { region: 'South Atlantic', ships: 3, alerts: 3, uptime: 99.1 }
  ]

  const portData = [
    { port: 'Singapore', visits: 15, alerts: 2, efficiency: 96.5 },
    { port: 'Rotterdam', visits: 12, alerts: 1, efficiency: 98.2 },
    { port: 'Shanghai', visits: 10, alerts: 3, efficiency: 94.8 },
    { port: 'Los Angeles', visits: 8, alerts: 1, efficiency: 97.1 },
    { port: 'Hamburg', visits: 6, alerts: 0, efficiency: 99.0 }
  ]

  const routeData = [
    { name: 'Trans-Pacific', distance: '5,500nm', alerts: 8, efficiency: 98.1 },
    {
      name: 'Trans-Atlantic',
      distance: '3,000nm',
      alerts: 12,
      efficiency: 97.5
    },
    { name: 'Asia-Europe', distance: '8,000nm', alerts: 15, efficiency: 96.8 },
    { name: 'Intra-Pacific', distance: '2,200nm', alerts: 5, efficiency: 98.7 }
  ]

  return (
    <div className='space-y-6'>
      {/* Regional Performance Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Active Regions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>
              {regionData.length}
            </div>
            <p className='text-sm text-slate-500'>Operational areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Port Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>
              {portData.reduce((sum, port) => sum + port.visits, 0)}
            </div>
            <p className='text-sm text-green-600'>+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Best Route Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>98.7%</div>
            <p className='text-sm text-slate-500'>Intra-Pacific route</p>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='w-5 h-5 text-blue-600' />
            Regional Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='region' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='ships' fill='#3B82F6' name='Ships' />
              <Bar dataKey='alerts' fill='#EF4444' name='Alerts' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Port Performance */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Anchor className='w-5 h-5 text-green-600' />
            Port Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {portData.map((port) => (
              <div
                key={port.port}
                className='flex items-center justify-between p-4 bg-slate-50 rounded-lg'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <Anchor className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <h4 className='font-semibold'>{port.port}</h4>
                    <p className='text-sm text-slate-500'>
                      {port.visits} visits
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <div className='font-semibold'>{port.efficiency}%</div>
                    <div className='text-xs text-slate-500'>Efficiency</div>
                  </div>
                  <Badge
                    variant='outline'
                    className={
                      port.alerts === 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {port.alerts} alerts
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='w-5 h-5 text-purple-600' />
            Shipping Route Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {routeData.map((route) => (
              <div key={route.name} className='p-4 border rounded-lg'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <h4 className='font-semibold'>{route.name}</h4>
                    <p className='text-sm text-slate-500'>{route.distance}</p>
                  </div>
                  <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                    {route.efficiency}%
                  </Badge>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Efficiency</span>
                    <span className='font-medium'>{route.efficiency}%</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Alerts</span>
                    <span className='font-medium'>{route.alerts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
