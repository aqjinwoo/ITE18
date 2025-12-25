'use client'

import { useState, useEffect } from 'react';
import { User, Page } from '../types';
import { LayoutDashboard } from './LayoutDashboard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock,
  QrCode,
  Download,
  Mail,
  Loader2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ticketsApi, Ticket as ApiTicket } from '../services/api';
import { toast } from 'sonner';

interface UserDashboardProps {
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface UserTicket {
  id: number;
  orderId: string;
  eventTitle: string;
  eventImage: string;
  date: string;
  time: string;
  venue: string;
  ticketType: string;
  quantity: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  qrCode: string;
}

// Transform API ticket to UI ticket
const transformTicket = (ticket: ApiTicket): UserTicket => {
  const event = ticket.event;
  const eventDate = event?.date ? new Date(event.date) : new Date();
  const isPast = eventDate < new Date();
  
  return {
    id: ticket.id || 0,
    orderId: `TXR${String(ticket.id || 0).padStart(5, '0')}`,
    eventTitle: event?.title || 'Unknown Event',
    eventImage: event?.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    date: event?.date || '',
    time: event?.time || '00:00',
    venue: event?.venue_name || 'Unknown Venue',
    ticketType: 'General Admission',
    quantity: 1,
    status: isPast ? 'completed' : 'upcoming',
    qrCode: `QR${ticket.id || 0}`,
  };
};

export function UserDashboard({ user, onNavigate, onLogout }: UserDashboardProps) {
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const apiTickets = await ticketsApi.getTickets();
      const transformedTickets = apiTickets.map(transformTicket);
      setTickets(transformedTickets);
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      toast.error('Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingTickets = tickets.filter(t => t.status === 'upcoming');
  const pastTickets = tickets.filter(t => t.status === 'completed');

  const TicketCard = ({ ticket }: { ticket: UserTicket }) => (
    <Card className="border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
          <ImageWithFallback
            src={ticket.eventImage}
            alt={ticket.eventTitle}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3>{ticket.eventTitle}</h3>
                <Badge variant={ticket.status === 'upcoming' ? 'default' : 'secondary'}>
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Order #{ticket.orderId}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm">{new Date(ticket.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm">{new Date(`2000-01-01T${ticket.time}`).toLocaleTimeString('en-PH', { 
                  hour: 'numeric', 
                  minute: '2-digit', 
                  hour12: true 
                })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Venue</p>
                <p className="text-sm">{ticket.venue}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tickets</p>
                <p className="text-sm">{ticket.quantity}x {ticket.ticketType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <LayoutDashboard user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="user-dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your event tickets
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{upcomingTickets.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{tickets.reduce((acc, t) => acc + t.quantity, 0)}</div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Past Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{pastTickets.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : upcomingTickets.length > 0 ? (
              upcomingTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse events and book your tickets
                  </p>
                  <Button 
                    onClick={() => onNavigate('events')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : pastTickets.length > 0 ? (
              pastTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2">No past events</h3>
                  <p className="text-muted-foreground">
                    Your attended events will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </LayoutDashboard>
  );
}