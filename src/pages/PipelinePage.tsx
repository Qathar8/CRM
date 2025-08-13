import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { PipelineBoard } from '@/components/pipeline/pipeline-board'
import { DealForm } from '@/components/pipeline/deal-form'
import { Button } from '@/components/ui/button'
import { usePipelines } from '@/lib/queries'
import { Plus, Download } from 'lucide-react'
import { exportDealsToExcel } from '@/lib/excel-export'
import { toast } from 'sonner'

interface Deal {
  id: string
  title: string
  value: number
  priority: 'low' | 'medium' | 'high'
  contact_id: string | null
  expected_close_date: string | null
  notes: string
}

export default function PipelinePage() {
  const { data: pipelines = [], isLoading } = usePipelines()
  const [isDealFormOpen, setIsDealFormOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const defaultPipeline = pipelines[0] // Use first pipeline as default
  
  const handleExportExcel = async () => {
    try {
      toast.loading('Preparing Excel export...')
      await exportDealsToExcel()
      toast.success('Deals exported to Excel successfully!')
    } catch (error) {
      toast.error('Failed to export deals')
    }
  }

  const handleCreateDeal = () => {
    setEditingDeal(null)
    setIsDealFormOpen(true)
  }

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal)
    setIsDealFormOpen(true)
  }

  const handleCloseDealForm = () => {
    setIsDealFormOpen(false)
    setEditingDeal(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading pipeline...</div>
        </div>
      </div>
    )
  }

  if (!defaultPipeline) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Pipeline Found</h2>
            <p className="text-muted-foreground">A default pipeline will be created automatically.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{defaultPipeline.name}</h2>
            <p className="text-muted-foreground">{defaultPipeline.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleExportExcel} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button onClick={handleCreateDeal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Button>
          </div>
        </div>
        
        <PipelineBoard
          pipelineId={defaultPipeline.id}
          stages={defaultPipeline.stages}
          onCreateDeal={handleCreateDeal}
          onEditDeal={handleEditDeal}
        />

        <DealForm
          isOpen={isDealFormOpen}
          onClose={handleCloseDealForm}
          deal={editingDeal}
          pipelineId={defaultPipeline.id}
        />
      </div>
    </div>
  )
}