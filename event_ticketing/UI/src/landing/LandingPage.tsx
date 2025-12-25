'use client'

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Ticket,
  Calendar,
  Shield,
  Zap,
  Star,
  Music,
  Trophy,
  Palette,
  Cpu,
  Film,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Mail,
  MapPin,
  Clock,
  Users
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Logo } from '../components/Logo';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  const featuredEvents = [
    {
      id: 1,
      title: 'Summer Music Festival 2024',
      image: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbCUyMGNyb3dkfGVufDF8fHx8MTc2MzYwODMxOHww&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'July 15, 2024',
      location: 'Manila Arena',
      price: 2650,
      category: 'Music'
    },
    {
      id: 2,
      title: 'Tech Innovation Summit',
      image: 'https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NjM1Mjk5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'August 20, 2024',
      location: 'SMX Convention Center',
      price: 5890,
      category: 'Technology'
    },
    {
      id: 3,
      title: 'Basketball Championship Finals',
      image: 'https://images.unsplash.com/photo-1760508737418-a7add7ee3871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwZXZlbnR8ZW58MXx8fHwxNzYzNTY3MzUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'September 5, 2024',
      location: 'Mall of Asia Arena',
      price: 2210,
      category: 'Sports'
    }
  ];

  const categories = [
    { icon: Music, name: 'Music', count: 24, color: 'text-pink-500' },
    { icon: Trophy, name: 'Sports', count: 18, color: 'text-orange-500' },
    { icon: Palette, name: 'Arts', count: 12, color: 'text-purple-500' },
    { icon: Cpu, name: 'Technology', count: 8, color: 'text-blue-500' },
    { icon: Film, name: 'Entertainment', count: 15, color: 'text-green-500' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book tickets in seconds with our streamlined checkout process'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-grade security encryption'
    },
    {
      icon: Smartphone,
      title: 'Mobile Tickets',
      description: 'Get instant e-tickets delivered to your email and mobile'
    },
    {
      icon: Star,
      title: 'Best Selection',
      description: 'Discover thousands of events from concerts to conferences'
    }
  ];

  const paymentMethods = [
    { name: 'Credit Card', icon: CreditCard },
    { name: 'Debit Card', icon: CreditCard },
    { name: 'GCash', icon: Smartphone },
    { name: 'PayPal', icon: Mail },
    { name: 'PayMaya', icon: Smartphone }
  ];



  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="md" />

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Events
              </a>
              <a href="#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                onClick={onNavigateToLogin}
                className="text-sm bg-primary hover:bg-primary/90"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  🇵🇭 Philippine's Premier Ticketing Platform
                </Badge>
                <h1 className="text-5xl lg:text-7xl">
                  <span className="text-white">Book Your Next</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                    Experience
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Discover and book tickets to the hottest events in the Philippines. 
                  From concerts to conferences, we've got you covered.
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card className="border-border/50 overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbCUyMGNyb3dkfGVufDF8fHx8MTc2MzYwODMxOHww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Concert"
                      className="w-full h-48 object-cover"
                    />
                  </Card>
                  <Card className="border-border/50 overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1760508737418-a7add7ee3871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwZXZlbnR8ZW58MXx8fHwxNzYzNTY3MzUwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Sports"
                      className="w-full h-48 object-cover"
                    />
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="border-border/50 overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMHByZXNlbnRhdGlvbnxlbnwxfHx8fDE3NjM1Mjk5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Tech"
                      className="w-full h-48 object-cover"
                    />
                  </Card>
                  <Card className="border-border/50 overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2UlMjBzdGFnZXxlbnwxfHx8fDE3NjM1NzE5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Theater"
                      className="w-full h-48 object-cover"
                    />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events U Can't Miss */}
      <section id="events" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Events U Can't Miss</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the hottest events happening now
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="border-border/50 overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm">
                    {event.category}
                  </Badge>
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="line-clamp-2">{event.title}</h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting from</p>
                      <p className="text-xl text-primary">
                        ₱{event.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Button
                      onClick={onNavigateToRegister}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Browse by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find events that match your interests
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={index}
                  className="border-border/50 p-6 text-center hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={onNavigateToRegister}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${category.color}`} />
                  </div>
                  <h3 className="mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} Events</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book tickets in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/50 p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm">
                1
              </div>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Browse Events</h3>
              <p className="text-muted-foreground">
                Discover thousands of events across the Philippines
              </p>
            </Card>

            <Card className="border-border/50 p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Secure Payment</h3>
              <p className="text-muted-foreground">
                Choose from multiple payment methods and checkout safely
              </p>
            </Card>

            <Card className="border-border/50 p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm">
                3
              </div>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Ticket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-3">Get Your Ticket</h3>
              <p className="text-muted-foreground">
                Receive instant e-tickets delivered to your email
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose Tixaro?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The best ticketing experience in the Philippines
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Payment Methods */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-6">We accept</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{method.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Logo size="md" />
              <p className="text-sm text-muted-foreground">
                Your trusted partner for event ticketing in the Philippines
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#events" className="hover:text-foreground transition-colors">Events</a></li>
                <li><a href="#categories" className="hover:text-foreground transition-colors">Categories</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Venues</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4">Get in Touch</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@tixaro.ph</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Manila, Philippines</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2024 Tixaro. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}