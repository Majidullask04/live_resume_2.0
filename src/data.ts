export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
  linkText: string;
  linkUrl: string;
  liveUrl?: string;
  featured?: boolean;
  architectureSummary?: string;
  architectureFlow?: string[];
  highlights?: string[];
  metrics?: ProjectMetric[];
  challenges?: string;
  securityControls?: string[];
}

export interface AIKnowledgeItem {
  keywords: string[];
  question: string;
  answer: string;
  category: string;
}

export const DATA = {
  name: "Majidulla SK",
  title: "AI Full-Stack Engineer | DevOps & Cloud Specialist",
  tagline: "Engineering resilient full-stack systems, automated DevSecOps pipelines, and intelligent AI-driven applications.",
  email: "majidullask04@gmail.com",
  phone: "+91 62944 12062",
  phoneRaw: "6294412062",
  location: "Hyderabad, Telangana, India",
  status: "Available for Full-Time Roles & High-Impact Internships",
  availability: "Open to AI Full-Stack, Backend, Cloud & DevSecOps Opportunities",
  yearsOfExperience: "2+ Years Hands-on",
  githubUsername: "Majidullask04",
  bio: "AI Engineer | LLMs • RAG • AI Agents • FastAPI | DevOps • CI/CD • Kubernetes • Open Source",
  about: `I am an AI Full-Stack Engineer and Cloud DevSecOps Specialist with deep engineering focus across the entire software delivery lifecycle.

I build resilient full-stack applications with Node.js, Express, React, TypeScript, and MongoDB, integrate modern AI/ML inference pipelines, and architect automated, zero-trust cloud infrastructure on AWS and Kubernetes.

From automating multi-stage CI/CD pipelines with SonarQube, Trivy, and Gitleaks to orchestrating microservices on Kubernetes with Istio Service Mesh, I ensure every system is secure by design, highly available, and production-ready.`,
  stats: [
    { label: "Public Repositories", value: "38+", change: "Live from GitHub" },
    { label: "Git Commits & Contributions", value: "350+", change: "+45% this year" },
    { label: "CI/CD Deployment Speedup", value: "90%", change: "Automated pipelines" },
    { label: "Cloud & DevSecOps", value: "AWS & K8s", change: "Production grade" },
  ],
  services: [
    {
      title: "AI Full-Stack & Intelligent Systems",
      subtitle: "React, Node.js, TypeScript, Python, FastAPI & LLM Agents",
      description: "Crafting end-to-end intelligent web applications. Building type-safe React/Vite frontends, high-performance Node/Express/FastAPI backends, and integrating Machine Learning models, vector search, and Gemini/OpenAI APIs for real-world automated workflows.",
      skills: ["React", "TypeScript", "Node.js", "Express.js", "MongoDB", "Python", "FastAPI", "Gemini AI", "REST APIs", "AWS Amplify"]
    },
    {
      title: "CI/CD & DevSecOps Engineering",
      subtitle: "Automating Zero-Trust Delivery",
      description: "Designing multi-stage declarative CI/CD pipelines in Jenkins and GitHub Actions. Integrated Gitleaks for secrets auditing, SonarQube for static analysis Quality Gates, Trivy for filesystem and container CVE scanning, and push hardened images with automated Docker Hub tags.",
      skills: ["Jenkins", "GitHub Actions", "SonarQube", "Trivy", "Gitleaks", "Bash", "Docker Hub", "Security Gates"]
    },
    {
      title: "Container Orchestration & Service Mesh",
      subtitle: "Kubernetes, Docker, Helm & Istio",
      description: "Deploying and managing containerized microservices on Kubernetes (K3s & AWS EKS). Deep experience writing Deployment, Service, and Ingress manifests, managing cluster state, configuring Istio Service Mesh with mTLS, and automating deployments with Argo CD GitOps.",
      skills: ["Docker", "Kubernetes", "K3s", "AWS EKS", "Helm", "Argo CD", "Istio", "gRPC"]
    },
    {
      title: "Cloud Infrastructure (AWS & IaC)",
      subtitle: "Architecting Cloud Solutions with Terraform",
      description: "Architecting and provisioning secure cloud environments on AWS. Hands-on expertise with EC2, IAM, VPC, S3, CloudFront, EKS, ECR, CloudWatch, and AWS Amplify. Writing declarative Terraform IaC for reproducible multi-tier infrastructure.",
      skills: ["AWS EC2", "S3", "IAM", "VPC", "CloudFront", "EKS", "Terraform", "Nginx", "SSL/TLS"]
    },
    {
      title: "Observability & SRE Stack",
      subtitle: "Monitoring, Alerting & Distributed Telemetry",
      description: "Designing comprehensive monitoring, metrics scraping, and logging stacks for Kubernetes workloads using Prometheus, Grafana dashboards with custom alerting rules, and Loki for centralized log aggregation.",
      skills: ["Prometheus", "Grafana", "Loki", "CloudWatch", "Distributed Tracing", "SRE Best Practices"]
    },
    {
      title: "Linux Systems & Automation",
      subtitle: "Kernel-level Debugging & Scripting",
      description: "Linux is my native operating environment. I write automation scripts in Bash and Python to streamline operations, manage systemd daemons, configure Nginx load balancing, and troubleshoot network/system performance.",
      skills: ["Linux (Ubuntu)", "Bash Scripting", "Python", "Nginx", "Systemd", "Networking", "gRPC"]
    }
  ],
  experience: [
    {
      role: "B.Tech in Computer Science and Engineering",
      company: "Brilliant Institute of Engineering and Technology (JNTUH)",
      period: "2023 - 2027",
      location: "Hyderabad, Telangana",
      description: "CGPA: 7.5. Core coursework in Operating Systems, Computer Networks, Distributed Systems, Database Management Systems, Data Structures & Algorithms, and Software Engineering. Active technical speaker and open-source project mentor.",
      highlights: [
        "Specializing in Cloud Computing, Distributed Systems, and AI/ML applications",
        "Lead technical workshops on Git, Docker, and Linux administration for peer engineering students"
      ]
    },
    {
      role: "CNCF Open Source Contributor",
      company: "Linux Foundation (LFX Mentorship)",
      period: "2024 - Present",
      location: "Remote / Open Source",
      description: "Active contributor to Cloud Native Computing Foundation (CNCF) ecosystem projects including CLOWarden and LFX Crowdfunding. Authored maintainer documentation, reviewed PRs, and streamlined developer setup workflows.",
      highlights: [
        "Resolved GitHub issue #359 clarifying LFX Crowdfunding setup and deployment pipelines",
        "Collaborated with global open source maintainers on cloud native tooling and governance"
      ]
    },
    {
      role: "AI Full-Stack & Platform Engineer",
      company: "Personal & Open Source Projects",
      period: "2023 - Present",
      location: "Hyderabad, India",
      description: "Designed production-grade DevSecOps pipelines for multi-service repositories, cutting manual deployment effort by 90%. Configured zero-trust secret scanning, automated image builds, and K3s GitOps sync with Argo CD.",
      highlights: [
        "Engineered automated pipelines with zero secret leaks across 10+ repositories",
        "Built intelligent web applications (student-os, career-ops) with React, Node, and AWS"
      ]
    },
    {
      role: "MLH Global Hack Week Participant & Builder",
      company: "Major League Hacking",
      period: "2024 - 2025",
      location: "Global / Remote",
      description: "Built full-stack web applications, tested AI agent workflows, and developed developer tools in fast-paced international collaborative hackathons.",
      highlights: [
        "Developed AI job assistant terminal tools and responsive full-stack applications",
        "Explored generative AI API integrations and real-time frontend user experiences"
      ]
    }
  ],
  recognition: [
    {
      id: "01",
      award: "In Progress / Preparing",
      title: "AWS Certified Cloud Practitioner",
      event: "Amazon Web Services",
      quote: "Validating foundational cloud architecture, security, compliance, and core AWS service expertise.",
      meta: "Cloud Certification"
    },
    {
      id: "02",
      award: "In Progress / Preparing",
      title: "Certified Kubernetes Administrator (CKA)",
      event: "CNCF / Linux Foundation",
      quote: "Demonstrating advanced hands-on capability in Kubernetes cluster installation, networking, storage, and troubleshooting.",
      meta: "Container Certification"
    },
    {
      id: "03",
      award: "In Progress / Preparing",
      title: "HashiCorp Certified: Terraform Associate",
      event: "HashiCorp",
      quote: "Validating Infrastructure as Code (IaC) principles, state management, and multi-cloud Terraform configuration.",
      meta: "IaC Certification"
    },
    {
      id: "04",
      award: "Completed & Recognized",
      title: "LFX Open Source Mentorship Program",
      event: "Linux Foundation & CNCF",
      quote: "Successfully completed program tasks contributing to cloud-native open source ecosystems.",
      meta: "Open Source Recognition"
    }
  ],
  projects: [
    {
      id: "01",
      title: "student-os",
      category: "Full-Stack & AI",
      description: "Flagship academic operating system and intelligent student workspace built with TypeScript, React, and AWS Amplify. Features automated schedule coordination, assignment intelligence, and real-time progress analytics.",
      tools: ["TypeScript", "React", "AWS Amplify", "Vite", "Node.js", "TailwindCSS"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/student-os",
      liveUrl: "https://majid-1.d1kytdzlw5ibag.amplifyapp.com",
      featured: true,
      architectureSummary: "Cloud-native single page web application deployed on AWS Amplify with continuous Git deployment, responsive client state management, and real-time student telemetry.",
      architectureFlow: [
        "Developer pushes updates to main branch on GitHub",
        "AWS Amplify triggers automated build and containerization",
        "TypeScript static type-checking and asset bundling via Vite",
        "Edge CDN distribution via AWS CloudFront with SSL termination",
        "Client synchronizes local state with cloud backend"
      ],
      highlights: [
        "Active production deployment on AWS Amplify with instant global edge CDN delivery",
        "High performance frontend achieving sub-second interactive page loads",
        "Comprehensive student productivity suite with intuitive dark-mode interface"
      ],
      metrics: [
        { label: "Deployment Target", value: "AWS Amplify" },
        { label: "Build Time", value: "<45s" },
        { label: "Lighthouse Score", value: "99/100" }
      ],
      securityControls: ["AWS IAM Roles", "HTTPS SSL/TLS Termination", "Strict Content Security Policies"],
      challenges: "Designing an ultra-responsive responsive UI capable of real-time scheduling analytics while maintaining seamless mobile and desktop accessibility."
    },
    {
      id: "02",
      title: "3-Tier-DevSecOps-Mega-Project",
      category: "DevSecOps & Cloud",
      description: "Production-ready Jenkins Declarative Pipeline auto-building 11+ microservices with dynamic Docker discovery. Features Gitleaks secret detection, SonarQube Quality Gates, Trivy container CVE scanning, and dynamic deployment to K3s.",
      tools: ["Jenkins", "Docker", "Kubernetes (K3s)", "SonarQube", "Trivy", "Gitleaks", "Argo CD", "Bash"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project",
      featured: true,
      architectureSummary: "Multi-branch Jenkins pipeline with automated discovery of modified microservices, running parallel security analysis, dockerizing images with Git commit SHA tags, and syncing with ArgoCD to a K3s Kubernetes cluster.",
      architectureFlow: [
        "Git Commit Push → Webhook triggers Jenkins Declarative Pipeline",
        "Stage 1: Gitleaks secrets scanning (Blocks pipeline if credentials found)",
        "Stage 2: SonarQube static code analysis & Quality Gate check",
        "Stage 3: Trivy vulnerability scanning on filesystem & dependencies",
        "Stage 4: Multi-architecture Docker image build & tag with Commit SHA",
        "Stage 5: Push hardened image to Docker Hub & update Helm/K8s manifests",
        "Stage 6: ArgoCD GitOps synchronizes deployment on K3s cluster"
      ],
      highlights: [
        "Zero-trust automated pipeline reducing release friction from hours to under 4 minutes",
        "Automated security scanning halts vulnerable builds before artifact generation",
        "Supports dynamic discovery of 11+ polyglot microservices"
      ],
      metrics: [
        { label: "Deployment Speedup", value: "90%" },
        { label: "Microservices Managed", value: "11+" },
        { label: "CVE Scanned Rate", value: "100%" }
      ],
      securityControls: ["Gitleaks Pre-commit & CI Gate", "SonarQube Quality Gate", "Trivy Image Scan", "RBAC Secrets Isolation"],
      challenges: "Dynamically detecting which of the 11 microservices were changed per commit to avoid redundant builds. Solved using custom Git diff parser scripts in declarative Jenkins pipeline."
    },
    {
      id: "03",
      title: "career-ops",
      category: "Full-Stack & AI",
      description: "Open-source AI job search tool and terminal agent. Scans job portals, grades listings with an A-F fit score, automatically tailors resume JSON/Markdown, and tracks applications locally inside AI coding CLIs.",
      tools: ["TypeScript", "Node.js", "AI Agent CLI", "Gemini / LLM API", "Git Automation"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/career-ops",
      liveUrl: "https://career-ops.org",
      featured: true,
      architectureSummary: "CLI + Web Agent architecture built in TypeScript that ingests candidate profile metadata, compares against target job descriptions via LLM prompt chains, and generates tailored ATS-optimized resumes and tracking dashboards.",
      architectureFlow: [
        "User supplies target Job Posting URL or text prompt",
        "Agent parses key skill requirements, experience levels, and ATS keywords",
        "Evaluates candidate resume data against criteria using AI scoring matrix",
        "Outputs match score (A-F), missing competencies, and tailored resume diff",
        "Saves application status to local SQLite/JSON datastore"
      ],
      highlights: [
        "Over 100+ tailored applications generated with automated ATS keyword matching",
        "Local-first privacy model keeping candidate information safe on device",
        "CLI and interactive web agent interface"
      ],
      metrics: [
        { label: "ATS Match Accuracy", value: "94%" },
        { label: "Time Saved Per App", value: "25 min" },
        { label: "Interface Latency", value: "<150ms" }
      ],
      securityControls: ["Local API Key Storage", "Zero-Tracking Privacy", "Sanitized Input Sanitization"],
      challenges: "Preventing AI hallucination in resume tailoring while strictly maintaining factual accuracy of candidate experience. Solved with structured prompt schema validation."
    },
    {
      id: "04",
      title: "Google Microservices DevOps Platform",
      category: "Microservices & K8s",
      description: "DevOps implementation of Google's 10-microservice cloud application. Deployed on Kubernetes with Istio Service Mesh, gRPC inter-service communication, distributed tracing, and automated telemetry.",
      tools: ["Go", "Kubernetes", "Istio", "gRPC", "Docker", "Helm", "Prometheus", "Grafana"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/Majid-s-DevOps-implementation-of-Google-s-project.",
      liveUrl: "https://cymbal-shops.retail.cymbal.dev",
      featured: true,
      architectureSummary: "Full polyglot microservice e-commerce ecosystem orchestrated on Kubernetes, utilizing Istio Envoy sidecars for mutual TLS (mTLS), traffic routing, canary rollouts, and Jaeger/Prometheus distributed telemetry.",
      architectureFlow: [
        "Ingress Gateway routes traffic through Istio Service Mesh",
        "Frontend service communicates with 9 backend services via gRPC",
        "Envoy sidecar proxies handle mTLS encryption and traffic shaping",
        "Prometheus scrapes service metrics from Kubernetes endpoints",
        "Grafana renders real-time latency, request rates, and error rate dashboards"
      ],
      highlights: [
        "Zero-trust inter-service communication enforced with Istio mTLS",
        "Canary release configuration enabling gradual traffic shifting",
        "Comprehensive health probes and automated pod self-healing"
      ],
      metrics: [
        { label: "Microservices", value: "10 Services" },
        { label: "Inter-service Protocol", value: "gRPC" },
        { label: "Telemetry Coverage", value: "100%" }
      ],
      securityControls: ["Istio mTLS", "NetworkPolicies", "Non-root Container Execution", "K8s Secrets"],
      challenges: "Managing service dependencies and distributed tracing across 10 polyglot services (Go, Python, Node, Java). Configured unified OpenTelemetry context propagation."
    },
    {
      id: "05",
      title: "Expense-tracker",
      category: "Full-Stack & AI",
      description: "Full-stack expense tracking web application featuring transaction analytics, visual financial dashboards, and automated continuous deployment on Vercel.",
      tools: ["JavaScript", "React", "Node.js", "Vercel", "Chart.js", "CSS3"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/Expense-tracker",
      liveUrl: "https://expense-tracker-delta-taupe-40.vercel.app",
      featured: true,
      architectureSummary: "Single-page React application with client-side reactive state, dynamic charting for financial breakdown, and optimized cloud hosting.",
      highlights: ["Real-time transaction computation", "Visual spending category analytics"],
      metrics: [
        { label: "Lighthouse Score", value: "98/100" },
        { label: "Load Time", value: "<0.8s" }
      ]
    },
    {
      id: "06",
      title: "AK-Memorial",
      category: "Full-Stack & AI",
      description: "Interactive tribute and memorial web platform with responsive photo galleries, narrative sections, and continuous cloud hosting on Vercel.",
      tools: ["TypeScript", "React", "Vite", "Vercel", "TailwindCSS"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/AK-Memorial",
      liveUrl: "https://ak-memorial.vercel.app",
      featured: false,
      highlights: ["Clean responsive digital tribute experience", "Optimized media gallery loading"]
    },
    {
      id: "07",
      title: "clowarden",
      category: "Open Source & CNCF",
      description: "CNCF ecosystem open-source project for cross-service resource access management. Participated in maintainer documentation and community review.",
      tools: ["Go", "CNCF", "LFX", "YAML", "Git", "Kubernetes"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/clowarden",
      liveUrl: "https://clowarden.io",
      featured: true,
      highlights: ["Active contribution in the CNCF open source community", "Cloud access policy and documentation improvements"]
    },
    {
      id: "08",
      title: "HomeoCare_2.0",
      category: "Full-Stack & AI",
      description: "Modern healthcare appointment and patient portal application featuring digital consultation booking and responsive frontend deployed on Vercel.",
      tools: ["TypeScript", "React", "Vite", "Vercel", "TailwindCSS"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/HomeoCare_2.0",
      liveUrl: "https://homeo-care-2-0.vercel.app",
      featured: false,
      highlights: ["Intuitive appointment booking workflow", "Mobile-first responsive UX"]
    },
    {
      id: "09",
      title: "ci-cd-automation",
      category: "DevSecOps & Cloud",
      description: "Automated 7-stage CI/CD security pipeline running static analysis, secrets audit, and container vulnerabilities before pushing hardened images to Docker Hub.",
      tools: ["Jenkins", "Docker", "SonarQube", "Trivy", "Gitleaks", "Bash", "Slack Notifications"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/ci-cd-automation",
      featured: false,
      architectureSummary: "Hardened Jenkins pipeline template designed for plug-and-play integration into any web or backend repository, enforcing automated security compliance.",
      highlights: ["Turnkey DevSecOps pipeline template", "Integrated build status alerts"]
    },
    {
      id: "10",
      title: "Three-Tier-Applications",
      category: "Microservices & K8s",
      description: "Containerized multi-tier full-stack application architecture deployed and managed with Docker and Docker Compose for enhanced scalability, portability, and reliability.",
      tools: ["JavaScript", "Docker", "Docker Compose", "Node.js", "MongoDB", "Nginx"],
      linkText: "GitHub Repo",
      linkUrl: "https://github.com/Majidullask04/Three-Tier-Applications",
      featured: false,
      highlights: ["Multi-tier container architecture", "Docker Compose orchestration"]
    }
  ] as Project[],
  categorizedTechStack: [
    {
      category: "Cloud & Infrastructure",
      skills: ["AWS EC2", "AWS S3", "AWS IAM", "AWS VPC", "AWS CloudFront", "AWS EKS", "AWS Amplify", "Linux (Ubuntu)", "Bash", "Terraform", "Nginx"]
    },
    {
      category: "Containers & Orchestration",
      skills: ["Docker", "Docker Compose", "Kubernetes", "K3s", "Helm", "Istio", "gRPC", "Argo CD"]
    },
    {
      category: "CI/CD & DevSecOps",
      skills: ["Jenkins", "GitHub Actions", "SonarQube", "Trivy", "Gitleaks", "Docker Hub", "Security Gates"]
    },
    {
      category: "AI & Full-Stack Development",
      skills: ["React", "TypeScript", "JavaScript", "Node.js", "Express.js", "Python", "FastAPI", "MongoDB", "MySQL", "Gemini AI"]
    },
    {
      category: "Observability & Tooling",
      skills: ["Prometheus", "Grafana", "Loki", "Git", "GitHub", "Vercel", "Vite", "REST APIs"]
    }
  ],
  links: {
    github: "https://github.com/Majidullask04",
    linkedin: "https://www.linkedin.com/in/majidulla-sk-1190a2286",
    twitter: "https://x.com/majidulla_sk",
    email: "majidullask04@gmail.com",
    phone: "+91 62944 12062",
    phoneRaw: "6294412062"
  },
  aiKnowledgeBase: [
    {
      keywords: ["who", "about", "introduce", "background", "summary", "elevator pitch"],
      question: "Who is Majidulla SK and what is his background?",
      category: "Overview",
      answer: "Majidulla SK is an AI Full-Stack Engineer and Cloud DevSecOps Specialist based in Hyderabad, India. He builds production-grade full-stack web applications with React, TypeScript, Node.js, Express, and MongoDB, while integrating AI/ML workflows and automating zero-trust cloud infrastructure on AWS and Kubernetes. He has 38+ public repositories on GitHub (@Majidullask04) and is an active CNCF / LFX open-source contributor."
    },
    {
      keywords: ["hire", "why hire", "strengths", "value", "special"],
      question: "Why should a company hire Majidulla SK?",
      category: "Hiring",
      answer: "Majid offers a rare and powerful combination: end-to-end Full-Stack development capabilities paired with deep, hands-on DevSecOps & Cloud Engineering. He doesn't just write frontend/backend code—he architectures the CI/CD pipelines, containerizes microservices, implements security scanning (SonarQube, Trivy, Gitleaks), and orchestrates Kubernetes clusters with GitOps. He saves teams hundreds of hours of deployment overhead and delivers resilient, secure software."
    },
    {
      keywords: ["phone", "call", "whatsapp", "mobile", "number", "tel"],
      question: "What is Majidulla SK's phone number and WhatsApp?",
      category: "Contact",
      answer: "You can reach Majid directly by phone or WhatsApp at **+91 62944 12062** (6294412062) or email him at **majidullask04@gmail.com**."
    },
    {
      keywords: ["student-os", "student os", "amplify", "latest project"],
      question: "What is the 'student-os' project?",
      category: "Projects",
      answer: "'student-os' is Majid's flagship student productivity and academic operating system built with TypeScript, React, and deployed on AWS Amplify (live at https://majid-1.d1kytdzlw5ibag.amplifyapp.com). It provides intelligent scheduling, assignment tracking, and real-time student analytics."
    },
    {
      keywords: ["devsecops", "pipeline", "security", "jenkins", "trivy", "sonarqube", "gitleaks"],
      question: "How does Majid approach DevSecOps and CI/CD pipelines?",
      category: "DevSecOps",
      answer: "Majid implements zero-trust automated pipelines. In his flagship '3-Tier-DevSecOps-Mega-Project', he designed a Jenkins declarative pipeline that auto-discovers modified microservices, enforces Gitleaks secrets scanning, validates SonarQube Quality Gates, runs Trivy vulnerability scans on filesystems & container images, tags images with commit SHAs, and deploys to Kubernetes via Argo CD GitOps."
    },
    {
      keywords: ["kubernetes", "k8s", "k3s", "docker", "istio", "containers", "orchestration"],
      question: "What is Majid's experience with Kubernetes and Containers?",
      category: "Cloud & K8s",
      answer: "Majid has hands-on experience deploying microservices on both lightweight K3s and AWS EKS. He configures Deployment manifests, Ingress controllers, Helm charts, and Istio Service Mesh for mutual TLS (mTLS), canary deployments, and distributed telemetry. He is currently preparing for the Certified Kubernetes Administrator (CKA) certification."
    },
    {
      keywords: ["full-stack", "fullstack", "frontend", "backend", "react", "node", "typescript", "api"],
      question: "What are Majid's Full-Stack and Backend capabilities?",
      category: "Full-Stack",
      answer: "Majid builds fast, type-safe SPAs with React, TypeScript, and TailwindCSS/Vite. On the backend, he creates scalable RESTful APIs with Node.js/Express and Python/FastAPI, utilizing MongoDB and MySQL for data persistence. He has shipped projects like student-os, career-ops, and Expense-tracker."
    },
    {
      keywords: ["contact", "email", "reach", "hire", "availability", "location"],
      question: "How can I contact Majid, and what is his availability?",
      category: "Contact",
      answer: "Majid is based in Hyderabad, Telangana, India and is available for Full-Time AI Full-Stack, Backend, DevSecOps, and Cloud Engineering roles as well as high-impact internships. You can call or WhatsApp him at **+91 62944 12062**, email **majidullask04@gmail.com**, connect on LinkedIn (majidulla-sk-1190a2286), or check his 38+ GitHub repos (@Majidullask04)."
    }
  ]
};
