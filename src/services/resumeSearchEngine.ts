import { DATA, Project } from '../data';

export interface SearchIndexItem {
  id: string;
  sectionId: string;
  sectionName: 'About' | 'Capabilities' | 'Experience' | 'Projects' | 'Tech Stack' | 'Certifications' | 'Overview';
  type: 'project' | 'skill' | 'capability' | 'experience' | 'certification' | 'summary';
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
  evidence: string[];
  linkUrl?: string;
  liveUrl?: string;
  rawProject?: Project;
}

export interface SearchMatch {
  item: SearchIndexItem;
  score: number;
  matchedTerms: string[];
  matchHighlights: {
    title: string;
    snippet: string;
  };
  matchedSectionId: string;
}

export interface GroupedSearchResults {
  sectionName: string;
  sectionId: string;
  matches: SearchMatch[];
}

export interface SearchResultSummary {
  query: string;
  totalMatches: number;
  executionTimeMs: number;
  traversedSections: string[];
  matchedSections: string[];
  resultsBySection: GroupedSearchResults[];
  flatResults: SearchMatch[];
  expandedTerms: string[];
}

// Technical terminology and alias dictionary
const TECHNICAL_SYNONYMS: Record<string, string[]> = {
  k8s: ['kubernetes', 'k3s', 'eks', 'orchestration', 'helm', 'kubectl'],
  kubernetes: ['k8s', 'k3s', 'eks', 'orchestration', 'helm', 'kubectl', 'pods', 'cluster'],
  py: ['python', 'fastapi', 'scripting'],
  python: ['py', 'fastapi', 'backend', 'automation'],
  fastapi: ['python', 'backend', 'api', 'rest', 'pydantic'],
  docker: ['container', 'containerization', 'dockerfile', 'docker compose', 'docker hub'],
  containers: ['docker', 'kubernetes', 'k8s', 'k3s', 'containerization', 'microservices'],
  postgres: ['postgresql', 'sql', 'database', 'rdbms', 'relational'],
  postgresql: ['postgres', 'sql', 'database', 'rdbms'],
  sql: ['mysql', 'database', 'rdbms', 'postgresql', 'queries'],
  nosql: ['mongodb', 'mongo', 'document database'],
  mongo: ['mongodb', 'nosql', 'database', 'collection'],
  mongodb: ['mongo', 'nosql', 'database'],
  ci: ['jenkins', 'github actions', 'pipeline', 'continuous integration', 'cicd'],
  cd: ['argo cd', 'argocd', 'gitops', 'deployment', 'continuous deployment'],
  cicd: ['jenkins', 'github actions', 'argo cd', 'pipeline', 'devsecops', 'automation'],
  devops: ['ci/cd', 'jenkins', 'kubernetes', 'docker', 'terraform', 'aws', 'monitoring', 'gitops'],
  devsecops: ['gitleaks', 'trivy', 'sonarqube', 'security', 'jenkins', 'zero-trust', 'cve'],
  security: ['devsecops', 'gitleaks', 'trivy', 'sonarqube', 'mtls', 'istio', 'rbac', 'zero-trust', 'secret scanning'],
  ai: ['llm', 'rag', 'agents', 'gemini', 'openai', 'inference', 'machine learning', 'artificial intelligence'],
  llm: ['ai', 'rag', 'agents', 'gemini', 'prompt', 'large language model'],
  rag: ['ai', 'llm', 'retrieval', 'vector', 'embeddings', 'knowledge base'],
  agents: ['ai', 'llm', 'career-ops', 'autonomous', 'cli', 'automation'],
  iac: ['terraform', 'infrastructure as code', 'hashicorp'],
  terraform: ['iac', 'infrastructure as code', 'hashicorp', 'cloud provisioning'],
  aws: ['cloud', 'ec2', 's3', 'eks', 'iam', 'vpc', 'cloudfront', 'amplify'],
  cloud: ['aws', 'amplify', 'ec2', 's3', 'eks', 'cloud-native', 'infrastructure'],
  istio: ['service mesh', 'mtls', 'envoy', 'traffic management', 'canary', 'grpc'],
  api: ['rest', 'grpc', 'fastapi', 'express', 'endpoints', 'http'],
  rest: ['api', 'endpoints', 'http', 'json', 'express', 'fastapi'],
  grpc: ['api', 'rpc', 'protobuf', 'istio', 'microservices', 'inter-service'],
  monitoring: ['prometheus', 'grafana', 'loki', 'cloudwatch', 'telemetry', 'observability', 'metrics'],
  observability: ['prometheus', 'grafana', 'loki', 'telemetry', 'monitoring', 'distributed tracing'],
  git: ['github', 'version control', 'commits', 'pr', 'pull shark', 'branch'],
  github: ['git', 'repositories', 'open source', 'pull shark', 'commit'],
  frontend: ['react', 'typescript', 'vite', 'tailwindcss', 'javascript', 'html', 'css', 'ui'],
  backend: ['node.js', 'express', 'fastapi', 'python', 'mongodb', 'rest apis', 'database', 'microservices'],
  fullstack: ['react', 'node.js', 'express', 'typescript', 'mongodb', 'fastapi', 'python'],
  'full-stack': ['react', 'node.js', 'express', 'typescript', 'mongodb', 'fastapi', 'python'],
  ts: ['typescript', 'javascript', 'type-safe'],
  js: ['javascript', 'typescript', 'node.js']
};

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let i = 0; i <= bn; ++i) matrix[i][0] = i;
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[bn][an];
}

