
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, MessageSquare, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SentimentGauge from '@/components/SentimentGauge';
import Navigation from '@/components/Navigation';
import { apiService, Event } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const EventAnalytics: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventSummary, setEventSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);
        // Grab all the events so we can find the one we're looking for
        const events = await apiService.getAllEvents();
        const event = events.find(e => e.id?.toString() === eventId);
        setCurrentEvent(event || null);

        // Now let's get all the juicy details about this event
        const summary = await apiService.getEventSummary(Number(eventId));
        setEventSummary(summary);
      } catch (error) {
        console.error('Error fetching event data:', error);
        setCurrentEvent(null);
        setEventSummary(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, toast]);

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
    navigate(`/all-feedback?eventId=${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No feedback for this event</h1>
            <Link to="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* The top part with the title and stuff */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/events">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{currentEvent.title}</h1>
            <p className="text-gray-600 mt-1">Event analytics and insights</p>
          </div>
        </div>

        {hasNoFeedback ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback for this event yet</h3>
            <p className="text-gray-600">Kindly submit feedback</p>
          </div>
        ) : (
          <>
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
              {/* Click me! I'll show you all the feedback people left */}
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


              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Event Details</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Date: {new Date(currentEvent.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Location: {currentEvent.location}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Event completed</span>
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

export default EventAnalytics;
