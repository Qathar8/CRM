import { Navbar } from '@/components/layout/navbar'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardStats, useDeals } from '@/lib/queries'
import { exportDealsToExcel } from '@/lib/excel-export'
import { Download, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()
  const { data: recentDeals = [] } = useDeals()

  const handleExportExcel = async () => {
    try {
      toast.loading('Preparing Excel export...')
      await exportDealsToExcel()
      toast.success('Deals exported to Excel successfully!')
    } catch (error) {
      toast.error('Failed to export deals')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  const conversionRate = stats?.totalDeals 
    ? ((stats.totalDeals - stats.lostDeals) / stats.totalDeals) * 100
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleExportExcel} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button asChild>
              <Link to="/pipeline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Pipeline
              </Link>
            </Button>
          </div>
        </div>
        
        {stats && (
          <>
            <StatsCards
              totalDeals={stats.totalDeals}
              wonValue={stats.wonValue}
              lostDeals={stats.lostDeals}
              conversionRate={conversionRate}
            />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <RevenueChart data={stats.chartData} />
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentDeals.slice(0, 5).map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{deal.title}</p>
                          <p className="text-xs text-muted-foreground">{deal.stage}</p>
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                          }).format(deal.value)}
                        </div>
                      </div>
                    ))}
                    {recentDeals.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No deals yet. <Link to="/pipeline" className="text-primary hover:underline">Create your first deal</Link>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}