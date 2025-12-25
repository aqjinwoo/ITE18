'use client'

import { User, Page, Event } from '../types';
import { LayoutDashboard } from './LayoutDashboard';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  MapPin, 
  Clock,
  Ticket,
  ArrowLeft,
  Share2,
  Users,
  Trash2,
  Edit
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { eventsApi } from '../services/api';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface EventDetailsPageProps {
  event: Event;
  user: User;
  onNavigate: (page: Page, event?: Event) => void;
  onLogout: () => void;
}

export function EventDetailsPage({ event, user, onNavigate, onLogout }: EventDetailsPageProps) {
  const ticketPercentage = ((event.total_tickets - event.available_tickets) / event.total_tickets) * 100;
  const isAdmin = user?.role === 'admin';
  const [deleting, setDeleting] = useState(false);

  const handleDeleteEvent = async () => {
    try {
      setDeleting(true);
      await eventsApi.deleteEvent(event.id);
      toast.success('Event deleted successfully');
      onNavigate('events');
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <LayoutDashboard user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="event-details">
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => onNavigate('events')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>

        {/* Event Image */}
        <div className="relative h-96 rounded-xl overflow-hidden">
          <ImageWithFallback
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm mb-3">
                  {event.category_name}
                </Badge>
                <h1 className="mb-2">{event.title}</h1>
                <p className="text-muted-foreground">
                  {event.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p>{new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-PH', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p>{event.venue_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Organizer</p>
                      <p>Tixaro Events</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="mb-4">About This Event</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    {event.description}
                  </p>
                  <p>
                    Join us for an unforgettable experience! This event promises to bring together 
                    enthusiasts from all walks of life for a memorable celebration.
                  </p>
                  <p>
                    Don't miss out on this incredible opportunity to be part of something special. 
                    Tickets are selling fast, so secure your spot today!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-6">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Starting from</p>
                  <p className="text-4xl text-primary">₱{event.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                {/* Ticket Availability */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Availability</span>
                    <span className={event.available_tickets === 0 ? 'text-destructive' : 'text-primary'}>
                      {event.available_tickets} / {event.total_tickets}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        event.available_tickets === 0 
                          ? 'bg-destructive' 
                          : ticketPercentage > 80 
                          ? 'bg-yellow-500' 
                          : 'bg-primary'
                      }`}
                      style={{ width: `${ticketPercentage}%` }}
                    />
                  </div>
                  {event.available_tickets > 0 && event.available_tickets < 50 && (
                    <p className="text-xs text-yellow-500">
                      ⚠️ Only {event.available_tickets} tickets left!
                    </p>
                  )}
                </div>

                {/* Admin Actions - Only show for admin */}
                {isAdmin ? (
                  <div className="space-y-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive"
                          className="w-full"
                          disabled={deleting}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleting ? 'Deleting...' : 'Delete Event'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{event.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-xs text-center text-muted-foreground">
                      Admin users cannot purchase tickets
                    </p>
                  </div>
                ) : (
                  /* User Actions - Only show for regular users */
                  <>
                    {event.available_tickets === 0 ? (
                      <Button 
                        disabled
                        className="w-full"
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        Sold Out
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => onNavigate('ticket-purchase', event)}
                        className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        Get Tickets
                      </Button>
                    )}
                  </>
                )}

                {/* Additional Info */}
                <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>E-ticket delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}