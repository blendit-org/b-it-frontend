
import React from 'react';

interface HeartIconProps {
  isSaved: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({ isSaved }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6 transition-all duration-300 ease-in-out ${isSaved ? 'text-orange-500' : 'text-white'}`}
      viewBox="0 0 24 24"
      fill={isSaved ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
};

export default HeartIcon;
