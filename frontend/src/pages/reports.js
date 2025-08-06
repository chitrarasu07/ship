import React, { useState, useEffect } from 'react'
import { FileText, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ReportTemplates from '../components/reports/ReportTemplates'
import GeneratedReportsList from '../components/reports/GeneratedReportsList'
import ReportGenerator from '../components/reports/ReportGenerator'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setIsLoading(true)
    try {
      const reportsData = []
      setReports(reportsData)
    } catch (error) {
      console.error('Error loading reports:', error)
    }
    setIsLoading(false)
  }

  const handleCreateReport = (template) => {
    setSelectedTemplate(template)
    setIsGeneratorOpen(true)
  }

  const onReportGenerated = async (reportData) => {
    setIsGeneratorOpen(false)
    setSelectedTemplate(null)

    // Simulate generation process
    const newReport = await Report.create({
      ...reportData,
      status: 'generating'
    })

    // Refresh list to show "generating" status
    await loadReports()

    // Simulate delay and then update to "completed"
    setTimeout(async () => {
      await Report.update(newReport.id, {
        status: 'completed',
        file_url: '/reports/sample-report.pdf',
        summary:
          'This is an AI-generated summary of the report findings, highlighting key metrics and anomalies.'
      })
      await loadReports()
    }, 3000)
  }

  return (
    <div className='p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900 flex items-center gap-2'>
              <FileText className='w-8 h-8 text-blue-600' />
              Reports & Analytics
            </h1>
            <p className='text-slate-600 mt-1'>
              Generate and manage insightful reports for your fleet.
            </p>
          </div>
          <Button
            onClick={() => handleCreateReport(null)}
            className='flex items-center gap-2'
          >
            <PlusCircle className='w-4 h-4' />
            Create Custom Report
          </Button>
        </div>

        {/* Report Templates */}
        <ReportTemplates onSelectTemplate={handleCreateReport} />

        {/* Generated Reports */}
        <Card>
          <CardContent className='p-6'>
            <h2 className='text-xl font-bold text-slate-900 mb-4'>
              Generated Reports
            </h2>
            <GeneratedReportsList reports={reports} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Report Generator Dialog */}
        <ReportGenerator
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          template={selectedTemplate}
          onGenerate={onReportGenerated}
        />
      </div>
    </div>
  )
}
