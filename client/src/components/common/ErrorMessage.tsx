import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = 'error',
}) => {
  return <div className={className}>{message}</div>;
};

export default ErrorMessage;
