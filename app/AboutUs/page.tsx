// pages/AboutUs.tsx
import ContactSection from '@/components/AboutContact';
import MarketingSection from '@/components/WhoWeAre';
import React from 'react';
import Head from 'next/head';
// import { FaBullhorn, FaUsers, FaRocket, FaLaughBeam } from "react-icons/fa";
import { FaBullhorn, FaLightbulb, FaRocket, FaFire, FaSearch, FaLaughSquint, FaBolt, FaCode, FaSmile } from 'react-icons/fa';


const contentItems = [
    { icon: <FaBullhorn size={30} className="text-white text-center" />, title: 'Brand Ads', desc: ' We break down ad campaigns that made us stop, stare, and sometimes share. The good, the bold, and the unforgettable.' },
    { icon: <FaRocket size={30} className="text-white text-center" />, title: 'Brand Updates', desc: ' From rebrands to bold launches, stay in the loop with what top brands are up to, before everyone else.' },
    { icon: <FaLightbulb size={30} className="text-white text-center" />, title: 'Recent Moves', desc: ' Mergers, pivots, drops, and top hires. The headlines that shape the marketing world, decoded and delivered.' },
    { icon: <FaFire size={30} className="text-white text-center" />, title: 'Startup Saturday', desc: 'Weekend inspiration spotlighting ambitious startups and their founders.Weekend dose of inspiration with spotlight stories of ambitious brands and the minds behind them.' },
    { icon: <FaSearch size={30} className="text-white text-center" />, title: 'Friday Fundings', desc: ' Your crisp Friday roundup of the hottest startup fundings, strategic investors, and what it all means.' },
    { icon: <FaBolt size={30} className="text-white text-center" />, title: 'Did You Know', desc: ' Deep dives that deliver ‘Aha!’ moments,  facts, firsts, and fascinating journeys of celebs, founders, and brands.' },
    { icon: <FaCode size={30} className="text-white text-center" />, title: 'Decoding Viral Campaigns', desc: 'Not just what went viral, but why. We peel back the curtain on what made the world click ‘share’.' },
    { icon: <FaSmile size={30} className="text-white text-center" />, title: 'Value in CGI Campaigns', desc: 'From eye-popping visuals to campaign value, we analyze CGI work that adds more than just pixels.' },
    { icon: <FaLaughSquint size={30} className="text-white text-center" />, title: 'Corporate Meme Integrations', desc: 'Because brands that meme right, win hearts. We spotlight meme marketing done smart (and savage).' },
  ];
  
  const reasons = [
    'High-Intent Audience: Our readers aren’t just scrolling,  they’re searching, learning, and applying.',
    'No Forced Ads: We match brands with trends that fit, because real always resonates.',
    'Curated > Cluttered:Only crisp, actionable insights make the cut. Just value.',
    'Always in the Know: From midnight rebrands to Monday morning metrics, we track what matters.',
    'Founder-Ready Inspiration:Stories that fuel the next pitch, campaign, or pivot. Built for decision-makers.',
    'We Decode the “Why”: Psychology, storytelling, and strategy,  we break down what’s working (and why you should care).',
    'Built for the Busy:Perfect for marketers, creators, founders, and anyone short on time but big on curiosity.',
    'Relatable + Reliable: We’re your marketing-savvy friend who gets the game and plays it smart.',
  ];
  
  const community = [
    {
      label: 'On Facebook',
      stat: '7.4+ Lakh',
      desc: 'Marketers who engage, not just follow.',
    },
    {
      label: 'On Instagram',
      stat: '3.38+ Lakh',
      desc: 'Founders, creators, and brand nerds vibing with value.',
    },
  ];
  
const aboutData = {
  hero: {
    title: "About Us",
    subtitle: "Where Marketing Minds Become Legends.",
    image: "/s7.jpeg",
    overlayImage: "/t1.jpeg"
  },
  whoWeAre: {
    heading: "Who We Are",
    content: (
      <div className="space-y-4">
        <div>A place where bold brands meet an audience that pays attention.</div>
        <div>We spotlight brands, campaigns, and marketers that challenge the norm and spark conversations.</div>
        <div>If you're done blending in and ready to be talked about, we're the team that makes sure your story not only sticks, but spreads.</div>
        <div><strong>Welcome to Legend of Marketing</strong> — where impact meets imagination.</div>
      </div>
    ),
    image: "/s2.jpeg"
  },
  ourStory: {
    heading: "Our Story",
    text: `Every great idea starts with a spark — and ours was the desire to decode what made brands win.\n\nLegend of Marketing was born from that curiosity. What started as a single blog aimed at helping marketing teams thrive, soon transformed into a strategic hub for brand development. We’ve since worked with countless startups, enterprises, and nonprofits, helping them connect, captivate, and convert.\n\nToday, we empower the next generation of change-makers by uniting them through community, real-world storytelling, and sustainable strategy. Join us, we’ve been expecting you.`,
    image: "/s3.jpeg"
  }
};

