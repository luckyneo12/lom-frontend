'use client';

import React from 'react';

// Define types for the privacy data
interface Section {
  title: string;
  content: string;
  email?: string;
}

interface PrivacyData {
  lastUpdated: string;
  sections: Section[];
}

const privacyData: PrivacyData = {
  lastUpdated: 'April 29, 2025',
  sections: [
    {
      title: '1. Introduction',
      content:
        'We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our blog website.',
    },
    {
      title: '2. Information We Collect',
      content:
        'We may collect personal information such as your name, email address, and any other information you provide when you contact us or subscribe to our content. We also collect non-personal data such as browser type, operating system, and usage data through cookies.',
    },
    {
      title: '3. How We Use Your Information',
      content:
        'We use the information we collect to operate and maintain our blog, respond to inquiries, personalize your experience, send newsletters (if subscribed), and improve our content and services.',
    },
    {
      title: '4. Cookies and Tracking Technologies',
      content:
        'We use cookies and similar technologies to track the activity on our site and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
    },
    {
      title: '5. Sharing Your Information',
      content:
        'We do not sell, trade, or rent your personal information to others. However, we may share data with trusted third-party services that help us operate the blog, provided they agree to keep your data confidential.',
    },
    {
      title: '6. Data Security',
      content:
        'We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
    },
    {
      title: '7. Third-Party Links',
      content:
        'Our blog may contain links to third-party sites. We are not responsible for the privacy practices or the content of such external websites.',
    },
    {
      title: '8. Your Rights',
      content:
        'You have the right to access, update, or delete your personal information. To exercise these rights, please contact us using the information below.',
    },
    {
      title: '9. Changes to This Privacy Policy',
      content:
        'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.',
    },
    {
      title: '10. Contact Us',
      content:
        'If you have any questions or concerns about this Privacy Policy, feel free to contact us at ',
      email: ' connect@legendofmarketing.com',
    },
  ],
};

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Privacy <span className="text-yellow-500">Policy</span>
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Last updated: {privacyData.lastUpdated}
      </p>

      <section className="space-y-10 text-base leading-relaxed">
        {privacyData.sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            <p>
              {section.content}
              {section.email && (
                <a
                  href={`mailto:${section.email}`}
                  className="text-yellow-500 underline ml-1"
                >
                  {section.email}
                </a>
              )}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default PrivacyPolicy;
