'use client';

import React from 'react';

interface Service {
  img: string;
  title: string;
}

interface ClientLogo {
  img: string;
}

interface WhatWeDoSection {
  title: string;
  description: string;
  services: Service[];
}

interface OurClientsSection {
  title: string;
  description: string;
  logos: ClientLogo[];
}

interface Data {
  whatWeDo: WhatWeDoSection;
  ourClients: OurClientsSection;
}

const data: Data = {
  whatWeDo: {
    title: 'What We Do',
    description:
      'We deliver content and tools that help you become a smarter, more effective marketer. Our platform features fresh, relevant insights across all key areas of modern marketing, including:',
    services: [
      { img: '/f6.png', title: 'Digital Marketing' },
      { img: '/f5.png', title: 'Social Media Strategies' },
      { img: '/f4.png', title: 'SEO & Content Marketing' },
      { img: '/f3.png', title: 'Branding & Positioning' },
      { img: '/f2.png', title: 'Paid Campaigns & Ad Strategies' },
      { img: '/f1.png', title: 'Analytics & Marketing Tech' },
    ],
  },
  ourClients: {
    title: 'Our Clients',
    description: "We've had the privilege of working with a diverse range of clients",
    logos: [
      { img: '/c1.png' },
      { img: '/c2.png' },
      { img: '/c5.png' },
      { img: '/c4.png' },
      { img: '/c3.png' },
      { img: '/c2.png' },
      { img: '/c5.png' },
      { img: '/c1.png' },
      { img: '/c4.png' },
      { img: '/c3.png' },
      { img: '/c1.png' },
      { img: '/c2.png' },
      { img: '/c3.png' },
      { img: '/c4.png' },
      { img: '/c3.png' },
    ],
  },
};

const MarketingSection: React.FC = () => {
  return (
    <div className="py-16 px-4">
      {/* What We Do Section */}
      <div className="text-center mb-16 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4">
          {data.whatWeDo.title}
        </h2>
        <p className="text-gray-700 font-semibold max-w-3xl mx-auto">
          {data.whatWeDo.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {data.whatWeDo.services.map((service, index) => (
            <div
              key={index}
              className="bg-yellow-50 border-b-8 border-yellow-400 rounded-md py-6 px-4 flex flex-col items-start shadow hover:shadow-xl transition-transform transform hover:scale-105 duration-300"
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-12 h-12 mb-3 animate-bounce-slow"
              />
              <h3 className="text-lg font-semibold">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Our Clients Section */}
      <div className="bg-[#fafafa]">
        <div className="text-center py-8 max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            {data.ourClients.title}
          </h2>
          <p className="text-gray-700 font-semibold mb-10 max-w-xl mx-auto">
            {data.ourClients.description}
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 md:gap-14 gap-7 items-center justify-center text-gray-700 text-sm font-semibold">
            {data.ourClients.logos.map((client, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center hover:text-yellow-500 transition duration-300 transform hover:scale-105"
              >
                <img
                  src={client.img}
                  alt="Client Logo"
                  className="w-30 h-10 mb-2 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingSection;
