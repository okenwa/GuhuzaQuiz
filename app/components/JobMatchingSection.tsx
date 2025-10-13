"use client";

import { useState } from "react";
import Link from "next/link";
import { JobMatchResults } from "@/lib/jobMatching";

interface JobMatchingSectionProps {
  resumeText: string;
  report: any;
}

export default function JobMatchingSection({ resumeText, report }: JobMatchingSectionProps) {
  const [jobMatches, setJobMatches] = useState<JobMatchResults | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateJobMatches = async () => {
    if (!resumeText) return;
    
    setIsLoadingJobs(true);
    setError(null);
    
    try {
      // Generate job preferences based on report insights
      const preferences: any = {};
      
      if (report) {
        // Use report insights to enhance job matching
        preferences.skills = report.strengths;
      }

      const response = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, preferences }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setJobMatches(data.jobMatches);
      } else {
        setError("Failed to generate job matches");
      }
    } catch (error) {
      console.error("Error generating job matches:", error);
      setError("Failed to generate job matches");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  return (
    <div className="mt-8">
      {/* Job Matching Recommendation Banner */}
      {!jobMatches && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🎯 Ready to Find Your Perfect Job Match?
              </h3>
              <p className="text-blue-700 mb-3">
                Based on your resume analysis, we can recommend personalized job opportunities that match your skills and experience.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-blue-600 mb-4">
                <span>✓ AI-Powered Matching</span>
                <span>✓ Skill Gap Analysis</span>
                <span>✓ Salary Insights</span>
              </div>
              <button
                onClick={generateJobMatches}
                disabled={isLoadingJobs}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md disabled:opacity-50 flex items-center gap-2 shadow-lg"
              >
                {isLoadingJobs ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Finding Jobs...
                  </>
                ) : (
                  <>
                    💼 Find Matching Jobs
                  </>
                )}
              </button>
            </div>
            <div className="hidden lg:block text-4xl">💼</div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Job Matching Results */}
      {jobMatches && (
        <div>
          <h2 className="text-2xl font-bold mb-6">🎯 Recommended Jobs Based on Your Resume</h2>
          
          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{jobMatches.totalMatches}</div>
                <div className="text-sm text-gray-600">Matching Jobs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${jobMatches.salaryInsights.averageSalary.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Avg. Salary</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(jobMatches.matches.reduce((sum, job) => sum + job.matchScore, 0) / jobMatches.matches.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg. Match Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{jobMatches.suggestedSkills.length}</div>
                <div className="text-sm text-gray-600">Skills to Learn</div>
              </div>
            </div>
          </div>

          {/* Job Recommendations */}
          <div className="space-y-4 mb-6">
            {jobMatches.matches.slice(0, 3).map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company} • {job.location}</p>
                    <p className="text-sm text-gray-500">{job.type} • {job.experienceLevel}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.matchScore >= 90 ? "text-green-700 bg-green-100" :
                      job.matchScore >= 80 ? "text-blue-700 bg-blue-100" :
                      "text-yellow-700 bg-yellow-100"
                    }`}>
                      {job.matchScore}% Match
                    </div>
                    <p className="text-lg font-semibold text-green-600 mt-1">
                      ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Your Matching Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsMatched.slice(0, 4).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Skills to Develop</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsGap.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technology Stack Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  {job.frameworksUsed.length > 0 && (
                    <div>
                      <h6 className="font-semibold text-blue-700">Frameworks</h6>
                      <ul className="text-gray-600">
                        {job.frameworksUsed.slice(0, 2).map((fw, i) => <li key={i}>{fw}</li>)}
                      </ul>
                    </div>
                  )}
                  {job.librariesUsed.length > 0 && (
                    <div>
                      <h6 className="font-semibold text-purple-700">Libraries</h6>
                      <ul className="text-gray-600">
                        {job.librariesUsed.slice(0, 2).map((lib, i) => <li key={i}>{lib}</li>)}
                      </ul>
                    </div>
                  )}
                  {job.uiuxSkills.length > 0 && (
                    <div>
                      <h6 className="font-semibold text-pink-700">UI/UX</h6>
                      <ul className="text-gray-600">
                        {job.uiuxSkills.slice(0, 2).map((skill, i) => <li key={i}>{skill}</li>)}
                      </ul>
                    </div>
                  )}
                  {job.backendTech.length > 0 && (
                    <div>
                      <h6 className="font-semibold text-green-700">Backend</h6>
                      <ul className="text-gray-600">
                        {job.backendTech.slice(0, 2).map((tech, i) => <li key={i}>{tech}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/job-match"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    View Full Details
                  </Link>
                  <button 
                    onClick={() => window.open(job.applyUrl || '#', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Skills Analysis based on Jobs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-4">💪 Your Strongest Skills</h3>
              <div className="space-y-2">
                {jobMatches.topSkills.slice(0, 5).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill}</span>
                    <span className="text-green-600 font-medium">Strong</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-4">🎯 Skills to Focus On</h3>
              <div className="space-y-2">
                {jobMatches.suggestedSkills.slice(0, 5).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill}</span>
                    <span className="text-orange-600 font-medium">Learn</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
            <p className="text-white/90 mb-4">
              View all {jobMatches.totalMatches} matching jobs and optimize your resume for each application.
            </p>
            <Link
              href="/job-match"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              View All Job Matches & Optimize Resume
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
