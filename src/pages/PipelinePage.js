import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { PipelineBoard } from '@/components/pipeline/pipeline-board';
import { DealForm } from '@/components/pipeline/deal-form';
import { Button } from '@/components/ui/button';
import { usePipelines } from '@/lib/queries';
import { Plus, Download } from 'lucide-react';
import { exportDealsToExcel } from '@/lib/excel-export';
import { toast } from 'sonner';
export default function PipelinePage() {
    const { data: pipelines = [], isLoading } = usePipelines();
    const [isDealFormOpen, setIsDealFormOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState(null);
    const defaultPipeline = pipelines[0]; // Use first pipeline as default
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
    const handleCreateDeal = () => {
        setEditingDeal(null);
        setIsDealFormOpen(true);
    };
    const handleEditDeal = (deal) => {
        setEditingDeal(deal);
        setIsDealFormOpen(true);
    };
    const handleCloseDealForm = () => {
        setIsDealFormOpen(false);
        setEditingDeal(null);
    };
    if (isLoading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex items-center justify-center h-96", children: _jsx("div", { className: "text-lg", children: "Loading pipeline..." }) })] }));
    }
    if (!defaultPipeline) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex items-center justify-center h-96", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "No Pipeline Found" }), _jsx("p", { className: "text-muted-foreground", children: "A default pipeline will be created automatically." })] }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, {}), _jsxs("div", { className: "flex-1 space-y-4 p-8 pt-6", children: [_jsxs("div", { className: "flex items-center justify-between space-y-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: defaultPipeline.name }), _jsx("p", { className: "text-muted-foreground", children: defaultPipeline.description })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { onClick: handleExportExcel, variant: "outline", children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), "Export Excel"] }), _jsxs(Button, { onClick: handleCreateDeal, children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add Deal"] })] })] }), _jsx(PipelineBoard, { pipelineId: defaultPipeline.id, stages: defaultPipeline.stages, onCreateDeal: handleCreateDeal, onEditDeal: handleEditDeal }), _jsx(DealForm, { isOpen: isDealFormOpen, onClose: handleCloseDealForm, deal: editingDeal, pipelineId: defaultPipeline.id })] })] }));
}
