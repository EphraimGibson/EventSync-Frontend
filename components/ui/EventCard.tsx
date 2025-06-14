
import React from 'react';
import { Calendar, MapPin, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/services/api';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            {event.feedbackCount || 0} feedback{(event.feedbackCount || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
