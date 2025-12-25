'use client'

import { useState, useEffect } from 'react';
import { User, Page, Event } from '../types';
import { LayoutDashboard } from './LayoutDashboard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  Clock,
  Ticket,
  Filter,
  Loader2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { eventsApi, categoriesApi, Category } from '../services/api';
import { toast } from 'sonner';

interface EventsPageProps {
  user: User | null;
  onNavigate: (page: Page, event?: Event) => void;
  onLogout: () => void;
  onBack?: () => void;
}

// Mock events data (fallback)
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Summer Music Festival 2024',
    description: 'Experience the biggest music festival of the summer featuring top artists from around the world. Three days of non-stop music, food, and entertainment.',
    date: '2024-07-15',
    time: '18:00',
    venue_id: 1,
    venue_name: 'Manila Arena',
    venue_location: 'Manila, Philippines',
    category_id: 1,
    category_name: 'Music',
    image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbCUyMGNyb3dkfGVufDF8fHx8MTc2MzYwODMxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    price: 2650.00,
    available_tickets: 245,
    total_tickets: 500,
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Tech Innovation Summit',
    description: 'Join industry leaders and innovators for a day of inspiring talks, networking, and hands-on workshops about the future of technology.',
    date: '2024-08-20',
    time: '09:00',
    venue_id: 2,
    venue_name: 'SMX Convention Center',
    venue_location: 'Pasay, Philippines',
    category_id: 4,
    category_name: 'Technology',
    image: 'https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NjM1Mjk5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 5890.00,
    available_tickets: 150,
    total_tickets: 300,
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Modern Art Exhibition',
    description: 'Discover contemporary masterpieces from renowned local and international artists in this exclusive exhibition.',
    date: '2024-06-10',
    time: '10:00',
    venue_id: 3,
    venue_name: 'National Museum',
    venue_location: 'Manila, Philippines',
    category_id: 3,
    category_name: 'Arts',
    image: 'https://images.unsplash.com/photo-1719935115623-4857df23f3c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjM1NDUxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 750.00,
    available_tickets: 0,
    total_tickets: 200,
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'Basketball Championship Finals',
    description: 'Witness the most anticipated basketball game of the season as top teams compete for the championship title.',
    date: '2024-09-05',
    time: '19:00',
    venue_id: 4,
    venue_name: 'Mall of Asia Arena',
    venue_location: 'Pasay, Philippines',
    category_id: 2,
    category_name: 'Sports',
    image: 'https://images.unsplash.com/photo-1760508737418-a7add7ee3871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwZXZlbnR8ZW58MXx8fHwxNzYzNTY3MzUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 2210.00,
    available_tickets: 1200,
    total_tickets: 5000,
    status: 'upcoming',
  },
  {
    id: 5,
    title: 'Broadway Musical: The Classics',
    description: 'Experience the magic of Broadway with this spectacular production featuring beloved musical classics performed by a world-class cast.',
    date: '2024-10-12',
    time: '20:00',
    venue_id: 5,
    venue_name: 'Cultural Center of the Philippines',
    venue_location: 'Manila, Philippines',
    category_id: 3,
    category_name: 'Arts',
    image: 'https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2UlMjBzdGFnZXxlbnwxfHx8fDE3NjM1NzE5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 3540.00,
    available_tickets: 89,
    total_tickets: 150,
    status: 'upcoming',
  },
  {
    id: 6,
    title: 'Stand-Up Comedy Night',
    description: 'Get ready for a night of laughter with the country\'s funniest comedians. Featuring special guest performers and surprise acts!',
    date: '2024-07-25',
    time: '21:00',
    venue_id: 6,
    venue_name: 'PETA Theater Center',
    venue_location: 'Quezon City, Philippines',
    category_id: 5,
    category_name: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1760582912320-79fcbc9f309b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzaG93JTIwbmlnaHR8ZW58MXx8fHwxNjM2MDgzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1325.00,
    available_tickets: 56,
    total_tickets: 100,
    status: 'upcoming',
  },
];

export function EventsPage({ user, onNavigate, onLogout, onBack }: EventsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load events and categories on mount
  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      loadEvents();
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery, categoryFilter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('[EventsPage] Loading events with params:', { search: searchQuery, category: categoryFilter });
      const fetchedEvents = await eventsApi.getEvents({
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      });
      console.log('[EventsPage] Fetched events from API:', fetchedEvents);
      // Transform API events to match the expected Event type
      const transformedEvents: Event[] = fetchedEvents.map((apiEvent) => ({
        id: apiEvent.id || apiEvent.event_id || 0,
        title: apiEvent.title || apiEvent.event_name || '',
        description: apiEvent.description || '',
        date: apiEvent.date || apiEvent.event_date || '',
        time: apiEvent.time || apiEvent.event_time || '00:00',
        venue_id: apiEvent.venue_id || 0,
        venue_name: apiEvent.venue_name || '',
        venue_location: apiEvent.venue_location || '',
        category_id: apiEvent.category_id || 0,
        category_name: apiEvent.category_name || '',
        image: apiEvent.image || '',
        price: apiEvent.price || 0,
        available_tickets: apiEvent.available_tickets || 0,
        total_tickets: apiEvent.total_tickets || 0,
        status: apiEvent.status || 'upcoming',
      }));
      console.log('[EventsPage] Transformed events:', transformedEvents);
      setEvents(transformedEvents);
    } catch (error: any) {
      console.error('[EventsPage] Error loading events:', error);
      toast.error('Failed to load events. Using fallback data.');
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const fetchedCategories = await categoriesApi.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
      event.category_name?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return null;
  }

  return (
    <LayoutDashboard user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="events" onBack={onBack}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Discover Events</h1>
            <p className="text-muted-foreground">
              Find and book tickets for amazing events near you
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button 
              onClick={() => onNavigate('create-event')}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border h-11"
            />
          </div>
          <div className="sm:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-input border-border h-11">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name?.toLowerCase() || ''}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id} 
              className="border-border/50 bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all cursor-pointer group"
              onClick={() => onNavigate('event-details', event)}
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                    {event.category_name}
                  </Badge>
                </div>
                {event.available_tickets === 0 && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-lg px-4 py-2 bg-destructive rounded-lg">SOLD OUT</span>
                  </div>
                )}
              </div>
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="mb-2 line-clamp-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-PH', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.venue_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ticket className="w-4 h-4" />
                    <span>{event.available_tickets} / {event.total_tickets} available</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="text-xl text-primary">₱{event.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <Button 
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      onNavigate('event-details', event);
                    }}
                    disabled={event.available_tickets === 0}
                    className="bg-primary hover:bg-primary/90"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
}