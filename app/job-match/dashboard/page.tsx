"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type JobMatchHistory = {
  sessionId: number;
  createdAt: string;
  matchCount: number;
};

export default function JobMatchDashboard() {
  const [history, setHistory] = useState<JobMatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/job-match");
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: "AI-Powered Matching",
      description: "Advanced algorithms analyze your resume and match you with relevant opportunities",
      icon: "🤖",
      category: "AI Algorithm"
    },
    {
      title: "Framework Analysis",
      description: "Identifies experience with React, Vue.js, Angular, and other modern frameworks",
      icon: "⚛️",
      category: "Framework"
    },
    {
      title: "Library Assessment",
      description: "Evaluates your knowledge of popular libraries and tools",
      icon: "📚",
      category: "Library"
    },
    {
      title: "UI/UX Evaluation",
      description: "Assesses design skills and user experience capabilities",
      icon: "🎨",
      category: "UI/UX"
    },
    {
      title: "Backend Expertise",
      description: "Analyzes server-side development skills and database experience",
      icon: "🔧",
      category: "Backend Development"
    },
    {
      title: "Resume Optimization",
      description: "Provides tailored suggestions to improve your resume for specific jobs",
      icon: "📝",
      category: "Optimization"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Job Matching System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Upload your resume and discover personalized job opportunities with AI-powered matching
        </p>
        
        <div className="flex justify-center gap-4">
          <Link 
            href="/job-match"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Start Job Matching
          </Link>
          <Link 
            href="/resume-report"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Resume Analysis
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-3">{feature.description}</p>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {feature.category}
            </span>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold mb-2">1. Upload Resume</h3>
            <p className="text-sm text-gray-600">Upload your resume in PDF, DOCX, or text format</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">2. AI Analysis</h3>
            <p className="text-sm text-gray-600">Our AI analyzes your skills, experience, and qualifications</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="font-semibold mb-2">3. Job Matching</h3>
            <p className="text-sm text-gray-600">Get personalized job recommendations with match scores</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold mb-2">4. Apply & Optimize</h3>
            <p className="text-sm text-gray-600">Apply directly or optimize your resume for specific jobs</p>
          </div>
        </div>
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Job Searches</h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((session) => (
                <div key={session.sessionId} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{session.matchCount} job matches found</p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.createdAt).toLocaleDateString()} at{" "}
                      {new Date(session.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <Link
                    href="/job-match"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Search Again
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        <div className="text-center bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-blue-600">95%</div>
          <div className="text-sm text-gray-600">Match Accuracy</div>
        </div>
        <div className="text-center bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-green-600">10k+</div>
          <div className="text-sm text-gray-600">Jobs Analyzed</div>
        </div>
        <div className="text-center bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-purple-600">500+</div>
          <div className="text-sm text-gray-600">Companies</div>
        </div>
        <div className="text-center bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-orange-600">24/7</div>
          <div className="text-sm text-gray-600">AI Matching</div>
        </div>
      </div>
    </div>
  );
}
