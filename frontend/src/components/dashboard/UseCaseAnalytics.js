import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  BellElectric,
  FireExtinguisher,
  Flame,
  Shirt,
  X,
} from 'lucide-react'

export default function UseCaseAnalytics({ cameraData }) {
  const useCaseData = cameraData.reduce((acc, data) => {
    if (!acc[data.use_case]) {
      acc[data.use_case] = {
        count: 0,
        totalConfidence: 0,
        alerts: 0
      }
    }
    acc[data.use_case].count += 1
    acc[data.use_case].totalConfidence += data.confidence_score || 0
    if (data.alert_level === 'high' || data.alert_level === 'critical') {
      acc[data.use_case].alerts += 1
    }
    return acc
  }, {})

  const useCaseIcons = {
    // cargo_monitoring: Package,
    // safety_compliance: Shield,
    // maintenance_inspection: Wrench,
    // security: Eye,
    // navigation_assistance: Navigation
    Fire_Detection: Flame,
    Smoke_Detection: FireExtinguisher,
    PPT_KIT_Detection: Shirt,
    Anomaly_Detection: BellElectric,
    No_Cross_Detection: X
  }

  const useCaseColors = {
    Fire_Detection: 'bg-blue-100 text-blue-800 border-blue-200',
    Smoke_Detection: 'bg-green-100 text-green-800 border-green-200',
    PPT_KIT_Detection: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Anomaly_Detection: 'bg-red-100 text-red-800 border-red-200',
    No_Cross_Detection: 'bg-purple-100 text-purple-800 border-purple-200'
  }

  const total = Object.values(useCaseData).reduce(
    (sum, data) => sum + data.count,
    0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BarChart3 className='w-5 h-5 text-blue-600' />
          Use Case Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {Object.entries(useCaseData).map(([useCase, data]) => {
            const Icon = useCaseIcons[useCase]
            const percentage = total > 0 ? (data.count / total) * 100 : 0
            const avgConfidence =
              data.count > 0
                ? ((data.totalConfidence / data.count) * 100).toFixed(1)
                : 0

            return (
              <div key={useCase} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Icon className='w-4 h-4 text-slate-600' />
                    <span className='text-sm font-medium'>
                      {useCase
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline' className={useCaseColors[useCase]}>
                      {data.count}
                    </Badge>
                    {data.alerts > 0 && (
                      <Badge
                        variant='outline'
                        className='bg-red-50 text-red-700'
                      >
                        {data.alerts} alerts
                      </Badge>
                    )}
                  </div>
                </div>
                <div className='space-y-1'>
                  <div className='flex justify-between text-xs text-slate-500'>
                    <span>{percentage.toFixed(1)}% of total</span>
                    <span>{avgConfidence}% confidence</span>
                  </div>
                  <Progress value={percentage} className='h-2' />
                </div>
              </div>
            )
          })}

          {Object.keys(useCaseData).length === 0 && (
            <div className='text-center py-8'>
              <BarChart3 className='w-12 h-12 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500'>No camera data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
