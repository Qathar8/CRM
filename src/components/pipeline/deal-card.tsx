import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DollarSign, Calendar, User, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Deal {
  id: string
  title: string
  value: number
  stage: string
  priority: 'low' | 'medium' | 'high'
  expected_close_date?: string
  contact?: {
    name: string
    company?: string
  }
}

interface DealCardProps {
  deal: Deal
  onEdit: (deal: Deal) => void
  onDelete: (dealId: string) => void
}

export function DealCard({ deal, onEdit, onDelete }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-3 scale-105' : ''
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {deal.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(deal)}>
                Edit Deal
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(deal.id)}
                className="text-red-600"
              >
                Delete Deal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center text-sm font-semibold text-green-600">
          <DollarSign className="mr-1 h-3 w-3" />
          {formatCurrency(deal.value)}
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className={getPriorityColor(deal.priority)}>
            {deal.priority}
          </Badge>
        </div>

        {deal.contact && (
          <div className="flex items-center text-xs text-gray-600">
            <User className="mr-1 h-3 w-3" />
            <span className="truncate">
              {deal.contact.name}
              {deal.contact.company && ` • ${deal.contact.company}`}
            </span>
          </div>
        )}

        {deal.expected_close_date && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(deal.expected_close_date).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}