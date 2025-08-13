import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navbar } from '@/components/layout/navbar';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats, useDeals } from '@/lib/queries';
import { exportDealsToExcel } from '@/lib/excel-export';
import { Download, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
export default function DashboardPage() {
    const { data: stats, isLoading } = useDashboardStats();
    const { data: recentDeals = [] } = useDeals();
    const handleExportExcel = async () => {
        try {
            toast.loading('Preparing Excel export...');
            await exportDealsToExcel();
            toast.success('Deals exported to Excel successfully!');
        }
        catch (error) {
            toast.error('Failed to export deals');
        }
    };
    if (isLoading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("div", { className: "text-lg", children: "Loading dashboard..." }) })] }));
    }
    const conversionRate = stats?.totalDeals
        ? ((stats.totalDeals - stats.lostDeals) / stats.totalDeals) * 100
        : 0;
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsxs("div", { className: "flex-1 space-y-4 p-8 pt-6", children: [_jsxs("div", { className: "flex items-center justify-between space-y-2", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Dashboard" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { onClick: handleExportExcel, variant: "outline", children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), "Export Excel"] }), _jsx(Button, { asChild: true, children: _jsxs(Link, { to: "/pipeline", children: [_jsx(TrendingUp, { className: "mr-2 h-4 w-4" }), "View Pipeline"] }) })] })] }), stats && (_jsxs(_Fragment, { children: [_jsx(StatsCards, { totalDeals: stats.totalDeals, wonValue: stats.wonValue, lostDeals: stats.lostDeals, conversionRate: conversionRate }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-7", children: [_jsx(RevenueChart, { data: stats.chartData }), _jsxs(Card, { className: "col-span-3", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Recent Deals" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [recentDeals.slice(0, 5).map((deal) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: deal.title }), _jsx("p", { className: "text-xs text-muted-foreground", children: deal.stage })] }), _jsx("div", { className: "text-sm font-semibold text-green-600", children: new Intl.NumberFormat('en-US', {
                                                                        style: 'currency',
                                                                        currency: 'USD',
                                                                        minimumFractionDigits: 0,
                                                                    }).format(deal.value) })] }, deal.id))), recentDeals.length === 0 && (_jsxs("p", { className: "text-sm text-muted-foreground text-center py-4", children: ["No deals yet. ", _jsx(Link, { to: "/pipeline", className: "text-primary hover:underline", children: "Create your first deal" })] }))] }) })] })] })] }))] })] }));
}
