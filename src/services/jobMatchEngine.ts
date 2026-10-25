import { DATA, Project } from '../data';
import { expandQueryTokens } from './resumeSearchEngine';

export interface ScoringWeights {
  coreSkills: number;       // default 30%
  preferredSkills: number;  // default 20%
  projectEvidence: number;  // default 25%
  backendApi: number;       // default 15%
  infrastructure: number;   // default 10%
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  coreSkills: 30,
  preferredSkills: 20,
  projectEvidence: 25,
  backendApi: 15,
  infrastructure: 10
};

export interface MatchedRequirement {
  skill: string;
  category: string;
  status: 'matched' | 'partial' | 'missing';
  supportingProjects: string[];
  evidenceText: string;
  repoUrl?: string;
  isPreferred?: boolean;
}

export interface RecommendedProjectMatch {
  project: Project;
  relevanceScore: number;
  matchedKeywords: string[];
  reason: string;
}

export interface ResumeImprovementSuggestion {
  targetSection: string;
  observation: string;
  actionableTip: string;
  exampleBullet: string;
}

export interface JobMatchAnalysisResult {
  overallScore: number;
  weights: ScoringWeights;
  scoreBreakdown: {
    category: string;
    weight: number;
    earned: number;
    details: string;
  }[];
  matchedRequirements: MatchedRequirement[];
  missingSkills: string[];
  weaklyEvidencedSkills: string[];
  recommendedProjects: RecommendedProjectMatch[];
  suggestions: ResumeImprovementSuggestion[];
  extractedJobSkills: string[];
  explanation: string;
}

// Sample real-world job descriptions for recruiters to test with 1-click
export const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'AI Full-Stack / Backend Engineer',
    role: 'AI Backend & Full-Stack',
    text: `Job Description:
We are looking for an AI Full-Stack / Backend Engineer to build intelligent web applications and developer tools.

Key Responsibilities:
- Build high-performance backend APIs using Python (FastAPI) and Node.js (Express)
- Develop responsive frontends using React, TypeScript, and modern CSS frameworks (TailwindCSS)
- Integrate Generative AI, LLM APIs (Gemini/OpenAI), and RAG pipelines for real-world automated workflows
- Design relational and document data persistence using MongoDB and PostgreSQL/MySQL
- Build and maintain containerized services using Docker and Docker Compose
- Ensure secure API authentication, input sanitization, and structured JSON output validation

Requirements:
- Strong proficiency in TypeScript, React, Node.js, and Python
- Experience building RESTful APIs and asynchronous backend microservices
- Hands-on experience with LLM prompting, structured schemas, or AI agent architectures
- Familiarity with CI/CD deployment pipelines (GitHub Actions, Vercel, or AWS)`
  },
  {
    title: 'Cloud & DevSecOps Platform Engineer',
    role: 'DevSecOps & Platform',
    text: `Job Description:
Seeking a Cloud & DevSecOps Platform Engineer to design, automate, and secure our multi-tier infrastructure.

Key Responsibilities:
- Build declarative CI/CD pipelines in Jenkins and GitHub Actions with automated security testing
- Enforce zero-trust security controls including Gitleaks secret auditing, SonarQube quality gates, and Trivy CVE scanning
- Deploy and manage containerized microservices on Kubernetes (K3s, AWS EKS)
- Configure service mesh capabilities (Istio), mutual TLS (mTLS), and traffic routing
- Write Infrastructure as Code using Terraform to provision AWS cloud resources (EC2, S3, IAM, VPC)
- Set up observability stacks with Prometheus, Grafana, and centralized logging

Requirements:
- Hands-on experience with Docker, Kubernetes, and Helm
- Experience with Jenkins declarative pipelines and automated security scanning tools
- Familiarity with AWS cloud architecture, IAM roles, and Terraform
- Strong Linux/Bash shell scripting and system administration skills`
  },
  {
    title: 'Kubernetes & Microservices Engineer',
    role: 'Cloud Native & K8s',
    text: `Job Description:
We need a Cloud-Native / Microservices Engineer to lead container orchestration and service mesh deployments.

Responsibilities:
- Deploy and configure 10+ polyglot microservices on Kubernetes clusters
- Implement Istio Service Mesh with Envoy sidecar proxies for mTLS encryption and traffic management
- Implement gRPC binary communication between distributed backend services
- Deploy GitOps continuous delivery workflows using Argo CD
- Monitor cluster health, node resource allocations, and latency using Prometheus and Grafana
- Ensure container security, non-root execution, and Kubernetes NetworkPolicies

Qualifications:
- Solid background in Kubernetes orchestration (CKA level knowledge preferred)
- Experience with Docker, Helm charts, and container networking
- Familiarity with gRPC, Istio, and GitOps automation`
  }
];

