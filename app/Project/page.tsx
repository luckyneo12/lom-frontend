'use client';

import React, { useState, useCallback } from 'react';

// Define types for projects and categories
interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'Pepsi',
    description: 'A bold influencer-driven summer campaign...',
    category: 'Influencer Marketing',
    imageUrl: '/v1.jpeg',
  },
  {
    id: 2,
    title: "Swiggy's Voice of Hunger",
    description: 'A wildly hilarious voice-challenge campaign...',
    category: 'Social Media',
    imageUrl: '/v2.jpeg',
  },
  {
    id: 3,
    title: 'Cadbury Unity Bar',
    description: 'Heartfelt diversity-rich promotion...',
    category: 'Brand Campaigns',
    imageUrl: '/v3.jpeg',
  },
];

const categories: string[] = [
  'All Projects',
  'Brand Campaigns',
  'Social Media',
  'Influencer Marketing',
  'Product Launch',
  'Trending Now',
  'Case Studies',
];

export default function Project() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeCategory, setActiveCategory] = useState('All Projects');

  const filteredProjects = activeCategory === 'All Projects'
    ? projectsData
    : projectsData.filter(project => project.category === activeCategory);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setVisibleCount(6); // Reset visible projects on category change
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(visibleCount + 3);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Our Projects</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Explore our collection of standout campaigns and real-world examples that reflect marketing excellence and insight.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map(category => (
          <button
            key={category}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleProjects.map(project => (
          <div
            key={project.id}
            className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                <p className="text-gray-200 text-sm">{project.description}</p>
                <span className="inline-block px-3 py-1 mt-2 text-xs font-medium bg-yellow-400 text-black rounded-full mb-2">
                  {project.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredProjects.length && (
        <div className="flex justify-center mt-14">
          <button
            className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={handleLoadMore}
          >
            Load More Projects
          </button>
        </div>
      )}
    </div>
  );
}
