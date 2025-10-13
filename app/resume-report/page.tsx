"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
}

function ResumeUploadSection({ error, onReportGenerated }: { 
  error: string | null; 
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
    try {
      // Parse the file to text based on its type
      let resumeText = '';
      
      console.log('Parsing file:', file.name, 'Type:', file.type);
      
      if (file.type === 'application/pdf') {
        // Parse PDF
        try {
          const { parsePdfToText } = await import('@/lib/fileParsers');
          resumeText = await parsePdfToText(file);
          console.log('PDF parsed, length:', resumeText.length);
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          alert('Failed to parse PDF file. Please ensure it\'s a valid PDF with text content.');
          return;
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Parse DOCX
        try {
          const { parseDocxToText } = await import('@/lib/fileParsers');
          resumeText = await parseDocxToText(file);
          console.log('DOCX parsed, length:', resumeText.length);
        } catch (docxError) {
          console.error('DOCX parsing error:', docxError);
          alert('Failed to parse DOCX file. Please ensure it\'s a valid Word document.');
          return;
        }
      } else if (file.type === 'text/plain') {
        // Plain text
        resumeText = await file.text();
        console.log('Text file parsed, length:', resumeText.length);
      } else {
        alert('Unsupported file type');
        return;
      }

      // Validate parsed text
      if (!resumeText || resumeText.trim().length < 50) {
        console.error('Parsed text too short:', resumeText.length, 'characters');
        alert('Could not extract enough text from the file. Please ensure your resume contains text (not just images) and try again.');
        return;
      }

      console.log('Sending resume text to API...');

      // Send the parsed text to the API
      const response = await fetch('/api/resume/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          fileName: file.name,
          mimeType: file.type,
        }),
      });

      console.log('API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data);
        if (data.success && data.report) {
          // Call the callback to show the report directly
          onReportGenerated(data.report, data.resumeText || '');
        } else {
          alert('Failed to generate report');
        }
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
        alert(errorData.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload resume. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
          <div className="flex justify-center items-center gap-4 mb-4">
          <img 
              src="/logo/logo_black_large.png" 
              alt="Guhuza Logo" 
              className="h-16 w-auto print:h-12"
            />
            <img 
              src="/mascot/resume_mascot.png" 
              alt="Resume Analysis Mascot" 
              className="h-32 w-auto print:h-24"
            />
           
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 print:text-2xl">
            Resume Analysis & Job Matching
          </h1>
          <p className="text-gray-600 text-lg print:text-base">
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

  const handleReportGenerated = (newReport: ResumeReport, newResumeText: string) => {
    setReport(newReport);
    setResumeText(newResumeText);
    setError(null);
    setLoading(false);
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
    return <ResumeUploadSection error={error} onReportGenerated={handleReportGenerated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-6 print:shadow-none print:border print:border-gray-300">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center">
               <img 
                 src="/logo/logo_black_large.png" 
                 alt="Guhuza Logo" 
                 className="h-10 w-auto mr-4 print:h-8"
               />
               <img 
                 src="/mascot/resume_mascot.png" 
                 alt="Resume Report Mascot" 
                 className="h-20 w-auto mr-4 print:h-16"
               />
             </div>
             <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">
               Resume Report
             </h1>
           </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {report.overallScore}%
              </div>
              <div className="text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {(report.strengths || []).length}
              </div>
              <div className="text-gray-600">Key Strengths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {(report.skills || []).length}
              </div>
              <div className="text-gray-600">Skills Found</div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">👤 Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Name</h3>
              <p className="text-gray-900">{report.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Email</h3>
              <p className="text-gray-900">{report.email}</p>
            </div>
            {report.phone && (
              <div>
                <h3 className="font-semibold text-gray-700">Phone</h3>
                <p className="text-gray-900">{report.phone}</p>
              </div>
            )}
          </div>
          {report.summary && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Summary</h3>
              <p className="text-gray-900 mt-2">{report.summary}</p>
            </div>
          )}
        </div>

        {/* Skills Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-green-700">💪 Strengths</h2>
            <div className="space-y-2">
              {(report.strengths || []).map((strength, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-800">{strength}</span>
                </div>
              ))}
              {(!report.strengths || report.strengths.length === 0) && (
                <p className="text-gray-500 text-sm">Analyzing strengths...</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-orange-700">🎯 Areas to Improve</h2>
            <div className="space-y-2">
              {(report.weaknesses || []).map((weakness, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-orange-600 mr-2">!</span>
                  <span className="text-gray-800">{weakness}</span>
                </div>
              ))}
              {(!report.weaknesses || report.weaknesses.length === 0) && (
                <p className="text-gray-500 text-sm">Analyzing areas for improvement...</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🛠 Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(report.skills || []).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          {(!report.skills || report.skills.length === 0) && (
            <p className="text-gray-500 text-sm">No technical skills detected. Consider adding a skills section to your resume.</p>
          )}
        </div>

        {/* Experience */}
        {(report.experience || []).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">💼 Work Experience</h2>
            <div className="space-y-4">
              {(report.experience || []).map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {(report.education || []).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">🎓 Education</h2>
            <div className="space-y-3">
              {(report.education || []).map((edu, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-gray-500">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATS Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🤖 ATS (Applicant Tracking System) Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <div className={`text-3xl font-bold mr-4 ${
                  report.atsScore >= 80 ? 'text-green-600' :
                  report.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {report.atsScore}%
                </div>
                <div>
                  <h3 className="font-semibold">ATS Compatibility Score</h3>
                  <p className="text-sm text-gray-600">
                    {report.atsScore >= 80 ? 'Excellent ATS compatibility' :
                     report.atsScore >= 60 ? 'Good ATS compatibility' : 'Needs ATS optimization'}
                  </p>
                </div>
              </div>
              
              {/* Contact Information Analysis */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <span className={`mr-2 ${report.contactInfo?.hasEmail ? 'text-green-600' : 'text-red-600'}`}>
                      {report.contactInfo?.hasEmail ? '✓' : '✗'}
                    </span>
                    Email {report.contactInfo?.hasEmail ? 'detected' : 'missing'}
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 ${report.contactInfo?.hasPhone ? 'text-green-600' : 'text-orange-600'}`}>
                      {report.contactInfo?.hasPhone ? '✓' : '!'}
                    </span>
                    Phone {report.contactInfo?.hasPhone ? 'detected' : 'recommended'}
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 ${report.contactInfo?.hasLinkedIn ? 'text-green-600' : 'text-orange-600'}`}>
                      {report.contactInfo?.hasLinkedIn ? '✓' : '!'}
                    </span>
                    LinkedIn {report.contactInfo?.hasLinkedIn ? 'detected' : 'recommended'}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">ATS Optimization Tips</h4>
              <div className="space-y-2">
                {(report.atsTips || []).map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Items & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">📋 Action Items</h2>
            <div className="space-y-3">
              {(report.actionItems || []).map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">🎯 Tailoring Tips</h2>
            <div className="space-y-4">
              {(report.tailoringTips || []).map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-blue-700 mb-2">{section.title}</h4>
                  <div className="space-y-1">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700 text-sm">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Measurable Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">📊 Measurable Results</h2>
            <div className="mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                report.measurableResults?.present ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {report.measurableResults?.present ? '✓ Results Present' : '! Missing Metrics'}
              </div>
            </div>
            {report.measurableResults?.examples && report.measurableResults.examples.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Examples Found:</h4>
                <div className="space-y-2">
                  {report.measurableResults.examples.map((example, index) => (
                    <div key={index} className="bg-green-50 p-2 rounded text-sm">
                      <span className="text-green-700">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!report.measurableResults?.present && (
              <p className="text-gray-600 text-sm">
                Consider adding quantified achievements with numbers, percentages, or dollar amounts to strengthen your resume.
              </p>
            )}
          </div>

          {/* File & Format Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">📄 Format Analysis</h2>
            
            {report.fileType && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">File Type</h4>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {report.fileType}
                </span>
              </div>
            )}

            {report.resumeTone && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Resume Tone</h4>
                <p className="text-gray-700 text-sm">{report.resumeTone}</p>
              </div>
            )}

            {report.dateFormatting?.pattern && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Date Formatting</h4>
                <p className="text-gray-700 text-sm">
                  Pattern: {report.dateFormatting.pattern}
                  {report.dateFormatting.consistency && (
                    <span className="block">Consistency: {report.dateFormatting.consistency}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Web Presence & Formatting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Web Presence */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">🌐 Web Presence</h2>
            
            {report.webPresence?.links && report.webPresence.links.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Links Found</h4>
                <div className="space-y-2">
                  {report.webPresence.links.map((link, index) => (
                    <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                      <span className="text-blue-700">{link}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.webPresence?.suggestions && report.webPresence.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Suggestions</h4>
                <div className="space-y-1">
                  {report.webPresence.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700 text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!report.webPresence?.links?.length && !report.webPresence?.suggestions?.length) && (
              <p className="text-gray-600 text-sm">
                Consider adding portfolio links, GitHub profile, or LinkedIn URL to showcase your work.
              </p>
            )}
          </div>

          {/* Formatting Audit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">🎨 Formatting Audit</h2>
            
            {report.formattingAudit?.fontConsistency && (
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800 mb-1">Font Consistency</h4>
                <p className="text-gray-700 text-sm">{report.formattingAudit.fontConsistency}</p>
              </div>
            )}

            {report.formattingAudit?.layout && (
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800 mb-1">Layout</h4>
                <p className="text-gray-700 text-sm">{report.formattingAudit.layout}</p>
              </div>
            )}

            {report.formattingAudit?.pageSetup && (
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800 mb-1">Page Setup</h4>
                <p className="text-gray-700 text-sm">{report.formattingAudit.pageSetup}</p>
              </div>
            )}

            {report.formattingAudit?.suggestions && report.formattingAudit.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Formatting Suggestions</h4>
                <div className="space-y-1">
                  {report.formattingAudit.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700 text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Matching Section */}
        <JobMatchingSection resumeText={resumeText} report={report} />

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => {
              setReport(null);
              setResumeText("");
              setError(null);
            }}
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