// Build comprehensive index from raw DATA
export function buildResumeIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];

  // 1. Overview & Professional Summary
  items.push({
    id: 'summary-profile',
    sectionId: '#landing',
    sectionName: 'Overview',
    type: 'summary',
    title: `${DATA.name} — ${DATA.title}`,
    subtitle: DATA.tagline,
    content: `${DATA.bio} ${DATA.about} Located in ${DATA.location}. Status: ${DATA.status}. Availability: ${DATA.availability}. Experience: ${DATA.yearsOfExperience}. GitHub: @${DATA.githubUsername}`,
    tags: ['bio', 'overview', 'summary', 'about', 'full-stack', 'ai', 'devsecops', 'hyderabad', 'contact', 'github'],
    evidence: [
      `38+ Public Repositories on GitHub (@${DATA.githubUsername})`,
      `350+ Commits & Contributions, +45% this year`,
      `90% CI/CD deployment speedup achieved through automated pipelines`
    ],
    linkUrl: DATA.links.github
  });

  // 2. About Section
  items.push({
    id: 'about-philosophy',
    sectionId: '#about',
    sectionName: 'About',
    type: 'summary',
    title: 'Professional Philosophy & Architecture Focus',
    subtitle: 'Zero-Trust Architecture, Modern AI Inference & Production Delivery',
    content: DATA.about,
    tags: ['about', 'architecture', 'zero-trust', 'production', 'cloud', 'aws', 'kubernetes', 'full-stack', 'istio'],
    evidence: [
      'Architects automated zero-trust cloud infrastructure on AWS and Kubernetes',
      'Integrates multi-stage CI/CD pipelines with SonarQube, Trivy, and Gitleaks',
      'Builds type-safe full-stack systems with Node.js, Express, React, TypeScript, and MongoDB'
    ]
  });

  // 3. Capabilities / Services
  DATA.services.forEach((service, idx) => {
    items.push({
      id: `service-${idx}`,
      sectionId: '#services',
      sectionName: 'Capabilities',
      type: 'capability',
      title: service.title,
      subtitle: service.subtitle,
      content: `${service.description} Technologies: ${service.skills.join(', ')}`,
      tags: [...service.skills.map(s => s.toLowerCase()), 'capability', 'service', 'engineering'],
      evidence: service.skills
    });
  });

  // 4. Projects (All 11 projects with rich details)
  DATA.projects.forEach(project => {
    const highlights = project.highlights || [];
    const metrics = (project.metrics || []).map(m => `${m.label}: ${m.value}`).join('; ');
    const secControls = (project.securityControls || []).join(', ');
    const flow = (project.architectureFlow || []).join(' -> ');

    items.push({
      id: `project-${project.id}-${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      sectionId: '#work',
      sectionName: 'Projects',
      type: 'project',
      title: project.title,
      subtitle: `${project.category} • ${project.tools.join(', ')}`,
      content: `${project.description} ${project.architectureSummary || ''} Highlights: ${highlights.join('. ')}. Challenges: ${project.challenges || ''}. Security: ${secControls}. Flow: ${flow}. Metrics: ${metrics}`,
      tags: [
        project.title.toLowerCase(),
        project.category.toLowerCase(),
        ...project.tools.map(t => t.toLowerCase()),
        'project',
        'code',
        'portfolio',
        'repo'
      ],
      evidence: [
        ...(project.metrics ? project.metrics.map(m => `${m.label}: ${m.value}`) : []),
        ...(project.highlights ? project.highlights.slice(0, 2) : []),
        ...(project.securityControls ? [`Security: ${project.securityControls.join(', ')}`] : [])
      ],
      linkUrl: project.linkUrl,
      liveUrl: project.liveUrl,
      rawProject: project
    });
  });

  // 5. Categorized Tech Stack & Verified Skills
  DATA.categorizedTechStack.forEach((cat, idx) => {
    items.push({
      id: `skills-category-${idx}`,
      sectionId: '#skills',
      sectionName: 'Tech Stack',
      type: 'skill',
      title: `${cat.category} Skills`,
      subtitle: `${cat.skills.length} Verified Technologies`,
      content: `Verified technical skills in ${cat.category}: ${cat.skills.join(', ')}.`,
      tags: [...cat.skills.map(s => s.toLowerCase()), cat.category.toLowerCase(), 'skills', 'tools', 'technologies'],
      evidence: cat.skills
    });
  });

  // Individual high-value skill entries for granular matching
  const allSkills = Array.from(new Set(DATA.categorizedTechStack.flatMap(c => c.skills)));
  allSkills.forEach(skill => {
    // Find supporting projects
    const supportingProjects = DATA.projects.filter(p => 
      p.tools.some(t => t.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(t.toLowerCase()))
    );

    items.push({
      id: `skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      sectionId: '#skills',
      sectionName: 'Tech Stack',
      type: 'skill',
      title: skill,
      subtitle: `Verified Technical Competency (${supportingProjects.length} Supporting Projects)`,
      content: `Skill: ${skill}. Supported by projects: ${supportingProjects.map(p => p.title).join(', ') || 'Core Engineering Toolkit'}.`,
      tags: [skill.toLowerCase(), 'skill', 'technology', 'verified'],
      evidence: supportingProjects.length > 0 
        ? supportingProjects.map(p => `Project: ${p.title} (${p.category})`) 
        : ['Demonstrated in core engineering coursework and hands-on labs'],
      linkUrl: supportingProjects[0]?.linkUrl
    });
  });

  // 6. Experience & Education
  DATA.experience.forEach((exp, idx) => {
    items.push({
      id: `exp-${idx}`,
      sectionId: '#experience',
      sectionName: 'Experience',
      type: 'experience',
      title: `${exp.role} — ${exp.company}`,
      subtitle: `${exp.period} • ${exp.location}`,
      content: `${exp.description} Highlights: ${exp.highlights.join('. ')}`,
      tags: [exp.role.toLowerCase(), exp.company.toLowerCase(), 'experience', 'education', 'role', 'history'],
      evidence: exp.highlights
    });
  });

  // 7. Certifications & Recognition
  DATA.recognition.forEach(rec => {
    items.push({
      id: `cert-${rec.id}`,
      sectionId: '#experience',
      sectionName: 'Certifications',
      type: 'certification',
      title: rec.title,
      subtitle: `${rec.event} • ${rec.award}`,
      content: `${rec.quote} Category: ${rec.meta}. Status: ${rec.award}.`,
      tags: [rec.title.toLowerCase(), rec.event.toLowerCase(), rec.meta.toLowerCase(), 'certification', 'award', 'credential'],
      evidence: [`${rec.award} by ${rec.event}`, rec.quote]
    });
  });

  return items;
}

