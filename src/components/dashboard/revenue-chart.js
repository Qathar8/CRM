'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export function RevenueChart({ data }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (_jsxs("div", { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg", children: [_jsx("p", { className: "font-medium text-gray-900", children: label }), _jsxs("p", { className: "text-blue-600", children: ["Revenue: ", formatCurrency(payload[0].value)] }), _jsxs("p", { className: "text-gray-600", children: ["Deals: ", payload[0].payload.deals] })] }));
        }
        return null;
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Revenue by Month" }), _jsx(CardDescription, { children: "Monthly revenue from closed deals" })] }), _jsx(CardContent, { children: _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", className: "opacity-30" }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 12 }, tickLine: { stroke: '#e5e7eb' } }), _jsx(YAxis, { tick: { fontSize: 12 }, tickLine: { stroke: '#e5e7eb' }, tickFormatter: formatCurrency }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Bar, { dataKey: "revenue", fill: "#3b82f6", radius: [4, 4, 0, 0], className: "hover:opacity-80 transition-opacity" })] }) }) }) })] }));
}
