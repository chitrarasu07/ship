import React, { useState, useEffect } from 'react'
import { Activity, TrendingUp, TrendingDown } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import FleetMetrics from '../components/statistics/FleetMetrics'
import AlertAnalytics from '../components/statistics/AlertAnalytics'
import CameraAnalytics from '../components/statistics/CameraAnalytics'
import PerformanceCharts from '../components/statistics/PerformanceCharts'
import BenchmarkComparison from '../components/statistics/BenchmarkComparison'
import GeographicInsights from '../components/statistics/GeographicInsights'

export default function StatisticsPage() {
  const [ships, setShips] = useState([])
  const [alerts, setAlerts] = useState([])
  const [cameraData, setCameraData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadData()
  }, [timeRange])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const shipsData = [],
        alertsData = [],
        cameraDataResults = []
      setShips(shipsData)
      setAlerts(alertsData)
      setCameraData(cameraDataResults)
    } catch (error) {
      console.error('Error loading statistics data:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className='p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 flex items-center gap-2'>
              <Activity className='w-8 h-8 text-blue-600' />
              Fleet Statistics & KPIs
            </h1>
            <p className='text-slate-600 mt-1'>
              Performance metrics and industry benchmarks for your maritime
              operations
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className='px-3 py-2 border border-slate-200 rounded-lg bg-white'
            >
              <option value='7d'>Last 7 days</option>
              <option value='30d'>Last 30 days</option>
              <option value='90d'>Last 90 days</option>
              <option value='1y'>Last year</option>
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <FleetMetrics
          ships={ships}
          alerts={alerts}
          cameraData={cameraData}
          isLoading={isLoading}
        />

        {/* Main Analytics Tabs */}
        <Tabs defaultValue='performance' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-white shadow-sm'>
            <TabsTrigger
              value='performance'
              className='flex items-center gap-2 py-3'
            >
              <TrendingUp className='w-4 h-4' />
              Performance
            </TabsTrigger>
            <TabsTrigger
              value='alerts'
              className='flex items-center gap-2 py-3'
            >
              <Activity className='w-4 h-4' />
              Alert Analytics
            </TabsTrigger>
            <TabsTrigger
              value='cameras'
              className='flex items-center gap-2 py-3'
            >
              <Activity className='w-4 h-4' />
              Camera Analytics
            </TabsTrigger>
            <TabsTrigger
              value='benchmarks'
              className='flex items-center gap-2 py-3'
            >
              <TrendingDown className='w-4 h-4' />
              Benchmarks
            </TabsTrigger>
            <TabsTrigger
              value='geographic'
              className='flex items-center gap-2 py-3'
            >
              <Activity className='w-4 h-4' />
              Geographic
            </TabsTrigger>
          </TabsList>

          <TabsContent value='performance' className='space-y-6'>
            <PerformanceCharts
              ships={ships}
              alerts={alerts}
              cameraData={cameraData}
              timeRange={timeRange}
            />
          </TabsContent>

          <TabsContent value='alerts' className='space-y-6'>
            <AlertAnalytics alerts={alerts} timeRange={timeRange} />
          </TabsContent>

          <TabsContent value='cameras' className='space-y-6'>
            <CameraAnalytics cameraData={cameraData} ships={ships} />
          </TabsContent>

          <TabsContent value='benchmarks' className='space-y-6'>
            <BenchmarkComparison
              ships={ships}
              alerts={alerts}
              cameraData={cameraData}
            />
          </TabsContent>

          <TabsContent value='geographic' className='space-y-6'>
            <GeographicInsights ships={ships} alerts={alerts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
