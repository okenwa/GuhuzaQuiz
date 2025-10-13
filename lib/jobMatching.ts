// Extended AI helper for job matching based on resume analysis

export type JobMatch = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  matchScore: number; // 0-100
  matchReasons: string[];
  requirements: string[];
  description: string;
  skillsMatched: string[];
  skillsGap: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  industry: string;
  applyUrl?: string;
  postedDate: string;
  benefits?: string[];
  remoteWork: boolean;
  frameworksUsed: string[];
  librariesUsed: string[];
  uiuxSkills: string[];
  aiAlgorithms?: string[];
  backendTech: string[];
};

export type JobPreferences = {
  location?: string[];
  jobType?: string[];
  salaryMin?: number;
  salaryMax?: number;
  remoteWork?: boolean;
  experienceLevel?: string[];
  industry?: string[];
  skills?: string[];
};

export type JobMatchResults = {
  matches: JobMatch[];
  totalMatches: number;
  topSkills: string[];
  suggestedSkills: string[];
  salaryInsights: {
    averageSalary: number;
    salaryRange: { min: number; max: number };
  };
  marketTrends: string[];
  recommendedActions: string[];
};

const buildJobMatchPrompt = (resumeText: string, preferences?: JobPreferences) => `You are an expert technical recruiter and job market analyst.
Analyze the following resume content and generate realistic job matches as valid JSON matching this TypeScript type:

type JobMatchResults = {
  matches: JobMatch[];
  totalMatches: number;
  topSkills: string[];
  suggestedSkills: string[];
  salaryInsights: { averageSalary: number; salaryRange: { min: number; max: number } };
  marketTrends: string[];
  recommendedActions: string[];
};

type JobMatch = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  salaryRange: { min: number; max: number; currency: string };
  matchScore: number; // 0-100
  matchReasons: string[];
  requirements: string[];
  description: string;
  skillsMatched: string[];
  skillsGap: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  industry: string;
  applyUrl?: string;
  postedDate: string;
  benefits?: string[];
  remoteWork: boolean;
  frameworksUsed: string[];
  librariesUsed: string[];
  uiuxSkills: string[];
  aiAlgorithms?: string[];
  backendTech: string[];
};

Rules:
- Generate 5-10 realistic job matches based on the resume
- Include a mix of match scores (70-95%)
- Focus on Framework, Library, UI/UX, AI Algorithm, and Backend development roles
- Make company names realistic but fictional
- Include current salary ranges for the role level
- Provide specific, actionable recommendations
- Consider the user preferences if provided: ${JSON.stringify(preferences || {})}

Resume:
"""
${resumeText}
"""`;

