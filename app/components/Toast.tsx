'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
      case 'info':
        return `${baseStyles} bg-blue-500 text-white ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
      default:
        return `${baseStyles} bg-gray-500 text-white ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold">{getIcon()}</span>
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast; 