"use client";

import { useEffect, useState } from "react";
import { Section } from "@/app/api/sections/route";
import Link from "next/link";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";

interface Post {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  mainImage?: string;
  createdAt: string;
  readTime?: string;
  featured?: boolean;
  tags?: string[];
}

interface SectionWithPosts extends Section {
  posts: Post[];
}

const demoImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop";

const truncateText = (text: string, wordLimit: number = 25) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const BlogCard: React.FC<{ post: Post }> = ({ post }) => (
  <div className="space-y-4">
    <Link href={`/blog/${post.slug}`}>
      <img
        src={post.mainImage || demoImage}
        alt={post.title}
        className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </Link>

    <div className="flex gap-2 flex-wrap">
      {post.tags?.map((tag, i) => (
        <span key={i} className="bg-yellow-400 text-black text-xs font-bold py-1 px-2 rounded">
          {tag}
        </span>
      ))}
    </div>

    <h3 className="text-sm font-semibold leading-tight">{post.title}</h3>
    <div className="flex items-center text-gray-500 text-xs space-x-2">
      <FaRegCalendarAlt />
      <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })}</span>
      <FaRegClock />
      <span>{post.readTime || '5 Min read'}</span>
    </div>
  </div>
);

export default function SectionDisplay() {
  const [sections, setSections] = useState<SectionWithPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/sections");
      const data = await response.json();
      setSections(data);
      // Initialize visible posts count for each section
      const initialVisiblePosts = data.reduce((acc: { [key: string]: number }, section: SectionWithPosts) => {
        acc[section._id!] = 8; // Start with 8 visible posts
        return acc;
      }, {});
      setVisiblePosts(initialVisiblePosts);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = (sectionId: string, totalPosts: number) => {
    setVisiblePosts(prev => ({
      ...prev,
      [sectionId]: Math.min(prev[sectionId] + 10, totalPosts) // Load 10 more posts
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section._id} className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-10 flex items-center gap-2">
            <span className="h-10 w-1 bg-yellow-500 inline-block"></span>
            {section.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.posts?.slice(0, visiblePosts[section._id!]).map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>

          {section.posts && section.posts.length > visiblePosts[section._id!] && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => handleLoadMore(section._id!, section.posts.length)}
                className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium transition hover:bg-gray-100"
              >
                View More
              </button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
} 