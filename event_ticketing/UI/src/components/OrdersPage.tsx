'use client'

import { useState, useEffect } from 'react';
import { User, Page } from '../types';
import { LayoutDashboard } from './LayoutDashboard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Eye,
  User as UserIcon,
  Calendar,
  Ticket,
  CreditCard,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { adminPaymentsApi, Payment, Ticket as TicketType } from '../services/api';

interface OrdersPageProps {
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface Order extends Payment {
  order_id?: string;
  customer_name?: string;
  customer_email?: string;
  event_name?: string;
  event_date?: string;
}

export function OrdersPage({ user, onNavigate, onLogout }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
    paid: 0,
    pending: 0,
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (paymentMethodFilter !== 'all') {
        params.payment_method = paymentMethodFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await adminPaymentsApi.getPayments(params);
      const ordersData = (response.data || []).map((payment) => {
        const ticket = payment.ticket as any;
        // Use ticket_id to match user's order ID format: TXR + ticket_id padded to 5 digits
        const ticketId = ticket?.id || ticket?.ticket_id || payment.ticket_id || payment.id;
        return {
          ...payment,
          order_id: `TXR${String(ticketId).padStart(5, '0')}`,
          customer_name: ticket?.user?.username || ticket?.user?.name || 'Unknown',
          customer_email: ticket?.user?.email || '',
          event_name: ticket?.event?.title || ticket?.event?.event_name || 'Unknown Event',
          event_date: ticket?.event?.date || ticket?.event?.event_date || '',
        };
      });
      
      setOrders(ordersData);
      setStats({
        total: response.total || ordersData.length,
        revenue: response.revenue || 0,
        paid: response.paid || 0,
        pending: response.pending || 0,
      });
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      // Use mock data as fallback
      setOrders(getMockOrders());
      setStats({
        total: 156,
        revenue: 1245000,
        paid: 142,
        pending: 14,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, paymentMethodFilter]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.event_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSearch = () => {
    loadOrders();
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500/20">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleExport = () => {
    toast.info('Export feature coming soon!');
  };

  return (
    <LayoutDashboard user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="orders">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Orders Management</h1>
          <p className="text-muted-foreground">
            View and manage all user ticket purchases and orders
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg hover:shadow-primary/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time orders</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.revenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">From completed orders</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Paid Orders
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.paid}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully paid</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:shadow-lg hover:shadow-yellow-500/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Section */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer name, email, or event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-input border-border"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-input border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-input border-border">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="paymaya">PayMaya</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} variant="outline" className="border-border">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Event</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order Date</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Payment</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-primary font-semibold">
                            {order.order_id}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.customer_name}</span>
                            <span className="text-sm text-muted-foreground">{order.customer_email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.event_name}</span>
                            <span className="text-sm text-muted-foreground">{formatDate(order.event_date)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(order.payment_date)}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold">{formatCurrency(order.amount)}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-border/50">
                            {order.payment_method?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(order.status || 'pending')}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Order Details - {selectedOrder?.order_id}
              </DialogTitle>
              <DialogDescription>
                Complete order information and customer details
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6 mt-4">
                {/* Customer Information */}
                <div className="rounded-lg bg-muted/50 border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-medium">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium">{selectedOrder.customer_email}</p>
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                <div className="rounded-lg bg-muted/50 border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Event Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Event Name</p>
                      <p className="font-medium">{selectedOrder.event_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Event Date</p>
                      <p className="font-medium">{formatDate(selectedOrder.event_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="rounded-lg bg-muted/50 border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Ticket Details</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="text-muted-foreground">Ticket ID</span>
                      <span className="font-mono font-semibold">TKT-{String(selectedOrder.ticket_id).padStart(6, '0')}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-semibold">1</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="text-muted-foreground">Unit Price</span>
                      <span className="font-semibold">{formatCurrency(selectedOrder.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="rounded-lg bg-muted/50 border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Payment Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <Badge variant="outline" className="mt-1 border-border/50">
                        {selectedOrder.payment_method?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedOrder.status || 'pending')}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                      <p className="font-mono text-sm font-semibold">TXN-{String(selectedOrder.id).padStart(8, '0')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                      <p className="font-medium">{formatDate(selectedOrder.payment_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(selectedOrder.amount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LayoutDashboard>
  );
}

// Mock data generator for fallback
function getMockOrders(): Order[] {
  const names = [
    'Maria Santos', 'Juan Dela Cruz', 'Ana Garcia', 'Carlos Rodriguez',
    'Maria Clara', 'Jose Rizal', 'Gabriela Silang', 'Andres Bonifacio',
    'Melissa Tan', 'Roberto Cruz', 'Patricia Lim', 'Michael Ong'
  ];
  const events = [
    'Manila Music Festival 2024', 'Tech Summit Manila', 'Art Exhibit Opening',
    'Basketball Championship', 'Jazz Night Live', 'Comedy Show Manila',
    'Food Festival 2024', 'Fashion Week Manila'
  ];
  const methods = ['gcash', 'paymaya', 'credit-card', 'debit-card', 'paypal'];
  const statuses = ['completed', 'pending', 'failed'];

  return Array.from({ length: 20 }, (_, i) => {
    const ticketId = i + 1;
    return {
      id: i + 1,
      payment_id: i + 1,
      ticket_id: ticketId,
      amount: Math.floor(Math.random() * 5000) + 500,
      payment_method: methods[Math.floor(Math.random() * methods.length)],
      payment_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      order_id: `TXR${String(ticketId).padStart(5, '0')}`, // Match user order ID format
      customer_name: names[Math.floor(Math.random() * names.length)],
      customer_email: `customer${i + 1}@example.com`,
      event_name: events[Math.floor(Math.random() * events.length)],
      event_date: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

