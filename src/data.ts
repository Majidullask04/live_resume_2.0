export const DATA = {
  name: "Majidulla SK",
  title: "DevOps Engineer | Cloud & Platform Engineering",
  email: "majidullask04@gmail.com",
  location: "Hyderabad, Telangana, India",
  status: "Available",
  availability: "Open to DevOps, Cloud, Platform Eng., and SRE Internships",
  about: "Building infrastructure that deploys reliably, scales efficiently, and recovers automatically. I build and operate CI/CD pipelines, container platforms, and cloud infrastructure. I have hands-on experience running Kubernetes workloads, designing DevSecOps pipelines with real security tooling, and deploying production applications on AWS. Currently contributing to the cloud-native ecosystem through the CNCF LFX Mentorship Program.",
  stats: [
    { label: "Git Commits", value: "200+" },
    { label: "DevSecOps Pipeline", value: "7-Stage" },
    { label: "Projects Shipped", value: "5+" },
  ],
  services: [
    {
      title: "CI/CD Pipeline Engineering",
      subtitle: "Automating secure delivery",
      description: "Design and implement multi-stage declarative CI/CD pipelines. My Jenkins DevSecOps pipeline runs Gitleaks for secrets scanning, SonarQube for static analysis, Trivy for image CVE scanning, and pushes hardened images to registries.",
      skills: ["Jenkins", "GitHub Actions", "DevSecOps", "Bash Scripting"]
    },
    {
      title: "Container Orchestration",
      subtitle: "Kubernetes & Docker",
      description: "Deploy and manage containerised workloads on Kubernetes. Hands-on experience with K3s clusters, writing Deployment and Service manifests, debugging pod failures, and managing workload state.",
      skills: ["Docker", "Kubernetes", "K3s", "Helm", "ArgoCD"]
    },
    {
      title: "Cloud Infrastructure (AWS)",
      subtitle: "Architect & Deploy",
      description: "Architect and deploy applications on AWS. Deep understanding of core services including EC2, IAM, VPC, S3, CloudFront, EKS, ECR, and CloudWatch. Proven experience deploying production workloads on EC2 behind Nginx reverse proxies.",
      skills: ["AWS EC2", "IAM", "VPC", "S3", "CloudFront", "EKS"]
    },
    {
      title: "DevSecOps & Security Tooling",
      subtitle: "Shift-left Security",
      description: "Embed security into the delivery pipeline. Integrating Gitleaks to prevent credential leaks, Trivy to catch container CVEs, and SonarQube to surface code quality hotspots before they reach production.",
      skills: ["Trivy", "Gitleaks", "SonarQube", "SAST", "Image Scanning"]
    },
    {
      title: "Linux Administration & Scripting",
      subtitle: "Core Operations",
      description: "Linux is my primary operating environment. I write Bash scripts to automate repetitive ops work, manage services with systemd, and configure Nginx for reverse proxying and load balancing.",
      skills: ["Linux", "Bash", "Nginx", "Systemd", "Automation"]
    },
    {
      title: "Observability (Architecture)",
      subtitle: "Monitoring Stack",
      description: "Designed the architecture for a comprehensive monitoring stack using Prometheus for metrics scraping, Grafana for dashboarding, and Loki for log aggregation — integrated with a K3s/ArgoCD GitOps platform.",
      skills: ["Prometheus", "Grafana", "Loki", "Architecture Design"]
    }
  ],
  experience: [
    {
      role: "Bachelor of Technology, Computer Science and Engineering",
      company: "Brilliant Institute of Engineering and Technology (JNTUH)",
      period: "2023 - 2027",
      description: "CGPA: 7.5. Hyderabad, Telangana."
    },
    {
      role: "Open Source Contributor",
      company: "CNCF Project",
      period: "Recent",
      description: "Contributing documentation to a CNCF project (GitHub issue #359), clarifying LFX Crowdfunding usage guidance for project maintainers."
    },
    {
      role: "LFX Open Source Program",
      company: "Linux Foundation",
      period: "Completed",
      description: "Successfully completed the LFX Open Source Program."
    },
    {
      role: "MLH Global Hack Week",
      company: "Major League Hacking",
      period: "Participated",
      description: "Actively participated in the MLH Global Hack Week."
    }
  ],
  recognition: [
    {
      id: "01",
      award: "Preparing",
      title: "AWS Certified Cloud Practitioner",
      event: "AWS",
      quote: "Preparing for the foundational AWS certification to validate cloud expertise.",
      meta: "Certification"
    },
    {
      id: "02",
      award: "Preparing",
      title: "Certified Kubernetes Administrator (CKA)",
      event: "CNCF",
      quote: "Preparing for CKA to demonstrate advanced proficiency in Kubernetes administration.",
      meta: "Certification"
    },
    {
      id: "03",
      award: "Preparing",
      title: "Terraform Associate",
      event: "HashiCorp",
      quote: "Preparing for the Terraform Associate certification to validate infrastructure as code skills.",
      meta: "Certification"
    }
  ],
  projects: [
    {
      id: "01",
      title: "ci-cd-automation",
      category: "DevSecOps Pipeline",
      tools: ["Jenkins", "Docker", "SonarQube", "Trivy", "Gitleaks", "Bash"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/ci-cd-automation"
    },
    {
      id: "02",
      title: "examaid-pro",
      category: "Full-Stack Developer & Cloud Deployment",
      tools: ["React/Vite", "TypeScript", "FastAPI", "AWS EC2", "Nginx", "SonarQube"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/examaid-pro"
    },
    {
      id: "03",
      title: "node-express-mongoose-demo",
      category: "Kubernetes Deployment & Troubleshooting",
      tools: ["K3s", "Kubernetes", "Node.js", "Express", "MongoDB"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/node-express-mongoose-demo"
    },
    {
      id: "04",
      title: "microservices-devops-platform",
      category: "Architecture Design & Documentation",
      tools: ["K3s", "ArgoCD", "Prometheus", "Grafana", "Loki", "Architecture"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/microservices-demo.git"
    },
    {
      id: "05",
      title: "amplify-vite-react-template",
      category: "AWS Auth Integration",
      tools: ["AWS Amplify Gen 2", "React", "Vite"],
      linkText: "GitHub ↗",
      linkUrl: "https://github.com/Majidullask04/amplify-vite-react-template"
    }
  ],
  techStack: [
    "AWS EC2", "S3", "CloudFront", "EKS", "Linux", "Bash", "Terraform", "Docker", "Kubernetes", "K3s", "Helm",
    "Jenkins", "GitHub Actions", "ArgoCD", "SonarQube", "Trivy", "Gitleaks", "Prometheus", "Grafana", "Loki",
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "Nginx", "Git", "GitHub"
  ],
  links: {
    github: "https://github.com/Majidullask04",
    linkedin: "https://www.linkedin.com/in/majidulla-sk-1190a2286",
    twitter: "https://x.com/majidulla_sk"
  }
};
