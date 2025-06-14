
import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import EventCard from '@/components/EventCard';
import EventSkeleton from '@/components/EventSkeleton';
import Navigation from '@/components/Navigation';
import { apiService, Event } from '@/services/api';

const Events: React.FC = () => {
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventsData = await apiService.getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch events.",
          variant: "destructive"
        });

      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEventClick = (eventId: string | number | undefined) => {
    if (eventId) {
      navigate(`/event-analytics/${eventId}`);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      const eventData: Event = {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        location: newEvent.location
      };

      const createdEvent = await apiService.createEvent(eventData);
      setEvents([createdEvent, ...events]);
      setNewEvent({ title: '', description: '', date: '', location: '' });
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Event created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600 mt-1">Manage and track your events</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Enter event location"
                  />
                </div>
                <Button onClick={handleCreateEvent} className="w-full" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">0</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} onClick={() => handleEventClick(event.id)} className="cursor-pointer">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms.' : 'Create your first event to get started.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
