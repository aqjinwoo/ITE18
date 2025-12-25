'use client'

import { useState, useEffect } from 'react';
import { User, Page } from '../types';
import { LayoutDashboard } from './LayoutDashboard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { 
  Plus,
  Search,
  MapPin,
  Edit,
  Trash2,
  Users,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { toast } from 'sonner';
import { venuesApi, Venue } from '../services/api';

interface VenuesPageProps {
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function VenuesPage({ user, onNavigate, onLogout }: VenuesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      setLoading(true);
      const fetchedVenues = await venuesApi.getVenues();
      setVenues(fetchedVenues);
    } catch (error: any) {
      console.error('Error loading venues:', error);
      toast.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue =>
    (venue.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (venue.city?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (venue?: Venue) => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        name: venue.name || '',
        address: venue.address || '',
        city: venue.city || '',
        capacity: (venue.capacity || 0).toString(),
        description: venue.description || ''
      });
    } else {
      setEditingVenue(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        capacity: '',
        description: ''
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    if (editingVenue) {
        await venuesApi.updateVenue(editingVenue.id!, {
          venue_name: formData.name,
          address: formData.address,
          city: formData.city,
          capacity: parseInt(formData.capacity),
          description: formData.description,
        });
      toast.success('Venue updated successfully!');
    } else {
        await venuesApi.createVenue({
          venue_name: formData.name,
          address: formData.address,
          city: formData.city,
          capacity: parseInt(formData.capacity),
          description: formData.description,
        });
      toast.success('Venue created successfully!');
    }
    setDialogOpen(false);
      loadVenues();
    } catch (error: any) {
      console.error('Error saving venue:', error);
      toast.error(error.message || 'Failed to save venue');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this venue?')) {
      return;
    }
    try {
      await venuesApi.deleteVenue(id);
    toast.success('Venue deleted successfully!');
      loadVenues();
    } catch (error: any) {
      console.error('Error deleting venue:', error);
      toast.error(error.message || 'Failed to delete venue');
    }
  };

  return (
    <LayoutDashboard user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="venues">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="mb-2">Venues</h1>
            <p className="text-muted-foreground">
              Manage event venues and locations
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => handleOpenDialog()}
                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Venue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
                <DialogDescription>
                  {editingVenue ? 'Update venue information' : 'Fill in the details to create a new venue'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Venue Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    {editingVenue ? 'Update' : 'Create'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border h-11"
          />
        </div>

        {/* Venues Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <Card 
              key={venue.id} 
              className="border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDialog(venue)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => venue.id && handleDelete(venue.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-1">{venue.name}</h3>
                  <p className="text-sm text-muted-foreground">{venue.address}</p>
                  <p className="text-sm text-muted-foreground">{venue.city}</p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {venue.description}
                </p>

                <div className="flex items-center gap-2 text-sm pt-2 border-t border-border">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Capacity:</span>
                  <span>{(venue.capacity || 0).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {!loading && filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No venues found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or create a new venue
            </p>
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
}