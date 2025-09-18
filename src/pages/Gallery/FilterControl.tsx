
import { FilterType } from '@/types/gallery.type';
import React from 'react';

interface FilterControlsProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}

const FilterButton: React.FC<{
  label: string;
  filterType: FilterType;
  activeFilter: FilterType;
  onClick: (filter: FilterType) => void;
}> = ({ label, filterType, activeFilter, onClick }) => {
  const isActive = activeFilter === filterType;
  return (
    <button
      onClick={() => onClick(filterType)}
      className={`
        px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-orange-500
        ${
          isActive
            ? 'bg-orange-600 text-white shadow-md'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }
      `}
    >
      {label}
    </button>
  );
};


const FilterControls: React.FC<FilterControlsProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8 p-2 bg-slate-800 rounded-lg shadow-inner">
      <FilterButton label="All" filterType={FilterType.All} activeFilter={activeFilter} onClick={setActiveFilter} />
      <FilterButton label="Photos" filterType={FilterType.Photos} activeFilter={activeFilter} onClick={setActiveFilter} />
      <FilterButton label="Videos" filterType={FilterType.Videos} activeFilter={activeFilter} onClick={setActiveFilter} />
      <FilterButton label="Saved" filterType={FilterType.Saved} activeFilter={activeFilter} onClick={setActiveFilter} />
    </div>
  );
};

export default FilterControls;
