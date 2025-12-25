'use client'

import { useState, useEffect } from 'react';
import { User, Page } from '../types';
import { LayoutDashboard } from './LayoutDashboard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Calendar, 
  Ticket, 
  Users, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { dashboardApi, DashboardStats } from '../services/api';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onBack?: () => void;
}

// Mock data
const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 18600 },
  { month: 'Mar', revenue: 22100 },
  { month: 'Apr', revenue: 19800 },
  { month: 'May', revenue: 26500 },
  { month: 'Jun', revenue: 31200 },
];

const ticketSalesData = [
  { month: 'Jan', sales: 245 },
  { month: 'Feb', sales: 398 },
  { month: 'Mar', sales: 512 },
  { month: 'Apr', sales: 467 },
  { month: 'May', sales: 689 },
  { month: 'Jun', sales: 823 },
];

const categoryData = [
  { name: 'Music', value: 450, color: '#0ea5e9' },
  { name: 'Sports', value: 320, color: '#06b6d4' },
  { name: 'Arts', value: 180, color: '#8b5cf6' },
  { name: 'Tech', value: 240, color: '#ec4899' },
];

const recentEvents = [
  { id: 1, name: 'Summer Music Festival 2024', date: '2024-07-15', sales: 245, revenue: 360500, status: 'active' },
  { id: 2, name: 'Tech Conference 2024', date: '2024-06-22', sales: 189, revenue: 556710, status: 'active' },
  { id: 3, name: 'Art Exhibition Opening', date: '2024-06-10', sales: 156, revenue: 117000, status: 'completed' },
  { id: 4, name: 'Football Championship', date: '2024-08-05', sales: 512, revenue: 1131520, status: 'active' },
  { id: 5, name: 'Jazz Night Live', date: '2024-05-28', sales: 98, revenue: 129850, status: 'completed' },
];

export function AdminDashboard({ user, onNavigate, onLogout, onBack }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await dashboardApi.getStats();
      setStats(dashboardStats);
    } catch (error: any) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutDashboard user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="admin-dashboard" onBack={onBack}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name || user.username || user.admin_name}! Here's what's happening with your events.
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl mb-2">₱{stats?.total_revenue?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
              <div className="flex items-center gap-1 text-sm text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                  <span>Revenue from all events</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Tickets Sold</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-cyan-500" />
              </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl mb-2">{stats?.total_tickets?.toLocaleString() || '0'}</div>
              <div className="flex items-center gap-1 text-sm text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                  <span>Total tickets purchased</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Events</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl mb-2">{stats?.active_events?.toLocaleString() || '0'}</div>
                <div className="flex items-center gap-1 text-sm text-emerald-500">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>{stats?.upcoming_events || 0} upcoming</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-pink-500" />
              </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl mb-2">{stats?.total_users?.toLocaleString() || '0'}</div>
              <div className="flex items-center gap-1 text-sm text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                  <span>Registered users</span>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111118', 
                      border: '1px solid #1e1e2e',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    dot={{ fill: '#0ea5e9', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ticket Sales Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Ticket Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111118', 
                      border: '1px solid #1e1e2e',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }} 
                  />
                  <Bar dataKey="sales" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Distribution & Recent Events */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Category Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#111118', 
                      border: '1px solid #1e1e2e',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{cat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events Table */}
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm">{event.sales} tickets</p>
                        <p className="text-xs text-muted-foreground">₱{event.revenue.toLocaleString('en-PH')}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        event.status === 'active' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {event.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutDashboard>
  );
}