const mockJobMatches = (resumeText: string, preferences?: JobPreferences): JobMatchResults => {
  const baseJobs: JobMatch[] = [
    {
      id: 'job-001',
      title: 'Senior Full Stack Developer',
      company: 'TechFlow Solutions',
      location: 'Toronto, ON',
      type: 'Full-time',
      salaryRange: { min: 95000, max: 120000, currency: 'CAD' },
      matchScore: 92,
      matchReasons: [
        'Strong React and Node.js experience matches requirements',
        'Full-stack expertise aligns with role needs',
        'Previous leadership experience valued'
      ],
      requirements: [
        '5+ years React/TypeScript experience',
        'Node.js and Express.js proficiency',
        'Database design experience',
        'Team leadership skills'
      ],
      description: 'Lead development of modern web applications using React, Node.js, and cloud technologies.',
      skillsMatched: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'Git'],
      skillsGap: ['AWS', 'Docker', 'GraphQL'],
      experienceLevel: 'Senior',
      industry: 'Technology',
      postedDate: '2025-01-05',
      benefits: ['Health insurance', 'RRSP matching', 'Flexible hours'],
      remoteWork: true,
      frameworksUsed: ['React', 'Next.js', 'Express.js'],
      librariesUsed: ['Redux', 'Axios', 'Lodash'],
      uiuxSkills: ['Figma', 'Responsive Design', 'Material-UI'],
      aiAlgorithms: [],
      backendTech: ['Node.js', 'PostgreSQL', 'Redis']
    },
    {
      id: 'job-002',
      title: 'AI/ML Engineer',
      company: 'DataVision Analytics',
      location: 'Vancouver, BC',
      type: 'Full-time',
      salaryRange: { min: 110000, max: 140000, currency: 'CAD' },
      matchScore: 85,
      matchReasons: [
        'Programming background transferable to ML',
        'Strong analytical skills evident',
        'Growing field with opportunities'
      ],
      requirements: [
        'Python proficiency',
        'Machine learning frameworks',
        'Data analysis experience',
        'Statistical knowledge'
      ],
      description: 'Develop and deploy machine learning models for business intelligence and predictive analytics.',
      skillsMatched: ['Python', 'Data Analysis', 'Programming'],
      skillsGap: ['TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn'],
      experienceLevel: 'Mid',
      industry: 'Data Science',
      postedDate: '2025-01-03',
      benefits: ['Stock options', 'Learning budget', 'Remote work'],
      remoteWork: true,
      frameworksUsed: ['FastAPI', 'Flask'],
      librariesUsed: ['Pandas', 'NumPy', 'Matplotlib'],
      uiuxSkills: [],
      aiAlgorithms: ['Random Forest', 'Neural Networks', 'NLP', 'Computer Vision'],
      backendTech: ['Python', 'PostgreSQL', 'MongoDB']
    },
    {
      id: 'job-003',
      title: 'Frontend Developer',
      company: 'Creative Digital Studio',
      location: 'Montreal, QC',
      type: 'Full-time',
      salaryRange: { min: 70000, max: 90000, currency: 'CAD' },
      matchScore: 88,
      matchReasons: [
        'Strong frontend skills match perfectly',
        'UI/UX awareness valued',
        'Modern framework experience'
      ],
      requirements: [
        'React/Vue.js proficiency',
        'CSS/SCSS expertise',
        'Responsive design skills',
        'Version control (Git)'
      ],
      description: 'Create engaging user interfaces and experiences for web applications using modern frontend technologies.',
      skillsMatched: ['React', 'CSS', 'JavaScript', 'HTML', 'Git'],
      skillsGap: ['Vue.js', 'SCSS', 'Webpack'],
      experienceLevel: 'Mid',
      industry: 'Digital Agency',
      postedDate: '2025-01-04',
      benefits: ['Creative environment', 'Professional development', 'Flexible schedule'],
      remoteWork: false,
      frameworksUsed: ['React', 'Vue.js', 'Nuxt.js'],
      librariesUsed: ['Styled-components', 'Framer Motion', 'Three.js'],
      uiuxSkills: ['Figma', 'Adobe XD', 'Prototyping', 'User Testing'],
      aiAlgorithms: [],
      backendTech: []
    },
    {
      id: 'job-004',
      title: 'Backend Developer',
      company: 'CloudScale Systems',
      location: 'Calgary, AB',
      type: 'Full-time',
      salaryRange: { min: 85000, max: 110000, currency: 'CAD' },
      matchScore: 82,
      matchReasons: [
        'Server-side development experience',
        'Database knowledge applicable',
        'API development background'
      ],
      requirements: [
        'Node.js or Python backend experience',
        'RESTful API development',
        'Database design and optimization',
        'Cloud platform experience'
      ],
      description: 'Build scalable backend systems and APIs to support high-traffic web and mobile applications.',
      skillsMatched: ['Node.js', 'API Development', 'Database Design'],
      skillsGap: ['AWS', 'Microservices', 'Redis', 'Docker'],
      experienceLevel: 'Mid',
      industry: 'Cloud Services',
      postedDate: '2025-01-02',
      benefits: ['Cloud certification training', 'Health benefits', 'Performance bonuses'],
      remoteWork: true,
      frameworksUsed: ['Express.js', 'Fastify'],
      librariesUsed: ['Mongoose', 'Sequelize', 'JWT'],
      uiuxSkills: [],
      aiAlgorithms: [],
      backendTech: ['Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS']
    },
    {
      id: 'job-005',
      title: 'UI/UX Developer',
      company: 'DesignTech Innovations',
      location: 'Ottawa, ON',
      type: 'Hybrid',
      salaryRange: { min: 75000, max: 95000, currency: 'CAD' },
      matchScore: 78,
      matchReasons: [
        'Frontend development skills valuable',
        'User-focused development experience',
        'Design implementation abilities'
      ],
      requirements: [
        'Strong design principles knowledge',
        'Figma/Sketch proficiency',
        'HTML/CSS/JavaScript skills',
        'User experience research'
      ],
      description: 'Bridge design and development by creating intuitive user interfaces and conducting UX research.',
      skillsMatched: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
      skillsGap: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      experienceLevel: 'Mid',
      industry: 'Design Technology',
      postedDate: '2025-01-01',
      benefits: ['Design tool licenses', 'Conference attendance', 'Mentorship programs'],
      remoteWork: true,
      frameworksUsed: ['React', 'Svelte'],
      librariesUsed: ['Styled-components', 'Emotion'],
      uiuxSkills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Testing', 'Wireframing'],
      aiAlgorithms: [],
      backendTech: []
    }
  ];

  // Apply preferences filter if provided
  let filteredJobs = baseJobs;
  if (preferences) {
    if (preferences.jobType?.length) {
      filteredJobs = filteredJobs.filter(job => 
        preferences.jobType!.includes(job.type)
      );
    }
    if (preferences.salaryMin) {
      filteredJobs = filteredJobs.filter(job => 
        job.salaryRange.max >= preferences.salaryMin!
      );
    }
    if (preferences.remoteWork !== undefined) {
      filteredJobs = filteredJobs.filter(job => 
        job.remoteWork === preferences.remoteWork
      );
    }
  }

  return {
    matches: filteredJobs,
    totalMatches: filteredJobs.length,
    topSkills: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'Python', 'CSS'],
    suggestedSkills: ['AWS', 'Docker', 'GraphQL', 'TensorFlow', 'Vue.js', 'MongoDB'],
    salaryInsights: {
      averageSalary: 95000,
      salaryRange: { min: 70000, max: 140000 }
    },
    marketTrends: [
      'AI/ML roles seeing 40% growth in 2025',
      'Remote-first companies increasing demand',
      'Full-stack developers highly sought after',
      'Cloud skills premium increasing'
    ],
    recommendedActions: [
      'Learn cloud platforms (AWS/Azure) to increase market value',
      'Build a portfolio showcasing AI/ML projects',
      'Contribute to open-source projects',
      'Obtain relevant certifications'
    ]
  };
};

