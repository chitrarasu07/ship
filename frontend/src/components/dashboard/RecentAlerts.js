import React, { useState } from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, MapPin, Eye, ShipIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function RecentAlerts({ alerts }) {
  const severityColors = {
    low: 'bg-gray-100 text-gray-800 border-gray-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
    emergency: 'bg-red-500 text-white border-red-600'
  }

  const severityIcons = {
    emergency: <AlertTriangle className='w-3 h-3 animate-pulse' />,
    critical: <AlertTriangle className='w-3 h-3' />,
    high: <AlertTriangle className='w-3 h-3' />,
    medium: <AlertTriangle className='w-3 h-3' />,
    low: <AlertTriangle className='w-3 h-3' />
  }
  // this is added for show more/less functionality
  const [showAll, setShowAll] = useState(false)
  const visibleAlerts = showAll ? alerts : alerts.slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <AlertTriangle className='w-5 h-5 text-red-600' />
          Recent Alerts
          <Badge variant='outline' className='ml-auto'>
            {alerts.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {alerts.length === 0 ? (
            <div className='text-center py-8'>
              <AlertTriangle className='w-12 h-12 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500'>No active alerts</p>
            </div>
          ) : (
            // alerts.slice(0, 10).map((alert) => (
            visibleAlerts.map((alert) => (
              <div
                key={alert.id}
                className='flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors'
              >
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Badge
                      variant='outline'
                      className={`${
                        severityColors[alert.severity]
                      } border flex items-center gap-1`}
                    >
                      {alert.severity === 'emergency' ? (
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className='flex items-center gap-1'
                        >
                          {severityIcons[alert.severity]}
                          {alert.severity}
                        </motion.span>
                      ) : (
                        <>
                          {severityIcons[alert.severity]}
                          {alert.severity}
                        </>
                      )}
                    </Badge>
                    <span className='text-xs text-slate-500 flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {format(new Date(alert.created_date), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <p className='font-medium text-slate-900 text-sm mb-1'>
                    {alert.title}
                  </p>
                  <p className='text-xs text-slate-500 line-clamp-2'>
                    {alert.description}
                  </p>
                  <p className="flex items-center gap-1">
                        <ShipIcon className="w-3 h-3" /> {alert.shipName}
                    </p>
                  {alert.location && (
                    <p className='text-xs text-slate-400 flex items-center gap-1 mt-1'>
                      <MapPin className='w-3 h-3' />
                      {alert.location}
                    </p>
                  )}
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-blue-600 hover:text-blue-800'
                >
                  <Eye className='w-4 h-4' />
                </Button>
              </div>
            ))
          )}
          {/* Show more/less button */}
          {alerts.length > 4 && (
            <div className='text-center pt-1'>
              <Button
                variant='outline'
                size='sm'
                className='text-blue-500 border-blue-500 hover:text-white-100 bg-grey-300 p-1 cursor-pointer'
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'View Less' : `View More (${alerts.length - 4})`}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
