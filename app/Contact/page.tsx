// components/ContactUs.tsx
"use client";

import React, { FormEvent } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";

const ContactUs: React.FC = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  return (
    <section className="px-6 md:px-20 py-16 bg-white" id="Contact">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">Contact us</h2>
          <p className="text-gray-600 mb-8">
            Have a question, feedback, or collaboration idea? We’d love to hear from you. 
            Email us, call us, or simply fill out the form — our team will get back to you as soon as possible.
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 rounded-full p-3">
                <HiOutlineMail className="text-white text-2xl" />
              </div>
              <p className="font-semibold text-black">connect@legendofmarketing.com
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 rounded-full p-3">
                <FaPhoneAlt className="text-white text-xl" />
              </div>
              <p className="font-semibold text-black">+91 9713559563
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border rounded-md p-6">
              <h4 className="font-semibold text-lg mb-2">Customer Support</h4>
              <p className="text-gray-600 text-sm">
                We’re available Monday to Friday from 10:00 AM to 6:00 PM IST to assist you with any queries.
              </p>
            </div>
            <div className="border rounded-md p-6">
              <h4 className="font-semibold text-lg mb-2">Feedback & Suggestions</h4>
              <p className="text-gray-600 text-sm">
                Your input helps us grow! Share your thoughts and ideas with us to help improve the Legend of Marketing experience.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="flex-1">
          <div className="bg-white border border-yellow-400 shadow-md rounded-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full"></div>

            <div className="relative z-10 p-8">
              <h3 className="text-2xl font-bold mb-6">Get in touch with us.</h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    className="border rounded-md p-3 w-full focus:outline-yellow-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="border rounded-md p-3 w-full focus:outline-yellow-400"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full">
                    <FaPhoneAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="border rounded-md pl-10 p-3 w-full focus:outline-yellow-400"
                      required
                    />
                  </div>

                  <div className="relative w-full">
                    <HiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="border rounded-md pl-10 p-3 w-full focus:outline-yellow-400"
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
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full py-3 rounded-md transition-all duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactUs;