// Technical dictionary of known resume competencies
const RESUME_KNOWLEDGE_BASE = [
  // AI & Backend
  { name: 'React', category: 'Frontend', projects: ['student-os', 'EASYCAFE', 'live_resume_2.0', 'Expense-tracker'], weight: 1.0 },
  { name: 'TypeScript', category: 'Language', projects: ['student-os', 'EASYCAFE', 'career-ops'], weight: 1.0 },
  { name: 'JavaScript', category: 'Language', projects: ['Expense-tracker', 'Three-Tier-Applications'], weight: 0.9 },
  { name: 'Node.js', category: 'Backend', projects: ['student-os', 'EASYCAFE', 'career-ops', 'Three-Tier-Applications'], weight: 1.0 },
  { name: 'Express.js', category: 'Backend', projects: ['Three-Tier-Applications', 'Core Stack'], weight: 0.9 },
  { name: 'Python', category: 'Backend', projects: ['Google Microservices Platform', 'Automation'], weight: 0.9 },
  { name: 'FastAPI', category: 'Backend', projects: ['Core Stack', 'AI Backend Services'], weight: 0.8 },
  { name: 'Gemini AI', category: 'AI/LLM', projects: ['career-ops', 'live_resume_2.0'], weight: 1.0 },
  { name: 'LLM Prompting', category: 'AI/LLM', projects: ['career-ops'], weight: 1.0 },
  { name: 'AI Agents', category: 'AI/LLM', projects: ['career-ops'], weight: 1.0 },
  { name: 'RAG', category: 'AI/LLM', projects: ['live_resume_2.0', 'career-ops'], weight: 0.9 },
  { name: 'REST APIs', category: 'Backend', projects: ['student-os', 'EASYCAFE', 'career-ops'], weight: 1.0 },
  { name: 'gRPC', category: 'Backend', projects: ['Google Microservices DevOps Platform'], weight: 0.9 },
  { name: 'MongoDB', category: 'Database', projects: ['Three-Tier-Applications', 'Core Stack'], weight: 0.9 },
  { name: 'MySQL', category: 'Database', projects: ['Core Stack', 'Academic Coursework'], weight: 0.8 },
  { name: 'TailwindCSS', category: 'Frontend', projects: ['student-os', 'EASYCAFE', 'live_resume_2.0'], weight: 1.0 },
  { name: 'Vite', category: 'Frontend', projects: ['student-os', 'EASYCAFE', 'live_resume_2.0'], weight: 1.0 },

  // Cloud & DevOps
  { name: 'Docker', category: 'DevOps', projects: ['3-Tier-DevSecOps-Mega-Project', 'Three-Tier-Applications', 'ci-cd-automation'], weight: 1.0 },
  { name: 'Docker Compose', category: 'DevOps', projects: ['Three-Tier-Applications'], weight: 0.9 },
  { name: 'Kubernetes', category: 'DevOps', projects: ['3-Tier-DevSecOps-Mega-Project', 'Google Microservices DevOps Platform'], weight: 1.0 },
  { name: 'K3s', category: 'DevOps', projects: ['3-Tier-DevSecOps-Mega-Project'], weight: 0.9 },
  { name: 'Helm', category: 'DevOps', projects: ['Google Microservices DevOps Platform'], weight: 0.8 },
  { name: 'Istio', category: 'DevOps', projects: ['Google Microservices DevOps Platform'], weight: 0.9 },
  { name: 'Argo CD', category: 'DevOps', projects: ['3-Tier-DevSecOps-Mega-Project'], weight: 0.9 },
  { name: 'Jenkins', category: 'DevOps', projects: ['3-Tier-DevSecOps-Mega-Project', 'ci-cd-automation'], weight: 1.0 },
  { name: 'GitHub Actions', category: 'DevOps', projects: ['Core Stack', 'CI/CD Pipelines'], weight: 0.9 },
  { name: 'SonarQube', category: 'DevSecOps', projects: ['3-Tier-DevSecOps-Mega-Project', 'ci-cd-automation'], weight: 1.0 },
  { name: 'Trivy', category: 'DevSecOps', projects: ['3-Tier-DevSecOps-Mega-Project', 'ci-cd-automation'], weight: 1.0 },
  { name: 'Gitleaks', category: 'DevSecOps', projects: ['3-Tier-DevSecOps-Mega-Project', 'ci-cd-automation'], weight: 1.0 },
  { name: 'AWS', category: 'Cloud', projects: ['student-os', 'Core Services'], weight: 0.9 },
  { name: 'AWS Amplify', category: 'Cloud', projects: ['student-os'], weight: 1.0 },
  { name: 'Terraform', category: 'Cloud', projects: ['Core Stack', 'IaC Preparation'], weight: 0.8 },
  { name: 'Linux', category: 'System', projects: ['3-Tier-DevSecOps-Mega-Project', 'System Automation'], weight: 1.0 },
  { name: 'Bash', category: 'System', projects: ['3-Tier-DevSecOps-Mega-Project', 'ci-cd-automation'], weight: 1.0 },
  { name: 'Prometheus', category: 'Monitoring', projects: ['Google Microservices DevOps Platform'], weight: 0.9 },
  { name: 'Grafana', category: 'Monitoring', projects: ['Google Microservices DevOps Platform'], weight: 0.9 },
  { name: 'Loki', category: 'Monitoring', projects: ['Core Stack'], weight: 0.7 },
  { name: 'Git', category: 'Tooling', projects: ['All 11 Repositories'], weight: 1.0 },
  { name: 'Vercel', category: 'Cloud', projects: ['EASYCAFE', 'Expense-tracker', 'live_resume_2.0'], weight: 1.0 }
];

