'use client';

import React, { FC, FormEvent } from 'react';
import { FiPhone } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';

const ContactSection: FC = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optional: Add form submission logic here
    console.log('Form submitted');
  };

  return (
    <section className="px-4 py-10 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
        {/* Left Side - Text */}
        <div className="lg:w-1/2 lg:pr-8 font-semibold">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-4 text-md font-semibold leading-relaxed">
            Have a question, collaboration idea, or just want to say hello?<br />
            We'd love to hear from you.
          </p>
          <p className="text-gray-700 text-md  font-semibold leading-relaxed">
            Whether you're a fellow marketer, brand, or agency — reach out and let's create something legendary together.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 w-full bg-white border rounded-lg shadow-lg p-8 md:p-8">
          <h3 className="text-2xl font-bold mb-6">Get in touch with us</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Phone Field with Icon */}
              <div className="flex-1 flex items-center border rounded-md px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-yellow-400">
                <FiPhone className="text-gray-700 mr-2 flex-shrink-0" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full outline-none"
                  required
                />
              </div>

              {/* Email Field with Icon */}
              <div className="flex-1 flex items-center border rounded-md px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-yellow-400">
                <HiOutlineMail className="text-gray-700 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <textarea
                placeholder="Message"
                rows={5}
                className="w-full h-28 border-2 rounded-md px-4 py-3 outline-none focus:ring-2 resize-none overflow-hidden focus:ring-yellow-400"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-md hover:bg-yellow-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
