import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, AlertTriangle, Camera, Users } from 'lucide-react'

const templates = [
  {
    title: 'Fleet Summary',
    description: 'Overall performance and status of all ships.',
    icon: BarChart3,
    type: 'fleet_summary',
    color: 'blue'
  },
  {
    title: 'Alert Analysis',
    description: 'In-depth breakdown of all triggered alerts.',
    icon: AlertTriangle,
    type: 'alert_analysis',
    color: 'red'
  },
  {
    title: 'Camera Performance',
    description: 'Metrics on camera uptime and detection rates.',
    icon: Camera,
    type: 'camera_performance',
    color: 'green'
  },
  {
    title: 'Operator Activity',
    description: 'Report on user activity and alert response times.',
    icon: Users,
    type: 'operator_activity',
    color: 'purple'
  }
]

const colorClasses = {
  blue: 'text-blue-600 bg-blue-100',
  red: 'text-red-600 bg-red-100',
  green: 'text-green-600 bg-green-100',
  purple: 'text-purple-600 bg-purple-100'
}

export default function ReportTemplates({ onSelectTemplate }) {
  return (
    <div>
      <h2 className='text-xl font-bold text-slate-900 mb-4'>
        Start from a Template
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {templates.map((template) => (
          <Card
            key={template.title}
            className='hover:shadow-lg transition-shadow'
          >
            <CardHeader>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  colorClasses[template.color]
                }`}
              >
                <template.icon className='w-6 h-6' />
              </div>
            </CardHeader>
            <CardContent>
              <h3 className='text-lg font-semibold text-slate-800'>
                {template.title}
              </h3>
              <p className='text-sm text-slate-500 mt-1 mb-4 h-10'>
                {template.description}
              </p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onSelectTemplate(template)}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