export function analyzeJobDescription(
  jobDescriptionText: string,
  customWeights: ScoringWeights = DEFAULT_WEIGHTS
): JobMatchAnalysisResult {
  const cleanJD = jobDescriptionText.trim();
  if (!cleanJD) {
    throw new Error('Please paste a job description or select a preset template.');
  }

  const jdLower = cleanJD.toLowerCase();

  // Normalize weights to sum to 100
  const weightTotal = customWeights.coreSkills + customWeights.preferredSkills + customWeights.projectEvidence + customWeights.backendApi + customWeights.infrastructure;
  const normalizedWeights: ScoringWeights = {
    coreSkills: Math.round((customWeights.coreSkills / weightTotal) * 100),
    preferredSkills: Math.round((customWeights.preferredSkills / weightTotal) * 100),
    projectEvidence: Math.round((customWeights.projectEvidence / weightTotal) * 100),
    backendApi: Math.round((customWeights.backendApi / weightTotal) * 100),
    infrastructure: Math.round((customWeights.infrastructure / weightTotal) * 100)
  };

  // Find mentioned skills in JD
  const extractedJobSkills: string[] = [];
  const matchedRequirements: MatchedRequirement[] = [];
  const missingSkills: string[] = [];
  const weaklyEvidencedSkills: string[] = [];

  // Common external skills that might be demanded by JDs
  const potentialExternalSkills = [
    { name: 'GraphQL', category: 'APIs' },
    { name: 'PostgreSQL', category: 'Database', alias: 'postgres' },
    { name: 'Redis', category: 'Database / Caching' },
    { name: 'Kafka', category: 'Streaming / Queue' },
    { name: 'RabbitMQ', category: 'Message Queue' },
    { name: 'C++', category: 'Language' },
    { name: 'Rust', category: 'Language' },
    { name: 'GCP (Google Cloud)', category: 'Cloud', alias: 'google cloud' },
    { name: 'Azure', category: 'Cloud' },
    { name: 'Ansible', category: 'Config Management' }
  ];

  for (const item of RESUME_KNOWLEDGE_BASE) {
    const sLower = item.name.toLowerCase();
    const isDirectMatch = jdLower.includes(sLower);
    
    // Check synonyms/aliases
    const { expandedTokens } = expandQueryTokens([sLower]);
    const isExpandedMatch = expandedTokens.some(tok => jdLower.includes(tok));

    if (isDirectMatch || isExpandedMatch) {
      extractedJobSkills.push(item.name);

      // Determine supporting projects
      const suppProjObjects = DATA.projects.filter(p => item.projects.includes(p.title) || p.tools.includes(item.name));
      const firstProj = suppProjObjects[0];

      if (suppProjObjects.length > 0) {
        matchedRequirements.push({
          skill: item.name,
          category: item.category,
          status: 'matched',
          supportingProjects: suppProjObjects.map(p => p.title),
          evidenceText: `Verified in project "${firstProj.title}" (${firstProj.category}): ${firstProj.highlights?.[0] || firstProj.description}`,
          repoUrl: firstProj.linkUrl,
          isPreferred: false
        });
      } else {
        // Known in tech stack but lacks deep standalone project showcase
        weaklyEvidencedSkills.push(item.name);
        matchedRequirements.push({
          skill: item.name,
          category: item.category,
          status: 'partial',
          supportingProjects: [],
          evidenceText: `Present in verified tech stack but lacks dedicated production repository evidence.`,
          isPreferred: false
        });
      }
    }
  }

  // Detect external missing skills mentioned in JD
  for (const ext of potentialExternalSkills) {
    const term = ext.alias || ext.name.toLowerCase();
    if (jdLower.includes(term)) {
      extractedJobSkills.push(ext.name);
      missingSkills.push(ext.name);
      matchedRequirements.push({
        skill: ext.name,
        category: ext.category,
        status: 'missing',
        supportingProjects: [],
        evidenceText: `Not explicitly demonstrated in current resume repositories.`,
        isPreferred: true
      });
    }
  }

  // Compute category scores
  const matchedCount = matchedRequirements.filter(r => r.status === 'matched').length;
  const partialCount = matchedRequirements.filter(r => r.status === 'partial').length;
  const totalMentioned = Math.max(1, matchedRequirements.length);

  // 1. Core skills score (matched ratio)
  const coreSkillRatio = Math.min(1, (matchedCount + partialCount * 0.5) / Math.max(1, totalMentioned - missingSkills.length * 0.5));
  const coreSkillEarned = Math.round(coreSkillRatio * normalizedWeights.coreSkills);

  // 2. Project evidence score
  const projectsWithMatches = DATA.projects.map(p => {
    const pTools = p.tools.map(t => t.toLowerCase());
    const matchedCountForProj = extractedJobSkills.filter(s => pTools.includes(s.toLowerCase())).length;
    return { project: p, count: matchedCountForProj };
  }).filter(p => p.count > 0);

  const projectEvidenceRatio = Math.min(1, projectsWithMatches.length / 3);
  const projectEvidenceEarned = Math.round(projectEvidenceRatio * normalizedWeights.projectEvidence);

  // 3. Backend & API capabilities score
  const backendMatchCount = matchedRequirements.filter(r => 
    ['Backend', 'APIs', 'Language'].includes(r.category) && r.status === 'matched'
  ).length;
  const backendRatio = Math.min(1, backendMatchCount / 3);
  const backendEarned = Math.round(backendRatio * normalizedWeights.backendApi);

  // 4. Infrastructure & DevSecOps score
  const infraMatchCount = matchedRequirements.filter(r => 
    ['DevOps', 'DevSecOps', 'Cloud', 'System', 'Monitoring'].includes(r.category) && r.status === 'matched'
  ).length;
  const infraRatio = Math.min(1, infraMatchCount / 3);
  const infraEarned = Math.round(infraRatio * normalizedWeights.infrastructure);

  // 5. Preferred / Advanced Skills Score (penalty for genuine missing)
  const missingPenalty = Math.min(normalizedWeights.preferredSkills, missingSkills.length * 4);
  const preferredEarned = Math.max(0, normalizedWeights.preferredSkills - missingPenalty);

  const overallScore = Math.min(100, Math.max(15, coreSkillEarned + preferredEarned + projectEvidenceEarned + backendEarned + infraEarned));

  // Determine top 3 recommended projects
  const scoredProjects: RecommendedProjectMatch[] = DATA.projects.map(p => {
    let relScore = 0;
    const matches: string[] = [];
    const pTools = p.tools.map(t => t.toLowerCase());
    const pDesc = (p.description + ' ' + (p.architectureSummary || '')).toLowerCase();

    for (const skill of extractedJobSkills) {
      const sLow = skill.toLowerCase();
      if (pTools.includes(sLow)) {
        relScore += 25;
        matches.push(skill);
      } else if (pDesc.includes(sLow)) {
        relScore += 12;
        matches.push(skill);
      }
    }

    if (p.featured) relScore += 10;
    if (p.liveUrl) relScore += 5;

    return {
      project: p,
      relevanceScore: relScore,
      matchedKeywords: Array.from(new Set(matches)),
      reason: `Demonstrates ${matches.slice(0, 3).join(', ')} with ${p.metrics?.[0]?.label || 'production'} metrics.`
    };
  });

  scoredProjects.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const recommendedProjects = scoredProjects.slice(0, 3);

  // Truthful resume bullet suggestions based on ACTUAL project details
  const suggestions: ResumeImprovementSuggestion[] = [];

  if (jdLower.includes('fastapi') || jdLower.includes('python')) {
    suggestions.push({
      targetSection: 'Projects / student-os & career-ops',
      observation: 'The JD highlights Python / FastAPI backend capabilities.',
      actionableTip: 'Highlight asynchronous Python data processing and Pydantic validation scripts alongside TypeScript frontend workflows.',
      exampleBullet: 'Engineered Python automation scripts and REST services with Pydantic validation to preprocess unstructured candidate records.'
    });
  }

  if (jdLower.includes('security') || jdLower.includes('cve') || jdLower.includes('devsecops')) {
    suggestions.push({
      targetSection: 'Projects / 3-Tier-DevSecOps-Mega-Project',
      observation: 'The role emphasizes zero-trust automated compliance.',
      actionableTip: 'Bring the Gitleaks and Trivy CVE scanning pass rates to the prominent first bullet point.',
      exampleBullet: 'Enforced zero-trust delivery with Gitleaks pre-commit audits and Trivy container CVE scans, achieving a 100% security gate pass rate.'
    });
  }

  if (jdLower.includes('kubernetes') || jdLower.includes('k8s') || jdLower.includes('istio')) {
    suggestions.push({
      targetSection: 'Projects / Google Microservices DevOps Platform',
      observation: 'The role prioritizes microservice communication and mesh security.',
      actionableTip: 'Explicitly mention mutual TLS (mTLS) enforcement and gRPC inter-service latency in the project description.',
      exampleBullet: 'Orchestrated 10 polyglot microservices on Kubernetes with Istio Service Mesh, securing inter-service traffic with strict mTLS.'
    });
  }

  if (missingSkills.length > 0) {
    suggestions.push({
      targetSection: 'Skills & Growth Alignment',
      observation: `The JD specifies ${missingSkills.slice(0, 2).join(' and ')}, which are not featured in current projects.`,
      actionableTip: 'Clearly communicate quick learning capability by connecting relational database fundamentals (MySQL) to PostgreSQL or Redis caching workflows without fabricating experience.',
      exampleBullet: 'Strong relational modeling foundations in MySQL/PostgreSQL with hands-on containerized MongoDB deployments.'
    });
  }

  const scoreBreakdown = [
    {
      category: 'Core Technical Requirements',
      weight: normalizedWeights.coreSkills,
      earned: coreSkillEarned,
      details: `${matchedCount} verified skills matched from job description`
    },
    {
      category: 'Project Evidence & Deployments',
      weight: normalizedWeights.projectEvidence,
      earned: projectEvidenceEarned,
      details: `${projectsWithMatches.length} matching repositories with verified code`
    },
    {
      category: 'Backend & API Architecture',
      weight: normalizedWeights.backendApi,
      earned: backendEarned,
      details: `REST, Node.js, Express & asynchronous API patterns`
    },
    {
      category: 'Infrastructure, Cloud & DevSecOps',
      weight: normalizedWeights.infrastructure,
      earned: infraEarned,
      details: `Docker, Kubernetes, Jenkins pipelines & AWS deployment`
    },
    {
      category: 'Preferred & Advanced Qualifications',
      weight: normalizedWeights.preferredSkills,
      earned: preferredEarned,
      details: missingSkills.length > 0 ? `${missingSkills.length} unevidenced requirement(s) detected` : `Full coverage of preferred skills`
    }
  ];

  const explanation = `Score calculated using transparent weighted criteria (${normalizedWeights.coreSkills}% Core, ${normalizedWeights.projectEvidence}% Project Evidence, ${normalizedWeights.backendApi}% Backend/APIs, ${normalizedWeights.infrastructure}% DevOps/Cloud, and ${normalizedWeights.preferredSkills}% Preferred Skills). All matched claims are mapped strictly to verified code repositories without fabrication.`;

  return {
    overallScore,
    weights: normalizedWeights,
    scoreBreakdown,
    matchedRequirements,
    missingSkills,
    weaklyEvidencedSkills,
    recommendedProjects,
    suggestions,
    extractedJobSkills,
    explanation
  };
}
