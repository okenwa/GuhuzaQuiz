"use client";

import { useState, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { JobMatch, JobPreferences, JobMatchResults } from "@/lib/jobMatching";

export default function JobMatchingPage() {
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatchResults | null>(null);
  const [preferences, setPreferences] = useState<JobPreferences>({});
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [resumeChanges, setResumeChanges] = useState<string>("");

  const handleFile = async (file: File) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith(".pdf")) {
        const { parsePdfToText } = await import("@/lib/fileParsers");
        const text = await parsePdfToText(file);
        setResumeText(text);
        return;
      }
      if (name.endsWith(".docx")) {
        const { parseDocxToText } = await import("@/lib/fileParsers");
        const text = await parseDocxToText(file);
        setResumeText(text);
        return;
      }
      if (!file.type.includes("text") && !name.endsWith(".txt")) {
        setError("Supported formats: .txt, .pdf, .docx");
        return;
      }
      const text = await file.text();
      setResumeText(text);
    } catch (e: any) {
      setError(e?.message || "Failed to read file");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setJobMatches(null);
    
    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, preferences }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to generate job matches");
      }
      
      const data = await res.json();
      setJobMatches(data.jobMatches);
      trackEvent("job_matches_generated", { 
        matchCount: data.jobMatches.matches.length,
        resumeLength: resumeText.length 
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const applyToJob = (job: JobMatch) => {
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
    } else {
      // Generate a mock application process
      alert(`Application process would open for ${job.title} at ${job.company}`);
    }
    trackEvent("job_application_clicked", {
      jobTitle: job.title,
      company: job.company,
      matchScore: job.matchScore
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const generateResumeChanges = async (job: JobMatch) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetJob: job
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResumeChanges(data.optimizedResume);
      }
    } catch (error) {
      console.error("Failed to generate resume changes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">AI-Powered Job Matching</h1>
      <p className="text-center text-gray-600 mb-6">
        Upload your resume and get personalized job recommendations with optimization suggestions.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resume Upload Section */}
        <div className="lg:col-span-1">
          <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Paste resume text</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste your resume here..."
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium">Or upload file</label>
              <input
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
                className="border p-2 rounded-md text-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPreferences(!showPreferences)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-md"
            >
              {showPreferences ? "Hide" : "Show"} Preferences
            </button>

            {showPreferences && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium">Job Preferences</h3>
                
                <div>
                  <label className="block text-sm mb-1">Preferred Locations</label>
                  <input
                    type="text"
                    placeholder="e.g., Toronto, Vancouver, Remote"
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      location: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Job Type</label>
                  <select
                    multiple
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      jobType: Array.from(e.target.selectedOptions, option => option.value)
                    }))}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Minimum Salary (CAD)</label>
                  <input
                    type="number"
                    placeholder="e.g., 80000"
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      salaryMin: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remoteWork"
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      remoteWork: e.target.checked
                    }))}
                  />
                  <label htmlFor="remoteWork" className="ml-2 text-sm">Prefer Remote Work</label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || resumeText.trim().length < 50}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md disabled:opacity-50"
            >
              {isLoading ? "Finding Jobs..." : "Find Job Matches"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Job Matches Section */}
        <div className="lg:col-span-2">
          {jobMatches && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Job Match Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{jobMatches.totalMatches}</div>
                    <div className="text-sm text-gray-600">Total Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${jobMatches.salaryInsights.averageSalary.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{jobMatches.topSkills.length}</div>
                    <div className="text-sm text-gray-600">Top Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{jobMatches.suggestedSkills.length}</div>
                    <div className="text-sm text-gray-600">Skills to Learn</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Your Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobMatches.topSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Recommended Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobMatches.suggestedSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Matches */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recommended Jobs</h3>
                {jobMatches.matches.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-gray-600">{job.company} • {job.location}</p>
                        <p className="text-sm text-gray-500">
                          {job.type} • {job.experienceLevel} • {job.industry}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
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
                        <h5 className="font-semibold text-green-700 mb-2">Skills You Have</h5>
                        <div className="flex flex-wrap gap-2">
                          {job.skillsMatched.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-orange-700 mb-2">Skills to Develop</h5>
                        <div className="flex flex-wrap gap-2">
                          {job.skillsGap.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Technology Categories */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      {job.frameworksUsed.length > 0 && (
                        <div>
                          <h6 className="font-semibold text-blue-700">Frameworks</h6>
                          <ul className="text-gray-600">
                            {job.frameworksUsed.map((fw, i) => <li key={i}>{fw}</li>)}
                          </ul>
                        </div>
                      )}
                      {job.librariesUsed.length > 0 && (
                        <div>
                          <h6 className="font-semibold text-purple-700">Libraries</h6>
                          <ul className="text-gray-600">
                            {job.librariesUsed.map((lib, i) => <li key={i}>{lib}</li>)}
                          </ul>
                        </div>
                      )}
                      {job.uiuxSkills.length > 0 && (
                        <div>
                          <h6 className="font-semibold text-pink-700">UI/UX</h6>
                          <ul className="text-gray-600">
                            {job.uiuxSkills.map((skill, i) => <li key={i}>{skill}</li>)}
                          </ul>
                        </div>
                      )}
                      {job.aiAlgorithms && job.aiAlgorithms.length > 0 && (
                        <div>
                          <h6 className="font-semibold text-indigo-700">AI/ML</h6>
                          <ul className="text-gray-600">
                            {job.aiAlgorithms.map((algo, i) => <li key={i}>{algo}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => applyToJob(job)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                      >
                        Optimize Resume for This Job
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium">
                        Save Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Market Insights */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Market Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Current Trends</h4>
                    <ul className="space-y-2">
                      {jobMatches.marketTrends.map((trend, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">📈</span>
                          <span className="text-gray-700">{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Recommended Actions</h4>
                    <ul className="space-y-2">
                      {jobMatches.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✅</span>
                          <span className="text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resume Optimization Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  Optimize Resume for: {selectedJob.title}
                </h3>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Recommended Changes</h4>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm"><strong>Add these keywords:</strong> {selectedJob.skillsGap.join(", ")}</p>
                  <p className="text-sm"><strong>Emphasize:</strong> {selectedJob.skillsMatched.slice(0, 3).join(", ")}</p>
                  <p className="text-sm"><strong>Include:</strong> Experience with {selectedJob.frameworksUsed.join(", ")}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Original Resume</h5>
                  <textarea
                    value={resumeText}
                    readOnly
                    className="w-full h-64 border rounded-md p-3 bg-gray-50 text-sm"
                  />
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Optimized Version</h5>
                  <textarea
                    value={resumeChanges || "Click 'Generate Optimized Version' to see changes..."}
                    onChange={(e) => setResumeChanges(e.target.value)}
                    className="w-full h-64 border rounded-md p-3 text-sm"
                    placeholder="Optimized resume will appear here..."
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => generateResumeChanges(selectedJob)}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {isLoading ? "Generating..." : "Generate Optimized Version"}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resumeChanges);
                    alert("Optimized resume copied to clipboard!");
                  }}
                  disabled={!resumeChanges}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => applyToJob(selectedJob)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Apply with Optimized Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
