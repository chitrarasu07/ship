import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Award, Target, CheckCircle } from 'lucide-react'

export default function BenchmarkComparison({ ships, alerts, cameraData }) {
  const benchmarks = [
    {
      metric: 'Fleet Uptime',
      current: 98.5,
      industry: 95.2,
      target: 99.0,
      unit: '%',
      status: 'above'
    },
    {
      metric: 'Alert Response Time',
      current: 3.2,
      industry: 5.8,
      target: 3.0,
      unit: 'min',
      status: 'above'
    },
    {
      metric: 'Detection Accuracy',
      current: 94.8,
      industry: 89.3,
      target: 95.0,
      unit: '%',
      status: 'near'
    },
    {
      metric: 'False Positive Rate',
      current: 2.1,
      industry: 4.7,
      target: 2.0,
      unit: '%',
      status: 'near'
    },
    {
      metric: 'Camera Uptime',
      current: 98.5,
      industry: 92.1,
      target: 99.5,
      unit: '%',
      status: 'above'
    },
    {
      metric: 'Incident Prevention',
      current: 87.3,
      industry: 76.5,
      target: 90.0,
      unit: '%',
      status: 'above'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'above':
        return 'text-green-600 bg-green-100'
      case 'near':
        return 'text-yellow-600 bg-yellow-100'
      case 'below':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'above':
        return <CheckCircle className='w-4 h-4' />
      case 'near':
        return <Target className='w-4 h-4' />
      case 'below':
        return <TrendingUp className='w-4 h-4' />
      default:
        return <Award className='w-4 h-4' />
    }
  }

  return (
    <div className='space-y-6'>
      {/* Industry Comparison Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='bg-green-50 border-green-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-green-700'>
              Above Industry Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-900'>
              {benchmarks.filter((b) => b.status === 'above').length}
            </div>
            <p className='text-sm text-green-600'>of 6 key metrics</p>
          </CardContent>
        </Card>

        <Card className='bg-yellow-50 border-yellow-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-yellow-700'>
              Near Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-900'>
              {benchmarks.filter((b) => b.status === 'near').length}
            </div>
            <p className='text-sm text-yellow-600'>metrics approaching goal</p>
          </CardContent>
        </Card>

        <Card className='bg-blue-50 border-blue-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-medium text-blue-700'>
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-900'>A+</div>
            <p className='text-sm text-blue-600'>Industry rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Award className='w-5 h-5 text-blue-600' />
            Performance vs Industry Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {benchmarks.map((benchmark) => (
              <div key={benchmark.metric} className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='font-medium'>{benchmark.metric}</span>
                    <Badge
                      variant='outline'
                      className={getStatusColor(benchmark.status)}
                    >
                      {getStatusIcon(benchmark.status)}
                      {benchmark.status}
                    </Badge>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold'>
                      {benchmark.current}
                      {benchmark.unit}
                    </div>
                    <div className='text-xs text-slate-500'>
                      Target: {benchmark.target}
                      {benchmark.unit}
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Your Performance</span>
                    <span className='font-medium'>
                      {benchmark.current}
                      {benchmark.unit}
                    </span>
                  </div>
                  <Progress
                    value={(benchmark.current / benchmark.target) * 100}
                    className='h-2'
                  />
                  <div className='flex justify-between text-xs text-slate-500'>
                    <span>
                      Industry Avg: {benchmark.industry}
                      {benchmark.unit}
                    </span>
                    <span>
                      Target: {benchmark.target}
                      {benchmark.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='w-5 h-5 text-green-600' />
            Industry Rankings & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h4 className='font-semibold'>Performance Rankings</h4>
              <div className='space-y-2'>
                <div className='flex justify-between items-center p-3 bg-green-50 rounded-lg'>
                  <span>Maritime Safety Excellence</span>
                  <Badge className='bg-green-600'>Top 5%</Badge>
                </div>
                <div className='flex justify-between items-center p-3 bg-blue-50 rounded-lg'>
                  <span>AI Detection Accuracy</span>
                  <Badge className='bg-blue-600'>Top 10%</Badge>
                </div>
                <div className='flex justify-between items-center p-3 bg-purple-50 rounded-lg'>
                  <span>Operational Efficiency</span>
                  <Badge className='bg-purple-600'>Top 15%</Badge>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h4 className='font-semibold'>Compliance & Certifications</h4>
              <div className='space-y-2'>
                <div className='flex justify-between items-center p-3 bg-green-50 rounded-lg'>
                  <span>IMO Compliance</span>
                  <Badge
                    variant='outline'
                    className='bg-green-100 text-green-800'
                  >
                    ✓ Certified
                  </Badge>
                </div>
                <div className='flex justify-between items-center p-3 bg-green-50 rounded-lg'>
                  <span>SOLAS Standards</span>
                  <Badge
                    variant='outline'
                    className='bg-green-100 text-green-800'
                  >
                    ✓ Compliant
                  </Badge>
                </div>
                <div className='flex justify-between items-center p-3 bg-yellow-50 rounded-lg'>
                  <span>ISO 27001</span>
                  <Badge
                    variant='outline'
                    className='bg-yellow-100 text-yellow-800'
                  >
                    ⏳ In Progress
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
