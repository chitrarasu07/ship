import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3, Activity } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts'

export default function PerformanceCharts({
  ships,
  alerts,
  cameraData,
  timeRange
}) {
  // Mock time series data based on timeRange
  const generateTimeSeriesData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    return Array.from({ length: days }, (_, i) => ({
      date: `Day ${i + 1}`,
      alerts: Math.floor(Math.random() * 10) + 5,
      uptime: 95 + Math.random() * 5,
      detections: Math.floor(Math.random() * 50) + 30,
      efficiency: 85 + Math.random() * 15
    }))
  }

  const timeSeriesData = generateTimeSeriesData()

  // const fleetPerformanceData = ships.map((ship) => ({
  //   name: ship.name.split(' ').pop(), // Get last word of ship name
  //   uptime: 95 + Math.random() * 5,
  //   alerts: Math.floor(Math.random() * 8) + 1,
  //   cameras: ship.cameras_installed || 0
  // }))

  // Using static mock data for demonstration
  const fleetPerformanceData = [
  { name: 'MV Tønsberg', uptime: 97.3 , alerts: 2, cameras: 6},
  { name: 'Figaro Vehicle Carrier', uptime: 96.1 , alerts: 1, cameras: 5},
  { name: 'Morning Crown', uptime: 94.4 , alerts: 3, cameras: 4},
  { name: 'My Morning Crown', uptime: 95.8 , alerts: 2, cameras: 6},
  { name: 'Titan', uptime: 95.2 , alerts: 1, cameras: 5},
];


  return (
    <div className='space-y-6'>
      {/* Fleet Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='w-5 h-5 text-blue-600' />
            Fleet Performance Trends ({timeRange})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={400}>
            <ComposedChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis yAxisId='left' />
              <YAxis yAxisId='right' orientation='right' />
              <Tooltip />
              <Bar
                yAxisId='left'
                dataKey='alerts'
                fill='#EF4444'
                name='Alerts'
              />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='uptime'
                stroke='#10B981'
                strokeWidth={2}
                name='Uptime %'
              />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='efficiency'
                stroke='#3B82F6'
                strokeWidth={2}
                name='Efficiency %'
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Ship Performance */}
      <div className='grid lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='w-5 h-5 text-green-600' />
              Ship Uptime Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={fleetPerformanceData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Bar dataKey='uptime' fill='#10B981' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='w-5 h-5 text-red-600' />
              Alert Frequency by Ship
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={fleetPerformanceData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='alerts' fill='#EF4444' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detection Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='w-5 h-5 text-purple-600' />
            AI Detection Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='detections'
                stroke='#8B5CF6'
                strokeWidth={2}
                dot={{ fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
