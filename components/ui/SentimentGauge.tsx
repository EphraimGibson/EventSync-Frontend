
import React from 'react';

interface SentimentGaugeProps {
  sentiment: number; // This goes from 0-100, like a percentage!
  size?: number;
}

const SentimentGauge: React.FC<SentimentGaugeProps> = ({ sentiment, size = 120 }) => {
  const radius = size / 2 - 10;
  const circumference = radius * Math.PI; // Just using half a circle here, not the whole thing!
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (sentiment / 100) * circumference;

  const getSentimentLabel = (value: number) => {
    if (value >= 80) return 'Very Positive';
    if (value >= 60) return 'Positive';
    if (value >= 40) return 'Neutral';
    if (value >= 20) return 'Negative';
    return 'Very Negative';
  };

  const getSentimentColor = (value: number) => {
    if (value >= 80) return '#10B981'; // Nice happy green color!
    if (value >= 60) return '#84CC16'; // Cheerful lime green
    if (value >= 40) return '#EAB308'; // Meh, yellow - could go either way
    if (value >= 20) return '#F97316'; // Getting into danger zone orange
    return '#EF4444'; // Uh oh, angry red alert!
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 }}>
        <svg
          width={size}
          height={size / 2}
          className="transform -rotate-90"
        >
          {/* The boring gray background arc - nothing fancy here */}
          <path
            d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          {/* This is where the magic happens - the colorful arc that shows the score! */}
          <path
            d={`M 10 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
            fill="none"
            stroke={getSentimentColor(sentiment)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        {/* Slap the actual percentage number right in the middle */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-2xl font-bold text-gray-900">{sentiment}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mt-2">
        {getSentimentLabel(sentiment)}
      </p>
    </div>
  );
};

export default SentimentGauge;
