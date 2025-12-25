'use client'

import { useState } from 'react';
import { User, Page, Event } from '../types';
import { LayoutDashboard } from './LayoutDashboard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  ArrowLeft,
  Plus,
  Minus,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TicketPurchasePageProps {
  event: Event;
  user: User;
  onNavigate: (page: Page, event?: Event) => void;
  onLogout: () => void;
}

export function TicketPurchasePage({ event, user, onNavigate, onLogout }: TicketPurchasePageProps) {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState('');

  const subtotal = event.price * ticketQuantity;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + serviceFee;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = ticketQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= Math.min(event.available_tickets, 10)) {
      setTicketQuantity(newQuantity);
    }
  };

  const handleCheckout = () => {
    // Store purchase data for payment page
    localStorage.setItem('purchase_quantity', ticketQuantity.toString());
    localStorage.setItem('purchase_event_id', event.id?.toString() || '');
    onNavigate('payment', event);
  };

  return (
    <LayoutDashboard user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="ticket-purchase">
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => onNavigate('event-details', event)}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Event
          </Button>
          <h1 className="mb-2">Purchase Tickets</h1>
          <p className="text-muted-foreground">
            Select your tickets and proceed to checkout
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Event Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info Card */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3>{event.title}</h3>
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
                      <span>{event.venue_name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Selection Card */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Select Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Admission */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      <span>General Admission</span>
                    </div>
                    <p className="text-2xl text-primary">₱{event.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.available_tickets} tickets available
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={ticketQuantity <= 1}
                      className="h-10 w-10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl w-8 text-center">{ticketQuantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={ticketQuantity >= Math.min(event.available_tickets, 10)}
                      className="h-10 w-10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <Label htmlFor="promo">Have a promo code?</Label>
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-input border-border"
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="mb-4">Important Information</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>All ticket sales are final. No refunds or exchanges.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Tickets will be sent to your registered email address.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Please arrive at least 30 minutes before the event starts.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p>Valid ID is required for entry. Digital tickets must be shown on mobile device.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Tickets ({ticketQuantity}x)
                    </span>
                    <span>₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>₱{serviceFee.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span className="text-2xl text-primary">₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>

                <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <span>PCI compliant payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <span>Money back guarantee</span>
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