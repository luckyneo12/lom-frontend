"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaRegCalendarAlt,
  FaRegClock,
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

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
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/slug/${params.slug}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        const data = await response.json();
        setPost(data.blog);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to fetch blog post",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-4">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog" passHref>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Table of Contents IDs
  const sectionIds = post.sections?.map((_, i) => `section-${i}`) || [];

  return (
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
        <span>
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })
            : "No date"}
        </span>
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
      {post.mainImage && (
        <div className="max-w-6xl mx-auto">
          <img
            src={post.mainImage}
            alt={post.title}
            className="w-full rounded-md h-[500px] object-cover transform transition-transform duration-500 hover:scale-[1.03] hover:rotate-[0.5deg] shadow-lg cursor-pointer"
          />
        </div>
      )}

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
              { Icon: RxCross2, href: "https://x.com/legendofmktg" },
            ].map(({ Icon, href }, idx) => (
              <Link
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border rounded-full bg-black cursor-pointer transform hover:scale-110 hover:shadow-xl hover:text-yellow-400 transition-all duration-300"
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
                  className="object-cover w-full h-[300px] md:h-[400px] rounded-md transform hover:scale-[1.02] hover:rotate-[1deg] transition-transform duration-500 shadow-md cursor-pointer"
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
  );
} 