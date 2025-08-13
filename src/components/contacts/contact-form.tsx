'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
}

interface ContactFormProps {
  contact?: any
  onSuccess?: () => void
}

export function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    defaultValues: contact || {}
  })

  useEffect(() => {
    if (contact) {
      reset(contact)
    }
  }, [contact, reset])

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      if (!user) throw new Error('User not authenticated')

      if (contact) {
        const { error } = await supabase
          .from('contacts')
          .update(data)
          .eq('id', contact.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('contacts')
          .insert([{ ...data, created_by: user.id }])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast.success(contact ? 'Contact updated successfully' : 'Contact created successfully')
      if (!contact) reset()
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Failed to save contact')
      console.error('Contact save error:', error)
    }
  })

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</CardTitle>
        <CardDescription>
          {contact ? 'Update contact information' : 'Create a new contact for your pipeline'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Acme Corp"
              />
            </div>
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
              {mutation.isPending ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}