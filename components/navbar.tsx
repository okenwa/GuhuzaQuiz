// components/Navbar.js
"use client";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold">
            Guhazo
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link href="/blog" className="hover:text-gray-300">
            Blog
          </Link>
        </div>
        <button onClick={toggleMenu} className="md:hidden text-white">
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 p-4">
          <Link href="/" className="text-lg hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="text-lg hover:text-gray-300">
            About
          </Link>
          <Link href="/blog" className="text-lg hover:text-gray-300">
            Blog
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
