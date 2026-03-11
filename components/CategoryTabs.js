import { useState } from 'react';

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex overflow-x-auto py-4 px-2 hide-scrollbar">
      <div className="flex space-x-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}