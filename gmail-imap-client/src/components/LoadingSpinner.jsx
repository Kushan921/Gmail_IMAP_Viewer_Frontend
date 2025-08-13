import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-blue-200 ${sizeClasses[size]}`}></div>
        
        {/* Animated ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 ${sizeClasses[size]} animate-spin`}></div>
        
        {/* Inner dot */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ${size === 'sm' ? 'inset-1' : size === 'lg' ? 'inset-3' : size === 'xl' ? 'inset-4' : 'inset-2'}`}></div>
      </div>
      
      {text && (
        <p className={`mt-4 text-gray-600 font-medium ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
