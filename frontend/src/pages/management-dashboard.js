import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Ship as ShipIcon,
  Activity,
  MapPin,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react'

import DashboardStats from '../components/dashboard/DashboardStats'
import ShipOverview from '../components/dashboard/ShipOverview'
import RecentAlerts from '../components/dashboard/RecentAlerts'
import GlobalMap from '../components/dashboard/GlobalMap'
import UseCaseAnalytics from '@/components/dashboard/UseCaseAnalytics'
import IncidentResponseMetrics from '../components/dashboard/IncidentResponseMatrics'
import axios from 'axios'


export default function Dashboard() {
  const [ships, setShips] = useState([])
  // const [alerts, setAlerts] = useState([])
  // const [cameraData, setCameraData] = useState([])


//   const [ships, setShips] = useState([
//   { id: 1, name: "MV northern Star ", status: "active", location: "Singapore" ,camera_installed:"8"},
//   { id: 2, name: "MV Atlantic poineer", status: "in_port", location: "Rotterdam" ,camera_installed:"5"},
//   { id: 3, name: "MV Blue Whale", status: "maintenance", location: "Shanghai" ,camera_installed:"3"},
//   { id: 4, name: "Ocean Queen", status: "active", location: "Long Beach" ,camera_installed:"10"},
//   { id: 5, name: "Ocean King", status: "active", location: "Los Angeles" ,camera_installed:"7"},
// ]);

const [alerts, setAlerts] = useState([
  {
    title: "Fire detected in engine room",
    description: "Temperature and smoke sensors have detected a possible fire in the engine room. Immediate evacuation and fire suppression required.",
    shipName: "MV Northern Star",
    location: "Engine Room - Deck 2",
    severity: "emergency",
    created_date: "2025-08-13T09:30:00Z"
  },
  {
    title: "Smoke detected in cargo hold",
    description: "Smoke detection system has triggered an alert in Cargo Hold A. Investigate for potential fire or overheating equipment.",
    shipName: "MV Atlantic Pioneer",
    location: "Cargo Hold A - Deck 1",
    severity: "critical",
    created_date: "2025-08-13T08:45:00Z"
  },

  {
    title: "Smoke detected in crew quarters",
    description: "Smoke alarms have been triggered in Crew Quarters B. Check for possible short circuits or small fires.",
    shipName: "Ocean Queen",
    location: "Crew Quarters B - Deck 4",
    severity: "critical",
    created_date: "2025-08-13T06:50:00Z"
  },
  {
    title: "Engine overheating",
    description: "The engine temperature has exceeded safe limits",
    shipName: "MV Blue Whale",
    location: "Ship ID: 1 - Deck 5",
    severity: "critical",
    created_date: "2025-08-13T09:30:00Z"
  },
  {
    title: "High temperature warning in kitchen",
    description: "Sensors detected unusually high temperatures in the galley area, possible electrical overheating.",
    shipName: "MV Blue Whale",
    location: "Galley - Deck 3",
    severity: "medium",
    created_date: "2025-08-13T07:15:00Z"
  },
    {
    title: "High temperature warning in kitchen",
    description: "Sensors detected unusually high temperatures in the galley area, possible electrical overheating.",
    shipName: "MV Blue Whale",
    location: "Galley - Deck 3",
    severity: "medium",
    created_date: "2025-08-13T07:15:00Z"
  },
  
])


// usecase analysis data
const [cameraData, setCameraData] = useState([
  { use_case: "Fire_Detection", confidence_score: 0.98, alert_level: "critical" },
  { use_case: "Fire_Detection", confidence_score: 0.98, alert_level: "critical" },
  { use_case: "Fire_Detection", confidence_score: 0.98, alert_level: "critical" },
  { use_case: "Smoke_Detection", confidence_score: 0.95, alert_level: "critical" },
  { use_case: "Smoke_Detection", confidence_score: 0.97, alert_level: "critical" },
  { use_case: "PPT_KIT_Detection", confidence_score: 0.89, alert_level: "emergency" },
  { use_case: "PPT_KIT_Detection", confidence_score: 0.90, alert_level: "emergency" },
  { use_case: "Anomaly_Detection", confidence_score: 0.87, alert_level: "critical" },
  { use_case: "No_Cross_Detection", confidence_score: 0.86, alert_level: "medium" }
]);

// dummy metrics data for incident response
const dummyMetrics = {
  avgResponseTime: {
    value: 120,
    trend: "up",
    change: "15 mins since last week"
  },
  resolutionRate: {
    value: "75%",
    resolved: 150,
    pending: 50
  },
  preventionRate: {
    value: "80%",
    change: "10% since last month"
  }
};


// ..........end 



  const [activeView, setActiveView] = useState('global')
  const [isLoading, setIsLoading] = useState(true)
  const [incidentMetrics, setIncidentMetrics] = useState({});

  useEffect(() => {
    loadDashboardData()
  }, [])



  // const loadDashboardData = async () => {
  //   setIsLoading(true)
  //   try {
  //     const shipsData = [],
  //       alertsData = [],
  //       cameraDataResults = []
  //     setShips(shipsData)
  //     setAlerts(alertsData)
  //     setIncidentMetrics(dashboardData.incidentResponseMetrics);
  //     setCameraData(cameraDataResults)
  //   } catch (error) {
  //     console.error('Error loading dashboard data:', error)
  //   }
  //   setIsLoading(false)
  // }


// demo purpose  after that we will remove this and use the above loadDashboardData function
  const loadDashboardData = async () => {
  setIsLoading(true)
  try {
    // const shipsData = [] // API call here later
    const shipsResponse = await axios.get('/no-guards/entity', { params: { limit: 50, pageNo: 1 } });
    
    // Adjust this line according to your actual API response structure
    const shipsData = shipsResponse.data.entities || shipsResponse.data || [];

    setShips(shipsData);
    const alertsData = []
    const cameraDataResults = await axios.get('/camera', { params: { limit: 50, pageNo: 1 } });
    // const cameraDataResults = []
    // setIncidentMetrics(incidentResponseMetrics);

    if (alertsData.length > 0) setAlerts(alertsData)
    if (cameraDataResults.length > 0) setCameraData(cameraDataResults)
      console.log("ships data", shipsData);
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
  setIsLoading(false)
}
// ............................

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === 'critical' || alert.severity === 'emergency' || alert.severity === 'medium'
  )
  // i have
  const activeShips = ships.filter((ship) => ship.status === 'active' || ship.status === 'in_port')

  // this is for time update i added
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(timer);
  }, []);

  // ..........
  return (
    <div className='p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>
              Vision AI Dashboard
            </h1>
            <p className='text-slate-600 mt-1'>
              Real-time maritime intelligence and monitoring
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <Badge
              variant='outline'
              className='bg-green-50 text-green-700 border-green-200'
            >
              <Activity className='w-3 h-3 mr-1' />
              System Online
            </Badge>
            <Badge
              variant='outline'
              className='bg-blue-50 text-blue-700 border-blue-200'
            >
              Last Updated: {new Date().getMinutes()} min ago
            </Badge>
          </div>
        </div>

        {/* View Selector */}
        <Tabs
          value={activeView}
          onValueChange={setActiveView}
          className='w-full '
        >
          <TabsList className='grid w-full grid-cols-2 lg:grid-cols-3 h-auto p-1 bg-white shadow-sm'>
            <TabsTrigger
              value='global'
              className='flex items-center gap-2 py-3'
            >
              <Activity className='w-4 h-4' />
              Global Admin
            </TabsTrigger>
            <TabsTrigger value='ships' className='flex items-center gap-2 py-3'>
              <ShipIcon className='w-4 h-4' />
              Ship View
            </TabsTrigger>
            <TabsTrigger
              value='locations'
              className='flex items-center gap-2 py-3'
            >
              <MapPin className='w-4 h-4' />
              Location View
            </TabsTrigger>
            {/* <TabsTrigger
              value='manager'
              className='flex items-center gap-2 py-3'
            >
              <Users className='w-4 h-4' />
              Manager View
            </TabsTrigger> */}
            {/* <TabsTrigger
              value='client'
              className='flex items-center gap-2 py-3'
            >
              <Shield className='w-4 h-4' />
              Client View
            </TabsTrigger> */}
          </TabsList>

          {/* Global A  dmin View */}
          <TabsContent value='global' className='space-y-8'>
            <DashboardStats
              ships={ships}
              alerts={alerts}
              cameraData={cameraData}
              isLoading={isLoading}
            />

            <div className='grid lg:grid-cols-2 gap-6'>
              {/* added to my purpose
              <div className='lg:col-span-2'>
                <RecentAlerts alerts={criticalAlerts} />
              </div> */}
              <div className='space-y-6'>
                <ShipOverview ships={ships} />
                <IncidentResponseMetrics metrics={dummyMetrics} />
              </div>
              <div className='space-y-8 space-x-8'>
                <RecentAlerts alerts={criticalAlerts} />
                <UseCaseAnalytics cameraData={cameraData} />
              </div> 
            </div>
          </TabsContent>

          {/* Ship View */}
          <TabsContent value='ships' className='space-y-6'>
            <div className='grid lg:grid-cols-4 gap-6'>
              <div className='lg:col-span-2'>
                <ShipOverview ships={ships} detailed={true} />
              </div>
              <div  className='lg:col-span-2'>
                {/* <RecentAlerts alerts={alerts.filter((a) => a.ship_id)} /> */}
                <RecentAlerts alerts={criticalAlerts} />
              </div>
            </div>
          </TabsContent>

          {/* Location View */}
          <TabsContent value='locations' className='space-y-6'>
            <GlobalMap ships={ships} alerts={criticalAlerts} />
            <div className='grid lg:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='w-5 h-5 text-blue-600' />
                    Port Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {['Singapore', 'Rotterdam', 'Shanghai', 'Long Beach'].map(
                      (port) => (
                        <div
                          key={port}
                          className='flex items-center justify-between p-3 bg-slate-50 rounded-lg'
                        >
                          <div>
                            <p className='font-medium'>{port}</p>
                            <p className='text-sm text-slate-500'>
                              Port of {port}
                            </p>
                          </div>
                          <Badge
                            variant='outline'
                            className='bg-green-50 text-green-700'
                          >
                            {Math.floor(Math.random() * 5) + 1} ships
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
              <UseCaseAnalytics cameraData={cameraData} />
            </div>
          </TabsContent>

          {/* Manager View */}
          <TabsContent value='manager' className='space-y-6'>
            <div className='grid lg:grid-cols-4 gap-6'>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-slate-600'>
                    Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900'>92%</div>
                  <p className='text-sm text-green-600 flex items-center gap-1'>
                    <TrendingUp className='w-3 h-3' />
                    +5% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-slate-600'>
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900'>3.2m</div>
                  <p className='text-sm text-green-600'>
                    Average alert response
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-slate-600'>
                    Active Operators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900'>12</div>
                  <p className='text-sm text-slate-500'>On duty now</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium text-slate-600'>
                    Efficiency Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900'>98.5%</div>
                  <p className='text-sm text-green-600'>Camera uptime</p>
                </CardContent>
              </Card>
            </div>
            <div className='grid lg:grid-cols-2 gap-6'>
              <IncidentResponseMetrics metrics={incidentMetrics} />
              <RecentAlerts alerts={alerts} />
            </div>
          </TabsContent>

          {/* Client View
          <TabsContent value='client' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='w-5 h-5 text-blue-600' />
                  Your Fleet Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='text-center p-4 bg-blue-50 rounded-lg'>
                    <div className='text-2xl font-bold text-blue-600'>8</div>
                    <p className='text-sm text-slate-600'>Your Ships</p>
                  </div>
                  <div className='text-center p-4 bg-green-50 rounded-lg'>
                    <div className='text-2xl font-bold text-green-600'>42</div>
                    <p className='text-sm text-slate-600'>Cameras</p>
                  </div>
                  <div className='text-center p-4 bg-amber-50 rounded-lg'>
                    <div className='text-2xl font-bold text-amber-600'>2</div>
                    <p className='text-sm text-slate-600'>Active Alerts</p>
                  </div>
                  <div className='text-center p-4 bg-purple-50 rounded-lg'>
                    <div className='text-2xl font-bold text-purple-600'>
                      96%
                    </div>
                    <p className='text-sm text-slate-600'>Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className='grid lg:grid-cols-2 gap-6'>
              <ShipOverview ships={ships.slice(0, 8)} />
              <RecentAlerts alerts={alerts.slice(0, 5)} />
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