const AboutUs = () => {
  return (
    <div className="py-10 px-4 md:px-8">
      <Head>
        <title>About Us - Legend of Marketing</title>
        <meta name="description" content="Discover who we are at Legend of Marketing. Learn our story and what drives us to create legendary marketing experiences." />
      </Head>

      {/* Hero Section */}
      <div className="text-center max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold hover:text-yellow-500 transition-colors duration-300">
          About <span className="text-yellow-500">Us</span>
        </h1>
        <p className="mt-2 text-gray-600 text-base md:text-lg">
          {aboutData.hero.subtitle}
        </p>

        <div className="relative mt-10 max-w-4xl">
          {/* Main Background Image */}
          <img
            src={aboutData.hero.image}
            alt="Team"
            className="w-full h-[420px] rounded-xl object-cover shadow-lg transition-transform transform hover:scale-105 overflow-hidden duration-300"
          />

          {/* Overlay Image (Laptop + Plant) */}
          <img
            src={aboutData.hero.overlayImage}
            alt="Overlay"
            className="absolute md:block hidden top-1/2 right-[-330px] translate-y-[-50%] w-40 sm:w-52 md:w-[550px] rounded-xl shadow-xl border transition-transform transform hover:scale-105 duration-300"
          />
        </div>
      </div>



      <div className="bg-[#fafafa] p-4 md:p-8">
        {/* Who We Are */}
        <div className="md:flex gap-8 mb-16 items-start max-w-6xl mx-auto">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 hover:text-yellow-500 transition-colors duration-300">{aboutData.whoWeAre.heading}</h2>
            <div className="text-gray-800 text-sm md:text-base leading-relaxed">{aboutData.whoWeAre.content}</div>
          </div>
          <div className="md:w-1/2">
            <img src={aboutData.whoWeAre.image} alt="Who We Are" className="rounded-lg w-full shadow-md h-[350px] object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>

        {/* Our Story */}
        <div className="md:flex gap-8 flex-col-reverse md:flex-row items-start max-w-6xl mx-auto mb-16">
          <div className="md:w-1/2 mt-6 md:mt-0">
            <img src={aboutData.ourStory.image} alt="Our Story" className="rounded-lg w-full shadow-md h-[350px] object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 hover:text-yellow-500 transition-colors duration-300">{aboutData.ourStory.heading}</h2>
            <p className="text-gray-800 whitespace-pre-line text-sm md:text-base leading-relaxed">{aboutData.ourStory.text}</p>
          </div>
        </div>

        {/* Extended Content Section */}
       {/* Content That Fuels Our Legend */}
       <div className="text-gray-800">
      {/* The Content Section */}
      <section className="py-20 bg-gradient-to-br from-white to-yellow-50 px-4">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-16">
          The <span className="text-yellow-500">Content</span> That Keeps Us Legendary
        </h2>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10">
          {contentItems.map((item, idx) => (
            <div
              key={idx}
              className="relative w-full md:w-[45%] lg:w-[30%] bg-white border border-yellow-100 rounded-3xl px-6 py-8 shadow-md hover:shadow-xl transition duration-300 group overflow-hidden"
            >
              <div className="absolute -top-2 -left-1 bg-yellow-500 p-4 rounded-full shadow-lg">
                {item.icon}
              </div>
              <h3 className="mt-8 font-semibold text-xl group-hover:text-yellow-500 transition duration-300">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Brands Choose Us */}
      <section className="bg-black text-white py-20 px-4">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-16">
          Why Brands <span className="text-yellow-500">Choose Us</span>
        </h2>
        <div className="max-w-6xl mx-auto space-y-8">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 group"
            >
              <span className="text-yellow-400 text-lg font-bold">✓</span>
              <p className="text-md group-hover:pl-2 transition-all duration-300">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-white">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-16">Our <span className="text-yellow-500">Community</span></h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10">
          {community.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-tr from-yellow-100 to-white border-l-8 border-yellow-400 p-6 rounded-xl shadow hover:shadow-lg w-full transition duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900">{item.label}</h3>
              <p className="text-3xl font-extrabold text-yellow-500 mt-2">{item.stat}</p>
              <p className="text-gray-700 mt-2 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
      </div>

      <MarketingSection />
      <ContactSection />
    </div>
  );
};

export default AboutUs;
