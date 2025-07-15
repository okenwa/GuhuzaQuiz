'use client';

import { useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsProvider';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  memoryUsage?: number;
  networkLatency: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const analytics = useAnalytics();

  useEffect(() => {
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
        
        const performanceMetrics: PerformanceMetrics = {
          pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
          firstContentfulPaint: fcp ? fcp.startTime : 0,
          largestContentfulPaint: lcp ? lcp.startTime : 0,
          firstInputDelay: 0, // Would need to be measured on first interaction
          cumulativeLayoutShift: 0, // Would need to be measured over time
          memoryUsage: (performance as any).memory?.usedJSHeapSize,
          networkLatency: navigation.responseEnd - navigation.requestStart,
        };

        setMetrics(performanceMetrics);

        // Track performance metrics
        analytics.trackPageLoad(window.location.pathname, performanceMetrics.pageLoadTime);
      }
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => prev ? {
              ...prev,
              largestContentfulPaint: entry.startTime
            } : null);
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, [analytics]);

  if (!metrics) return null;

  const getPerformanceGrade = (lcp: number) => {
    if (lcp < 2500) return { grade: 'A', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (lcp < 4000) return { grade: 'B', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { grade: 'C', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const performanceGrade = getPerformanceGrade(metrics.largestContentfulPaint);

  return (
    <>
      {/* Performance Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Monitor"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Performance Grade */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${performanceGrade.bgColor} ${performanceGrade.color} mb-4`}>
            Performance Grade: {performanceGrade.grade}
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Page Load Time:</span>
              <span className="text-sm font-medium">
                {metrics.pageLoadTime > 0 ? `${Math.round(metrics.pageLoadTime)}ms` : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">First Contentful Paint:</span>
              <span className="text-sm font-medium">
                {metrics.firstContentfulPaint > 0 ? `${Math.round(metrics.firstContentfulPaint)}ms` : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Largest Contentful Paint:</span>
              <span className="text-sm font-medium">
                {metrics.largestContentfulPaint > 0 ? `${Math.round(metrics.largestContentfulPaint)}ms` : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Network Latency:</span>
              <span className="text-sm font-medium">
                {metrics.networkLatency > 0 ? `${Math.round(metrics.networkLatency)}ms` : 'N/A'}
              </span>
            </div>

            {metrics.memoryUsage && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Memory Usage:</span>
                <span className="text-sm font-medium">
                  {Math.round(metrics.memoryUsage / 1024 / 1024)}MB
                </span>
              </div>
            )}
          </div>

          {/* Performance Tips */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Performance Tips:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {metrics.largestContentfulPaint > 4000 && (
                <li>• Optimize images and reduce bundle size</li>
              )}
              {metrics.networkLatency > 1000 && (
                <li>• Consider using a CDN</li>
              )}
              {metrics.pageLoadTime > 3000 && (
                <li>• Implement lazy loading</li>
              )}
              {metrics.largestContentfulPaint < 2500 && (
                <li>• Great performance! Keep it up</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
} 