// Global cached index
let cachedIndex: SearchIndexItem[] | null = null;
export function getResumeIndex(): SearchIndexItem[] {
  if (!cachedIndex) {
    cachedIndex = buildResumeIndex();
  }
  return cachedIndex;
}

// Expand a user query token into aliases and synonyms
export function expandQueryTokens(tokens: string[]): { expandedTokens: string[]; primaryTokens: string[] } {
  const expanded = new Set<string>();
  const primary = tokens.map(t => t.toLowerCase().trim()).filter(Boolean);

  for (const token of primary) {
    expanded.add(token);
    // Check direct synonyms
    if (TECHNICAL_SYNONYMS[token]) {
      TECHNICAL_SYNONYMS[token].forEach(syn => expanded.add(syn.toLowerCase()));
    }
    // Check partial key matches
    for (const [key, synList] of Object.entries(TECHNICAL_SYNONYMS)) {
      if (token.includes(key) || key.includes(token)) {
        expanded.add(key);
        synList.forEach(syn => expanded.add(syn.toLowerCase()));
      }
    }
  }

  return {
    expandedTokens: Array.from(expanded),
    primaryTokens: primary
  };
}

// Helper to create highlighted snippets
function createHighlightedSnippet(text: string, matchedTokens: string[]): string {
  if (!text) return '';
  const lower = text.toLowerCase();
  let firstIdx = -1;

  for (const token of matchedTokens) {
    const idx = lower.indexOf(token);
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
    }
  }

  if (firstIdx === -1) {
    return text.length > 140 ? text.substring(0, 140) + '...' : text;
  }

  const start = Math.max(0, firstIdx - 40);
  const end = Math.min(text.length, firstIdx + 110);
  let snippet = text.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  return snippet;
}

