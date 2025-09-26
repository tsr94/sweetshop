import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-b-2 border-purple-600 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;