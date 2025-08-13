'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface DealFormData {
  title: string
  value: number
  stage: string
  priority: 'low' | 'medium' | 'high'
  contact_id?: string
  notes: string
  expected_close_date?: string
}

interface DealFormProps {
  deal?: any
  onSuccess?: () => void
  defaultStage?: string
}

export function DealForm({ deal, onSuccess, defaultStage }: DealFormProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<DealFormData>({
    defaultValues: deal || { stage: defaultStage || 'prospecting', priority: 'medium' }
  })

  // Fetch contacts for the dropdown
  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('created_by', user.id)
        .order('name')
      if (error) throw error
      return data
    },
    enabled: !!user
  })

  // Fetch pipelines to get stages
  const { data: pipelines = [] } = useQuery({
    queryKey: ['pipelines'],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('pipelines')
        .select('*')
        .eq('created_by', user.id)
      if (error) throw error
      return data
    },
    enabled: !!user
  })

  const stages = pipelines[0]?.stages || [
    { id: 'prospecting', name: 'Prospecting' },
    { id: 'qualification', name: 'Qualification' },
    { id: 'proposal', name: 'Proposal' },
    { id: 'negotiation', name: 'Negotiation' },
    { id: 'closed', name: 'Closed' }
  ]

  useEffect(() => {
    if (deal) {
      reset({
        ...deal,
        expected_close_date: deal.expected_close_date ? new Date(deal.expected_close_date).toISOString().split('T')[0] : ''
      })
    }
  }, [deal, reset])

  const mutation = useMutation({
    mutationFn: async (data: DealFormData) => {
      if (!user) throw new Error('User not authenticated')

      const dealData = {
        ...data,
        value: Number(data.value),
        expected_close_date: data.expected_close_date || null,
        pipeline_id: pipelines[0]?.id
      }

      if (deal) {
        const { error } = await supabase
          .from('deals')
          .update(dealData)
          .eq('id', deal.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('deals')
          .insert([{ ...dealData, created_by: user.id }])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      toast.success(deal ? 'Deal updated successfully' : 'Deal created successfully')
      if (!deal) reset()
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Failed to save deal')
      console.error('Deal save error:', error)
    }
  })

  const onSubmit = (data: DealFormData) => {
    mutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{deal ? 'Edit Deal' : 'Add New Deal'}</CardTitle>
        <CardDescription>
          {deal ? 'Update deal information' : 'Create a new deal for your pipeline'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Enterprise Software License"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Deal Value ($)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...register('value', { valueAsNumber: true })}
                placeholder="50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={watch('stage')}
                onValueChange={(value) => setValue('stage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage: any) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_id">Contact</Label>
              <Select
                value={watch('contact_id') || ''}
                onValueChange={(value) => setValue('contact_id', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No contact</SelectItem>
                  {contacts.map((contact: any) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} {contact.company && `(${contact.company})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_close_date">Expected Close Date</Label>
              <Input
                id="expected_close_date"
                type="date"
                {...register('expected_close_date')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about this deal..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}