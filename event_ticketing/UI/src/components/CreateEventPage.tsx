'use client'

import { useState, useEffect, useRef } from 'react';
import { User, Page } from '../types';
import { LayoutDashboard } from './LayoutDashboard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar, MapPin, Tag, Ticket, Image as ImageIcon, ArrowLeft, Loader2, Upload, X, Link } from 'lucide-react';
import { toast } from 'sonner';
import { eventsApi, venuesApi, categoriesApi, Venue, Category } from '../services/api';

interface CreateEventPageProps {
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function CreateEventPage({ user, onNavigate, onLogout }: CreateEventPageProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue_id: '',
    category_id: '',
    total_tickets: '',
    price: '',
    image_url: '',
    status: 'upcoming'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadVenuesAndCategories();
  }, []);

  const loadVenuesAndCategories = async () => {
    try {
      setLoadingData(true);
      const [venuesData, categoriesData] = await Promise.all([
        venuesApi.getVenues(),
        categoriesApi.getCategories(),
      ]);
      setVenues(venuesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading venues/categories:', error);
      toast.error('Failed to load venues and categories');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await eventsApi.createEvent({
        event_name: formData.title,
        description: formData.description,
        event_date: formData.date,
        event_time: formData.time || '00:00',
        venue_id: parseInt(formData.venue_id),
        category_id: parseInt(formData.category_id),
        total_tickets: formData.total_tickets ? parseInt(formData.total_tickets) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        image: imageFile,
        image_url: imageMode === 'url' ? formData.image_url : undefined,
        status: formData.status,
      });
      
    toast.success('Event created successfully!');
    onNavigate('events');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <LayoutDashboard user={user} onNavigate={onNavigate} onLogout={onLogout} currentPage="create-event">
      <div className="space-y-8 max-w-4xl">
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
          <h1 className="mb-2">Create New Event</h1>
          <p className="text-muted-foreground">
            Fill in the details to create a new event
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Music Festival 2024"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="bg-input border-border"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="bg-input border-border min-h-32"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="bg-input border-border pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="bg-input border-border"
                    required
                  />
                </div>
              </div>

              {/* Venue and Category */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <Select value={formData.venue_id} onValueChange={(value) => handleChange('venue_id', value)}>
                    <SelectTrigger className="bg-input border-border">
                      <MapPin className="w-4 h-4 mr-2" />
                      <SelectValue placeholder={loadingData ? "Loading..." : "Select venue"} />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id?.toString() || ''}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleChange('category_id', value)}>
                    <SelectTrigger className="bg-input border-border">
                      <Tag className="w-4 h-4 mr-2" />
                      <SelectValue placeholder={loadingData ? "Loading..." : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id?.toString() || ''}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tickets and Price */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="total_tickets">Total Tickets *</Label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="total_tickets"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.total_tickets}
                      onChange={(e) => handleChange('total_tickets', e.target.value)}
                      className="bg-input border-border pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₱) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 2650.00"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="bg-input border-border"
                    required
                  />
                </div>
              </div>

              {/* Image Upload/URL */}
              <div className="space-y-4">
                <Label>Event Image</Label>
                
                {/* Toggle between upload and URL */}
                <div className="flex gap-2 mb-3">
                  <Button
                    type="button"
                    variant={imageMode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setImageMode('upload');
                      setFormData(prev => ({ ...prev, image_url: '' }));
                    }}
                    className={imageMode === 'upload' ? 'bg-primary' : ''}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={imageMode === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setImageMode('url');
                      handleRemoveImage();
                    }}
                    className={imageMode === 'url' ? 'bg-primary' : ''}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Image URL
                  </Button>
                </div>

                {imageMode === 'upload' ? (
                  <div className="space-y-3">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {/* Upload area */}
                    {!imagePreview ? (
                      <div
                        onClick={handleBrowseClick}
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                      >
                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">Click to upload an image</p>
                        <p className="text-xs text-muted-foreground">
                          JPEG, PNG, GIF or WebP (max 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          {imageFile?.name} ({(imageFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="image_url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => handleChange('image_url', e.target.value)}
                      className="bg-input border-border pl-10"
                    />
                    {formData.image_url && (
                      <div className="mt-3">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  If no image is provided, a default category image will be used.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading || loadingData}
                  className="flex-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => onNavigate('events')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </LayoutDashboard>
  );
}