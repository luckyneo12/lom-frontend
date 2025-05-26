// components/ContactUs.tsx
"use client";

import React, { FormEvent, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContactSubmission {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  message: string;
  createdAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: ContactSubmission[];
  message?: string;
}

const ContactUs: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    message: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const validatePhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid 10-digit Indian phone number
    if (cleaned.length !== 10) {
      setPhoneError("Phone number must be 10 digits");
      return false;
    }
    
    // Check if it starts with a valid Indian mobile prefix
    const validPrefixes = ['6', '7', '8', '9'];
    if (!validPrefixes.includes(cleaned[0])) {
      setPhoneError("Invalid phone number format");
      return false;
    }

    setPhoneError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate phone number before submission
    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "white",
          border: "none",
        },
      });
      return;
    }

    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.address.trim() || !formData.message.trim()) {
      toast.error("All fields are required", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "white",
          border: "none",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phoneNumber: formData.phoneNumber,
          email: formData.email.trim(),
          address: formData.address.trim(),
          message: formData.message.trim(),
        }),
      });

      const responseData: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit form");
      }

      if (responseData.success) {
        setSubmissions(responseData.data || []);
        setTotalCount(responseData.data?.length || 0);

        toast.success("Message sent successfully! We'll get back to you soon.", {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#4ade80",
            color: "white",
            border: "none",
          },
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          address: "",
          message: "",
        });
        setPhoneError("");
      } else {
        throw new Error("Failed to submit form");
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.", {
        duration: 5000,
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "white",
          border: "none",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") {
      // Only allow numbers
      const numericValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      const truncatedValue = numericValue.slice(0, 10);
      
      setFormData(prev => ({
        ...prev,
        [name]: truncatedValue
      }));

      // Validate phone number on change
      validatePhoneNumber(truncatedValue);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <section className="px-6 md:px-20 py-16 bg-white" id="Contact">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">Contact us</h2>
          <p className="text-gray-600 mb-8">
            Have a question, feedback, or collaboration idea? We'd love to hear from you. 
            Email us, call us, or simply fill out the form — our team will get back to you as soon as possible.
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 rounded-full p-3">
                <HiOutlineMail className="text-white text-2xl" />
              </div>
              <p className="font-semibold text-black">connect@legendofmarketing.com</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-yellow-400 rounded-full p-3">
                <FaPhoneAlt className="text-white text-xl" />
              </div>
              <p className="font-semibold text-black">+91 9713559563</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border rounded-md p-6">
              <h4 className="font-semibold text-lg mb-2">Customer Support</h4>
              <p className="text-gray-600 text-sm">
                We're available Monday to Friday from 10:00 AM to 6:00 PM IST to assist you with any queries.
              </p>
            </div>
            <div className="border rounded-md p-6">
              <h4 className="font-semibold text-lg mb-2">Feedback & Suggestions</h4>
              <p className="text-gray-600 text-sm">
                Your input helps us grow! Share your thoughts and ideas with us to help improve the Legend of Marketing experience.
              </p>
            </div>
          </div>

          <p className="text-gray-600">View and manage contact form submissions ({totalCount} total)</p>
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
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border rounded-md p-3 w-full focus:outline-yellow-400"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border rounded-md p-3 w-full focus:outline-yellow-400"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 ">
                  <div className="relative w-full">
                    <FaPhoneAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number (10 digits)"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="border rounded-md pl-10 p-3 w-full focus:outline-yellow-400"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1 absolute">{phoneError}</p>
                    )}
                  </div>

                  <div className="relative mt-2 w-full">
                    <HiOutlineMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className="border rounded-md pl-10 p-3 w-full focus:outline-yellow-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Your Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border rounded-md p-3 w-full focus:outline-yellow-400"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full h-28 border-2 rounded-md px-4 py-3 outline-none focus:ring-2 resize-none overflow-hidden focus:ring-yellow-400"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
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
