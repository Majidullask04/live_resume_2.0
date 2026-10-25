import { DATA, Project } from '../data';

export interface VerifiedSkillItem {
  name: string;
  category: string;
  level: 'Expert' | 'Proficient' | 'Working Knowledge';
  verifiedIn: string[];
  evidenceDescription: string;
  repos: string[];
}

export interface SkillCategoryGroup {
  id: string;
  title: string;
  color: string;
  badgeColor: string;
  description: string;
  skills: VerifiedSkillItem[];
}

export interface GraphNode {
  id: string;
  name: string;
  type: 'project' | 'skill' | 'capability' | 'repo';
  category?: string;
  val: number; // size
  linkUrl?: string;
  description?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

export interface RelationshipGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// 9 Verified Technical Skill Categories grounded strictly in DATA
export const VERIFIED_SKILL_CATEGORIES: SkillCategoryGroup[] = [
  {
    id: 'ai-llm',
    title: 'AI & LLM Engineering',
    color: '#a855f7',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/30',
    description: 'LLM Prompt Chaining, AI Agent Workflows, RAG Patterns, and Gemini/OpenAI API Integrations',
    skills: [
      {
        name: 'Gemini AI API',
        category: 'AI & LLM',
        level: 'Proficient',
        verifiedIn: ['career-ops', 'AICopilotModal'],
        evidenceDescription: 'Integrated for intelligent candidate fit scoring and automated resume diff tailoring in career-ops.',
        repos: ['https://github.com/Majidullask04/career-ops']
      },
      {
        name: 'AI Agent Workflows',
        category: 'AI & LLM',
        level: 'Proficient',
        verifiedIn: ['career-ops'],
        evidenceDescription: 'Built autonomous terminal agent in TypeScript that scans job portals and evaluates match criteria.',
        repos: ['https://github.com/Majidullask04/career-ops']
      },
      {
        name: 'RAG & Knowledge Retrieval',
        category: 'AI & LLM',
        level: 'Proficient',
        verifiedIn: ['live_resume_2.0', 'career-ops'],
        evidenceDescription: 'Implemented local inverted index and keyword token scoring with structured knowledge synthesis.',
        repos: ['https://github.com/Majidullask04/live_resume_2.0']
      },
      {
        name: 'Structured Prompt Schema',
        category: 'AI & LLM',
        level: 'Proficient',
        verifiedIn: ['career-ops'],
        evidenceDescription: 'Engineered strict JSON schema validation to eliminate AI hallucinations during resume optimization.',
        repos: ['https://github.com/Majidullask04/career-ops']
      }
    ]
  },
  {
    id: 'backend',
    title: 'Python & Backend Development',
    color: '#3b82f6',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/30',
    description: 'Scalable REST APIs, Asynchronous Execution, and Server-Side Microservices',
    skills: [
      {
        name: 'Node.js',
        category: 'Backend',
        level: 'Expert',
        verifiedIn: ['student-os', 'EASYCAFE', 'career-ops', 'Three-Tier-Applications'],
        evidenceDescription: 'Primary backend runtime for microservices, API servers, and build toolchains.',
        repos: ['https://github.com/Majidullask04/student-os', 'https://github.com/Majidullask04/career-ops']
      },
      {
        name: 'Express.js',
        category: 'Backend',
        level: 'Expert',
        verifiedIn: ['Three-Tier-Applications', 'Core Stack'],
        evidenceDescription: 'Developed modular Express middleware, REST routing, CORS handling, and JSON API controllers.',
        repos: ['https://github.com/Majidullask04/Three-Tier-Applications']
      },
      {
        name: 'Python',
        category: 'Backend',
        level: 'Proficient',
        verifiedIn: ['Google Microservices', 'Automation Scripts', 'Core Stack'],
        evidenceDescription: 'Polyglot microservice logic, Git automation parsers, and machine learning inference scripts.',
        repos: ['https://github.com/Majidullask04/Majid-s-DevOps-implementation-of-Google-s-project.']
      },
      {
        name: 'FastAPI',
        category: 'Backend',
        level: 'Proficient',
        verifiedIn: ['Core Stack', 'AI Backend Services'],
        evidenceDescription: 'High-performance Python asynchronous APIs with Pydantic type validation.',
        repos: ['https://github.com/Majidullask04']
      }
    ]
  },
  {
    id: 'api-dev',
    title: 'API Development & Inter-Service Comm',
    color: '#06b6d4',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    description: 'RESTful Endpoints, gRPC Protocol Buffers, and Secure Inter-Service Communication',
    skills: [
      {
        name: 'RESTful API Architecture',
        category: 'APIs',
        level: 'Expert',
        verifiedIn: ['student-os', 'EASYCAFE', 'career-ops'],
        evidenceDescription: 'Designed client-server contracts, pagination, error models, and reactive fetch pipelines.',
        repos: ['https://github.com/Majidullask04/EASYCAFE']
      },
      {
        name: 'gRPC Protocol Buffers',
        category: 'APIs',
        level: 'Proficient',
        verifiedIn: ['Google Microservices DevOps Platform'],
        evidenceDescription: 'Low-latency binary inter-service RPC communication across 10 polyglot microservices.',
        repos: ['https://github.com/Majidullask04/Majid-s-DevOps-implementation-of-Google-s-project.']
      },
      {
        name: 'Webhooks & Event Triggers',
        category: 'APIs',
        level: 'Expert',
        verifiedIn: ['3-Tier-DevSecOps-Mega-Project', 'ci-cd-automation'],
        evidenceDescription: 'Automated GitHub Webhook ingestion in Jenkins triggering multi-stage declarative pipelines.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      }
    ]
  },
  {
    id: 'databases',
    title: 'Databases & State Persistence',
    color: '#10b981',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    description: 'Document Stores, Relational Schemas, and Edge Local Data Stores',
    skills: [
      {
        name: 'MongoDB',
        category: 'Databases',
        level: 'Proficient',
        verifiedIn: ['Three-Tier-Applications', 'Core Stack'],
        evidenceDescription: 'Configured document schemas, replica sets, connection pools, and containerized mongo pods.',
        repos: ['https://github.com/Majidullask04/Three-Tier-Applications']
      },
      {
        name: 'MySQL',
        category: 'Databases',
        level: 'Proficient',
        verifiedIn: ['Academic Coursework (DBMS)', 'Core Stack'],
        evidenceDescription: 'Relational schema modeling, index optimization, foreign key constraints, and SQL queries.',
        repos: ['https://github.com/Majidullask04']
      },
      {
        name: 'Client-side Indexed / Local State',
        category: 'Databases',
        level: 'Expert',
        verifiedIn: ['student-os', 'EASYCAFE', 'career-ops'],
        evidenceDescription: 'Reactive local data persistence, sub-100ms offline state synchronization, and cache invalidation.',
        repos: ['https://github.com/Majidullask04/student-os']
      }
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend Development & UI Engineering',
    color: '#f59e0b',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
    description: 'Type-Safe React, Vite Bundling, TailwindCSS, and Dynamic User Interfaces',
    skills: [
      {
        name: 'React 19 & TypeScript',
        category: 'Frontend',
        level: 'Expert',
        verifiedIn: ['student-os', 'EASYCAFE', 'live_resume_2.0', 'Expense-tracker'],
        evidenceDescription: 'Component composition, custom hooks, typed interfaces, and zero-runtime-error strict mode.',
        repos: ['https://github.com/Majidullask04/student-os', 'https://github.com/Majidullask04/EASYCAFE']
      },
      {
        name: 'Vite & Modern Tooling',
        category: 'Frontend',
        level: 'Expert',
        verifiedIn: ['student-os', 'EASYCAFE', 'live_resume_2.0'],
        evidenceDescription: 'High-speed ESM dev server, optimized rollup bundling, and sub-second HMR updates.',
        repos: ['https://github.com/Majidullask04/student-os']
      },
      {
        name: 'TailwindCSS & Framer Motion',
        category: 'Frontend',
        level: 'Expert',
        verifiedIn: ['live_resume_2.0', 'student-os', 'EASYCAFE'],
        evidenceDescription: 'Responsive dark-mode UI systems, spring physics parallax, glassmorphism, and accessible layouts.',
        repos: ['https://github.com/Majidullask04/live_resume_2.0']
      }
    ]
  },
  {
    id: 'cloud',
    title: 'Cloud & Infrastructure (AWS & IaC)',
    color: '#f97316',
    badgeColor: 'border-orange-500/40 text-orange-300 bg-orange-950/30',
    description: 'AWS Cloud Services, Terraform Declarative Infrastructure, and Edge CDN Networks',
    skills: [
      {
        name: 'AWS Cloud (EC2, S3, IAM, VPC)',
        category: 'Cloud',
        level: 'Proficient',
        verifiedIn: ['student-os', 'Core Services', 'Certification Prep'],
        evidenceDescription: 'Configured secure IAM roles, VPC subnets, S3 static assets, and EC2 compute instances.',
        repos: ['https://github.com/Majidullask04/student-os']
      },
      {
        name: 'AWS Amplify & CloudFront',
        category: 'Cloud',
        level: 'Expert',
        verifiedIn: ['student-os'],
        evidenceDescription: 'Shipped production deployment with global CloudFront edge distribution and SSL termination.',
        repos: ['https://github.com/Majidullask04/student-os']
      },
      {
        name: 'Terraform (IaC)',
        category: 'Cloud',
        level: 'Proficient',
        verifiedIn: ['Terraform Associate Prep', 'Core Stack'],
        evidenceDescription: 'Declarative HCL modules for provisioning reproducible VPCs, EC2 instances, and security groups.',
        repos: ['https://github.com/Majidullask04']
      },
      {
        name: 'Linux (Ubuntu) & Bash',
        category: 'Cloud',
        level: 'Expert',
        verifiedIn: ['All DevSecOps Pipelines', 'Systemd daemons', 'Nginx configs'],
        evidenceDescription: 'Authored shell scripts for Git diff parsing, automated Docker building, and server tuning.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      }
    ]
  },
  {
    id: 'containers-k8s',
    title: 'Containers & Kubernetes Orchestration',
    color: '#0ea5e9',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/30',
    description: 'Docker Multi-stage Builds, Kubernetes (K3s/EKS), Helm, Istio, and GitOps Sync',
    skills: [
      {
        name: 'Docker & Docker Compose',
        category: 'Containers',
        level: 'Expert',
        verifiedIn: ['3-Tier-DevSecOps', 'Three-Tier-Applications', 'ci-cd-automation'],
        evidenceDescription: 'Authored minimal multi-stage Dockerfiles, dynamic image tagging with Git SHA, and Docker Hub distribution.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      },
      {
        name: 'Kubernetes (K3s & AWS EKS)',
        category: 'Containers',
        level: 'Proficient',
        verifiedIn: ['3-Tier-DevSecOps', 'Google Microservices', 'CKA Prep'],
        evidenceDescription: 'Managed Pods, Deployments, Services, ConfigMaps, Secrets, Ingress, and node health probes.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      },
      {
        name: 'Istio Service Mesh',
        category: 'Containers',
        level: 'Proficient',
        verifiedIn: ['Google Microservices DevOps Platform'],
        evidenceDescription: 'Configured mutual TLS (mTLS), traffic routing, canary releases, and Envoy sidecar telemetry.',
        repos: ['https://github.com/Majidullask04/Majid-s-DevOps-implementation-of-Google-s-project.']
      },
      {
        name: 'Argo CD (GitOps)',
        category: 'Containers',
        level: 'Proficient',
        verifiedIn: ['3-Tier-DevSecOps-Mega-Project'],
        evidenceDescription: 'Automated continuous reconciliation between Git manifest changes and active K3s cluster state.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      }
    ]
  },
  {
    id: 'devsecops',
    title: 'CI/CD & DevSecOps Engineering',
    color: '#ef4444',
    badgeColor: 'border-red-500/40 text-red-300 bg-red-950/30',
    description: 'Jenkins Declarative Pipelines, Gitleaks Secret Auditing, SonarQube, and Trivy CVE Gates',
    skills: [
      {
        name: 'Jenkins Declarative Pipelines',
        category: 'DevSecOps',
        level: 'Expert',
        verifiedIn: ['3-Tier-DevSecOps-Mega-Project', 'ci-cd-automation'],
        evidenceDescription: 'Engineered multi-stage declarative pipelines automating discovery and builds for 11+ polyglot microservices.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      },
      {
        name: 'Gitleaks Secret Detection',
        category: 'DevSecOps',
        level: 'Expert',
        verifiedIn: ['3-Tier-DevSecOps', 'ci-cd-automation'],
        evidenceDescription: 'Configured pre-commit and CI stage secret audits that strictly block builds on credential leaks.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      },
      {
        name: 'SonarQube Quality Gates',
        category: 'DevSecOps',
        level: 'Expert',
        verifiedIn: ['3-Tier-DevSecOps', 'ci-cd-automation'],
        evidenceDescription: 'Integrated automated static analysis Quality Gates validating code coverage and blocking code smells.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      },
      {
        name: 'Trivy Vulnerability Scanner',
        category: 'DevSecOps',
        level: 'Expert',
        verifiedIn: ['3-Tier-DevSecOps', 'ci-cd-automation'],
        evidenceDescription: 'Automated CVE scanning across project filesystems, OS dependencies, and final Docker container images.',
        repos: ['https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project']
      }
    ]
  },
  {
    id: 'observability',
    title: 'Testing, Monitoring & Observability',
    color: '#14b8a6',
    badgeColor: 'border-teal-500/40 text-teal-300 bg-teal-950/30',
    description: 'Prometheus Metrics Scraping, Grafana Dashboards, Loki Log Aggregation, and SRE Practices',
    skills: [
      {
        name: 'Prometheus & Grafana',
        category: 'Observability',
        level: 'Proficient',
        verifiedIn: ['Google Microservices DevOps Platform', 'Core Stack'],
        evidenceDescription: 'Deployed custom dashboards visualizing request rates, p95/p99 latency, and cluster node resource utilization.',
        repos: ['https://github.com/Majidullask04/Majid-s-DevOps-implementation-of-Google-s-project.']
      },
      {
        name: 'Loki Centralized Logging',
        category: 'Observability',
        level: 'Proficient',
        verifiedIn: ['Core Stack', 'SRE Practices'],
        evidenceDescription: 'Streamlined container log aggregation for multi-service Kubernetes workloads.',
        repos: ['https://github.com/Majidullask04']
      },
      {
        name: 'Distributed Tracing & SRE',
        category: 'Observability',
        level: 'Proficient',
        verifiedIn: ['Google Microservices DevOps Platform'],
        evidenceDescription: 'Trace context propagation across gRPC microservices for end-to-end latency bottleneck analysis.',
        repos: ['https://github.com/Majidullask04/Majid-s-DevOps-implementation-of-Google-s-project.']
      }
    ]
  }
];

// Interactive Relationship Graph Construction
export function buildRelationshipGraph(): RelationshipGraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeSet = new Set<string>();

  const addNode = (node: GraphNode) => {
    if (!nodeSet.has(node.id)) {
      nodeSet.add(node.id);
      nodes.push(node);
    }
  };

  // Add Project Nodes
  DATA.projects.forEach(p => {
    addNode({
      id: `p-${p.id}`,
      name: p.title,
      type: 'project',
      category: p.category,
      val: p.featured ? 22 : 16,
      linkUrl: p.linkUrl,
      description: p.description
    });

    // Connect tools to this project
    p.tools.forEach(tool => {
      const toolId = `s-${tool.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      addNode({
        id: toolId,
        name: tool,
        type: 'skill',
        val: 10,
        description: `Verified technology used in ${p.title}`
      });

      links.push({
        source: `p-${p.id}`,
        target: toolId,
        label: 'utilizes'
      });
    });
  });

  // Add Capabilities Nodes
  DATA.services.forEach((s, idx) => {
    const capId = `c-${idx}`;
    addNode({
      id: capId,
      name: s.title,
      type: 'capability',
      val: 18,
      description: s.description
    });

    // Connect capability skills
    s.skills.forEach(skill => {
      const toolId = `s-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      if (nodeSet.has(toolId)) {
        links.push({
          source: capId,
          target: toolId,
          label: 'encompasses'
        });
      }
    });
  });

  return { nodes, links };
}

// Recruiter-Friendly Evidence-Based Profile Summary
export interface RecruiterProfileSummary {
  headline: string;
  strongestAreas: {
    area: string;
    description: string;
    bestProjects: string[];
  }[];
  demonstratedCapabilities: string[];
  claimedKnowledge: string[];
  inferredCapabilities: string[];
  growthAreas: string[];
}

export const RECRUITER_PROFILE_SUMMARY: RecruiterProfileSummary = {
  headline: 'AI Full-Stack Engineer with Production Cloud DevSecOps & Kubernetes Competencies',
  strongestAreas: [
    {
      area: 'DevSecOps & Zero-Trust CI/CD Automation',
      description: 'End-to-end automation of security audits (Gitleaks, SonarQube, Trivy) integrated into declarative Jenkins pipelines, slashing release cycles by 90%.',
      bestProjects: ['3-Tier-DevSecOps-Mega-Project', 'ci-cd-automation']
    },
    {
      area: 'Full-Stack Web Engineering with Cloud CDN Edge',
      description: 'Type-safe React & TypeScript single-page architectures with sub-second latency, deployed on AWS Amplify and Vercel edge networks.',
      bestProjects: ['student-os', 'EASYCAFE', 'career-ops']
    },
    {
      area: 'Microservice Containerization & Service Mesh',
      description: 'Deploying polyglot services to Kubernetes (K3s/EKS) with Istio Envoy sidecars enforcing mutual TLS and distributed metrics.',
      bestProjects: ['Google Microservices DevOps Platform', '3-Tier-DevSecOps-Mega-Project']
    },
    {
      area: 'AI-Powered Agent Tools & Prompt Engineering',
      description: 'Building autonomous CLI tools and agents that evaluate unstructured job listings, generate ATS diffs, and validate outputs with schemas.',
      bestProjects: ['career-ops']
    }
  ],
  demonstratedCapabilities: [
    'Designed & executed Jenkins declarative pipelines supporting 11+ microservices with zero secrets leaks',
    'Deployed live, publicly accessible applications on AWS Amplify (student-os) and Vercel (EASYCAFE)',
    'Configured Istio Service Mesh with mTLS and gRPC inter-service communication',
    'Open-source PR contributions accepted in the CNCF / LFX ecosystem (CLOWarden #359)',
    'Maintained 38+ GitHub repositories with 350+ commits'
  ],
  claimedKnowledge: [
    'Preparing for Certified Kubernetes Administrator (CKA) and AWS Certified Cloud Practitioner certifications',
    'HashiCorp Terraform Associate infrastructure-as-code principles',
    'Core academic coursework in Distributed Systems, Operating Systems, Computer Networks, and DBMS at JNTUH (CGPA 7.5)'
  ],
  inferredCapabilities: [
    'Strong architectural intuition for security gates and automated compliance',
    'High velocity in adopting modern AI APIs and building user-centric interfaces',
    'Disciplined Git workflow, documentation hygiene, and production observability practices'
  ],
  growthAreas: [
    'Multi-region high-availability Kubernetes federation across heterogeneous cloud providers',
    'Fine-tuning open-source LLMs (e.g. Llama-3 / Mistral) on custom infrastructure',
    'Commercial software engineering tenure in large enterprise engineering teams (>100 engineers)'
  ]
};
