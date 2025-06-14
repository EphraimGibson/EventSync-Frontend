
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, MessageSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SentimentGauge from '@/components/SentimentGauge';
import Navigation from '@/components/Navigation';
import { apiService, Event } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Analytics: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSummary, setEventSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventsData = await apiService.getAllEvents();
        setEvents([{ id: 0, title: 'All Events', description: '', date: '', location: '' }, ...eventsData]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch events.",
          variant: "destructive"
        });
        setEvents([{ id: 0, title: 'All Events', description: '', date: '', location: '' }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  useEffect(() => {
    const fetchEventSummary = async () => {

        try {
          let summary: any;

          if(selectedEvent === 'all' || selectedEvent === '0'){
             summary = await apiService.getAllSummary();
             console.log(summary);
          }
          else {
            summary = await apiService.getEventSummary(Number(selectedEvent));
          }

          if (summary && !summary.isEmpty && summary.Summary?.['Total Feedbacks'] > 0) {
            setEventSummary(summary);
          } else {
            setEventSummary(null);
          }

          console.log('Event Summary:', summary);
        } catch (error) {
          console.error('Failed to fetch event summary:', error);
          setEventSummary(null);
        }
    };
    fetchEventSummary();
  }, [selectedEvent]);

  const getCurrentEvent = () => {
    if (selectedEvent === 'all' || selectedEvent === '0') {
      return { title: 'All Events', date: '', location: '' };
    }
    return events.find(e => e.id?.toString() === selectedEvent) || { title: 'Unknown Event', date: '', location: '' };
  };

  const getOverallSentiment = () => {
    return eventSummary?.Summary?.['Average Feedback Scores']?.["Overall Sentiment Score"] || "0";
  };

  const getAveragePositiveFeedbackScore = () => {
    return eventSummary?.Summary?.['Average Feedback Scores']?.POSITIVE || 0;
  };
  const getAverageNegativeFeedbackScore = () => {
    return eventSummary?.Summary?.['Average Feedback Scores']?.NEGATIVE || 0;
  };
  const getAverageNeutralFeedbackScore = () => {
    return eventSummary?.Summary?.['Average Feedback Scores']?.NEUTRAL || 0;
  };

  const sentimentData = [
    { name: 'Positive', value: getAveragePositiveFeedbackScore(), color: '#10B981' },
    { name: 'Neutral', value: getAverageNeutralFeedbackScore(), color: '#EAB308' },
    { name: 'Negative', value: getAverageNegativeFeedbackScore(), color: '#EF4444' }
  ];

  const hasNoFeedback = !eventSummary || !eventSummary.Summary || eventSummary.Summary['Total Feedbacks'] === 0;

  const handleFeedbackClick = () => {
    if (selectedEvent !== 'all' && selectedEvent !== '0') {
      navigate(`/all-feedback?eventId=${selectedEvent}`);
    } else {
      navigate('/all-feedback');
    }
  };

  const currentEvent = getCurrentEvent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentEvent.title}</h1>
            <p className="text-gray-600 mt-1">Analytics and insights</p>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasNoFeedback ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback available yet</h3>
            <p className="text-gray-600">
              {selectedEvent === 'all' || selectedEvent === '0' 
                ? 'No feedback has been submitted for any events yet.' 
                : 'No feedback has been submitted for this event yet.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Overall Sentiment Card */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Sentiment Scores</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <SentimentGauge sentiment={getOverallSentiment()} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Clickable Total Feedback Card */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-blue-300"
                onClick={handleFeedbackClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                        <ExternalLink className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-3xl font-bold text-green-600">
                        {eventSummary?.Summary?.['Total Feedbacks'] || 0}
                      </p>
                      <p className="text-xs text-blue-600 font-medium mt-1">Click to view all feedback</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Positive</span>
                      <span className="text-sm font-medium text-green-600">
                        {eventSummary?.Summary?.['Percentage of Sentiments']?.POSITIVE || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Neutral</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {eventSummary?.Summary?.['Percentage of Sentiments']?.NEUTRAL || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Negative</span>
                      <span className="text-sm font-medium text-red-600">
                        {eventSummary?.Summary?.['Percentage of Sentiments']?.NEGATIVE || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Details Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {selectedEvent === 'all' || selectedEvent === '0' ? 'Analytics Overview' : 'Event Details'}
                      </p>
                      {selectedEvent !== 'all' && selectedEvent !== '0' && currentEvent.date && (
                        <p className="text-sm text-gray-600 mt-2">
                          Date: {new Date(currentEvent.date).toLocaleDateString()}
                        </p>
                      )}
                      {selectedEvent !== 'all' && selectedEvent !== '0' && currentEvent.location && (
                        <p className="text-sm text-gray-600">
                          Location: {currentEvent.location}
                        </p>
                      )}
                      {(selectedEvent === 'all' || selectedEvent === '0') && (
                        <p className="text-sm text-gray-600 mt-2">
                          Viewing analytics for all events
                        </p>
                      )}
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      {selectedEvent === 'all' || selectedEvent === '0' ? 'All events overview' : 'Event completed'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Score Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
