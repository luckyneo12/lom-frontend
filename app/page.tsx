"use client";

import React, { useEffect, useState } from "react";
import ExpertSpeak from "@/components/ExpertSpeak";
import FeatureBlog from "@/components/Featuredblog";
import SearchSection from "@/components/HeroSection";
import BlogSection from "@/components/Latestblog";
import MarketingBlog from "@/components/Marketingblog";

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
      <FeatureBlog />
      <MarketingBlog />
      <ExpertSpeak />

      {/* Just for test */}
      <p style={{ marginTop: "20px", color: "green" }}>
        Message from backend: {message}
      </p>
    </div>
  );
};

export default Home;
