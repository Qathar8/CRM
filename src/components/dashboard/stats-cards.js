import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
export function StatsCards({ totalDeals, wonDealsValue, lostDealsCount, conversionRate }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    const formatPercentage = (value) => {
        return `${value.toFixed(1)}%`;
    };
    const stats = [
        {
            title: 'Total Deals',
            value: totalDeals.toString(),
            icon: Target,
            description: 'Active deals in pipeline',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Won Deals Value',
            value: formatCurrency(wonDealsValue),
            icon: DollarSign,
            description: 'Total revenue from won deals',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Lost Deals',
            value: lostDealsCount.toString(),
            icon: TrendingDown,
            description: 'Deals marked as lost',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            title: 'Conversion Rate',
            value: formatPercentage(conversionRate),
            icon: TrendingUp,
            description: 'Percentage of won deals',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((stat) => {
            const Icon = stat.icon;
            return (_jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: stat.title }), _jsx("div", { className: `p-2 rounded-lg ${stat.bgColor}`, children: _jsx(Icon, { className: `h-4 w-4 ${stat.color}` }) })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: stat.value }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: stat.description })] })] }, stat.title));
        }) }));
}
