"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Car,
  MapPin,
  Bike,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <span className="text-sm font-medium">Verifying Session...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Bookings', href: '/bookings', icon: CalendarCheck, badge: 'LIVE' },
    { name: 'Drivers', href: '/drivers', icon: Users },
    { name: 'Fleet Vehicles', href: '/vehicles', icon: Car },
    { name: 'Tour Packages', href: '/tours', icon: MapPin },
    { name: 'Two Wheeler Rentals', href: '/rentals', icon: Bike },
    { name: 'Website Settings', href: '/settings', icon: Settings },
  ];

  const currentPage = navItems.find((i) => i.href === pathname) || { name: 'Admin Dashboard' };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900/90 border-r border-zinc-800/80 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-800/80">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/25">
              U
            </div>
            <div>
              <span className="text-lg font-black tracking-tight block leading-none">UDAN CABS</span>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mt-1">
                Admin Center
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">
            Operational Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-red-600/15 text-red-500 border border-red-600/30 shadow-md shadow-red-950/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`transition-colors ${isActive ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-800/40 border border-zinc-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-zinc-200 truncate">{user?.email || 'Admin User'}</p>
                <p className="text-[10px] font-semibold text-red-500 uppercase">{user?.role || 'SUPER_ADMIN'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-zinc-900/60 border-b border-zinc-800/80 backdrop-blur-xl flex items-center justify-between px-6 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <span>Admin</span>
              <ChevronRight size={14} className="text-zinc-600" />
              <span className="font-bold text-zinc-100">{currentPage.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-800 text-xs text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Ujjain Dispatch Online</span>
            </div>
            <div className="relative">
              <button className="p-2.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800/80 border border-zinc-800/60 transition-colors">
                <Bell size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-zinc-950">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
