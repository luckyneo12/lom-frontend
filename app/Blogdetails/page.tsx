"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaRegClock, FaRegCalendarAlt, FaShare, FaBookmark } from "react-icons/fa";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import Link from "next/link";
import RelatedArticles from "@/components/RelatedArticles";
// import RelatedArticles from "./RelatedArticles";

interface Section {
  id: string;
  title: string;
  paragraphs: string[];
  subtitle?: string;
  imageCaption?: string;
  hasQuote?: boolean;
  quote?: string;
  hasList?: boolean;
  listItems?: string[];
  hasStats?: boolean;
  stats?: { value: string; label: string }[];
  hasCallToAction?: boolean;
  ctaText?: string;
  hasImage?: boolean;
}

const sections: Section[] = [
  {
    id: "section1",
    title: "Lorem ipsum ut vulputate est vitae vulputate nunc",
    paragraphs: [
      "Lorem ipsum dolor sit amet consectetur. Magna consequat erat ut neque non accumsan risus eget enim. Arcu ullamcorper ultricies ac nunc. Vel at diam at amet et morbi amet. Eu consectetur nunc dictum nisi massa imperdiet vel adipiscing egestas. Quis molestie et magna ipsum. Placerat et at turpis velit libero. Purus est morbi mattis non sed condimentum.",
    ],
    imageCaption: "Image caption describing the content above"
  },
  {
    id: "section2",
    title: "Faucibus. Nibh non laoreet vestibulum",
    paragraphs: [
      "Lorem ipsum dolor sit amet consectetur. Tellus iaculis vitae tortor eget erat turpis nulla sed facilisis. Blandit in et sed sagittis enim interdum accumsan. Risus parturient commodo risus at non. Egestas cursus pellentesque nisi duis pellentesque erat velit lorem convallis. Odio vulputate egestas bibendum tincidunt nibh. Porttitor mauris eget dictum tincidunt euismod vehicula tristique. Convallis amet nulla vulputate egestas. Senectus enim et molestie eros eu feugiat diam interdum lacus. Mi gravida odio tempor tincidunt dui vulputate nunc. Morbi urna arcu aliquam sagittis elit condimentum. Ullamcorper pellentesque in etiam sapien nec blandit faucibus non. Neque augue nibh varius sapien volutpat et eros urna. Lacus bibendum nulla mattis rhoncus suscipit lobortis. Consectetur iaculis egestas non sagittis amet tellus diam.",
    ],
    hasQuote: true,
    quote: "This is an important quote that highlights a key point in the article."
  },
  {
    id: "section3",
    title: "Isus parturient commodo risus at non",
    paragraphs: [
      "Lorem ipsum dolor sit amet consectetur. Magna consequat erat ut neque non accumsan risus eget enim. Arcu ullamcorper ultricies ac nunc. Vel at diam at amet et morbi amet. Eu consectetur nunc dictum nisi massa imperdiet vel adipiscing egestas. Quis molestie et magna ipsum. Placerat et at turpis velit libero. Purus est morbi mattis non sed condimentum.",
      "Lorem ipsum dolor sit amet consectetur. Auctor sagittis malesuada lectus risus enim eleifend. Lacus amet lobortis arcu ultricies odio faucibus. Volutpat arcu eget sit id. Interdum sagittis egestas malesuada egestas mauris pulvinar quam interdum rhoncus massa. Nulla erat sollicitudin sapien risus semper donec urna. Bibendum habitasse egestas vitae amet duis sapien venenatis. Feugiat tempor tristique aliquam in dignissim est ac morbi. Non dolor id scelerisque fermentum ultricies. Erat nibh non vestibulum nunc dolor ut orci dapibus. Est eget gravida tortor enim. In cras sed vulputate dignissim ut risus duis lacus id. Scelerisque blandit facilisis congue nullam. Pellentesque diam neque condimentum in dignissim risus.",
    ],
    hasList: true,
    listItems: [
      "List item one with important information",
      "Second list item with more details",
      "Third point that summarizes key takeaways"
    ]
  },
  {
    id: "section4",
    title: "The Importance of Brand Perception",
    subtitle: "Faucibus. Nibh non laoreet vestibulum",
    paragraphs: [
      "Lorem ipsum dolor sit amet consectetur. Neque habitant aliquam donec urna id ridiculus sit odio. Vivamus diam massa sed scelerisque pharetra cursus. Nisi consectetur felis ut sit malesuada et ut mattis nisl risus ut turpis. Id nullam integer enim lectus. Mi et tellus malesuada tincidunt amet in. Aliquam nec varius et malesuada mattis risus ipsum. Egestas euismod in id. In nullam venenatis at dolor. In sollicitudin feugiat scelerisque faucibus. Nibh non laoreet condimentum commodo lectus tellus. Risus magna pharetra mattis rhoncus eu malesuada vel non in nec. Id imperdiet sapien velit habitant vitae. Vitae nec eget nibh pretium vivamus nullam. Lectus quis turpis egestas. Urna cras diam nibh et lacus. At quis suspendisse varius varius lacus mattis vulputate risus non nulla duis condimentum sed.",
    ],
    hasStats: true,
    stats: [
      { value: "87%", label: "of customers say brand perception matters" },
      { value: "3.5x", label: "more likely to purchase from trusted brands" }
    ]
  },
  {
    id: "section5",
    title: "Lorem ipsum dolor sit amet consectetur. In dignissim egestas ullamcorper justo mattis maecenas diam dictumst.",
    paragraphs: [
      "Lorem ipsum dolor sit amet adipiscing. Elit hendrerit mattis et ultricies tincidunt. Mi fringilla id facilisis et. Arcu sed eu scelerisque et velit pellentesque. In condimentum nunc porta neque a lorem in ut. Elementum justo in pellentesque mi nibh. Feugiat non. Nisl diam in habitasse congue massa porttitor. Nec proin habitasse a nulla at non elit euismod. Viverra maecenas sed rhoncus blandit. Ipsum eget sit. Tellus fermentum eu mi adipiscing dictum. Velit feugiat at pretium pretium.",
    ],
    hasCallToAction: true,
    ctaText: "Want to learn more about this topic? Sign up for our newsletter!"
  },
];

