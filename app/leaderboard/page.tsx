import React from "react";
import EnhancedLeaderboard from "../components/EnhancedLeaderboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🏆 Global Leaderboard
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Compete with players worldwide and climb the ranks to become the ultimate quiz champion!
          </p>
          <div className="flex justify-center items-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Updates</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm font-medium">Real-time Rankings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">🏅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Top Performers</h3>
            <p className="text-gray-600">See who's leading the competition</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">📈</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Rankings</h3>
            <p className="text-gray-600">Real-time position updates</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Progress</h3>
            <p className="text-gray-600">Track your competitive journey</p>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
            <h2 className="text-2xl font-bold">Live Leaderboard</h2>
            <p className="text-gray-300 mt-2">Search, filter, and explore rankings with real-time updates</p>
          </div>
          <EnhancedLeaderboard />
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* How to Climb */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              How to Climb the Ranks
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Complete quizzes quickly and accurately</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Use power-ups strategically</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Maintain high streaks for bonus points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold">✓</span>
                <span>Challenge yourself with higher levels</span>
              </li>
            </ul>
          </div>

          {/* Leaderboard Rules */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Leaderboard Rules
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Points are earned by completing quizzes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Faster completion times earn bonus points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Power-ups can multiply your score</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <span>Rankings update in real-time</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Compete?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join the competition and see how you rank against players worldwide. 
              Take quizzes, earn points, and climb the leaderboard!
            </p>
            <a 
              href="/quiz" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <span>Start Quiz</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 