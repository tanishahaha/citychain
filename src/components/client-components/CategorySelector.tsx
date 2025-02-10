"use client"
import { useState } from 'react';

function CategorySelector({ onCategorySelect }:any) {
  const categories = [
    'environmental',
    'safety',
    'social inequality',
    'education',
    'healthcare',
    'transportation',
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (event:any) => {
      setSelectedCategory(event.target.value);
      onCategorySelect(event.target.value);
  };

  return (
    <div className='mt-4 '>
      <h2 className='font-semibold'>Select a Category</h2>
      <ul >
        {categories.map((category) => (
          <li key={category}>
            <input
              type="radio"
              name="category"
              value={category}
              checked={selectedCategory === category}
              onChange={handleCategoryChange}
            />
            <label htmlFor={category}>{category}</label>
          </li>
        ))}
      </ul>
      {/* <p className='font-semibold'>Selected Category: {selectedCategory}</p> */}
    </div>
  );
}

export default CategorySelector;