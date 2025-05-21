"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaRegClock,
  FaRegCalendarAlt,
} from "react-icons/fa";
import Link from "next/link";
import RelatedArticles from "@/components/RelatedArticles";
// import RelatedArticles from "./RelatedArticles";

interface BlogPost {
  title: string;
  date: string;
  description: string;
  image: string | null;
}

const blogPosts: BlogPost[] = [
  {
    title: "Lorem Ipsum vel vulputate est elit varius",
    date: "April 28, 2025",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel magna lorem. Aenean eu nunc ac nunc tincidunt commodo.",
    image: null,
  },
  {
    title: "New partnered connection titles at X",
    date: "April 28, 2025",
    description:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque habitant morbi tristique.",
    image: "/s1.jpeg",
  },
  {
    title: "The Importance of Brand Perception",
    date: "April 28, 2025",
    description:
      "Maecenas pretium fermentum dui, vel pharetra elit. Morbi feugiat purus a odio gravida, in eleifend erat sagittis.",
    image: null,
  },
  {
    title: "Lorem ipsum dolor sit amet consectetur. Eu dignissim egestas",
    date: "April 28, 2025",
    description:
      "Curabitur tincidunt, massa nec congue varius, nisl erat iaculis turpis, vel fermentum sapien libero nec ligula.",
    image: "/s5.jpeg",
  },
  {
    title: "Monitoring and Responding to Feedback",
    date: "April 28, 2025",
    description:
      "Integer sollicitudin magna a mauris bibendum, non volutpat lacus convallis. Phasellus eu risus at velit tristique.",
    image: null,
  },
  {
    title: "Vel varius eu volutpat",
    date: "April 28, 2025",
    description:
      "Pellentesque vehicula quam at cursus vehicula. Nullam suscipit quam eget lorem tincidunt, ut imperdiet nunc facilisis.",
    image: null,
  },
];

const sectionIds = ["post1", "post2", "post3", "post4", "post5", "post6"];

const contents = [
  "1. Lorem Ipsum vel vulputate est elit varius",
  "2. New partnered connection titles at X",
  "3. The Importance of Brand Perception",
  "4. Lorem ipsum dolor sit amet consectetur. Eu dignissim egestas",
  "5. Monitoring and Responding to Feedback",
  "6. Vel varius eu volutpat",
];

const BlogPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("post1");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
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
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans px-3 scroll-smooth">
      {/* Breadcrumb + Tags */}
      <div className="text-sm text-gray-500 flex items-center mt-6 justify-between max-w-6xl mx-auto">
        <div>
          <span className="text-gray-500 font-semibold">Blogs</span>
          <span className="text-gray-800 font-semibold">
            {" "}
            / Mi sit egestas sit et pulvinar vel nisi arcu malesuada.
          </span>
        </div>
        <div className="space-x-2">
          <span className="bg-yellow-300 text-xs px-2 py-1 font-semibold text-black rounded">
            Marketing
          </span>
          <span className="bg-yellow-300 text-xs px-2 py-1 font-semibold text-black rounded">
            Feature
          </span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center text-gray-500 text-xs space-x-2 mt-6 max-w-6xl mx-auto">
        <FaRegCalendarAlt />
        <span>Apr 02, 2025</span>
        <FaRegClock />
        <span>12 Min read</span>
      </div>

      {/* Blog Heading */}
      <section className="max-w-6xl mx-auto py-4">
        <h1 className="text-3xl font-bold hover:text-yellow-600 transition-colors duration-200 cursor-pointer">
          X faces $1 billion fine from EU over DSA violations
        </h1>
        <p className="mt-2 text-sm text-gray-700 pb-3 max-w-7xl">
          Lorem ipsum dolor sit amet consectetur. Justo scelerisque non odio
          volutpat purus non. Venenatis vel amet ut ullamcorper pellentesque nec
          nunc vel. Accumsan in eget in luctus phasellus ullamcorper aliquam
          justo. Fermentum consectetur etiam consectetur molestie felis lorem
          quis justo at.
        </p>
      </section>

      {/* Main Image */}
      <div className="max-w-6xl mx-auto">
        <img
          src="/s3.jpeg"
          alt="Main visual"
          className="w-full rounded-md h-[500px] object-cover transform transition-transform duration-500 hover:scale-[1.03] hover:rotate-[0.5deg] shadow-lg cursor-pointer"
        />
      </div>

      {/* Layout: Sidebar + Blog */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-1/4 text-sm md:sticky top-20 h-fit order-2 lg:order-1">
          <h3 className="font-semibold mb-4 text-lg">Contents</h3>
          <ol className="space-y-2">
            {contents.map((item, i) => (
              <li
                key={sectionIds[i]}
                className={`pl-2 border-l-4 transition-all duration-200 cursor-pointer ${
                  activeId === sectionIds[i]
                    ? "font-bold text-black border-yellow-400"
                    : "text-gray-600 border-transparent"
                } hover:text-yellow-500 hover:underline hover:pl-3`}
              >
                <a href={`#${sectionIds[i]}`}>{item}</a>
              </li>
            ))}
          </ol>

          {/* Social Icons */}
          <h3 className="font-bold mt-8 mb-4">Share this article</h3>
          <div className="flex space-x-3 text-gray-200">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map(
              (Icon, idx) => (
                <Link
                  key={idx}
                  href="#"
                  target="_blank"
                  className="p-2 border rounded-full bg-black cursor-pointer transform hover:scale-110 hover:shadow-xl hover:text-yellow-400 transition-all duration-300"
                >
                  <Icon />
                </Link>
              )
            )}
          </div>
        </aside>

        {/* Blog Posts */}
        <main className="lg:w-3/4 space-y-12 order-1 lg:order-2">
          {blogPosts.map((post, index) => (
            <article
              key={index}
              id={sectionIds[index]}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className="space-y-4 scroll-mt-28 group transition-opacity duration-700 animate-fade-in"
            >
              <h2 className="text-2xl font-bold text-black transition-all duration-200 group-hover:text-yellow-600 group-hover:scale-[1.01] cursor-pointer">
                {post.title}
              </h2>
              <p className="text-xs text-gray-500">{post.date}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Blog visual"
                  className="object-cover w-full h-[300px] md:h-[400px] rounded-md transform hover:scale-[1.02] hover:rotate-[1deg] transition-transform duration-500 shadow-md cursor-pointer"
                />
              )}
              <p className="text-gray-800 text-md">{post.description}</p>
            </article>
          ))}
        </main>
      </div>

      <RelatedArticles />
    </div>
  );
};

export default BlogPage;