// Order of resume sections for the crawler traversal
export const RESUME_SECTION_SEQUENCE = [
  { id: '#landing', name: 'Overview', label: 'Summary & Bio' },
  { id: '#about', name: 'About', label: 'Architecture & Focus' },
  { id: '#services', name: 'Capabilities', label: 'Engineering Capabilities' },
  { id: '#experience', name: 'Experience', label: 'Experience & CNCF' },
  { id: '#work', name: 'Projects', label: '11+ Production Projects' },
  { id: '#skills', name: 'Tech Stack', label: 'Verified Tech Stack' },
  { id: '#experience', name: 'Certifications', label: 'Certifications & Honors' }
];

// Main Search Function
export function executeResumeSearch(
  query: string,
  categoryFilter: string = 'All'
): SearchResultSummary {
  const startTime = performance.now();
  const cleanQuery = query.trim();

  const allSections = RESUME_SECTION_SEQUENCE.map(s => s.name);

  if (!cleanQuery) {
    const endTime = performance.now();
    return {
      query: '',
      totalMatches: 0,
      executionTimeMs: Math.max(1, Math.round((endTime - startTime) * 10) / 10),
      traversedSections: allSections,
      matchedSections: [],
      resultsBySection: [],
      flatResults: [],
      expandedTerms: []
    };
  }

  const rawTokens = cleanQuery
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);

  const { expandedTokens, primaryTokens } = expandQueryTokens(rawTokens);
  const index = getResumeIndex();

  const matches: SearchMatch[] = [];

  for (const item of index) {
    // Apply optional category filter
    if (categoryFilter !== 'All') {
      if (categoryFilter === 'Projects' && item.type !== 'project') continue;
      if (categoryFilter === 'Skills' && item.type !== 'skill') continue;
      if (categoryFilter === 'Capabilities' && item.type !== 'capability') continue;
      if (categoryFilter === 'Experience' && item.type !== 'experience') continue;
      if (categoryFilter === 'Certifications' && item.type !== 'certification') continue;
    }

    const titleLower = item.title.toLowerCase();
    const subLower = item.subtitle.toLowerCase();
    const contentLower = item.content.toLowerCase();
    const tagsLower = item.tags.join(' ').toLowerCase();

    let score = 0;
    const itemMatchedTerms = new Set<string>();

    // 1. Exact full query phrase match
    const lowerQuery = cleanQuery.toLowerCase();
    if (titleLower.includes(lowerQuery)) {
      score += 100;
      itemMatchedTerms.add(lowerQuery);
    } else if (subLower.includes(lowerQuery)) {
      score += 70;
      itemMatchedTerms.add(lowerQuery);
    } else if (tagsLower.includes(lowerQuery)) {
      score += 60;
      itemMatchedTerms.add(lowerQuery);
    } else if (contentLower.includes(lowerQuery)) {
      score += 40;
      itemMatchedTerms.add(lowerQuery);
    }

    // 2. Primary token matching
    for (const token of primaryTokens) {
      if (token.length < 2) continue;

      if (titleLower.includes(token)) {
        score += 35;
        itemMatchedTerms.add(token);
      }
      if (subLower.includes(token)) {
        score += 25;
        itemMatchedTerms.add(token);
      }
      if (item.tags.some(t => t === token || t.includes(token))) {
        score += 30;
        itemMatchedTerms.add(token);
      }
      if (contentLower.includes(token)) {
        score += 15;
        itemMatchedTerms.add(token);
      }

      // Fuzzy matching for longer words with minor typos
      if (token.length >= 4 && !titleLower.includes(token) && !contentLower.includes(token)) {
        for (const tag of item.tags) {
          if (Math.abs(tag.length - token.length) <= 2) {
            const dist = levenshteinDistance(token, tag);
            if (dist === 1) {
              score += 20;
              itemMatchedTerms.add(tag);
              break;
            } else if (dist === 2 && token.length >= 6) {
              score += 12;
              itemMatchedTerms.add(tag);
              break;
            }
          }
        }
      }
    }

    // 3. Synonym / Expanded token matching
    for (const token of expandedTokens) {
      if (primaryTokens.includes(token)) continue; // already counted
      if (titleLower.includes(token) || item.tags.includes(token)) {
        score += 18;
        itemMatchedTerms.add(token);
      } else if (contentLower.includes(token)) {
        score += 8;
        itemMatchedTerms.add(token);
      }
    }

    // Special Boosts for Project Relevance & Live Links
    if (item.type === 'project' && item.rawProject?.featured) {
      score += 5;
    }
    if (item.liveUrl) {
      score += 3;
    }

    if (score > 0) {
      const matchedArray = Array.from(itemMatchedTerms);
      matches.push({
        item,
        score,
        matchedTerms: matchedArray,
        matchHighlights: {
          title: item.title,
          snippet: createHighlightedSnippet(item.content, matchedArray)
        },
        matchedSectionId: item.sectionId
      });
    }
  }

  // Sort matches by descending score
  matches.sort((a, b) => b.score - a.score);

  // Group matches by resume section
  const sectionGroups: Record<string, SearchMatch[]> = {};
  const matchedSectionNames = new Set<string>();

  for (const match of matches) {
    const sec = match.item.sectionName;
    matchedSectionNames.add(sec);
    if (!sectionGroups[sec]) {
      sectionGroups[sec] = [];
    }
    sectionGroups[sec].push(match);
  }

  const resultsBySection: GroupedSearchResults[] = Object.entries(sectionGroups).map(
    ([secName, mList]) => ({
      sectionName: secName,
      sectionId: mList[0].item.sectionId,
      matches: mList
    })
  );

  const endTime = performance.now();
  const executionTimeMs = Math.max(1.2, Math.round((endTime - startTime) * 10) / 10);

  return {
    query: cleanQuery,
    totalMatches: matches.length,
    executionTimeMs,
    traversedSections: allSections,
    matchedSections: Array.from(matchedSectionNames),
    resultsBySection,
    flatResults: matches,
    expandedTerms: expandedTokens.filter(t => !primaryTokens.includes(t)).slice(0, 8)
  };
}
