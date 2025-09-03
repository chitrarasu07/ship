import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  Clock,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Bell,
  Play
} from 'lucide-react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { DialogHeader } from '@/components/ui/dialog'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [ships, setShips] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  // const loadData = async () => {
  //   setIsLoading(true)
  //   try {
  //     const alertsData = [],
  //       shipsData = []
  //     setAlerts(alertsData)
  //     setShips(shipsData)
  //   } catch (error) {
  //     console.error('Error loading alerts:', error)
  //   }
  //   setIsLoading(false)
  // }

  // Load initial or dummy dta to this  data
  const loadData = async () => {
    setIsLoading(true)
    try {
      // Dummy Alerts
      const alertsData = [
        {
          id: 1,
          title: 'Fire detected in Engine Room',
          description: 'Fire detected in the engine room. Immediate action required.',
          severity: 'critical',
          status: 'active',
          ship_id: 1,
          location: 'Engine Room',
          videoUrl: '../videos/fire-detect-1.mp4',
          created_date: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Hull Breach Detected',
          description: 'Minor breach detected near cargo bay.',
          severity: 'high',
          status: 'acknowledged',
          ship_id: 2,
          location: 'Cargo Bay',
          videoUrl: '../videos/fire-detect-1.mp4',
          created_date: new Date(Date.now() - 3600 * 1000).toISOString() // 1hr ago
        },
        {
          id: 3,
          title: 'Navigation System Failure',
          description: 'Autopilot system malfunctioned.',
          severity: 'emergency',
          status: 'resolved',
          ship_id: 1,
          videoUrl: '../videos/fire-detect-1.mp4',
          created_date: new Date(Date.now() - 24 * 3600 * 1000).toISOString() // 1 day ago
        }
      ]

      // // Dummy Ships
      // const shipsData = [
      //   { id: 1, name: 'SS Voyager' },
      //   { id: 2, name: 'SS Explorer' }
      // ]
      const res = await axios.get('/no-guards/entity', {
        params: { limit: 20, pageNo: 1 }
      })
      const shipsData = res.data.entities // ✅ fix key

      setAlerts(alertsData)
      setShips(shipsData)
    } catch (error) {
      console.error('Error loading alerts:', error)
    }
    setIsLoading(false)
  }
  //.............end

  const handleAcknowledge = async (alertId) => {
    try {
      await Alert.update(alertId, {
        status: 'acknowledged',
        acknowledged_by: 'current_user'
      })
      loadData()
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    }
  }

  const handleResolve = async (alertId) => {
    try {
      await Alert.update(alertId, {
        status: 'resolved',
        resolved_by: 'current_user'
      })
      loadData()
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && alert.status === 'active') ||
      (activeTab === 'critical' &&
        (alert.severity === 'critical' || alert.severity === 'emergency')) ||
      (activeTab === 'resolved' && alert.status === 'resolved')

    return matchesSearch && matchesTab
  })

  const getShipName = (shipId) => {
    const ship = ships.find((s) => s.id === shipId)
    return ship ? ship.name : 'Unknown Ship'
  }

  const severityColors = {
    low: 'bg-gray-100 text-gray-800 border-gray-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
    emergency: 'bg-red-500 text-white border-red-600'
  }

  const statusColors = {
    active: 'bg-red-100 text-red-800 border-red-200',
    acknowledged: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    resolved: 'bg-green-100 text-green-800 border-green-200'
  }

  return (
    <div className='p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 flex items-center gap-2'>
              <AlertTriangle className='w-8 h-8 text-red-600' />
              Alert Management
            </h1>
            <p className='text-slate-600 mt-1'>
              Monitor and manage critical alerts from your fleet
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <Badge
              variant='outline'
              className='bg-red-50 text-red-700 border-red-200'
            >
              <Bell className='w-3 h-3 mr-1' />
              {alerts.filter((a) => a.status === 'active').length} Active
            </Badge>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
                <Input
                  placeholder='Search alerts...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Button variant='outline' className='flex items-center gap-2'>
                <Filter className='w-4 h-4' />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alert Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-4 bg-white'>
            <TabsTrigger value='all'>All Alerts</TabsTrigger>
            <TabsTrigger value='active'>Active</TabsTrigger>
            <TabsTrigger value='critical'>Critical</TabsTrigger>
            <TabsTrigger value='resolved'>Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className='space-y-4'>
            {isLoading ? (
              <div className='space-y-4'>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className='animate-pulse'>
                      <CardContent className='p-6'>
                        <div className='h-4 bg-slate-200 rounded w-3/4 mb-2'></div>
                        <div className='h-3 bg-slate-200 rounded w-1/2'></div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className='p-12 text-center'>
                  <AlertTriangle className='w-12 h-12 text-slate-300 mx-auto mb-4' />
                  <p className='text-slate-500'>No alerts found</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className='hover:shadow-lg transition-shadow'
                >
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-3 mb-3'>
                          <Badge
                            variant='outline'
                            className={`${
                              severityColors[alert.severity]
                            } border flex items-center gap-1`}
                          >
                            <AlertTriangle className='w-3 h-3' />
                            {alert.severity}
                          </Badge>
                          <Badge
                            variant='outline'
                            className={`${statusColors[alert.status]} border`}
                          >
                            {alert.status}
                          </Badge>
                          <span className='text-sm text-slate-500 flex items-center gap-1'>
                            <Clock className='w-3 h-3' />
                            {format(
                              new Date(alert.created_date),
                              'MMM d, yyyy HH:mm'
                            )}
                          </span>
                        </div>

                        <h3 className='font-semibold text-slate-900 mb-2'>
                          {alert.title}
                        </h3>
                        <p className='text-slate-600 mb-3'>
                          {alert.description}
                        </p>

                        <div className='flex items-center gap-4 text-sm text-slate-500'>
                          <span className='flex items-center gap-1'>
                            <MapPin className='w-3 h-3' />
                            {getShipName(alert.ship_id)}
                          </span>
                          {alert.location && (
                            <span className='flex items-center gap-1'>
                              <MapPin className='w-3 h-3' />
                              {alert.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        {alert.status === 'active' && (
                          <>
                            {/* View button */}
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setSelectedAlert(alert)}
                              // onClick={() => window.open(videoUrl, "")}
                              className='flex items-center gap-1 text-blue-600 hover:text-blue-700'
                            >
                              <Play className='w-3 h-3' />
                              View
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleAcknowledge(alert.id)}
                              className='flex items-center gap-1'
                            >
                              <Eye className='w-3 h-3' />
                              Acknowledge
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleResolve(alert.id)}
                              className='flex items-center gap-1 text-green-600 hover:text-green-700'
                            >
                              <CheckCircle className='w-3 h-3' />
                              Resolve
                            </Button>
                          </>
                        )}

                        {alert.status === 'acknowledged' && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleResolve(alert.id)}
                            className='flex items-center gap-1 text-green-600 hover:text-green-700'
                          >
                            <CheckCircle className='w-3 h-3' />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Dialog */}
      <Dialog
        open={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        maxWidth='xl'
      >
        <DialogContent className='max-w-8xl bg-gray-200 '>
          <DialogHeader>
            <DialogTitle className='font-bold'>
              {selectedAlert?.title} - Video
            </DialogTitle>
            <button
              className='absolute top-2 right-3 text-lg bg-red-500 text-white p-1 rounded-full hover:bg-red-600'
              onClick={() => setSelectedAlert(null)}
            >
              ✕
            </button>
          </DialogHeader>
          {selectedAlert && (
            <video controls className='w-full rounded-lg'>
              <source src={selectedAlert.videoUrl} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
