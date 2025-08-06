import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function GeneratedReportsList({ reports, isLoading }) {
  const statusConfig = {
    generating: {
      icon: Loader2,
      color: 'bg-blue-100 text-blue-800',
      spin: true
    },
    completed: {
      icon: FileText,
      color: 'bg-green-100 text-green-800',
      spin: false
    },
    failed: { icon: AlertCircle, color: 'bg-red-100 text-red-800', spin: false }
  }

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className='h-12 w-full' />
          ))}
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className='text-center py-10'>
        <FileText className='w-12 h-12 text-slate-300 mx-auto mb-4' />
        <p className='text-slate-500'>No reports have been generated yet.</p>
      </div>
    )
  }

  return (
    <div className='border rounded-lg overflow-hidden'>
      <Table>
        <TableHeader className='bg-slate-50'>
          <TableRow>
            <TableHead>Report Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date Generated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => {
            const config = statusConfig[report.status]
            const Icon = config.icon
            return (
              <TableRow key={report.id}>
                <TableCell className='font-medium'>
                  {report.report_name}
                </TableCell>
                <TableCell className='capitalize'>
                  {report.report_type.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  {format(new Date(report.created_date), 'PPP')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant='outline'
                    className={`flex items-center gap-1 w-fit ${config.color}`}
                  >
                    <Icon
                      className={`w-3 h-3 ${config.spin ? 'animate-spin' : ''}`}
                    />
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {report.status === 'completed' && (
                    <Button variant='ghost' size='sm' asChild>
                      <a
                        href={report.file_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1'
                      >
                        <Download className='w-3 h-3' />
                        Download
                      </a>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
