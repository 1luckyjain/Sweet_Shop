import React from 'react';

const Alert = ({ message, type = 'error', onClose, autoClose = false, autoCloseDelay = 5000 }) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  const getAlertClasses = () => {
    switch (type) {
      case 'error':
        return 'error-message';
      case 'success':
        return 'success-message';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg';
      case 'info':
        return 'bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg';
      default:
        return 'error-message';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm-1 9h2v-2H9v2zm0-4h2V7H9v6z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l2.293-2.293a1 1 0 011.414 1.414L9 7.586 13.414 9.293a1 1 0 011.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334.213 2.98.355 3.872a4.497 4.497 0 01-2.622 1.27c-.01.077-.021.157-.021.235v-.004h-.002a.634.634 0 00-.097-.29c-.198-.298-.514-.485-.822-.634a3.976 3.976 0 00-1.795-.315 3.923 3.923 0 00-.822.624l-1.757 1.11c-.273.172-.585.274-.928.281-.033.007-.067.007-.1v-.004zm4.901 0l-1.757-1.11c-.273-.172-.585-.274-.928-.281-.033-.007-.067-.007-.1v.004h.002a.634.634 0 00.097.29c.198.298.514.485.822.634a3.976 3.976 0 001.795.315 3.923 3.923 0 00.822-.624l1.757-1.11c.273-.172.585-.274.928-.281.033-.007.067-.007.1v-.004h-.002z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!message) return null;

  return (
    <div className={`flex items-center justify-between ${getAlertClasses()}`}>
      <div className="flex items-center">
        {getIcon()}
        <span className="ml-3 text-sm font-medium">
          {message}
        </span>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 bg-transparent border-0 text-current hover:opacity-75 focus:outline-none"
          aria-label="Dismiss alert"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293 4.293a1 1 0 001.414-1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 11.414 5.707 7.707a1 1 0 01-1.414 0l-4-4z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
