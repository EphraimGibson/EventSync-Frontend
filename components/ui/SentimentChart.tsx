
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Very Positive', value: 35, fill: '#10B981' },
  { name: 'Positive', value: 28, fill: '#84CC16' },
  { name: 'Neutral', value: 20, fill: '#EAB308' },
  { name: 'Negative', value: 12, fill: '#F97316' },
  { name: 'Very Negative', value: 5, fill: '#EF4444' },
];

const SentimentChart: React.FC = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '6px'
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
