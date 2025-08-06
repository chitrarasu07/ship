import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, TrendingUp, Clock, Shield } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export default function AlertAnalytics({ alerts, timeRange }) {
  // Process alert data
  const alertsByType = alerts.reduce((acc, alert) => {
    acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1
    return acc
  }, {})

  const alertsBySeverity = alerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(alertsByType).map(([type, count]) => ({
    name: type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    value: count
  }))

  const severityData = Object.entries(alertsBySeverity).map(
    ([severity, count]) => ({
      name: severity,
      value: count
    })
  )

  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6']

  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved').length
  const resolutionRate =
    alerts.length > 0 ? ((resolvedAlerts / alerts.length) * 100).toFixed(1) : 0

  return (
    <div className='space-y-6'>
      {/* Alert Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Total Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>
              {alerts.length}
            </div>
            <p className='text-sm text-green-600 flex items-center gap-1'>
              <TrendingUp className='w-3 h-3' />
              -12% vs last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>
              {resolutionRate}%
            </div>
            <Progress value={parseFloat(resolutionRate)} className='mt-2' />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>3.2m</div>
            <p className='text-sm text-green-600'>-30s improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-slate-600'>
              False Positives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>2.1%</div>
            <p className='text-sm text-green-600'>Within target range</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertTriangle className='w-5 h-5 text-red-600' />
              Alerts by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  angle={-45}
                  textAnchor='end'
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#3B82F6' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='w-5 h-5 text-blue-600' />
              Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {severityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alert Types Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Categories Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Object.entries(alertsByType).map(([type, count]) => {
              const percentage = (count / alerts.length) * 100
              return (
                <div key={type} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      {type
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <Badge variant='outline'>{count} alerts</Badge>
                  </div>
                  <Progress value={percentage} className='h-2' />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
