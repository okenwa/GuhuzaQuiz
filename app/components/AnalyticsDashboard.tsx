'use client';

import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { IoStatsChart, IoPeople, IoTime, IoTrophy } from 'react-icons/io5';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  quizCompletions: number;
  averageScore: number;
  averageTime: number;
  completionRate: number;
  levelPerformance: Array<{
    levelId: string;
    levelTitle: string;
    completions: number;
    averageScore: number;
    averageTime: number;
  }>;
  dailyActivity: Array<{
    date: string;
    users: number;
    completions: number;
  }>;
  achievementStats: Array<{
    achievementId: string;
    achievementName: string;
    earnedCount: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your analytics API
      // For now, we'll use mock data
      const mockData: AnalyticsData = {
        totalUsers: 1250,
        activeUsers: 342,
        quizCompletions: 2847,
        averageScore: 78.5,
        averageTime: 12.3,
        completionRate: 85.2,
        levelPerformance: [
          { levelId: '1', levelTitle: 'Beginner Basics', completions: 450, averageScore: 82.3, averageTime: 10.5 },
          { levelId: '2', levelTitle: 'Intermediate Skills', completions: 380, averageScore: 76.8, averageTime: 13.2 },
          { levelId: '3', levelTitle: 'Advanced Challenges', completions: 290, averageScore: 71.4, averageTime: 15.8 },
          { levelId: '4', levelTitle: 'Expert Level', completions: 180, averageScore: 68.9, averageTime: 18.5 },
        ],
        dailyActivity: [
          { date: '2024-01-01', users: 45, completions: 67 },
          { date: '2024-01-02', users: 52, completions: 78 },
          { date: '2024-01-03', users: 48, completions: 71 },
          { date: '2024-01-04', users: 61, completions: 89 },
          { date: '2024-01-05', users: 55, completions: 82 },
          { date: '2024-01-06', users: 67, completions: 95 },
          { date: '2024-01-07', users: 72, completions: 108 },
        ],
        achievementStats: [
          { achievementId: 'perfect-score', achievementName: 'Perfect Score', earnedCount: 45 },
          { achievementId: 'speed-demon', achievementName: 'Speed Demon', earnedCount: 128 },
          { achievementId: 'streak-master', achievementName: 'Streak Master', earnedCount: 89 },
          { achievementId: 'quick-thinker', achievementName: 'Quick Thinker', earnedCount: 156 },
        ],
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
            <p className="text-gray-600">No analytics data available</p>
          </div>
        </div>
      </div>
    );
  }

  const levelChartData = {
    labels: analyticsData.levelPerformance.map(level => level.levelTitle),
    datasets: [
      {
        label: 'Completions',
        data: analyticsData.levelPerformance.map(level => level.completions),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Average Score',
        data: analyticsData.levelPerformance.map(level => level.averageScore),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const activityChartData = {
    labels: analyticsData.dailyActivity.map(day => new Date(day.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Active Users',
        data: analyticsData.dailyActivity.map(day => day.users),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Quiz Completions',
        data: analyticsData.dailyActivity.map(day => day.completions),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const achievementChartData = {
    labels: analyticsData.achievementStats.map(achievement => achievement.achievementName),
    datasets: [
      {
        data: analyticsData.achievementStats.map(achievement => achievement.earnedCount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Quiz app performance and user engagement metrics</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IoPeople className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <IoStatsChart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <IoTrophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quiz Completions</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.quizCompletions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IoTime className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Level Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Level Performance</h3>
            <Bar
              data={levelChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>

          {/* Daily Activity */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
            <Line
              data={activityChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Distribution</h3>
            <div className="h-64">
              <Doughnut
                data={achievementChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-green-600">{analyticsData.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Time per Quiz</span>
                <span className="font-semibold text-blue-600">{analyticsData.averageTime} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">User Retention</span>
                <span className="font-semibold text-purple-600">78.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mobile Usage</span>
                <span className="font-semibold text-orange-600">65.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 