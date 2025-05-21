"use client";
import React, { useState } from "react";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";

// Define Blog type
type Blog = {
  image: string;
  tag: string[];
  title: string;
  date: string;
  readTime: string;
  id: number;
};

// Blog data
const blogs: Blog[] = [
  {
    image: "/s1.jpeg",
    tag: ["Featured", "Marketing"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 1,
  },
  {
    image: "/s5.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 2,
  },
  {
    image: "/s3.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 3,
  },
  {
    image: "/s4.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 4,
  },
  {
    image: "/s2.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 5,
  },
  {
    image: "/v1.jpeg",
    tag: ["Featured", "Marketing"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 6,
  },
  {
    image: "/v4.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 7,
  },
  {
    image: "/s3.jpeg",
    tag: ["Marketing", "Featured"],
    title: "Roblox launches new ad format, strengthens partnership with Google",
    date: "Apr 05, 2025",
    readTime: "14 min read",
    id: 8,
  },
];

// BlogCard props type
type BlogCardProps = Blog;

const BlogCard: React.FC<BlogCardProps> = ({ image, tag, title, date, readTime, id }) => (
  <div className="space-y-4">
    <Link href={`/blog/${id}`}>
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </Link>

    <div className="flex gap-2 flex-wrap">
      {tag.map((t, i) => (
        <span key={i} className="bg-yellow-400 text-black text-xs font-bold py-1 px-2 rounded">
          {t}
        </span>
      ))}
    </div>

    <h3 className="text-sm font-semibold leading-tight">{title}</h3>
    <div className="flex items-center text-gray-500 text-xs space-x-2">
      <FaRegCalendarAlt />
      <span>{date}</span>
      <FaRegClock />
      <span>{readTime}</span>
    </div>
  </div>
);

const ExpertSpeak: React.FC = () => {
  const [visibleBlogs, setVisibleBlogs] = useState<number>(8);

  const handleLoadMore = () => {
    setVisibleBlogs((prevVisible) => prevVisible + 4);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-4xl font-bold mb-10 flex items-center gap-2">
        <span className="h-10 w-1 bg-yellow-500 inline-block"></span>
        Expert Speak
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.slice(0, visibleBlogs).map((blog) => (
          <BlogCard
            key={blog.id}
            image={blog.image}
            tag={blog.tag}
            title={blog.title}
            date={blog.date}
            readTime={blog.readTime}
            id={blog.id}
          />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={handleLoadMore}
          disabled={visibleBlogs >= blogs.length}
          className={`px-6 py-2 border border-gray-300 rounded-full text-sm font-medium transition ${
            visibleBlogs >= blogs.length ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          {visibleBlogs < blogs.length ? "View More" : "No More Blogs"}
        </button>
      </div>
    </section>
  );
};

export default ExpertSpeak;
