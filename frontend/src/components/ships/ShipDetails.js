import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Ship,
  Fingerprint,
  Flag,
  MapPin,
  Camera,
  Signal,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'
import RecentAlerts from '../dashboard/RecentAlerts'

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className='flex items-start gap-4 p-4 bg-slate-100/50 rounded-lg'>
    <Icon className='w-5 h-5 text-blue-600 mt-1 flex-shrink-0' />
    <div>
      <p className='text-sm text-slate-500'>{label}</p>
      <p className='font-semibold text-slate-800'>{value}</p>
    </div>
  </div>
)

export default function ShipDetails({ ship, alerts, isLoading }) {


  if (isLoading) {
    return (
      <div className='p-6 space-y-6'>
        <Skeleton className='h-10 w-3/4' />
        <Skeleton className='h-6 w-1/2' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className='h-20 rounded-lg' />
            ))}
        </div>
        <Skeleton className='h-64 w-full' />
      </div>
    )
  }

  if (!ship) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center p-6'>
        <Ship className='w-24 h-24 text-slate-300 mb-6' />
        <h3 className='text-xl font-bold text-slate-800'>Select a Ship</h3>
        <p className='text-slate-500'>
          Choose a ship from the list to view its details.
        </p>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-slate-900'>{ship.name}</h1>
        <p className='text-slate-500'>
          {(ship.ship_type || 'Bulk')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <DetailItem
          icon={Fingerprint}
          label='IMO Number'
          value={ship.imo_number}
        />
        <DetailItem icon={Flag} label='Flag' value={ship.flag} />
        <DetailItem
          icon={Signal}
          label='Status'
          value={
            <Badge variant='outline' className='capitalize'>
              {ship.status.replace('_', ' ')}
            </Badge>
          }
        />
        <DetailItem
          icon={MapPin}
          label='Current Location'
          value={`${ship.current_location?.port || 'N/A'}, ${
            ship.current_location?.country || 'N/A'
          }`}
        />
        <DetailItem
          icon={Camera}
          label='Cameras Installed'
          value={ship.cameras_installed}
        />
        <DetailItem
          icon={Calendar}
          label='Last Update'
          value={
            ship.last_update
              ? format(new Date(ship.last_update.replace(' ', 'T')), 'PPP p')
              : 'Not Available'
          }
        />
      </div>

      <Tabs defaultValue='alerts' className='w-full'>
        <TabsList>
          <TabsTrigger value='alerts' className='flex items-center gap-1'>
            <AlertTriangle className='w-4 h-4' />
            Alerts
            {alerts.length > 0 && (
              <Badge className='ml-2'>{alerts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='cameras' className='flex items-center gap-1'>
            <Camera className='w-4 h-4' />
            Cameras
          </TabsTrigger>
          <TabsTrigger value='reports' className='flex items-center gap-1'>
            <FileText className='w-4 h-4' />
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value='alerts'>
          <RecentAlerts alerts={alerts} />
        </TabsContent>
        <TabsContent value='cameras'>
          <Card>
            <CardHeader>
              <CardTitle>Camera Feeds</CardTitle>
            </CardHeader>
            <CardContent className='text-center text-slate-500 py-12'>
              <Camera className='w-16 h-16 text-slate-300 mx-auto mb-4' />
              <p>Live camera feeds will be displayed here.</p>
              <p className='text-sm'>(Feature in development)</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='reports'>
          <Card>
            <CardHeader>
              <CardTitle>Ship-Specific Reports</CardTitle>
            </CardHeader>
            <CardContent className='text-center text-slate-500 py-12'>
              <FileText className='w-16 h-16 text-slate-300 mx-auto mb-4' />
              <p>Custom reports for this ship will be available here.</p>
              <p className='text-sm'>(Feature in development)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
