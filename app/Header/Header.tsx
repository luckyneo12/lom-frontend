"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaBars,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import SideMenu from "./Sidemenu";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";

interface NavLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: React.ElementType;
  href: string;
  color: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  // Add other blog post fields as needed
}

const socialLinks: SocialLink[] = [
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/LOM.FB",
    color: "hover:text-blue-600",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/legendofmarketing",
    color: "hover:text-pink-500",
  },
  {
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/company/legendofmarketing",
    color: "hover:text-blue-700",
  },
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/@legendofmarketing",
    color: "hover:text-red-600",
  },
  {
    icon: FaTwitter,
    href: "https://x.com/legendofmktg",
    color: "hover:text-blue-400",
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error loading categories",
          description:
            error instanceof Error ? error.message : "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="border-b relative">
        {/* Top bar */}
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Left: Social Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map(({ icon: Icon, href, color }, index) => (
              <Link href={href} key={index} target="_blank">
                <Icon className={`w-5 h-5 ${color}`} />
              </Link>
            ))}
          </div>

          {/* Center: Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/bloglogo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h1 className="font-bold text-sm md:text-lg whitespace-nowrap">
                LEGEND OF MARKETING
              </h1>
            </Link>
          </div>

          {/* Right: Search and Mobile Menu */}
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              {isSearchOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaSearch className="w-5 h-5" />
              )}
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
              <FaBars className="w-6 h-6" />
            </button>

            {/* Search Input Animation */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "10rem", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSearchSubmit}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-white border rounded-full overflow-hidden flex items-center shadow-md"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-4 py-1 outline-none w-full text-sm"
                    autoFocus
                  />
                  <button type="submit" className="px-2 text-blue-500">
                    Go
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Menu */}
        <nav className="hidden md:flex items-center justify-center max-w-7xl text-gray-700 mx-auto flex-wrap gap-8 py-3 text-md font-medium md:text-base">
          <Link
            href="/"
            className={`relative inline-block transition-colors duration-300
                      after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 
                      after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full
                      ${
                        isActive("/")
                          ? "text-yellow-500 after:w-full"
                          : "text-black hover:text-gray-500"
                      }`}
          >
            Latest Updates
          </Link>
          {loading ? (
            <div className="animate-pulse">Loading...</div>
          ) : (
            categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className={`relative inline-block transition-colors duration-300
                          after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 
                          after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full
                          ${
                            isActive(`/category/${category.slug}`)
                              ? "text-yellow-500 after:w-full"
                              : "text-black hover:text-gray-500"
                          }`}
              >
                {category.name}
              </Link>
            ))
          )}

          <button
            className="flex items-center gap-1 hover:text-yellow-500"
            onClick={() => setIsMenuOpen(true)}
          >
            <FaBars className="w-5 h-5" />
            More
          </button>
        </nav>
      </header>

      {/* Side Menu */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
