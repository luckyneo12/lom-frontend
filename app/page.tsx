"use client";

import React, { useEffect, useState } from "react";
import ExpertSpeak from "@/components/ExpertSpeak";
import FeatureBlog from "@/components/Featuredblog";
import SearchSection from "@/components/HeroSection";
import BlogSection from "@/components/Latestblog";
import MarketingBlog from "@/components/Marketingblog";
import SectionDisplay from "@/components/SectionDisplay";

const Home = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("https://new-blogbackend.onrender.com/api/blog")
      .then((res) => res.json())
      .then((data) => setMessage("connected"))
      .catch((err) => {
        console.error("Fetch error:", err);
        setMessage("Failed to connect to backend");
      });
  }, []);

  return (
    <div>
      <SearchSection />

      <BlogSection />
      <SectionDisplay />
   

  
    </div>
  );
};

export default Home;
