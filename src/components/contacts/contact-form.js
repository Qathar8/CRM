'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
export function ContactForm({ contact, onSuccess }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: contact || {}
    });
    useEffect(() => {
        if (contact) {
            reset(contact);
        }
    }, [contact, reset]);
    const mutation = useMutation({
        mutationFn: async (data) => {
            if (!user)
                throw new Error('User not authenticated');
            if (contact) {
                const { error } = await supabase
                    .from('contacts')
                    .update(data)
                    .eq('id', contact.id);
                if (error)
                    throw error;
            }
            else {
                const { error } = await supabase
                    .from('contacts')
                    .insert([{ ...data, created_by: user.id }]);
                if (error)
                    throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success(contact ? 'Contact updated successfully' : 'Contact created successfully');
            if (!contact)
                reset();
            onSuccess?.();
        },
        onError: (error) => {
            toast.error('Failed to save contact');
            console.error('Contact save error:', error);
        }
    });
    const onSubmit = (data) => {
        mutation.mutate(data);
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: contact ? 'Edit Contact' : 'Add New Contact' }), _jsx(CardDescription, { children: contact ? 'Update contact information' : 'Create a new contact for your pipeline' })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Name *" }), _jsx(Input, { id: "name", ...register('name', { required: 'Name is required' }), placeholder: "John Doe" }), errors.name && (_jsx("p", { className: "text-sm text-red-600", children: errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", ...register('email'), placeholder: "john@example.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "phone", children: "Phone" }), _jsx(Input, { id: "phone", ...register('phone'), placeholder: "+1 (555) 123-4567" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company", children: "Company" }), _jsx(Input, { id: "company", ...register('company'), placeholder: "Acme Corp" })] })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => reset(), children: "Reset" }), _jsx(Button, { type: "submit", disabled: mutation.isPending, children: mutation.isPending ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact' })] })] }) })] }));
}
