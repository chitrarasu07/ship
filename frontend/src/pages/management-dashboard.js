import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Ship as ShipIcon,
  Activity,
  MapPin,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react'

import DashboardStats from '../components/dashboard/DashboardStats'
import ShipOverview from '../components/dashboard/ShipOverview'
import RecentAlerts from '../components/dashboard/RecentAlerts'
import CameraMetrics from '../components/dashboard/CameraMetrics'
import GlobalMap from '../components/dashboard/GlobalMap'
import UseCaseAnalytics from '../components/dashboard/UseCaseAnalytics'

export default function Dashboard() {
  const [ships, setShips] = useState([])
  const [alerts, setAlerts] = useState([])
  const [cameraData, setCameraData] = useState([])
  const [activeView, setActiveView] = useState('global')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const shipsData = [],
        alertsData = [],
        cameraDataResults = []
      setShips(shipsData)
      setAlerts(alertsData)
      setCameraData(cameraDataResults)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
    setIsLoading(false)
  }

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === 'critical' || alert.severity === 'emergency'
  )
  const activeShips = ships.filter((ship) => ship.status === 'active')

  return (
    <div className='p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>
              Vision AI Dashboard
            </h1>
            <p className='text-slate-600 mt-1'>
              Real-time maritime intelligence and monitoring
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <Badge
              variant='outline'
              className='bg-green-50 text-green-700 border-green-200'
            >
              <Activity className='w-3 h-3 mr-1' />
              System Online
            </Badge>
            <Badge
              variant='outline'
              className='bg-blue-50 text-blue-700 border-blue-200'
            >
              Last Updated: 2 min ago
            </Badge>
          </div>
        </div>

        {/* View Selector */}
        <Tabs
          value={activeView}
          onValueChange={setActiveView}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-white shadow-sm'>
            <TabsTrigger
              value='global'
              className='flex items-center gap-2 py-3'
            >
              <Activity className='w-4 h-4' />
              Global Admin
            </TabsTrigger>
            <TabsTrigger value='ships' className='flex items-center gap-2 py-3'>
              <ShipIcon className='w-4 h-4' />
              Ship View
            </TabsTrigger>
            <TabsTrigger
              value='locations'
              className='flex items-center gap-2 py-3'
            >
              <MapPin className='w-4 h-4' />
              Location View
            </TabsTrigger>
            <TabsTrigger
              value='manager'
              className='flex items-center gap-2 py-3'
            >
              <Users className='w-4 h-4' />
              Manager View
            </TabsTrigger>
            <TabsTrigger
              value='client'
              className='flex items-center gap-2 py-3'
            >
              <Shield className='w-4 h-4' />
              Client View
            </TabsTrigger>
          </TabsList>

          {/* Global Admin View */}
          <TabsContent value='global' className='space-y-6'>
            <DashboardStats
              ships={ships}
              alerts={alerts}
              cameraData={cameraData}
              isLoading={isLoading}
            />

            <div className='grid lg:grid-cols-2 gap-6'>
              <div className='space-y-6'>
                <ShipOverview ships={activeShips} />
                <CameraMetrics cameraData={cameraData} />
              </div>
              <div className='space-y-6'>
                <RecentAlerts alerts={criticalAlerts} />
                <UseCaseAnalytics cameraData={cameraData} />
              </div>
            </div>
          </TabsContent>

          {/* Ship View */}
          <TabsContent value='ships' className='space-y-6'>
            <div className='grid lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2'>
                <ShipOverview ships={ships} detailed={true} />
              </div>
              <div>
                <RecentAlerts alerts={alerts.filter((a) => a.ship_id)} />
              </div>
            </div>
          </TabsContent>

          {/* Location View */}
          <TabsContent value='locations' className='space-y-6'>
            <GlobalMap ships={ships} alerts={criticalAlerts} />
            <div className='grid lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='w-5 h-5 text-blue-600' />
                    Port Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {['Singapore', 'Rotterdam', 'Shanghai', 'Long Beach'].map(
                      (port) => (
                        <div
                          key={port}
                          className='flex items-center justify-between p-3 bg-slate-50 rounded-lg'
                        >
                          <div>
                            <p className='font-medium'>{port}</p>
                            <p className='text-sm text-slate-500'>
                              Port of {port}
                            </p>
                          </div>
                          <Badge
                            variant='outline'
                            className='bg-green-50 text-green-700'
                          >
                            {Math.floor(Math.random() * 5) + 1} ships
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              <UseCaseAnalytics cameraData={cameraData} />
            </div>
          </TabsContent>

          {/* Manager View */}
          <TabsContent value='manager' className='space-y-6'>
            <div className='grid lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-slate-600'>
                    Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900'>92%</div>
                  <p className='text-sm text-green-600 flex items-center gap-1'>
                    <TrendingUp className='w-3 h-3' />
                    +5% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-slate-600'>
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900'>3.2m</div>
                  <p className='text-sm text-green-600'>
                    Average alert response
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-slate-600'>
                    Active Operators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900'>12</div>
                  <p className='text-sm text-slate-500'>On duty now</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-slate-600'>
                    Efficiency Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900'>98.5%</div>
                  <p className='text-sm text-green-600'>Camera uptime</p>
                </CardContent>
              </Card>
            </div>
            <div className='grid lg:grid-cols-2 gap-6'>
              <CameraMetrics cameraData={cameraData} />
              <RecentAlerts alerts={alerts} />
            </div>
          </TabsContent>

          {/* Client View */}
          <TabsContent value='client' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='w-5 h-5 text-blue-600' />
                  Your Fleet Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='text-center p-4 bg-blue-50 rounded-lg'>
                    <div className='text-2xl font-bold text-blue-600'>8</div>
                    <p className='text-sm text-slate-600'>Your Ships</p>
                  </div>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                    <div className='text-2xl font-bold text-green-600'>42</div>
                    <p className='text-sm text-slate-600'>Cameras</p>
                  </div>
                  <div className='text-center p-4 bg-amber-50 rounded-lg'>
                    <div className='text-2xl font-bold text-amber-600'>2</div>
                    <p className='text-sm text-slate-600'>Active Alerts</p>
                  </div>
                  <div className='text-center p-4 bg-purple-50 rounded-lg'>
                    <div className='text-2xl font-bold text-purple-600'>
                      96%
                    </div>
                    <p className='text-sm text-slate-600'>Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className='grid lg:grid-cols-2 gap-6'>
              <ShipOverview ships={ships.slice(0, 8)} />
              <RecentAlerts alerts={alerts.slice(0, 5)} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
