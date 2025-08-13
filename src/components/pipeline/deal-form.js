'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
export function DealForm({ deal, onSuccess, defaultStage }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: deal || { stage: defaultStage || 'prospecting', priority: 'medium' }
    });
    // Fetch contacts for the dropdown
    const { data: contacts = [] } = useQuery({
        queryKey: ['contacts'],
        queryFn: async () => {
            if (!user)
                return [];
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('created_by', user.id)
                .order('name');
            if (error)
                throw error;
            return data;
        },
        enabled: !!user
    });
    // Fetch pipelines to get stages
    const { data: pipelines = [] } = useQuery({
        queryKey: ['pipelines'],
        queryFn: async () => {
            if (!user)
                return [];
            const { data, error } = await supabase
                .from('pipelines')
                .select('*')
                .eq('created_by', user.id);
            if (error)
                throw error;
            return data;
        },
        enabled: !!user
    });
    const stages = pipelines[0]?.stages || [
        { id: 'prospecting', name: 'Prospecting' },
        { id: 'qualification', name: 'Qualification' },
        { id: 'proposal', name: 'Proposal' },
        { id: 'negotiation', name: 'Negotiation' },
        { id: 'closed', name: 'Closed' }
    ];
    useEffect(() => {
        if (deal) {
            reset({
                ...deal,
                expected_close_date: deal.expected_close_date ? new Date(deal.expected_close_date).toISOString().split('T')[0] : ''
            });
        }
    }, [deal, reset]);
    const mutation = useMutation({
        mutationFn: async (data) => {
            if (!user)
                throw new Error('User not authenticated');
            const dealData = {
                ...data,
                value: Number(data.value),
                expected_close_date: data.expected_close_date || null,
                pipeline_id: pipelines[0]?.id
            };
            if (deal) {
                const { error } = await supabase
                    .from('deals')
                    .update(dealData)
                    .eq('id', deal.id);
                if (error)
                    throw error;
            }
            else {
                const { error } = await supabase
                    .from('deals')
                    .insert([{ ...dealData, created_by: user.id }]);
                if (error)
                    throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            toast.success(deal ? 'Deal updated successfully' : 'Deal created successfully');
            if (!deal)
                reset();
            onSuccess?.();
        },
        onError: (error) => {
            toast.error('Failed to save deal');
            console.error('Deal save error:', error);
        }
    });
    const onSubmit = (data) => {
        mutation.mutate(data);
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: deal ? 'Edit Deal' : 'Add New Deal' }), _jsx(CardDescription, { children: deal ? 'Update deal information' : 'Create a new deal for your pipeline' })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "title", children: "Deal Title *" }), _jsx(Input, { id: "title", ...register('title', { required: 'Title is required' }), placeholder: "Enterprise Software License" }), errors.title && (_jsx("p", { className: "text-sm text-red-600", children: errors.title.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "value", children: "Deal Value ($)" }), _jsx(Input, { id: "value", type: "number", step: "0.01", ...register('value', { valueAsNumber: true }), placeholder: "50000" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "stage", children: "Stage" }), _jsxs(Select, { value: watch('stage'), onValueChange: (value) => setValue('stage', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select stage" }) }), _jsx(SelectContent, { children: stages.map((stage) => (_jsx(SelectItem, { value: stage.id, children: stage.name }, stage.id))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "priority", children: "Priority" }), _jsxs(Select, { value: watch('priority'), onValueChange: (value) => setValue('priority', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select priority" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Low" }), _jsx(SelectItem, { value: "medium", children: "Medium" }), _jsx(SelectItem, { value: "high", children: "High" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "contact_id", children: "Contact" }), _jsxs(Select, { value: watch('contact_id') || '', onValueChange: (value) => setValue('contact_id', value || undefined), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select contact" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "No contact" }), contacts.map((contact) => (_jsxs(SelectItem, { value: contact.id, children: [contact.name, " ", contact.company && `(${contact.company})`] }, contact.id)))] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "expected_close_date", children: "Expected Close Date" }), _jsx(Input, { id: "expected_close_date", type: "date", ...register('expected_close_date') })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "notes", children: "Notes" }), _jsx(Textarea, { id: "notes", ...register('notes'), placeholder: "Additional notes about this deal...", rows: 3 })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => reset(), children: "Reset" }), _jsx(Button, { type: "submit", disabled: mutation.isPending, children: mutation.isPending ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal' })] })] }) })] }));
}
