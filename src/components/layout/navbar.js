import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, Users, Kanban, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export function Navbar() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOut();
        navigate('/auth/login');
    };
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { name: 'Pipeline', href: '/pipeline', icon: Kanban },
        { name: 'Contacts', href: '/contacts', icon: Users },
    ];
    const isActive = (path) => location.pathname === path;
    return (_jsxs("nav", { className: "bg-white border-b border-gray-200 sticky top-0 z-50", children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsx("div", { className: "flex items-center", children: _jsxs(Link, { to: "/dashboard", className: "flex items-center space-x-2", children: [_jsx(BarChart3, { className: "h-8 w-8 text-blue-600" }), _jsx("span", { className: "text-xl font-bold text-gray-900", children: "SalesPipe" })] }) }), _jsxs("div", { className: "flex items-center space-x-8", children: [_jsx("div", { className: "hidden md:flex space-x-8", children: navigation.map((item) => {
                                        const Icon = item.icon;
                                        return (_jsxs(Link, { to: item.href, className: `inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive(item.href)
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-500 hover:text-gray-700'}`, children: [_jsx(Icon, { className: "h-4 w-4 mr-2" }), item.name] }, item.name));
                                    }) }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", className: "relative h-8 w-8 rounded-full", children: _jsxs(Avatar, { className: "h-8 w-8", children: [_jsx(AvatarImage, { src: user?.user_metadata?.avatar_url }), _jsx(AvatarFallback, { children: user?.email?.charAt(0).toUpperCase() || 'U' })] }) }) }), _jsxs(DropdownMenuContent, { className: "w-56", align: "end", forceMount: true, children: [_jsx("div", { className: "flex items-center justify-start gap-2 p-2", children: _jsxs("div", { className: "flex flex-col space-y-1 leading-none", children: [_jsx("p", { className: "font-medium", children: user?.user_metadata?.full_name || 'User' }), _jsx("p", { className: "w-[200px] truncate text-sm text-gray-500", children: user?.email })] }) }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onClick: handleSignOut, children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Sign out" })] })] })] })] })] }) }), _jsx("div", { className: "md:hidden border-t border-gray-200", children: _jsx("div", { className: "px-2 pt-2 pb-3 space-y-1", children: navigation.map((item) => {
                        const Icon = item.icon;
                        return (_jsx(Link, { to: item.href, className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.href)
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`, children: _jsxs("div", { className: "flex items-center", children: [_jsx(Icon, { className: "h-4 w-4 mr-3" }), item.name] }) }, item.name));
                    }) }) })] }));
}
