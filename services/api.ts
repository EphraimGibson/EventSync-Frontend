
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Event {
  id?: string | number;
  title: string;
  description: string;
  date: string;
  location: string;
  feedbackCount?: number
}

export interface Feedback {
  id?: number;
  name?: string;
  email?: string;
  content: string;
  eventId?: number;
}

export const apiService = {

  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  createEvent: async (event: Event): Promise<Event> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  submitFeedback: async (eventId: number, feedback: Feedback): Promise<Feedback> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: feedback.name || null,
          email: feedback.email || null,
          content: feedback.content,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit feedback');
      return await response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  getEventFeedback: async (eventId: number): Promise<Feedback[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/feedback`);
      if (!response.ok) throw new Error('Failed to fetch feedback');
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  getAllFeedback: async (): Promise<Feedback[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/feedback`);
      if (!response.ok) throw new Error('Failed to fetch feedback');
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },


  getEventSummary: async (eventId: number): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/summary`);
      if (!response.ok) throw new Error('Failed to fetch event summary');
      return await response.json();
    } catch (error) {
      console.error('Error fetching event summary:', error);
      throw error;
    }
  },

  getAllSummary: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/summary`);
      if (!response.ok) throw new Error('Failed to fetch event summary');
      return await response.json();
    } catch (error) {
      console.error('Error fetching event summary:', error);
      throw error;
    }
  },
};
