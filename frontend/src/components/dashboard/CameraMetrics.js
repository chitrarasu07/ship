import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Camera, Eye, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CameraMetrics({ cameraData }) {
  const useCaseCounts = cameraData.reduce((acc, data) => {
    acc[data.use_case] = (acc[data.use_case] || 0) + 1
    return acc
  }, {})

  const detectionCounts = cameraData.reduce((acc, data) => {
    acc[data.detection_type] = (acc[data.detection_type] || 0) + 1
    return acc
  }, {})

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
      : 0

  const useCaseColors = {
    cargo_monitoring: 'bg-blue-100 text-blue-800',
    safety_compliance: 'bg-green-100 text-green-800',
    maintenance_inspection: 'bg-yellow-100 text-yellow-800',
    security: 'bg-red-100 text-red-800',
    navigation_assistance: 'bg-purple-100 text-purple-800'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Camera className='w-5 h-5 text-blue-600' />
          Camera Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Performance Metrics */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center p-3 bg-blue-50 rounded-lg'>
              <div className='text-xl font-bold text-blue-600'>
                {cameraData.length}
              </div>
              <p className='text-xs text-slate-600'>Data Points</p>
            </div>
            <div className='text-center p-3 bg-green-50 rounded-lg'>
              <div className='text-xl font-bold text-green-600'>
                {avgConfidence}%
              </div>
              <p className='text-xs text-slate-600'>Avg Confidence</p>
            </div>
            <div className='text-center p-3 bg-purple-50 rounded-lg'>
              <div className='text-xl font-bold text-purple-600'>
                {Object.keys(useCaseCounts).length}
              </div>
              <p className='text-xs text-slate-600'>Use Cases</p>
            </div>
          </div>

          {/* Use Case Breakdown */}
          <div>
            <h4 className='font-medium text-slate-900 mb-3 flex items-center gap-2'>
              <Activity className='w-4 h-4' />
              Use Case Distribution
            </h4>
            <div className='space-y-2'>
              {Object.entries(useCaseCounts).map(([useCase, count]) => (
                <div
                  key={useCase}
                  className='flex items-center justify-between'
                >
                  <span className='text-sm text-slate-600'>
                    {useCase
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                  <Badge variant='outline' className={useCaseColors[useCase]}>
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Detection Types */}
          <div>
            <h4 className='font-medium text-slate-900 mb-3 flex items-center gap-2'>
              <Eye className='w-4 h-4' />
              Detection Summary
            </h4>
            <div className='grid grid-cols-2 gap-2'>
              {Object.entries(detectionCounts)
                .slice(0, 6)
                .map(([type, count]) => (
                  <div
                    key={type}
                    className='flex items-center justify-between text-sm'
                  >
                    <span className='text-slate-600 capitalize'>{type}</span>
                    <span className='font-medium'>{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
