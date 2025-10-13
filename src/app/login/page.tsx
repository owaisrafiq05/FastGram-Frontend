'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import loginImg from '../../../public/images/fastgram-login-img.png';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex justify-center gap-4">
        {/* Left: continuously bouncing image */}
        <div className="hidden md:block md:w-1/2 lg:w-2/5 relative min-h-[700px]">
          <div className="relative h-full w-full will-change-transform animate-[y-bob_3.5s_ease-in-out_infinite]">
            <Image
              src={loginImg}
              alt="FastGram preview"
              fill
              priority
              className="object-contain object-center"
              sizes="(max-width: 900px) 50vw, 60vw"
            />
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-sm">
            <div className="bg-black border border-[#363636] rounded-sm p-8 mb-4">
              <div className="text-center mb-6">
                <h1 className="text-4xl italic font-semibold text-white font-serif tracking-wide">
                  FastGram
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="FAST University Email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 bg-[#121212] border border-gray-600 rounded-sm text-white placeholder-gray-400 text-sm focus:outline-none focus:border-gray-400"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className="w-full px-3 py-2 bg-[#121212] border border-gray-600 rounded-sm text-white placeholder-gray-400 text-sm focus:outline-none focus:border-gray-400"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4"
                >
                  Log in
                </button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Log in with Facebook</span>
              </button>

              <div className="text-center">
                <a href="#" className="text-blue-400 text-sm">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="bg-black border border-gray-700 rounded-sm p-6 text-center">
              <p className="text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/Signup" className="text-blue-400 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mb-4">
            <a href="#" className="hover:underline">Meta</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Jobs</a>
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">API</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Locations</a>
            <a href="#" className="hover:underline">FastGram Lite</a>
            <a href="#" className="hover:underline">Meta AI</a>
            <a href="#" className="hover:underline">Meta AI Articles</a>
            <a href="#" className="hover:underline">Threads</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Uploading &amp; Non-Users</a>
            <a href="#" className="hover:underline">Meta Verified</a>
          </div>

          <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span>English</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </div>
            <span>© 2025 FastGram from Meta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
