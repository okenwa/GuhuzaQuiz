"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaSignInAlt, FaSignOutAlt, FaUser, FaTrophy, FaQuestionCircle, FaHome, FaGift } from "react-icons/fa";
import LoginButton from "./buttons/loginBtn";
import LogoutButton from "./buttons/logoutBtn";

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasRewards, setHasRewards] = useState(false);
  const { data: session } = useSession();

  // Check for available rewards
  useEffect(() => {
    const checkRewards = async () => {
      if (session?.user?.memberId) {
        try {
          // Check for social rewards
          const socialResponse = await fetch(`/api/social-rewards?playerId=${session.user.memberId}`);
          if (socialResponse.ok) {
            const socialData = await socialResponse.json();
            if (socialData.success) {
              // Check if there are any pending invites or recent activity
              const hasSocialActivity = socialData.data.pendingInvites > 0 || 
                                      Object.values(socialData.data.todayShares || {}).some((count: any) => count > 0);
              setHasRewards(hasSocialActivity);
            }
          }
        } catch (error) {
          console.error('Error checking rewards:', error);
        }
      }
    };

    checkRewards();
  }, [session?.user?.memberId]);

  return (
    <header className="sticky top-0 z-50 bg-black py-6 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/quiz">
            <img src="/logo/logo_white_large.png" alt="Logo" className="h-10" />
          </Link>
        </div>


        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-4 items-center">
          <a href="https://guhuza.com/" target="_blank" rel="noopener noreferrer">
            <span className="text-white hover:underline flex items-center gap-1 group">
              <FaHome /> Guhuza
              <Image
                src="/icons/AnotherWebsite.svg"
                className="transition-transform duration-300 group-hover:rotate-12"
                alt=""
                width={20}
                height={20}
              />
            </span>
          </a>
          <Link href="/quiz">
            <span className="text-white hover:underline flex items-center gap-1">
              <FaQuestionCircle /> Quiz
            </span>
          </Link>
          <Link href="/leaderboard">
            <span className="text-white hover:underline flex items-center gap-1">
              <FaTrophy /> Leaderboard
            </span>
          </Link>
          <Link href="/profile">
            <span className="text-white hover:underline flex items-center gap-1">
              <FaUser /> Profile
            </span>
          </Link>
          <Link href="/reward">
            <span className="text-white hover:underline flex items-center gap-1 relative">
              <FaGift /> Rewards
              {hasRewards && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  !
                </span>
              )}
            </span>
          </Link>
          {session && session.user ? (
            <span className="flex items-center gap-1">
              <FaSignOutAlt />
              <LogoutButton />
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <FaSignInAlt />
              <LoginButton />
            </span>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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

        {/* Mobile Menu (Sliding Sidebar) */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-black transform transition-transform duration-300 ease-in-out z-50 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links (Mobile) */}
          <div className="flex flex-col space-y-4 p-4 gap-8">
            <a href="https://guhuza.com/" target="_blank" rel="noopener noreferrer" className="w-full text-center">
              <span className="text-white hover:underline flex items-center justify-center gap-1 group">
                <FaHome /> Guhuza
                <Image
                  src="/icons/AnotherWebsite.svg"
                  className="transition-transform duration-300 group-hover:rotate-12"
                  alt=""
                  width={20}
                  height={20}
                />
              </span>
            </a>
            <Link href="/quiz" className="w-full text-center">
              <span className="text-white hover:underline flex items-center justify-center gap-1">
                <FaQuestionCircle /> Quiz
              </span>
            </Link>
            <Link href="/leaderboard" className="w-full text-center">
              <span className="text-white hover:underline flex items-center justify-center gap-1">
                <FaTrophy /> Leaderboard
              </span>
            </Link>
            <Link href="/profile" className="w-full text-center">
              <span className="text-white hover:underline flex items-center justify-center gap-1">
                <FaUser /> Profile
              </span>
            </Link>
            <Link href="/reward" className="w-full text-center">
              <span className="text-white hover:underline flex items-center justify-center gap-1 relative">
                <FaGift /> Rewards
                {hasRewards && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    !
                  </span>
                )}
              </span>
            </Link>
            {session && session.user ? (
              <span className="flex items-center justify-center gap-1">
                <FaSignOutAlt />
                <LogoutButton />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                <FaSignInAlt />
                <LoginButton />
              </span>
            )}
          </div>
        </div>

        {/* Overlay for Mobile Menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
}

export default Navbar;
