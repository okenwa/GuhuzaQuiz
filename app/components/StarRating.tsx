"use client";
import React from 'react';

type StarRatingProps = {
  timeScore: number;    // Time-based score (0-100)
  accuracyScore: number; // Accuracy score (0-100)
  totalStars: number;    // Maximum stars possible
};

export default function StarRating({ timeScore, accuracyScore, totalStars = 3 }: StarRatingProps) {
  const calculateStars = () => {
    let stars = 0;
    
    // Base star for completing the level
    stars += 1;
    
    // Star for time performance (if average answer time is under 8 seconds)
    if (timeScore >= 80) stars += 1;
    
    // Star for accuracy (if accuracy is above 90%)
    if (accuracyScore >= 90) stars += 1;
    
    return stars;
  };

  const earnedStars = calculateStars();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {[...Array(totalStars)].map((_, index) => (
          <div 
            key={index} 
            className={`w-16 h-16 transform transition-all duration-500 ${
              index < earnedStars 
                ? 'motion-safe:animate-bounce-slow' 
                : 'opacity-40'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-full h-full ${
                index < earnedStars ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
          <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-full">
            <span className="text-yellow-600 text-lg">⭐</span>
          </div>
          <p className="font-medium text-yellow-700">Level Completed!</p>
        </div>
        {timeScore >= 80 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
              <span className="text-blue-600 text-lg">⚡</span>
            </div>
            <p className="font-medium text-blue-700">Speed Master: Fast responses!</p>
          </div>
        )}
        {accuracyScore >= 90 && (
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
              <span className="text-green-600 text-lg">🎯</span>
            </div>
            <p className="font-medium text-green-700">Accuracy Master: 90%+ correct!</p>
          </div>
        )}
      </div>
      <div className="w-full max-w-md space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-blue-600">Time Performance</span>
            <span className="text-sm font-medium text-blue-600">{timeScore}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${timeScore}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-green-600">Accuracy</span>
            <span className="text-sm font-medium text-green-600">{accuracyScore}%</span>
          </div>
          <div className="w-full bg-green-100 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${accuracyScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 