const contents = [
  "1. Lorem ipsum faucibus aliquam",
  "2. Lorem ipsum consectetur consequat sit orci cras.",
  "3. Lorem ipsum porttitor enim lorem",
  "4. Lorem ipsum quis aliquam in turpis et turpis ut.",
  "5. Lorem ipsum tortor vitae tortor",
];

const BlogPage: React.FC = () => {
  const [activeId, setActiveId] = useState("section1");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -50% 0px" }
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

  useEffect(() => {
    const calculateReadingProgress = () => {
      if (!articleRef.current) return;
      
      const articleHeight = articleRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      
      const progress = Math.min(
        (scrollPosition / (articleHeight - windowHeight)) * 100,
        100
      );
      
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", calculateReadingProgress);
    return () => window.removeEventListener("scroll", calculateReadingProgress);
  }, []);

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: "Check out this interesting article",
        url: window.location.href
      }).catch(err => console.log("Error sharing:", err));
    }
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-white text-black px-4 py-8 scroll-smooth">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-yellow-400 transition-all duration-300" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto">
        <div className="text-sm text-gray-500 flex items-center justify-between">
          <div>
            <Link href="/blogs" className="text-gray-500 font-semibold hover:text-yellow-500 transition-colors">
              Blogs
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-semibold">
              Mi sit egestas sit et pulvinar vel nisi arcu malesuada.
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
      </nav>

      <header className="mt-3 max-w-7xl mx-auto">
        <div className="flex items-center mt-10 text-gray-500 text-xs space-x-4">
          <div className="flex items-center space-x-1">
            <FaRegCalendarAlt aria-hidden="true" />
            <span>Apr 02, 2025</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaRegClock aria-hidden="true" />
            <span>12 Min read</span>
          </div>
          <button 
            onClick={handleBookmarkClick}
            className="flex items-center space-x-1 hover:text-yellow-500 transition-colors"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this article"}
          >
            <FaBookmark className={isBookmarked ? "text-yellow-500 fill-current" : ""} />
            <span>{isBookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mt-4 leading-tight">
          Faucibus. Nibh non laoreet vestibulum
        </h1>
        
        <p className="mt-4 text-base text-gray-700 pb-5 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Justo scelerisque non odio
          volutpat purus non. Venenatis vel amet ut ullamcorper pellentesque
          nec nunc vel. Accumsan in eget in luctus phasellus ullamcorper
          aliquam justo. Fermentum consectetur etiam consectetur molestie felis
          lorem quis justo at.
        </p>
      </header>

      <div className="p-4 sm:p-6 bg-[#fafafa]">
  <div
    className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 max-w-7xl mx-auto"
    ref={articleRef}
  >
    {/* Sidebar */}
    <aside className="md:col-span-1 text-sm sticky top-24 self-start order-1 md:order-none">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">Contents</h3>
        <nav aria-label="Article sections">
          <ol className="space-y-3">
            {contents.map((item, i) => (
              <li
                key={sections[i].id}
                className={`pl-3 border-l-4 ${
                  activeId === sections[i].id
                    ? "font-bold text-black border-yellow-400 bg-yellow-50"
                    : "text-gray-600 border-transparent hover:border-gray-300"
                } transition-colors duration-200 py-1`}
              >
                <a
                  href={`#${sections[i].id}`}
                  className="block"
                  aria-current={activeId === sections[i].id ? "location" : undefined}
                >
                  {item}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Share Options */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Share this article</h3>
            <button
              onClick={handleShareClick}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              aria-label="Share options"
            >
              <FaShare />
            </button>
          </div>
          <div className={`${showShareOptions ? "block" : "hidden"} md:block`}>
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: FaFacebookF, name: "Facebook" },
                { Icon: FaTwitter, name: "Twitter" },
                { Icon: FaLinkedinIn, name: "LinkedIn" },
                { Icon: FaInstagram, name: "Instagram" },
                { Icon: FaYoutube, name: "YouTube" }
              ].map(({ Icon, name }, idx) => (
                <Link
                  key={idx}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                  aria-label={`Share on ${name}`}
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>

    {/* Article Content */}
    <article className="md:col-span-3 space-y-10 text-base order-0">
      {sections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          ref={(el) => { sectionRefs.current[idx] = el; }}
          className="scroll-mt-24 bg-white p-4 sm:p-6 rounded-lg shadow-sm"
        >
          <h2 className="font-bold text-2xl text-black mb-4">
            {section.title}
          </h2>

          {section.subtitle && (
            <h3 className="font-medium text-gray-700 text-lg mt-1 mb-4">
              {section.subtitle}
            </h3>
          )}

          {section.paragraphs.map((para, j) => (
            <p key={j} className="mt-4 leading-relaxed text-gray-800">
              {para}
            </p>
          ))}

          {section.hasImage && (
            <figure className="my-6">
              <img
                src="https://source.unsplash.com/random/800x400/?business"
                alt={section.imageCaption || "Supporting image"}
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
              <figcaption className="text-sm text-gray-500 mt-2 italic">
                {section.imageCaption}
              </figcaption>
            </figure>
          )}

          {section.hasQuote && (
            <blockquote className="border-l-4 border-yellow-400 pl-4 my-6 italic text-gray-700">
              <p className="text-lg">"{section.quote}"</p>
            </blockquote>
          )}

          {section.hasList && (
            <ul className="list-disc pl-6 my-6 space-y-2">
              {section.listItems?.map((item, k) => (
                <li key={k} className="text-gray-800">
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.hasStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {section.stats?.map((stat, l) => (
                <div
                  key={l}
                  className="bg-gray-50 p-4 rounded-lg text-center"
                >
                  <p className="text-3xl font-bold text-yellow-500">{stat.value}</p>
                  <p className="text-gray-700 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {section.hasCallToAction && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
              <p className="text-yellow-800 font-medium">{section.ctaText}</p>
              <button className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition-colors">
                Sign Up Now
              </button>
            </div>
          )}
        </section>
      ))}
    </article>
  </div>
</div>


      <div className="mt-16 max-w-7xl mx-auto">
        <RelatedArticles/>
      </div>
    </div>
  );
};

export default BlogPage;