
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className=" backdrop-blur-sm sticky top-0 z-20 shadow-lg shadow-orange-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
         Media Gallery
        </h1>
        <p className="text-slate-400 mt-1">Your personal Gallery</p>
      </div>
    </header>
  );
};

export default Header;
