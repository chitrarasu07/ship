import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Ship,
  Camera,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export default function DashboardStats({
  
  ships = [],
  alerts = [],
  cameraData = [],
  isLoading = false,

}) {
  // this an count of an active ships
  const activeShips = ships.filter((ship) => ship.status === 'active').length

  // this is an count of total cameras installed
  const totalCameras = ships.reduce(
    (sum, ship) => sum + Number(ship.cameras_installed || 0),
    0
  )
  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === 'critical' || alert.severity === 'emergency'
  ).length
  const dataProcessingRate =
    cameraData.length > 0
      ? (
          (cameraData.filter((d) => d.confidence_score > 0.8).length /
            cameraData.length) *
          96.6
        ).toFixed(1)
      : 0
// logic for trend and trendup 
const [previousStats, setPreviousStats] = useState(null);

  // Helper to calculate trend
  const getTrend = (current, previous) => {
    if (!previous || previous === 0) return { trend: '0%', trendUp: false };
    const diff = current - previous;
    const percentChange = ((diff / previous) * 100).toFixed(1);
    return {
      trend: `${percentChange > 0 ? '+' : ''}${percentChange}%`,
      trendUp: percentChange > 0
    };
  };
  

  // Store current values for trend calculation next render
  useEffect(() => {
    setPreviousStats({
      activeShips,
      totalCameras,
      criticalAlerts,
      dataProcessingRate
    });
  }, [activeShips, totalCameras, criticalAlerts, dataProcessingRate]);

  const stats = [
    {
      title: 'Active Ships',
      value: activeShips,
      total: ships.length,
      icon: Ship,
      color: 'blue',
      trend: '2%',
      trendUp: true
    },
    {
      title: 'Camera Network',
      value: totalCameras,
      subtitle: 'cameras online',
      icon: Camera,
      color: 'green',
      trend: '1.5%',
      trendUp: true
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      subtitle: 'require attention',
      icon: AlertTriangle,
      color: 'red',
      trend: '3%',
      trendUp: false
    },
    {
      title: 'AI Processing',
      value: `${dataProcessingRate}%`,
      subtitle: 'accuracy rate',
      icon: Activity,
      color: 'purple',
      trend:'1.4%',
      trendUp: false
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
    purple: 'bg-purple-500 text-white'
  }

  const backgroundClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200'
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Array(4)
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
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`border-2 ${
            backgroundClasses[stat.color]
          } transition-all duration-300 hover:shadow-lg`}
        >
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${colorClasses[stat.color]}`}>
              <stat.icon className='w-4 h-4' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900 mb-1'>
              {stat.value}
              {stat.total && (
                <span className='text-sm font-normal text-slate-500'>
                  /{stat.total}
                </span>
              )}
            </div>
            {stat.subtitle && (
              <p className='text-xs text-slate-500 mb-2'>{stat.subtitle}</p>
            )}
            <div className='flex items-center gap-1 text-xs'>
              {stat.trendUp ? (
                <TrendingUp className='w-3 h-3 text-green-500' />
              ) : (
                <TrendingDown className='w-3 h-3 text-red-500' />
              )}
              <span
                className={stat.trendUp ? 'text-green-500' : 'text-red-500'}
              >
                {stat.trend}
              </span>
              <span className='text-slate-500'>vs last Day</span>
            </div>
          </CardContent>
        </Card>
      ))}

      
    </div>
  )
  
}
