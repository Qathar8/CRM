import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'
import { useAuth } from '@/hooks/useAuth'

export function useContacts() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

export function useDeals() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          contact:contacts(name, company)
        `)
        .eq('created_by', user.id)
        .order('stage_order', { ascending: true })
      
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

export function usePipelines() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('pipelines')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

export function useDashboardStats() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (!user) return null
      
      const { data: deals, error } = await supabase
        .from('deals')
        .select('*')
        .eq('created_by', user.id)
      
      if (error) throw error
      
      const totalDeals = deals.length
      const wonDeals = deals.filter(deal => deal.status === 'won')
      const lostDeals = deals.filter(deal => deal.status === 'lost')
      const wonValue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)
      
      // Generate chart data for the last 6 months
      const chartData = []
      const now = new Date()
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = date.toLocaleDateString('en-US', { month: 'short' })
        
        const monthDeals = wonDeals.filter(deal => {
          const dealDate = new Date(deal.updated_at)
          return dealDate.getMonth() === date.getMonth() && 
                 dealDate.getFullYear() === date.getFullYear()
        })
        
        chartData.push({
          month: monthName,
          revenue: monthDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
          deals: monthDeals.length
        })
      }
      
      return {
        totalDeals,
        wonValue,
        lostDeals: lostDeals.length,
        chartData
      }
    },
    enabled: !!user,
  })
}