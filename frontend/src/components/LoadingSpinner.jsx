import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  className = '', 
  text = null,
  color = 'primary'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-6 h-6';
      case 'large':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getBorderClasses = () => {
    switch (color) {
      case 'primary':
        return 'border-primary-200 border-t-primary-600';
      case 'secondary':
        return 'border-secondary-200 border-t-secondary-600';
      case 'white':
        return 'border-white/30 border-t-white';
      case 'gray':
        return 'border-gray-200 border-t-gray-600';
      default:
        return 'border-primary-200 border-t-primary-600';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`loading-spinner ${getSizeClasses()} ${getBorderClasses()}`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="ml-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
