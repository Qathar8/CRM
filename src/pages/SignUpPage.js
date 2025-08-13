import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
export default function SignUpPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }
        setLoading(true);
        try {
            const { error } = await signUpWithEmail(email, password, fullName);
            if (error) {
                toast.error(error.message);
            }
            else {
                toast.success('Account created successfully!');
                navigate('/dashboard');
            }
        }
        catch (error) {
            toast.error('An unexpected error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleSignUp = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) {
                toast.error(error.message);
            }
        }
        catch (error) {
            toast.error('An unexpected error occurred');
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx(CardTitle, { className: "text-2xl font-bold", children: "Create your account" }), _jsx(CardDescription, { children: "Get started with your sales pipeline tracker." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs(Button, { type: "button", variant: "outline", className: "w-full", onClick: handleGoogleSignUp, children: [_jsxs("svg", { className: "w-4 h-4 mr-2", viewBox: "0 0 24 24", children: [_jsx("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }), _jsx("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), _jsx("path", { fill: "currentColor", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), _jsx("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }), "Continue with Google"] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("span", { className: "w-full border-t" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-white px-2 text-muted-foreground", children: "Or continue with email" }) })] }), _jsxs("form", { onSubmit: handleSignUp, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", children: "Full name" }), _jsx(Input, { id: "fullName", type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Enter your full name", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email address" }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Create a password", required: true }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(EyeOff, { className: "h-4 w-4" }) : _jsx(Eye, { className: "h-4 w-4" }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirm password" }), _jsx(Input, { id: "confirmPassword", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Confirm your password", required: true })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? 'Creating account...' : 'Create account' })] }), _jsxs("div", { className: "text-center text-sm", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-primary hover:underline", children: "Sign in" })] })] })] }) }));
}
