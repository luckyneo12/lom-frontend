"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { Lock, Mail, User } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({ name: '', email: '', password: '' });
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('https://new-blogbackend.onrender.com/api/auth/register', form);
      setMessage({text: 'Registration successful! Redirecting...', type: 'success'});
      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      setMessage({text: 'Registration failed. Please try again.', type: 'error'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Left side - Branding/Image */}
      <motion.div 
        className="hidden md:block md:w-1/2 bg-yellow-500 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80"></div>
        <div className="relative z-10 h-full flex flex-col justify-center p-12">
          <motion.h1 
            className="text-5xl font-bold text-white mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join Our Community
          </motion.h1>
          <motion.p 
            className="text-xl text-yellow-200 max-w-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create your account and unlock exclusive content and features.
          </motion.p>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center items-center p-6"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-2 border-yellow-500 hover:shadow-yellow-500/20 transition-all"
        >
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-black mb-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Create Account
            </motion.h2>
            <p className="text-gray-600">Join us today and get started</p>
          </div>

          <div className="space-y-5">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-yellow-600" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 border-2 border-black rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-yellow-600" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 border-2 border-black rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-yellow-600" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 border-2 border-black rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${isLoading ? 'bg-yellow-700' : 'bg-black hover:bg-yellow-600 hover:text-black'} flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Register Now'}
            </button>
          </div>

          {message && (
            <motion.div 
              className={`mt-4 p-3 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {message.text}
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => router.push('/Login')}
                className="text-yellow-600 hover:text-black font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;