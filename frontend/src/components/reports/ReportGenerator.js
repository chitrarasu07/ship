import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { format } from 'date-fns'

export default function ReportGenerator({
  isOpen,
  onClose,
  template,
  onGenerate
}) {
  const [reportName, setReportName] = useState('')
  const [ships, setShips] = useState([])
  const [selectedShips, setSelectedShips] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setReportName(`${template.title} - ${format(new Date(), 'yyyy-MM-dd')}`)
      } else {
        setReportName(`Custom Report - ${format(new Date(), 'yyyy-MM-dd')}`)
      }
      loadShips()
    }
  }, [isOpen, template])

  const loadShips = async () => {
    const shipsData = []
    setShips(shipsData)
  }

  const handleGenerateClick = () => {
    const reportData = {
      report_name: reportName,
      report_type: template?.type || 'custom',
      date_range: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd')
      },
      filters: {
        ship_ids: selectedShips
      }
    }
    onGenerate(reportData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Generate New Report</DialogTitle>
        </DialogHeader>
        <div className='grid gap-6 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='report-name'>Report Name</Label>
            <Input
              id='report-name'
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          {template && (
            <div className='space-y-2'>
              <Label>Report Type</Label>
              <Input value={template.title} disabled />
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>Start Date</Label>
              <Input
                type='date'
                value={format(startDate, 'yyyy-MM-dd')}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>
            <div className='space-y-2'>
              <Label>End Date</Label>
              <Input
                type='date'
                value={format(endDate, 'yyyy-MM-dd')}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Filter by Ships (Optional)</Label>
            <Select onValueChange={(value) => setSelectedShips([value])}>
              <SelectTrigger>
                <SelectValue placeholder='Select a ship to filter' />
              </SelectTrigger>
              <SelectContent>
                {ships.map((ship) => (
                  <SelectItem key={ship.id} value={ship.id}>
                    {ship.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Cancel
            </Button>
          </DialogClose>
          <Button type='submit' onClick={handleGenerateClick}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
