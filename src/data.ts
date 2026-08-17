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
}

export const DATA = {
  name: "Majidulla SK",
  title: "AI Full-Stack Engineer | DevOps & Cloud Specialist",
  email: "majidullask04@gmail.com",
  location: "Hyderabad, Telangana, India",
  status: "Available for Roles & Internships",
  availability: "Open to AI Full-Stack Engineering, Backend, Frontend & Cloud Roles",
  about: "I am actively building my trajectory toward becoming a complete AI Full-Stack Engineer. Currently engineering robust backend systems with Node.js, Express, and MongoDB, building dynamic frontend interfaces with React and TypeScript, and mastering Machine Learning (ML) fundamentals to gain an end-to-end understanding of full software development. Backed by hands-on experience in cloud infrastructure (AWS), Kubernetes, and automated DevSecOps pipelines.",
  stats: [
    { label: "Git Commits", value: "250+" },
    { label: "Full-Stack Stack", value: "React + Node/Mongo" },
    { label: "AI & ML Track", value: "Actively Learning" },
    { label: "Projects Shipped", value: "10+" },
  ],
  services: [
    {
      title: "AI Full-Stack & Backend Engineering",
      subtitle: "Node.js, Express, MongoDB, React & ML",
      description: "Build end-to-end software applications from scratch. Crafting RESTful APIs and backend microservices with Node.js, Express, and MongoDB, delivering dynamic single-page applications with React and TypeScript, and integrating Machine Learning models for intelligent software features.",
      skills: ["Node.js", "Express.js", "MongoDB", "React", "TypeScript", "Python", "Machine Learning"]
    },
    {
      title: "CI/CD & DevSecOps Engineering",
      subtitle: "Automating Secure Code Delivery",
      description: "Design multi-stage declarative CI/CD pipelines in Jenkins and GitHub Actions. Integrated Gitleaks for secrets auditing, SonarQube for static analysis Quality Gates, Trivy for filesystem and container CVE scanning, and push hardened images with automated Docker Hub tags.",
      skills: ["Jenkins", "GitHub Actions", "SonarQube", "Trivy", "Gitleaks", "Bash"]
    },
    {
      title: "Container Orchestration & Service Mesh",
      subtitle: "Kubernetes, Docker & Istio",
      description: "Deploy and manage containerized microservices on Kubernetes (K3s & EKS). Deep experience writing Deployment, Service, and Ingress manifests, managing cluster state, setting up Istio Service Mesh, and managing multi-architecture Docker builds (ARM64/AMD64).",
      skills: ["Docker", "Kubernetes", "K3s", "Helm", "Argo CD", "Istio"]
    },
    {
      title: "Cloud Infrastructure (AWS)",
      subtitle: "Architecting Cloud Solutions",
      description: "Architect and provision cloud environments on AWS. Hands-on expertise with EC2, IAM, VPC, S3, CloudFront, EKS, ECR, CloudWatch, and AWS Amplify. Experience deploying microservices on EC2 instances behind Nginx reverse proxies with SSL termination.",
      skills: ["AWS EC2", "S3", "IAM", "VPC", "CloudFront", "EKS", "Terraform"]
    },
    {
      title: "Observability & SRE Stack",
      subtitle: "Monitoring, Alerting & Logs",
      description: "Design comprehensive monitoring and logging stacks for Kubernetes workloads using Prometheus for metrics scraping, Grafana for dashboard visualizations and alerts, and Loki for centralized log aggregation linked to GitOps pipelines.",
      skills: ["Prometheus", "Grafana", "Loki", "CloudWatch", "Kubernetes Metrics"]
    },
    {
      title: "Linux Administration & Automation",
      subtitle: "Operating Systems & Scripting",
      description: "Linux is my native operating environment. I write automation scripts in Bash and Python to streamline operations, manage systemd services, configure Nginx load balancing, and troubleshoot network/system performance.",
      skills: ["Linux (Ubuntu)", "Bash", "Python", "Nginx", "Systemd", "gRPC"]
    }
  ],
  experience: [
    {
      role: "B.Tech in Computer Science and Engineering",
      company: "Brilliant Institute of Engineering and Technology (JNTUH)",
      period: "2023 - 2027",
      description: "CGPA: 7.5 | Hyderabad, Telangana. Core coursework: Operating Systems, Computer Networks, Database Management Systems, Data Structures & Algorithms, Software Engineering."
    },
    {
      role: "CNCF Open Source Contributor",
      company: "Linux Foundation (LFX Mentorship)",
      period: "2024 - Present",
      description: "Active contributor to CNCF ecosystem projects (CLOWarden, LFX Crowdfunding). Authored documentation updates (GitHub issue #359) clarifying LFX Crowdfunding setup and usage for project maintainers."
    },
    {
      role: "DevSecOps & Platform Engineer",
      company: "Personal & Open Source Projects",
      period: "2023 - Present",
      description: "Designed production-grade DevSecOps pipelines for multi-service repositories, cutting manual deployment effort by 90%. Configured zero-trust secret scanning, automated image builds, and K3s GitOps sync with Argo CD."
    },
    {
      role: "MLH Global Hack Week Participant",
      company: "Major League Hacking",
      period: "2024",
      description: "Participated in global hackathons, building web services, exploring AI API integrations, and collaborating on developer tools."
    }
  ],
  recognition: [
    {
      id: "01",
      award: "In Progress",
      title: "AWS Certified Cloud Practitioner",
      event: "Amazon Web Services",
      quote: "Validating foundational cloud architecture, security, compliance, and core AWS service expertise.",
      meta: "Certification"
    },
    {
      id: "02",
      award: "In Progress",
      title: "Certified Kubernetes Administrator (CKA)",
      event: "CNCF / Linux Foundation",
      quote: "Demonstrating advanced hands-on capability in Kubernetes cluster installation, networking, storage, and troubleshooting.",
      meta: "Certification"
    },
    {
      id: "03",
      award: "In Progress",
      title: "HashiCorp Certified: Terraform Associate",
      event: "HashiCorp",
      quote: "Validating Infrastructure as Code (IaC) principles, state management, and Terraform configuration.",
      meta: "Certification"
    },
    {
      id: "04",
      award: "Completed",
      title: "LFX Open Source Mentorship Program",
      event: "Linux Foundation & CNCF",
      quote: "Successfully completed program tasks contributing to cloud-native open source ecosystems.",
      meta: "Open Source Recognition"
    }
  ],
  projects: [
    {
      id: "01",
      title: "3-Tier-DevSecOps-Mega-Project",
      category: "DevSecOps & Cloud",
      description: "Production-ready Jenkins Declarative Pipeline auto-building 11+ microservices with dynamic Docker discovery. Features Gitleaks secret detection, SonarQube Quality Gates, Trivy container CVE scanning, and dynamic deployment to K3s.",
      tools: ["Jenkins", "Docker", "Kubernetes (K3s)", "SonarQube", "Trivy", "Gitleaks", "Argo CD"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/3-Tier-DevSecOps-Mega-Project",
      featured: true
    },
    {
      id: "02",
      title: "career-ops",
      category: "Full-Stack & AI",
      description: "Open-source AI job search tool and terminal agent. Scans job portals, grades listings (A-F fit score), tailors resume JSON/Markdown, and tracks job applications locally inside AI coding CLIs.",
      tools: ["TypeScript", "Node.js", "AI CLI", "Automation", "Git"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/career-ops",
      liveUrl: "https://career-ops.org",
      featured: true
    },
    {
      id: "03",
      title: "Google Microservices DevOps Platform",
      category: "Microservices & K8s",
      description: "DevOps implementation of Google's 10-microservice cloud app. Deployed on Kubernetes with Istio Service Mesh, gRPC inter-service communication, distributed tracing, and automated telemetry.",
      tools: ["Go", "Kubernetes", "Istio", "gRPC", "Docker", "Helm"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/Majid-s-DevOps-implementation-of-Google-s-project.",
      liveUrl: "https://cymbal-shops.retail.cymbal.dev",
      featured: true
    },
    {
      id: "04",
      title: "ci-cd-automation",
      category: "DevSecOps & Cloud",
      description: "Automated 7-stage CI/CD security pipeline running static analysis, secrets audit, and container vulnerabilities before pushing hardened images to Docker Hub.",
      tools: ["Jenkins", "Docker", "SonarQube", "Trivy", "Gitleaks", "Bash"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/ci-cd-automation",
      featured: false
    },
    {
      id: "05",
      title: "Expense-tracker",
      category: "Full-Stack & AI",
      description: "Full-stack expense tracking web app featuring transaction analytics, visual financial dashboards, and automated continuous deployment on Vercel.",
      tools: ["JavaScript", "React", "Node.js", "Vercel", "CSS3"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/Expense-tracker",
      liveUrl: "https://expense-tracker-delta-taupe-40.vercel.app",
      featured: true
    },
    {
      id: "06",
      title: "examaid-pro",
      category: "Full-Stack & AI",
      description: "Full-stack educational platform built with React, Vite, FastAPI backend, SonarQube code quality audits, deployed on AWS EC2 with Nginx reverse proxy.",
      tools: ["React/Vite", "TypeScript", "FastAPI", "AWS EC2", "Nginx", "SonarQube"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/examaid-pro",
      featured: false
    },
    {
      id: "07",
      title: "HomeoCare_2.0",
      category: "Full-Stack & AI",
      description: "Modern healthcare appointment and patient portal application featuring digital consultation booking and responsive frontend deployed on Vercel.",
      tools: ["TypeScript", "React", "Vite", "Vercel", "TailwindCSS"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/HomeoCare_2.0",
      liveUrl: "https://homeo-care-2-0.vercel.app",
      featured: false
    },
    {
      id: "08",
      title: "clowarden",
      category: "Open Source & CNCF",
      description: "CNCF ecosystem open-source project for cross-service resource access management. Participated in maintainer documentation and community review.",
      tools: ["Go", "CNCF", "LFX", "YAML", "Git"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/clowarden",
      featured: true
    },
    {
      id: "09",
      title: "MR-Electrical-works",
      category: "Full-Stack & AI",
      description: "Commercial website for electrical contractor services featuring service showcase, inquiry workflow, and production hosting on Vercel.",
      tools: ["JavaScript", "React", "Vercel", "HTML5", "CSS3"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/MR-Electrical-works",
      liveUrl: "https://mr-electrical-works.vercel.app",
      featured: false
    }
  ] as Project[],
  categorizedTechStack: [
    {
      category: "Cloud & Infrastructure",
      skills: ["AWS EC2", "AWS S3", "AWS IAM", "AWS VPC", "AWS CloudFront", "AWS EKS", "Linux (Ubuntu)", "Bash", "Terraform", "Nginx"]
    },
    {
      category: "Containers & Orchestration",
      skills: ["Docker", "Docker Compose", "Kubernetes", "K3s", "Helm", "Istio", "gRPC"]
    },
    {
      category: "CI/CD & DevSecOps",
      skills: ["Jenkins", "GitHub Actions", "SonarQube", "Trivy", "Gitleaks", "Argo CD"]
    },
    {
      category: "Observability & Databases",
      skills: ["Prometheus", "Grafana", "Loki", "MongoDB", "MySQL"]
    },
    {
      category: "Development & Web",
      skills: ["Python", "Java", "JavaScript", "TypeScript", "React", "Vite", "Node.js", "FastAPI", "Git", "GitHub", "Vercel"]
    }
  ],
  techStack: [
    "AWS EC2", "AWS S3", "AWS CloudFront", "AWS EKS", "Linux", "Bash", "Terraform", "Docker", "Kubernetes", "K3s", "Helm", "Istio",
    "Jenkins", "GitHub Actions", "Argo CD", "SonarQube", "Trivy", "Gitleaks", "Prometheus", "Grafana", "Loki",
    "Python", "Java", "JavaScript", "TypeScript", "React", "Node.js", "FastAPI", "MongoDB", "MySQL", "Nginx", "Git", "GitHub", "Vercel"
  ],
  links: {
    github: "https://github.com/Majidullask04",
    linkedin: "https://www.linkedin.com/in/majidulla-sk-1190a2286",
    twitter: "https://x.com/majidulla_sk"
  }
};
