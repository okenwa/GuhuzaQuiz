"use client";

import Link from "next/link";
import { useState } from "react";

export default function JobMatchPromo() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        ✕
      </button>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">🎯 Discover Your Perfect Job Match!</h3>
          <p className="text-white/90 mb-4">
            Upload your resume and get AI-powered job recommendations tailored to your skills and experience.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-green-300">✓</span>
              AI-Powered Matching
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-300">✓</span>
              Resume Optimization
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-300">✓</span>
              Skill Gap Analysis
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link
              href="/job-match"
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Find Jobs Now
            </Link>
            <Link
              href="/resume-report"
              className="bg-white/20 text-white px-4 py-2 rounded-md font-semibold hover:bg-white/30 transition-colors"
            >
              Analyze Resume
            </Link>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <div className="text-6xl">💼</div>
        </div>
      </div>
    </div>
  );
}
