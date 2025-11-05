"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import JobMatchingSection from "@/app/components/JobMatchingSection";

interface ResumeReport {
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  overallScore: number;
  // Extended analysis data
  atsScore: number;
  tailoringTips: Array<{
    title: string;
    bullets: string[];
  }>;
  actionItems: string[];
  atsTips: string[];
  contactInfo: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    extracted?: { email?: string; phone?: string; linkedin?: string };
  };
  dateFormatting: { pattern?: string; consistency?: string };
  fileType?: string;
  measurableResults: { present: boolean; examples?: string[] };
  resumeTone?: string;
  webPresence: { links: string[]; suggestions: string[] };
  formattingAudit: {
    fontConsistency?: string;
    layout?: string;
    pageSetup?: string;
    suggestions: string[];
  };
  overusedActionVerbs?: Array<{ verb: string; count: number }>;
}

function ResumeUploadSection({ error, setError, onReportGenerated }: { 
  error: string | null;
  setError: (error: string | null) => void;
  onReportGenerated: (report: any, resumeText: string) => void; 
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please upload a PDF, DOCX, or TXT file.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    
    try {
      let resumeText = "";
      
      console.log('Starting file parsing...', { fileName: file.name, fileType: file.type });
      
      // Parse file based on type
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".pdf")) {
        console.log('Parsing PDF file...');
        const { parsePdfToText } = await import("@/lib/fileParsers");
        resumeText = await parsePdfToText(file);
        console.log('PDF parsed successfully. Length:', resumeText.length);
      } else if (fileName.endsWith(".docx")) {
        console.log('Parsing DOCX file...');
        const { parseDocxToText } = await import("@/lib/fileParsers");
        resumeText = await parseDocxToText(file);
        console.log('DOCX parsed successfully. Length:', resumeText.length);
      } else if (fileName.endsWith(".txt") || file.type.includes("text")) {
        console.log('Reading text file...');
        resumeText = await file.text();
        console.log('Text file read successfully. Length:', resumeText.length);
      } else {
        const errorMsg = 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.';
        console.error(errorMsg);
        setError(errorMsg);
        alert(errorMsg);
        return;
      }

      if (!resumeText || resumeText.trim().length < 50) {
        const errorMsg = 'The file appears to be empty or too short. Please upload a valid resume.';
        console.error(errorMsg);
        setError(errorMsg);
        alert(errorMsg);
        return;
      }

      console.log('Sending data to API...', { resumeTextLength: resumeText.length });

      // Send the parsed text to the API
      const response = await fetch('/api/resume/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeText,
          fileName: file.name,
          mimeType: file.type
        }),
      });

      console.log('API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data);
        
        if (data.success && data.report) {
          // Call the callback to show the report directly
          onReportGenerated(data.report, data.resumeText || '');
          console.log('Report generated successfully');
        } else {
          const errorMsg = 'Failed to generate report: ' + (data.message || 'Unknown error');
          console.error(errorMsg);
          setError(errorMsg);
          alert(errorMsg);
        }
      } else {
        let errorMessage = 'Failed to upload resume';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('API error:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        setError(errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setError('Failed to upload resume: ' + errorMsg);
      alert('Failed to upload resume. Please check the console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📄 Resume Analysis & Job Matching
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your resume to get instant analysis and personalized job recommendations
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <div className="mb-4">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your resume here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOCX, TXT (Max 10MB)
              </p>
            </div>

            <input
              type="file"
              className="hidden"
              id="resume-upload"
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Choose File
            </label>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {file && (
            <div className="mt-6 text-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-md transition-colors flex items-center gap-2 mx-auto"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    🚀 Analyze Resume & Find Jobs
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Resume Analysis</h3>
            <p className="text-gray-600 text-sm">Get detailed insights into your resume's strengths and areas for improvement</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-900 mb-2">Job Matching</h3>
            <p className="text-gray-600 text-sm">Find personalized job recommendations based on your skills and experience</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-bold text-gray-900 mb-2">Optimization Tips</h3>
            <p className="text-gray-600 text-sm">Receive actionable suggestions to improve your resume for each job application</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [report, setReport] = useState<ResumeReport | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for expandable sections
  const [showQuantificationHelp, setShowQuantificationHelp] = useState(false);
  const [showNegativeWords, setShowNegativeWords] = useState(false);

  const handleReportGenerated = (newReport: ResumeReport, newResumeText: string) => {
    setReport(newReport);
    setResumeText(newResumeText);
    setError(null);
    setLoading(false);
  };

  const handleUploadNewResume = () => {
    // Clear the current report to show the upload form
    setReport(null);
    setResumeText("");
    setError(null);
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signup");
      return;
    }
    fetchReport();
  }, [session, status, router]);

  const fetchReport = async () => {
    try {
      const response = await fetch("/api/resume/report");
      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
        setResumeText(data.resumeText || "");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch resume report");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Failed to fetch resume report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return <ResumeUploadSection error={error} setError={setError} onReportGenerated={handleReportGenerated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Resume Report
            </h1>
          </div>
          <div className="hidden md:block print:block">
            <Image 
              src="/mascot/resume_mascot.png" 
              alt="Resume Analysis Mascot" 
              width={200} 
              height={200}
              className="object-contain"
            />
          </div>
        </div>

        {/* ATS Tip Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">ATS Tips</h2>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <span className="text-green-600 text-xl">✓</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            {report.atsTips && report.atsTips.length > 0 ? (
              <div className="flex-1">
                <p className="text-gray-700 mb-3">Here are important ATS (Applicant Tracking System) optimization tips for your resume:</p>
                <ul className="space-y-2">
                  {report.atsTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-700 flex-1">
                Your resume follows good ATS practices. For even better optimization, ensure you're using standard section headings and saving your resume in PDF or DOCX format.
              </p>
            )}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            <span className="ml-2 text-gray-400 text-sm">?</span>
          </div>
          <div className="space-y-3">
            {!report.contactInfo?.hasEmail && (
              <div className="flex items-start">
                <span className="text-red-600 text-xl mr-3">✗</span>
                <div>
                  <p className="text-gray-900">We did not find an email in your resume. Add an email so that recruiters have a means to contact you.</p>
                </div>
              </div>
            )}
            {report.contactInfo?.hasEmail && (
              <div className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div>
                  <p className="text-gray-900">Email found: {report.email}</p>
                </div>
              </div>
            )}
            {!report.contactInfo?.hasPhone && report.phone && (
              <div className="flex items-start">
                <span className="text-red-600 text-xl mr-3">✗</span>
                <div>
                  <p className="text-gray-900">We did not find a phone number in your resume. Some recruiters prefer a phone call to email.</p>
                </div>
              </div>
            )}
            {report.contactInfo?.hasPhone && report.phone && (
              <div className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div>
                  <p className="text-gray-900">Phone number found: {report.phone}</p>
                </div>
              </div>
            )}
            {!report.contactInfo?.hasPhone && !report.phone && (
              <div className="flex items-start">
                <span className="text-red-600 text-xl mr-3">✗</span>
                <div>
                  <p className="text-gray-900">We did not find a phone number in your resume. Some recruiters prefer a phone call to email.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {report.summary && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Summary</h2>
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">We found a summary section on your resume. Good job! The summary provides a quick overview of the candidate's qualifications, helping recruiters and hiring managers promptly grasp the value the candidate can offer in the position.</p>
              </div>
            </div>
          </div>
        )}

        {/* Section Headings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Section Headings</h2>
            <span className="ml-2 text-gray-400 text-sm">?</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">We found the education section in your resume.</p>
              </div>
            </div>
            {(report.experience || []).length > 0 && (
              <div className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div>
                  <p className="text-gray-900">We found the work experience section in your resume.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date Formatting */}
        {report.dateFormatting && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Date Formatting</h2>
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">ATS and recruiters prefer specific date formatting for your work experience. Please use the following formats: "MM/YY or MM/YYYY or Month YYYY" (e.g. 03/19, 03/2019, Mar 2019 or March 2019).</p>
              </div>
            </div>
          </div>
        )}

        {/* File Type */}
        {report.fileType && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">File Type</h2>
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div>
                  <p className="text-gray-900">You are using a {report.fileType} resume, which is the preferred format for most ATS systems.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Measurable Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Measurable Results</h2>
            <span className="ml-2 text-gray-400 text-sm">?</span>
          </div>
          {report.measurableResults?.present && report.measurableResults?.examples && report.measurableResults.examples.length >= 5 ? (
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900 mb-2">
                  Great! We found {report.measurableResults.examples.length} quantified achievements in your resume. Keep it up - employers like to see the impact and results that you had on the job.
                </p>
                {report.measurableResults.examples.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-700 text-sm font-semibold">Examples found:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {report.measurableResults.examples.slice(0, 3).map((example, idx) => (
                        <li key={idx}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">✗</span>
              <div>
                <p className="text-gray-900 mb-2">
                  Your resume needs more specific numbers. Using hard numbers to describe your achievements is important, even if you're entry-level.
                </p>
                {report.measurableResults?.examples && report.measurableResults.examples.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-700 text-sm font-semibold">Found {report.measurableResults.examples.length} measurable result(s):</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {report.measurableResults.examples.map((example, idx) => (
                        <li key={idx}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Paragraph Length */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Paragraph Length</h2>
            <span className="ml-2 text-gray-400 text-sm">?</span>
          </div>
          <div className="flex items-start">
            <span className="text-red-600 text-xl mr-3">✗</span>
            <div>
              <p className="text-gray-900">Some of your paragraphs are longer than 40 words. Consider shortening them for readability to bring attention to your skills and accomplishments.</p>
            </div>
          </div>
        </div>

        {/* Resume Tone */}
        {report.resumeTone && report.resumeTone !== "professional and impact-focused" && report.resumeTone !== "Positive and professional" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Resume Tone</h2>
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-600 text-xl mr-3">⚠</span>
              <div className="flex-1">
                <p className="text-gray-900 mb-3">{report.resumeTone}</p>
                <button 
                  onClick={() => setShowNegativeWords(!showNegativeWords)}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  View Common Clichés to Avoid
                </button>
                {showNegativeWords && (
                  <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-gray-700 text-sm font-semibold mb-2">Common negative phrases and clichés to avoid:</p>
                    <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                      <li>"I think" or "I believe" - be more confident</li>
                      <li>"Sorry" or "Apologies" - unnecessary</li>
                      <li>"Hard worker" or "team player" - overused clichés</li>
                      <li>"Think outside the box" - avoid this phrase</li>
                      <li>"References available upon request" - outdated</li>
                      <li>"Responsible for" - use action verbs instead</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Web Presence */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Web Presence</h2>
            <span className="ml-2 text-gray-400 text-sm">?</span>
          </div>
          {report.webPresence?.links && report.webPresence.links.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <div>
                  <p className="text-gray-900">Found the following web presence:</p>
                  <div className="mt-2 space-y-1">
                    {report.webPresence.links.map((link, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-blue-600 font-medium mr-2">•</span>
                        <a 
                          href={`https://${link}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {link}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {report.webPresence.suggestions && report.webPresence.suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-gray-700 text-sm mb-2">Suggestions:</p>
                  <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
                    {report.webPresence.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">✗</span>
              <div>
                <p className="text-gray-900">Consider adding a website or LinkedIn url to build your web credibility. Recruiters appreciate the convenience and credibility associated with a professional website.</p>
              </div>
            </div>
          )}
        </div>

        {/* Divider for Formatting Section */}
        <div className="mt-12 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Formatting</h2>
        </div>

        {/* Font Check */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Font Check</h3>
            <span className="ml-2 text-gray-400 text-sm">?</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your resume makes use of sparse bold styling. This increases readability for a recruiter.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your font is in a readable color.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your resume does not overuse different fonts.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your resume uses a standard font.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">The average font size of your resume meets readability and ATS standards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Layout</h3>
            <span className="ml-2 text-gray-400 text-sm">?</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your resume doesn't contain images.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your resume does not contain any tables.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your resume primarily uses standardized left alignment for text sections.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Setup */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Page Setup</h3>
            <span className="ml-2 text-gray-400 text-sm">?</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your resume does not contain information in footers.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your resume does not contain information in headers.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your margin sizes are all consistent and standard sizes.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 text-xl mr-3">✓</span>
              <div>
                <p className="text-gray-900">Your document page size is standard.</p>
              </div>
            </div>
          </div>
        </div>



        {/* Action Verb Overuse Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start">
            {report.overusedActionVerbs && report.overusedActionVerbs.length > 0 ? (
              <>
                <span className="text-yellow-600 text-xl mr-3 mt-1">⚠</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Change repetitive action verbs</h3>
                  <p className="text-gray-700 mb-3">
                    We found that you overused action verbs on your resume. Using the same action verbs more than 2 times reduces your resume's impact since it makes it harder for your achievements to stand out.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Review the following words and, where it makes sense, try to replace them with unique action verbs - this shows hiring managers that you have a range of different skill sets.
                  </p>
                  <div className="space-y-2">
                    {report.overusedActionVerbs.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-red-600 font-semibold">
                          {index + 1}. {item.verb} ({item.count} times)
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 underline font-medium text-sm">
                          Show lines
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className="text-green-600 text-xl mr-3 mt-1">✓</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Action Verb Variety</h3>
                  <p className="text-gray-900">
                    Great! Your resume uses a good variety of action verbs without overusing any particular word. This helps your achievements stand out and demonstrates a range of skills.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Checks Passed Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">CHECKS PASSED</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span className="text-gray-900">No repetitive phrases</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✓</span>
                <span className="text-gray-900">No repetitive bullet points</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Measurable Results with Progress Bar */}
        {(!report.measurableResults?.present || !report.measurableResults?.examples || report.measurableResults.examples.length < 5) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3 mt-1">✗</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your resume needs more specific numbers.</h3>
                <p className="text-gray-700 mb-4">
                  Using hard numbers to describe your achievements is important, even if you're entry-level. You don't have enough of them, so let's show you how to improve this.
                </p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="relative">
                    {/* Background gradient bar */}
                    <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-green-500"></div>
                    {/* Purple indicator - position based on actual count */}
                    {report.measurableResults?.examples && (
                      <>
                        <div 
                          className="absolute top-0 flex flex-col items-center transition-all duration-300"
                          style={{ left: `${Math.min(100, Math.max(0, (report.measurableResults.examples.length / 13) * 100))}%` }}
                        >
                          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-transparent border-t-purple-600 mb-1"></div>
                        </div>
                        {/* Labels */}
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>0</span>
                          <span className="font-semibold text-gray-900">
                            {report.measurableResults.examples.length} of 13 bullets quantified
                          </span>
                          <span>13</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Expandable section */}
                <div 
                  onClick={() => setShowQuantificationHelp(!showQuantificationHelp)}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-700 font-medium">What do hard numbers and quantifying impact mean?</span>
                  <svg 
                    className={`w-5 h-5 text-gray-600 transition-transform ${showQuantificationHelp ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showQuantificationHelp && (
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-700 text-sm">
                      Hard numbers are specific, measurable metrics that demonstrate your impact. Examples include:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700 list-disc list-inside">
                      <li>Increased sales by 25%</li>
                      <li>Managed a team of 10 employees</li>
                      <li>Reduced costs by $50,000</li>
                      <li>Improved efficiency by 30%</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Job Matching Section */}
        <div className="print:hidden">
          <JobMatchingSection resumeText={resumeText} report={report} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 print:hidden">
          <button
            onClick={handleUploadNewResume}
            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
          >
            Upload New Resume
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
