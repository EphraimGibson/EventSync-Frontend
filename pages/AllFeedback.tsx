
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, User, Calendar, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { apiService, Event, Feedback } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AllFeedback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId');

  const [selectedEvent, setSelectedEvent] = useState(initialEventId || 'all');
  const [events, setEvents] = useState<Event[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent && selectedEvent !== 'all') {
      fetchFeedback(Number(selectedEvent));
    } else {
      setFeedbackList([]);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const eventsData = await apiService.getAllEvents();
      setEvents([
        { id: 'all', title: 'All Events', description: '', date: '', location: '' },
        ...eventsData
      ]);
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

  const fetchFeedback = async (eventId: number) => {
    try {
      setIsLoading(true);
      const feedback = await apiService.getEventFeedback(eventId);
      setFeedbackList(feedback);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch feedback.",
        variant: "destructive"
      });
      setFeedbackList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string = 'neutral') => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedEventTitle = events.find(event => event.id?.toString() === selectedEvent)?.title || 'Select an event';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/analytics" 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Analytics
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Feedback</h1>
              <p className="text-gray-600 mt-1">
                {selectedEvent === 'all' ? 'Select an event to view feedback' : `Feedback for ${selectedEventTitle}`}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="all">Select an event...</option>
              {events.filter(event => event.id !== 'all').map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Loading feedback...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && selectedEvent === 'all' && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Event</h3>
            <p className="text-gray-500">Choose an event from the dropdown to view its feedback.</p>
          </div>
        )}

        {/* No Feedback State */}
        {!isLoading && selectedEvent !== 'all' && feedbackList.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-500">No feedback has been submitted for this event yet.</p>
          </div>
        )}

        {/* Feedback Cards */}
        {!isLoading && feedbackList.length > 0 && (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-4">
              Showing {feedbackList.length} feedback{feedbackList.length !== 1 ? 's' : ''}
            </div>

            {feedbackList.map((feedback) => (
              <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <CardTitle className="text-lg">
                          {feedback.name || 'Anonymous'}
                        </CardTitle>
                        {feedback.email && (
                          <p className="text-sm text-gray-500">{feedback.email}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getSentimentColor('neutral')}>
                      Feedback
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">{feedback.content}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted recently</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFeedback;
