"use client";

import React, { useRef } from "react";
import { FaRegClock, FaRegCalendarAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface Article {
  id: number;
  image: string;
  tags: string[];
  title: string;
  date: string;
  readTime: string;
}

const articles: Article[] = [
  {
    id: 1,
    image: "/s2.jpeg",
    tags: ["Marketing", "Feature"],
    title: "Roblox launches new ad format, strengthens partnership with google",
    date: "Apr 03, 2025",
    readTime: "1 Min read"
  },
  {
    id: 2,
    image: "/s3.jpeg",
    tags: ["Marketing", "Feature"],
    title: "Roblox launches new ad format, strengthens partnership with google",
    date: "Apr 03, 2025",
    readTime: "1 Min read"
  },
  {
    id: 3,
    image: "/s5.jpeg",
    tags: ["Marketing", "Feature"],
    title: "Roblox launches new ad format, strengthens partnership with google",
    date: "Apr 03, 2025",
    readTime: "1 Min read"
  },
  {
    id: 4,
    image: "/s7.jpeg",
    tags: ["Marketing", "Feature"],
    title: "Roblox launches new ad format, strengthens partnership with google",
    date: "Apr 03, 2025",
    readTime: "1 Min read"
  },
  {
    id: 5,
    image: "/s7.jpeg",
    tags: ["Marketing", "Feature"],
    title: "Roblox launches new ad format, strengthens partnership with google",
    date: "Apr 03, 2025",
    readTime: "1 Min read"
  }
];

const RelatedArticles: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="px-6 py-10 max-w-7xl mx-auto bg-white text-black font-sans relative">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="w-1 h-6 bg-yellow-400 mr-2"></span>
        Related Articles
      </h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-[35%] transform -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
          aria-label="Scroll left"
        >
          <FaAngleLeft className="text-xl" />
        </button>

        <div
          ref={sliderRef}
          className="flex overflow-x-auto space-x-4 px-10 no-scrollbar"
        >
          {articles.map((article) => (
            <div
              key={article.id}
              className="min-w-[18rem] bg-white rounded-lg shadow-sm flex-grow-0"
            >
              <img
                src={article.image}
                alt={`Banner ${article.id}`}
                className="rounded-t-lg w-full h-[250px] object-cover"
              />
              <div className="p-4">
                <div className="flex space-x-2 mb-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-yellow-400 text-xs px-2 py-1 rounded font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="font-semibold text-sm leading-tight mb-2">
                  {article.title}
                </p>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <div className="flex items-center space-x-1">
                    <FaRegCalendarAlt aria-hidden="true" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaRegClock aria-hidden="true" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-[35%] transform -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100"
          aria-label="Scroll right"
        >
          <FaAngleRight className="text-xl" />
        </button>
      </div>

      <div className="mt-6 text-center">
        <button className="px-4 py-2 border border-black rounded text-sm font-medium hover:bg-black hover:text-white transition">
          View all &#10140;
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default RelatedArticles;
