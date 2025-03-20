import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500" />
    </div>
  );
};

export {Loader};
