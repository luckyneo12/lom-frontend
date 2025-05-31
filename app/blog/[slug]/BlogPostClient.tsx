"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaRegCalendarAlt,
  FaRegClock,
} from "react-icons/fa";
import { X, ArrowLeft } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  mainImage: string;
  status: "published" | "draft";
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  featured: boolean;
  tags: string[];
  meta: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
  };
  createdAt: string;
  updatedAt?: string;
  author?: {
    name: string;
    image: string;
  };
  sections?: {
    section_title: string;
    section_description: string;
    section_img?: string;
    section_list?: string[];
  }[];
  slug: string;
}

interface BlogPostClientProps {
  slug: string;
  post: BlogPost;
}

export default function BlogPostClient({ slug, post }: BlogPostClientProps) {
  const [activeId, setActiveId] = useState<string>("");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Intersection observer for ToC highlight
  useEffect(() => {
    if (!post?.sections) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [post?.sections]);

  // Table of Contents IDs
  const sectionIds = post.sections?.map((_, i) => `section-${i}`) || [];

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading blog post...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white min-h-screen font-sans px-3 scroll-smooth">
        {/* Breadcrumb + Tags */}
        <div className="text-sm text-gray-500 flex items-center mt-6 justify-between max-w-6xl mx-auto">
          <div>
            <span className="text-gray-500 font-semibold">Blogs</span>
            <span className="text-gray-800 font-semibold">
              {" / "}
              {post.title}
            </span>
          </div>
          <div className="space-x-2">
            {post.category && (
              <span className="bg-yellow-300 text-xs px-2 py-1 font-semibold text-black rounded">
                {post.category.name}
              </span>
            )}
            {post.featured && (
              <span className="bg-yellow-300 text-xs px-2 py-1 font-semibold text-black rounded">
                Featured
              </span>
            )}                                    
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center text-gray-500 text-xs space-x-2 mt-6 max-w-6xl mx-auto">
          <FaRegCalendarAlt />
          <span>{formatDate(post.createdAt)}</span>
          <FaRegClock />
          <span>12 Min read</span>
        </div>

        {/* Blog Heading */}
        <section className="max-w-6xl mx-auto py-4">
          <h1 className="text-3xl font-bold hover:text-yellow-600 transition-colors duration-200 cursor-pointer">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-gray-700 pb-3 max-w-7xl">
            {post.description}
          </p>
        </section>

        {/* Main Image */}
        <div className="max-w-6xl mx-auto">
          {post.mainImage ? (
            <img
              src={post.mainImage}
              alt={post.title}
              className="w-full rounded-md h-[500px] object-cover transform transition-transform duration-500 shadow-lg cursor-pointer"
            />
          ) : null}
        </div>

        {/* Layout: Sidebar + Blog */}
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-1/4 text-sm md:sticky top-20 h-fit order-2 lg:order-1">
            <h3 className="font-semibold mb-4 text-lg">Contents</h3>
            <ol className="space-y-2">
              {post.sections && post.sections.map((section, i) => (
                <li
                  key={sectionIds[i]}
                  className={`pl-2 border-l-4 transition-all duration-200 cursor-pointer ${
                    activeId === sectionIds[i]
                      ? "font-bold text-black border-yellow-400"
                      : "text-gray-600 border-transparent"
                  } hover:text-yellow-500 hover:underline hover:pl-3`}
                >
                  <a href={`#${sectionIds[i]}`}>{section.section_title}</a>
                </li>
              ))}
            </ol>

            {/* Social Icons */}
            <h3 className="font-bold mt-8 mb-4">Share this article</h3>
            <div className="flex space-x-3 text-gray-200">
              {[
                { Icon: FaFacebookF, href: "https://www.facebook.com/LOM.FB" },
                { Icon: FaInstagram, href: "https://www.instagram.com/legendofmarketing" },
                { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/legendofmarketing" },
                { Icon: FaYoutube, href: "https://www.youtube.com/@legendofmarketing" },
                { Icon: X, href: "https://x.com/legendofmktg" },
              ].map(({ Icon, href }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 justify-center flex items-center border rounded-full bg-black cursor-pointer transform hover:scale-110 hover:shadow-xl hover:text-yellow-400 transition-all duration-300"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </aside>

          {/* Blog Posts */}
          <main className="lg:w-3/4 space-y-12 order-1 lg:order-2">
            {post.sections && post.sections.map((section, index) => (
              <article
                key={index}
                id={sectionIds[index]}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                className="space-y-4 scroll-mt-28 group transition-opacity duration-700 animate-fade-in"
              >
                <h2 className="text-2xl font-bold text-black transition-all duration-200 group-hover:text-yellow-600 group-hover:scale-[1.01] cursor-pointer">
                  {section.section_title}
                </h2>
                <p className="text-md text-gray-700">{section.section_description}</p>
                {section.section_img && (
                  <img
                    src={section.section_img}
                    alt={section.section_title}
                    className="object-cover w-full h-[300px] md:h-[400px] rounded-md transform transition-transform duration-500 shadow-md cursor-pointer"
                  />
                )}
                {section.section_list && section.section_list.length > 0 && (
                  <ul className="list-disc pl-6">
                    {section.section_list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </main>
        </div>
      </div>
    </>
  );
} 