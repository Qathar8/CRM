import { useState, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DealCard } from './deal-card'
import { DealForm } from './deal-form'
import { Plus } from 'lucide-react'
import { useDeals, usePipelines } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Deal {
  id: string
  title: string
  value: number
  stage: string
  priority: 'low' | 'medium' | 'high'
  expected_close_date?: string
  stage_order: number
  contact?: {
    name: string
    company?: string
  }
}

interface Stage {
  id: string
  name: string
  color: string
}

export function PipelineBoard() {
  const { data: pipelines = [] } = usePipelines()
  const { data: deals = [], refetch: refetchDeals } = useDeals()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDealFormOpen, setIsDealFormOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [selectedStage, setSelectedStage] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const pipeline = pipelines[0] // Use first pipeline for now
  const stages: Stage[] = pipeline?.stages || []

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = deals
      .filter((deal) => deal.stage === stage.id)
      .sort((a, b) => a.stage_order - b.stage_order)
    return acc
  }, {} as Record<string, Deal[]>)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeDeal = deals.find((deal) => deal.id === activeId)
    if (!activeDeal) return

    // Check if we're dropping on a stage column
    const targetStage = stages.find((stage) => stage.id === overId)
    if (targetStage && activeDeal.stage !== targetStage.id) {
      // Moving to a different stage
      const targetDeals = dealsByStage[targetStage.id] || []
      const newOrder = targetDeals.length

      try {
        const { error } = await supabase
          .from('deals')
          .update({
            stage: targetStage.id,
            stage_order: newOrder,
          })
          .eq('id', activeId)

        if (error) throw error

        toast.success('Deal moved successfully')
        refetchDeals()
      } catch (error) {
        toast.error('Failed to move deal')
        console.error('Error moving deal:', error)
      }
    }
  }

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal)
    setIsDealFormOpen(true)
  }

  const handleDeleteDeal = async (dealId: string) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId)

      if (error) throw error

      toast.success('Deal deleted successfully')
      refetchDeals()
    } catch (error) {
      toast.error('Failed to delete deal')
      console.error('Error deleting deal:', error)
    }
  }

  const handleAddDeal = (stageId: string) => {
    setSelectedStage(stageId)
    setEditingDeal(null)
    setIsDealFormOpen(true)
  }

  const activeDeal = activeId ? deals.find((deal) => deal.id === activeId) : null

  if (!pipeline) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No pipeline found. Please create a pipeline first.</p>
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <Card
              key={stage.id}
              className="flex-shrink-0 w-80 bg-gray-50"
              id={stage.id}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: stage.color }}
                    />
                    {stage.name}
                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {dealsByStage[stage.id]?.length || 0}
                    </span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddDeal(stage.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <SortableContext
                  items={dealsByStage[stage.id]?.map((deal) => deal.id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[200px]">
                    {dealsByStage[stage.id]?.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onEdit={handleEditDeal}
                        onDelete={handleDeleteDeal}
                      />
                    ))}
                  </div>
                </SortableContext>
              </CardContent>
            </Card>
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <DealCard
              deal={activeDeal}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <DealForm
        isOpen={isDealFormOpen}
        onClose={() => {
          setIsDealFormOpen(false)
          setEditingDeal(null)
          setSelectedStage('')
        }}
        deal={editingDeal}
        defaultStage={selectedStage}
        onSuccess={() => {
          setIsDealFormOpen(false)
          setEditingDeal(null)
          setSelectedStage('')
          refetchDeals()
        }}
      />
    </>
  )
}