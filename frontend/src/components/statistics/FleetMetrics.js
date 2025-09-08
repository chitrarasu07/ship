import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Ship,
  Camera,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock
} from 'lucide-react'

export default function FleetMetrics({ ships, alerts, cameraData, isLoading }) {
  const activeShips = ships.filter((ship) => ship.status === 'active').length
  const totalCameras = ships.reduce(
    (sum, ship) => sum + (ship.cameras_installed || 0),
    0
  )
  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === 'critical' || alert.severity === 'emergency'
  ).length
  const totalAlerts = alerts.length
  // const uptime = ships.length > 0 ? ((activeShips / ships.length) * 100).toFixed(1) : 0
    const uptime = '96.6' // Mock data
  const avgResponseTime = '3.2' // Mock data
  const detectionAccuracy =
    cameraData.length > 0
      ? (
          (cameraData.filter((d) => d.confidence_score > 0.8).length /
            cameraData.length) *
          100
        ).toFixed(1)
      : 0
  const incidentReduction = '90' // Mock data

  const metrics = [
    {
      title: 'Fleet Uptime',
      value: `${uptime}%`,
      icon: Activity,
      color: 'green',
      trend: '+2.1%',
      trendUp: true,
      description: 'Operational availability'
    },
    {
      title: 'Active Ships',
      // value: activeShips,
      // total: ships.length,
      value: '3', // Mock data
      total: '6', // Mock data
      icon: Ship,
      color: 'blue',
      trend: '+3 ships',
      trendUp: true,
      description: 'Currently operational'
    },
    {
      title: 'Camera Network',
      // value: totalCameras,
      value: '24', // Mock data
      icon: Camera,
      color: 'purple',
      trend: '96.5%',
      trendUp: true,
      description: 'Online and monitoring'
    },
    {
      title: 'Alert Response',
      value: `${avgResponseTime}m`,
      icon: Clock,
      color: 'orange',
      trend: '-0.8m',
      trendUp: true,
      description: 'Average response time'
    },
    {
      title: 'Detection Accuracy',
      // value: `${detectionAccuracy}%`,
      value: '96.5%', // Mock data
      icon: Shield,
      color: 'green',
      trend: '+1.2%',
      trendUp: true,
      description: 'AI confidence rate'
    },
    {
      title: 'Critical Alerts',
      // value: criticalAlerts,
      // total: totalAlerts,
      value: '3', // Mock data
      total: '8', // Mock data
      icon: AlertTriangle,
      color: 'red',
      trend: '-5 alerts',
      trendUp: true,
      description: 'Requiring immediate attention'
    },
    {
      title: 'Incident Reduction',
      value: `${incidentReduction}%`,
      icon: TrendingDown,
      color: 'green',
      trend: 'vs last month',
      trendUp: true,
      description: 'Preventive effectiveness'
    },
    {
      title: 'Compliance Score',
      value: '94.2%',
      icon: Shield,
      color: 'blue',
      trend: '+1.8%',
      trendUp: true,
      description: 'Safety regulations'
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white'
  }

  const backgroundClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className='animate-pulse'>
              <CardHeader className='pb-3'>
                <Skeleton className='h-4 w-24' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-16 mb-2' />
                <Skeleton className='h-3 w-20' />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className={`border-2 ${
            backgroundClasses[metric.color]
          } transition-all duration-300 hover:shadow-lg`}
        >
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${colorClasses[metric.color]}`}>
              <metric.icon className='w-4 h-4' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900 mb-1'>
              {metric.value}
              {metric.total && (
                <span className='text-sm font-normal text-slate-500'>
                  /{metric.total}
                </span>
              )}
            </div>
            <p className='text-xs text-slate-500 mb-2'>{metric.description}</p>
            <div className='flex items-center gap-1 text-xs'>
              {metric.trendUp ? (
                <TrendingUp className='w-3 h-3 text-green-500' />
              ) : (
                <TrendingDown className='w-3 h-3 text-red-500' />
              )}
              <span
                className={metric.trendUp ? 'text-green-500' : 'text-red-500'}
              >
                {metric.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
