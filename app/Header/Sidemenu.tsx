"use client";

import { FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
  FaTimes, } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: React.ElementType;
  href: string;
  color: string;
}

const sideMenuLinks: MenuLink[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/Project" },
  { name: "About Us", href: "/AboutUs" },
  { name: "Contact Us", href: "/Contact" },
  { name: "Privacy Policy", href: "/PrivacyPolicy" },
  { name: "Terms & Conditions", href: "/TermsAndCondition" },
  { name: "Login", href: "/Login" },
  // { name: "Register", href: "/Register" },
];

const socialLinks: SocialLink[] = [
  { icon: FaFacebookF, href: "https://www.facebook.com/LOM.FB", color: "hover:text-blue-600" },
  { icon: FaInstagram, href: "https://www.instagram.com/legendofmarketing", color: "hover:text-pink-500" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/legendofmarketing", color: "hover:text-blue-700" },
  { icon: FaYoutube, href: "https://www.youtube.com/@legendofmarketing", color: "hover:text-red-600" },
  { icon: FaTwitter, href: "https://x.com/legendofmktg", color: "hover:text-blue-400" },
];

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-72 md:w-80 h-full bg-white shadow-lg z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/bloglogo.png" alt="Logo" width={40} height={40} className="w-10 h-10" />
            </Link>
            <button onClick={onClose}>
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-col space-y-6 p-6">
            {sideMenuLinks.map(({ name, href }, index) => (
              <Link
                key={index}
                href={href}
                onClick={onClose}
                className="text-lg font-medium hover:text-yellow-500"
              >
                {name}
              </Link>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="mt-auto py-6 border-t flex justify-center space-x-4">
            {socialLinks.map(({ icon: Icon, href, color }, index) => (
              <Link key={index} href={href} target="_blank">
                <div className="p-2 border rounded-full">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
