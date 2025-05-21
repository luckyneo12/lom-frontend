'use client';

import React from 'react';

// Define types for the terms data
interface Section {
  title: string;
  content: string;
  email?: string;
}

interface TermsData {
  lastUpdated: string;
  sections: Section[];
}

const termsData: TermsData = {
  lastUpdated: 'April 29, 2025',
  sections: [
    {
      title: '1. Acceptance of Terms',
      content:
        'By accessing and using our blog website (“we”, “our”, or “us”), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this site.',
    },
    {
      title: '2. Modifications to These Terms',
      content:
        'We reserve the right to update or change our Terms at any time. Your continued use of the blog after we post any modifications will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Terms.',
    },
    {
      title: '3. Intellectual Property',
      content:
        'All content published on this blog—including articles, graphics, logos, and design—is the property of our website unless otherwise stated and is protected by applicable copyright and trademark laws.',
    },
    {
      title: '4. User Contributions',
      content:
        'You retain ownership of any content you submit, but you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content on the site.',
    },
    {
      title: '5. Prohibited Use',
      content:
        'You may not use our blog in any way that is unlawful, harmful, or in violation of any applicable law. Spamming, harassing others, or attempting to gain unauthorized access to any part of our site is strictly forbidden.',
    },
    {
      title: '6. Third-Party Links',
      content:
        'Our blog may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content or privacy practices of any third-party sites.',
    },
    {
      title: '7. Limitation of Liability',
      content:
        'In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages arising out of your access to or use of the blog.',
    },
    {
      title: '8. Governing Law',
      content:
        'These Terms shall be governed and construed in accordance with the laws of your local jurisdiction, without regard to its conflict of law provisions.',
    },
    {
      title: '9. Contact Us',
      content:
        'If you have any questions about these Terms, please contact us at ',
      email: ' connect@legendofmarketing.com',
    },
  ],
};

const TermsAndConditions: React.FC = () => {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Terms & <span className="text-yellow-500">Conditions</span>
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Last updated: {termsData.lastUpdated}
      </p>

      <section className="space-y-10 text-base leading-relaxed">
        {termsData.sections.map((section, index) => (
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

export default TermsAndConditions;
