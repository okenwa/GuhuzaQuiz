"use client"
import React, { useState } from "react";
import Link from "next/link";

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black py-6 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/">
            <img src="/logo/logo_white_large.png" alt="Logo" className="h-10" />
          </Link>
        </div>

        {/* Search Bar */}
        <form
          className={`relative flex items-center ${
            isSearchOpen ? "block" : "hidden md:flex"
          }`}
        >
          <input
            type="text"
            className="w-72 bg-white rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search..."
          />
          <button
            type="button"
            className="absolute right-2 text-gray-500 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <Link href="/quiz">
            <span className="text-white hover:underline">Quiz</span>
          </Link>
          <Link href="/login">
            <span className="text-white hover:underline">Login</span>
          </Link>
          <Link href="/register">
            <span className="text-white hover:underline">Register</span>
          </Link>
          <Link href="/plans">
            <span className="text-white hover:underline">Plans & Services</span>
          </Link>
          <Link href="/help">
            <span className="text-white hover:underline">Help</span>
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
