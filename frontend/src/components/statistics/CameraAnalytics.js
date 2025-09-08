import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Camera, Eye, Activity, Zap } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

export default function CameraAnalytics({ cameraData, ships }) {
  // const totalCameras = ships.reduce(
  //   (sum, ship) => sum + (ship.cameras_installed || 0),
  //   0
  // )
  
  const totalCameras =  '30' // Mock data
  const activeCameras = Math.floor(totalCameras * 0.985) // Mock 98.5% uptime
  const avgConfidence =
    cameraData.length > 0
      ? (
          (cameraData.reduce(
            (sum, data) => sum + (data.confidence_score || 0),
            0
          ) /
            cameraData.length) *
          100
        ).toFixed(1)
      // : 0
      : '96.5' // Mock data

  

  // Mock time series data for charts
  const uptimeData = [
    { time: '00:00', uptime: 98.5 },
    { time: '04:00', uptime: 98.2 },
    { time: '08:00', uptime: 98.8 },
    { time: '12:00', uptime: 97.9 },
    { time: '16:00', uptime: 98.5 },
    { time: '20:00', uptime: 98.7 },
    { time: '24:00', uptime: 98.5 }
  ]

  const detectionData = [
    { time: '00:00', detections: 45 },
    { time: '04:00', detections: 23 },
    { time: '08:00', detections: 78 },
    { time: '12:00', detections: 92 },
    { time: '16:00', detections: 67 },
    { time: '20:00', detections: 54 },
    { time: '24:00', detections: 41 }
  ]

  const useCaseCounts = cameraData.reduce((acc, data) => {
    acc[data.use_case] = (acc[data.use_case] || 0) + 1
    return acc
  }, {})



  return (
    <div className='space-y-6'>
      {/* Camera Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Total Cameras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>
              {totalCameras}
            </div>
            <p className='text-sm text-slate-500'>
              Across {ships.length} ships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Network Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>98.5%</div>
            <Progress value={98.5} className='mt-2' />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Detection Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>
              {avgConfidence}%
            </div>
            <p className='text-sm text-green-600'>+2.1% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Data Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>
              {/* {cameraData.length} */}95
            </div>
            <p className='text-sm text-slate-500'>Events processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className='grid lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='w-5 h-5 text-blue-600' />
              Camera Uptime (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={uptimeData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='time' />
                <YAxis domain={[95, 100]} />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='uptime'
                  stroke='#3B82F6'
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Eye className='w-5 h-5 text-green-600' />
              Detection Activity (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={detectionData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='time' />
                <YAxis />
                <Tooltip />
                <Area
                  type='monotone'
                  dataKey='detections'
                  stroke='#10B981'
                  fill='#10B981'
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Use Case Performance */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Zap className='w-5 h-5 text-purple-600' />
            Camera Use Case Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Object.entries(useCaseCounts).map(([useCase, count]) => {
              const percentage =
                cameraData.length > 0 ? (count / cameraData.length) * 100 : 0
              return (
                <div key={useCase} className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      {useCase
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <Badge variant='outline'>{count}</Badge>
                  </div>
                  <Progress value={percentage} className='h-2' />
                  <div className='text-xs text-slate-500'>
                    {percentage.toFixed(1)}% of total detections
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