export async function generateJobMatches(resumeText: string, preferences?: JobPreferences): Promise<JobMatchResults> {
  // Try Guhuza proxy first
  const proxy = getGuhuzaProxyConfig();
  const fallback = mockJobMatches(resumeText, preferences);
  
  if (proxy) {
    try {
      const response = await fetch(proxy.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": proxy.apiKey,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You return strictly and only JSON." },
            { role: "user", content: buildJobMatchPrompt(resumeText, preferences) },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content ?? "";
        return parseJobMatchSafe(content, fallback);
      }
    } catch (_) {
      // fall through to OpenAI/mock
    }
  }

  // Fallback to OpenAI if configured
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallback;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You return strictly and only JSON." },
          { role: "user", content: buildJobMatchPrompt(resumeText, preferences) },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    return parseJobMatchSafe(content, fallback);
  } catch (_) {
    return fallback;
  }
}

function getGuhuzaProxyConfig() {
  const domain = process.env.GHZ_AI_API_DOMAIN?.trim();
  const apiKey = process.env.GHZ_AI_API_KEY?.trim();
  if (!domain || !apiKey) return null;
  const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;
  const url = `${baseUrl}/api/v2/ai/chat`;
  return { url, apiKey } as const;
}

function parseJobMatchSafe(text: string, fallback: JobMatchResults): JobMatchResults {
  try {
    const data = JSON.parse(text);
    // Minimal validation
    if (
      Array.isArray(data?.matches) &&
      typeof data?.totalMatches === "number" &&
      Array.isArray(data?.topSkills) &&
      Array.isArray(data?.suggestedSkills)
    ) {
      return data as JobMatchResults;
    }
  } catch (_) {
    // fallthrough to mock
  }
  return fallback;
}
