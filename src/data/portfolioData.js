/**
 * =========================================================================
 * CENTRALIZED PORTFOLIO DATA
 * =========================================================================
 * Technical portfolio focused on Cybersecurity, Computer Networking,
 * and Artificial Intelligence & Machine Learning.
 */

export const portfolioData = {
  // Personal & Hero Information
  personal: {
    name: "Nuwan Pinnaduwage",
    preferredName: "Nuwan",
    email: "nuwan.pinnaduwage@example.com",
    role: "Cybersecurity, Networking & AI Specialist | Computer Science Undergraduate",
    degree: "Bachelor of Science in Computer Science",
    specialization: "Cybersecurity, Computer Networking & Artificial Intelligence",
    university: "State University of Technology",
    expectedGraduation: "May 2026",
    statusBadge: {
      available: true,
      text: "AVAILABLE FOR OPPORTUNITIES.",
    },
    location: "San Francisco, CA (Open to Remote & Relocation)",
    bioShort:
      "Computer Science undergraduate specializing in offensive & defensive cybersecurity, network infrastructure engineering, and artificial intelligence. Dedicated to building hardened networks, vulnerability research, and intelligent security automation.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    // Hero Background Images (Separate for Light and Dark modes)
    heroBackgrounds: {
      light: "/hero-light.png",
      dark: "/hero-dark.png",
    },
    resumeFileName: "Nuwan_Pinnaduwage_Technical_Resume.pdf",
    quickStats: [
      { label: "Technical Focus", value: "Cyber, Net & AI" },
      { label: "Degree Focus", value: "B.S. in CS" },
      { label: "Technical Projects", value: "14+" },
      { label: "Security Labs", value: "25+" },
    ],
    socialLinks: [
      {
        platform: "GitHub",
        url: "https://github.com/nuwan-pinnaduwage",
        username: "@nuwanp-sec",
        icon: "Github",
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/nuwan-pinnaduwage",
        username: "in/nuwan-pinnaduwage",
        icon: "Linkedin",
      },
      {
        platform: "TryHackMe",
        url: "https://tryhackme.com",
        username: "nuwan_cyber",
        icon: "Terminal",
      },
      {
        platform: "Email",
        url: "mailto:nuwan.pinnaduwage@example.com",
        username: "nuwan.pinnaduwage@example.com",
        icon: "Mail",
      },
    ],
  },

  // About Section
  about: {
    title: "About Me",
    subtitle: "Defending networks, engineering resilient infrastructure, and deploying machine intelligence.",
    paragraphs: [
      "I am a Computer Science undergraduate focused on the intersection of Cybersecurity, Computer Networking, and Artificial Intelligence. My journey began with low-level systems programming and network protocol analysis, evolving into penetration testing, network automation, and deep learning for threat detection.",
      "I have hands-on experience designing secure multi-segment network topologies, configuring firewalls and routing protocols, performing vulnerability assessments, and engineering AI pipelines for behavioral anomaly detection. I approach technology with a security-first mindset: understanding how systems break to engineer robust defenses.",
      "Beyond lab simulations and coursework, I actively engage in CTF competitions, explore packet-level protocol internals, and automate security telemetry. I aim to bridge network infrastructure reliability with modern machine learning intelligence."
    ],
    highlights: [
      {
        icon: "Shield",
        title: "Cybersecurity & Defense",
        description: "Vulnerability assessment, network penetration testing, intrusion detection (IDS/IPS), security auditing, and defensive system hardening."
      },
      {
        icon: "Network",
        title: "Networking & Infrastructure",
        description: "LAN/WAN design, routing (OSPF, BGP), switching (VLANs), firewall configuration, packet analysis, and network automation with Python."
      },
      {
        icon: "Cpu",
        title: "AI & Machine Learning",
        description: "Deep learning models for network anomaly detection, predictive security analytics, computer vision for surveillance, and NLP classification."
      },
      {
        icon: "Terminal",
        title: "Systems & Security Automation",
        description: "Linux server administration, packet dissection with Wireshark, automated configuration management, Docker containerization, and REST APIs."
      }
    ],
    terminalFacts: [
      { key: "degree", value: '"B.S. Computer Science"' },
      { key: "standing", value: '"Senior (4th Year)"' },
      { key: "focusAreas", value: '["Cybersecurity", "Computer Networks", "Artificial Intelligence"]' },
      { key: "securityTools", value: '["Kali Linux", "Wireshark", "Nmap", "Snort", "Burp Suite", "Metasploit"]' },
      { key: "networkingStack", value: '["Cisco IOS", "Packet Tracer", "GNS3", "TCP/IP", "pfSense", "BGP/OSPF"]' },
      { key: "aiFrameworks", value: '["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "Pandas"]' },
      { key: "availability", value: '"Open to Full-Time Security & Engineering Roles (2026)"' }
    ]
  },

  // Skills Section organized into the three main catalogs
  skills: {
    "title": "Skills & Technologies",
    "subtitle": "A balanced technical toolkit spanning Computer Networking, Cyber Security, and Computer Science & Analytical Fundamentals.",
    "categories": [
        {
            "id": "network",
            "name": "Network",
            "description": "Computer networking architecture, protocol models, routing & switching, subnetting, and network administration.",
            "order_index": 1,
            "is_published": true,
            "skills": [
                {
                    "id": "skill-network-computer-networking-fundamentals",
                    "name": "Computer Networking Fundamentals",
                    "level": 90,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Foundational principles of network topologies, packet transmission, and architecture.",
                    "order_index": 1,
                    "is_published": true
                },
                {
                    "id": "skill-network-tcp-ip-and-osi-models",
                    "name": "TCP/IP and OSI Models",
                    "level": 92,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Layered network communication models, protocol abstraction, and packet encapsulation.",
                    "order_index": 2,
                    "is_published": true
                },
                {
                    "id": "skill-network-ipv4-and-ipv6-addressing",
                    "name": "IPv4 and IPv6 Addressing",
                    "level": 88,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Hierarchical IP address schemes, dual-stack deployment, and address planning.",
                    "order_index": 3,
                    "is_published": true
                },
                {
                    "id": "skill-network-subnetting-and-vlsm",
                    "name": "Subnetting and VLSM",
                    "level": 90,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Variable Length Subnet Masking, CIDR prefix calculations, and address optimization.",
                    "order_index": 4,
                    "is_published": true
                },
                {
                    "id": "skill-network-routing-and-switching",
                    "name": "Routing and Switching",
                    "level": 86,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Layer 2 CAM table switching and Layer 3 static and dynamic packet routing.",
                    "order_index": 5,
                    "is_published": true
                },
                {
                    "id": "skill-network-vlans",
                    "name": "VLANs",
                    "level": 88,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "802.1Q virtual LAN segmentation, trunking, and broadcast domain isolation.",
                    "order_index": 6,
                    "is_published": true
                },
                {
                    "id": "skill-network-dns-and-dhcp",
                    "name": "DNS and DHCP",
                    "level": 89,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Hierarchical name resolution, resource records, and dynamic IP leasing services.",
                    "order_index": 7,
                    "is_published": true
                },
                {
                    "id": "skill-network-network-protocols",
                    "name": "Network Protocols",
                    "level": 87,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Transport (TCP/UDP), ICMP, ARP, NAT, HTTP/S, SSH, and network telemetry.",
                    "order_index": 8,
                    "is_published": true
                },
                {
                    "id": "skill-network-network-configuration-and-troubleshooting",
                    "name": "Network Configuration and Troubleshooting",
                    "level": 85,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Diagnosing connectivity issues, packet inspection, and device configuration.",
                    "order_index": 9,
                    "is_published": true
                },
                {
                    "id": "skill-network-network-administration",
                    "name": "Network Administration",
                    "level": 84,
                    "catalog_id": "network",
                    "category_id": "network",
                    "catalog_name": "Network",
                    "category_name": "Network",
                    "description": "Hardware provisioning, switch/router CLI management, and network monitoring.",
                    "order_index": 10,
                    "is_published": true
                }
            ]
        },
        {
            "id": "cyber_security",
            "name": "Cyber Security",
            "description": "Offensive and defensive security practices, vulnerability identification, system hardening, and access control.",
            "order_index": 2,
            "is_published": true,
            "skills": [
                {
                    "id": "skill-cyber_security-cybersecurity-fundamentals",
                    "name": "Cybersecurity Fundamentals",
                    "level": 88,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Core CIA triad model, defense-in-depth strategies, and threat landscape analysis.",
                    "order_index": 1,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-information-security",
                    "name": "Information Security",
                    "level": 86,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Data protection, security governance, risk assessment, and confidentiality policies.",
                    "order_index": 2,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-network-security",
                    "name": "Network Security",
                    "level": 88,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Firewall packet filtering, perimeter defense, and Intrusion Detection Systems.",
                    "order_index": 3,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-ethical-hacking-fundamentals",
                    "name": "Ethical Hacking Fundamentals",
                    "level": 84,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Authorized penetration testing methodologies, security scoping, and ethical disclosure.",
                    "order_index": 4,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-vulnerability-assessment",
                    "name": "Vulnerability Assessment",
                    "level": 85,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Automated scanning, manual verification, and CVSS severity scoring workflows.",
                    "order_index": 5,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-security-auditing",
                    "name": "Security Auditing",
                    "level": 80,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "System log auditing, baseline verification, and security compliance checks.",
                    "order_index": 6,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-linux-security",
                    "name": "Linux Security",
                    "level": 88,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Hardening Linux servers, user permissions, PAM, and secure SSH configuration.",
                    "order_index": 7,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-cryptography-fundamentals",
                    "name": "Cryptography Fundamentals",
                    "level": 82,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Symmetric/asymmetric encryption, hashing algorithms, and digital certificates.",
                    "order_index": 8,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-authentication-and-authorization",
                    "name": "Authentication and Authorization",
                    "level": 87,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Identity verification, Multi-Factor Authentication (MFA), and Role-Based Access Control.",
                    "order_index": 9,
                    "is_published": true
                },
                {
                    "id": "skill-cyber_security-security-tools-and-technologies",
                    "name": "Security Tools and Technologies",
                    "level": 86,
                    "catalog_id": "cyber_security",
                    "category_id": "cyber_security",
                    "catalog_name": "Cyber Security",
                    "category_name": "Cyber Security",
                    "description": "Hands-on utility experience with Wireshark, Nmap, Burp Suite, and security platforms.",
                    "order_index": 10,
                    "is_published": true
                }
            ]
        },
        {
            "id": "cs_fundamentals",
            "name": "CS Fundamentals",
            "description": "Core software engineering, algorithms, systems programming, and mathematical research methodology.",
            "order_index": 3,
            "is_published": true,
            "skills": [
                {
                    "id": "skill-cs_fundamentals-programming-fundamentals",
                    "name": "Programming Fundamentals",
                    "level": 92,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Core procedural structures, control flows, memory references, and algorithmic logic.",
                    "order_index": 1,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-object-oriented-programming",
                    "name": "Object-Oriented Programming",
                    "level": 90,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Encapsulation, inheritance, polymorphism, abstraction, and software design principles.",
                    "order_index": 2,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-data-structures-and-algorithms",
                    "name": "Data Structures and Algorithms",
                    "level": 88,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Arrays, linked lists, trees, graphs, sorting, searching, and Big-O complexity.",
                    "order_index": 3,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-database-management-systems",
                    "name": "Database Management Systems",
                    "level": 85,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Relational schema design, normalization, transactions, ACID properties, and SQL.",
                    "order_index": 4,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-operating-systems",
                    "name": "Operating Systems",
                    "level": 84,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Process scheduling, multi-threading, concurrency locks, virtual memory, and file systems.",
                    "order_index": 5,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-web-development-fundamentals",
                    "name": "Web Development Fundamentals",
                    "level": 86,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Client-server architectures, RESTful APIs, modern JavaScript, and responsive UI.",
                    "order_index": 6,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-software-engineering",
                    "name": "Software Engineering",
                    "level": 85,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "SDLC methodologies, Agile workflows, Git version control, and unit testing.",
                    "order_index": 7,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-discrete-mathematics",
                    "name": "Discrete Mathematics",
                    "level": 84,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Set theory, propositional logic, graph theory, relations, and proof techniques.",
                    "order_index": 8,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-linear-algebra",
                    "name": "Linear Algebra",
                    "level": 82,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Matrix operations, vector spaces, dot products, eigenvalues, and linear transformations.",
                    "order_index": 9,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-probability-and-statistics",
                    "name": "Probability and Statistics",
                    "level": 83,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Probability distributions, random variables, sample statistics, and hypothesis testing.",
                    "order_index": 10,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-machine-learning-fundamentals",
                    "name": "Machine Learning Fundamentals",
                    "level": 82,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Supervised and unsupervised learning, cost functions, training pipelines, and metrics.",
                    "order_index": 11,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-multiple-linear-regression-mlr-",
                    "name": "Multiple Linear Regression (MLR)",
                    "level": 80,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Multivariate regression modeling, residual analysis, and coefficient significance.",
                    "order_index": 12,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-analysis-of-variance-anova-",
                    "name": "Analysis of Variance (ANOVA)",
                    "level": 78,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Comparing statistical variance across independent sample groups.",
                    "order_index": 13,
                    "is_published": true
                },
                {
                    "id": "skill-cs_fundamentals-mathematical-and-statistical-research-fundamentals",
                    "name": "Mathematical and Statistical Research Fundamentals",
                    "level": 84,
                    "catalog_id": "cs_fundamentals",
                    "category_id": "cs_fundamentals",
                    "catalog_name": "CS Fundamentals",
                    "category_name": "CS Fundamentals",
                    "description": "Empirical study design, academic literature review, and experimental validation.",
                    "order_index": 14,
                    "is_published": true
                }
            ]
        }
    ],
    "items": [
        {
            "id": "skill-network-computer-networking-fundamentals",
            "name": "Computer Networking Fundamentals",
            "level": 90,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Foundational principles of network topologies, packet transmission, and architecture.",
            "order_index": 1,
            "is_published": true
        },
        {
            "id": "skill-network-tcp-ip-and-osi-models",
            "name": "TCP/IP and OSI Models",
            "level": 92,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Layered network communication models, protocol abstraction, and packet encapsulation.",
            "order_index": 2,
            "is_published": true
        },
        {
            "id": "skill-network-ipv4-and-ipv6-addressing",
            "name": "IPv4 and IPv6 Addressing",
            "level": 88,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Hierarchical IP address schemes, dual-stack deployment, and address planning.",
            "order_index": 3,
            "is_published": true
        },
        {
            "id": "skill-network-subnetting-and-vlsm",
            "name": "Subnetting and VLSM",
            "level": 90,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Variable Length Subnet Masking, CIDR prefix calculations, and address optimization.",
            "order_index": 4,
            "is_published": true
        },
        {
            "id": "skill-network-routing-and-switching",
            "name": "Routing and Switching",
            "level": 86,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Layer 2 CAM table switching and Layer 3 static and dynamic packet routing.",
            "order_index": 5,
            "is_published": true
        },
        {
            "id": "skill-network-vlans",
            "name": "VLANs",
            "level": 88,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "802.1Q virtual LAN segmentation, trunking, and broadcast domain isolation.",
            "order_index": 6,
            "is_published": true
        },
        {
            "id": "skill-network-dns-and-dhcp",
            "name": "DNS and DHCP",
            "level": 89,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Hierarchical name resolution, resource records, and dynamic IP leasing services.",
            "order_index": 7,
            "is_published": true
        },
        {
            "id": "skill-network-network-protocols",
            "name": "Network Protocols",
            "level": 87,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Transport (TCP/UDP), ICMP, ARP, NAT, HTTP/S, SSH, and network telemetry.",
            "order_index": 8,
            "is_published": true
        },
        {
            "id": "skill-network-network-configuration-and-troubleshooting",
            "name": "Network Configuration and Troubleshooting",
            "level": 85,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Diagnosing connectivity issues, packet inspection, and device configuration.",
            "order_index": 9,
            "is_published": true
        },
        {
            "id": "skill-network-network-administration",
            "name": "Network Administration",
            "level": 84,
            "catalog_id": "network",
            "category_id": "network",
            "catalog_name": "Network",
            "category_name": "Network",
            "description": "Hardware provisioning, switch/router CLI management, and network monitoring.",
            "order_index": 10,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-cybersecurity-fundamentals",
            "name": "Cybersecurity Fundamentals",
            "level": 88,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Core CIA triad model, defense-in-depth strategies, and threat landscape analysis.",
            "order_index": 1,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-information-security",
            "name": "Information Security",
            "level": 86,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Data protection, security governance, risk assessment, and confidentiality policies.",
            "order_index": 2,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-network-security",
            "name": "Network Security",
            "level": 88,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Firewall packet filtering, perimeter defense, and Intrusion Detection Systems.",
            "order_index": 3,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-ethical-hacking-fundamentals",
            "name": "Ethical Hacking Fundamentals",
            "level": 84,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Authorized penetration testing methodologies, security scoping, and ethical disclosure.",
            "order_index": 4,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-vulnerability-assessment",
            "name": "Vulnerability Assessment",
            "level": 85,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Automated scanning, manual verification, and CVSS severity scoring workflows.",
            "order_index": 5,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-security-auditing",
            "name": "Security Auditing",
            "level": 80,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "System log auditing, baseline verification, and security compliance checks.",
            "order_index": 6,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-linux-security",
            "name": "Linux Security",
            "level": 88,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Hardening Linux servers, user permissions, PAM, and secure SSH configuration.",
            "order_index": 7,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-cryptography-fundamentals",
            "name": "Cryptography Fundamentals",
            "level": 82,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Symmetric/asymmetric encryption, hashing algorithms, and digital certificates.",
            "order_index": 8,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-authentication-and-authorization",
            "name": "Authentication and Authorization",
            "level": 87,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Identity verification, Multi-Factor Authentication (MFA), and Role-Based Access Control.",
            "order_index": 9,
            "is_published": true
        },
        {
            "id": "skill-cyber_security-security-tools-and-technologies",
            "name": "Security Tools and Technologies",
            "level": 86,
            "catalog_id": "cyber_security",
            "category_id": "cyber_security",
            "catalog_name": "Cyber Security",
            "category_name": "Cyber Security",
            "description": "Hands-on utility experience with Wireshark, Nmap, Burp Suite, and security platforms.",
            "order_index": 10,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-programming-fundamentals",
            "name": "Programming Fundamentals",
            "level": 92,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Core procedural structures, control flows, memory references, and algorithmic logic.",
            "order_index": 1,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-object-oriented-programming",
            "name": "Object-Oriented Programming",
            "level": 90,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Encapsulation, inheritance, polymorphism, abstraction, and software design principles.",
            "order_index": 2,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-data-structures-and-algorithms",
            "name": "Data Structures and Algorithms",
            "level": 88,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Arrays, linked lists, trees, graphs, sorting, searching, and Big-O complexity.",
            "order_index": 3,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-database-management-systems",
            "name": "Database Management Systems",
            "level": 85,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Relational schema design, normalization, transactions, ACID properties, and SQL.",
            "order_index": 4,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-operating-systems",
            "name": "Operating Systems",
            "level": 84,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Process scheduling, multi-threading, concurrency locks, virtual memory, and file systems.",
            "order_index": 5,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-web-development-fundamentals",
            "name": "Web Development Fundamentals",
            "level": 86,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Client-server architectures, RESTful APIs, modern JavaScript, and responsive UI.",
            "order_index": 6,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-software-engineering",
            "name": "Software Engineering",
            "level": 85,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "SDLC methodologies, Agile workflows, Git version control, and unit testing.",
            "order_index": 7,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-discrete-mathematics",
            "name": "Discrete Mathematics",
            "level": 84,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Set theory, propositional logic, graph theory, relations, and proof techniques.",
            "order_index": 8,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-linear-algebra",
            "name": "Linear Algebra",
            "level": 82,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Matrix operations, vector spaces, dot products, eigenvalues, and linear transformations.",
            "order_index": 9,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-probability-and-statistics",
            "name": "Probability and Statistics",
            "level": 83,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Probability distributions, random variables, sample statistics, and hypothesis testing.",
            "order_index": 10,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-machine-learning-fundamentals",
            "name": "Machine Learning Fundamentals",
            "level": 82,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Supervised and unsupervised learning, cost functions, training pipelines, and metrics.",
            "order_index": 11,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-multiple-linear-regression-mlr-",
            "name": "Multiple Linear Regression (MLR)",
            "level": 80,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Multivariate regression modeling, residual analysis, and coefficient significance.",
            "order_index": 12,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-analysis-of-variance-anova-",
            "name": "Analysis of Variance (ANOVA)",
            "level": 78,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Comparing statistical variance across independent sample groups.",
            "order_index": 13,
            "is_published": true
        },
        {
            "id": "skill-cs_fundamentals-mathematical-and-statistical-research-fundamentals",
            "name": "Mathematical and Statistical Research Fundamentals",
            "level": 84,
            "catalog_id": "cs_fundamentals",
            "category_id": "cs_fundamentals",
            "catalog_name": "CS Fundamentals",
            "category_name": "CS Fundamentals",
            "description": "Empirical study design, academic literature review, and experimental validation.",
            "order_index": 14,
            "is_published": true
        }
    ]
},

  // Education Section
  education: {
    title: "Education",
    subtitle: "Rigorous academic curriculum emphasizing computer systems, network engineering, and cybersecurity.",
    degrees: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "State University of Technology",
        location: "Campus City, CA",
        period: "August 2022 - Expected May 2026",
        gpa: "3.85 / 4.00",
        honors: ["Dean's Honors List (All semesters)", "Academic Excellence Scholarship in STEM"],
        description: "Concentration in Cybersecurity, Computer Networks, and Machine Learning Systems.",
        coursework: [
          "Computer Networks & Internet Protocols",
          "Network Security & Cryptography",
          "Operating Systems & Kernel Architecture",
          "Artificial Intelligence & Machine Learning",
          "Data Structures & Algorithm Analysis",
          "Database Management Systems",
          "Computer System Architecture",
          "Distributed Systems & Cloud Computing",
        ],
        extracurriculars: [
          "Cybersecurity Club - Technical Lead & CTF Team Captain",
          "Undergraduate Peer Tutor for Computer Networks & Data Structures",
          "ACM Student Chapter - Systems & Security Workshop Organizer"
        ]
      }
    ]
  },

  // Featured Projects Showcase: Cybersecurity, Computer Networking, AI/ML
  projects: {
    title: "Technical Projects Showcase",
    subtitle: "A collection of hands-on security frameworks, enterprise network infrastructures, and artificial intelligence models engineered with real-world architectures.",
    categories: [
      "All",
      "Cybersecurity",
      "Computer Networking",
      "Artificial Intelligence & Machine Learning"
    ],
    subcategories: {
      "Cybersecurity": [
        "Network Security",
        "Ethical Hacking",
        "Penetration Testing",
        "Vulnerability Assessment",
        "Security Auditing",
        "Web Application Security",
        "Cryptography",
        "Digital Forensics",
        "Intrusion Detection Systems (IDS)",
        "Malware Analysis",
        "Security Automation"
      ],
      "Computer Networking": [
        "Network Infrastructure",
        "Network Configuration",
        "Routing and Switching",
        "Network Monitoring",
        "Network Automation",
        "TCP/IP and Network Protocols",
        "LAN/WAN Design",
        "Network Simulation",
        "Firewall Configuration",
        "Server Administration",
        "Cloud Networking"
      ],
      "Artificial Intelligence & Machine Learning": [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing (NLP)",
        "Computer Vision",
        "AI Chatbots",
        "Predictive Analytics",
        "Intelligent Automation",
        "AI-Powered Security",
        "Anomaly Detection",
        "Data Science"
      ]
    },
    types: [
      "All",
      "Security Tool",
      "Network Infrastructure",
      "AI System",
      "Simulation Lab",
      "Automation Engine",
      "Defensive Framework",
      "Offensive Security Tool"
    ],
    statuses: ["All", "Completed", "In Progress", "Research", "Planned"],
    categorizedTags: {
      "Programming": ["Python", "Java", "JavaScript", "C", "C++", "PHP", "Bash", "Go"],
      "Cybersecurity": ["Kali Linux", "Wireshark", "Nmap", "Metasploit", "Burp Suite", "OWASP ZAP", "Snort", "Suricata", "OpenSSL", "Ghidra"],
      "Networking": ["Cisco Packet Tracer", "GNS3", "Cisco IOS", "TCP/IP", "DNS", "DHCP", "VLAN", "Routing", "Switching", "BGP", "OSPF", "pfSense"],
      "AI/ML": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "Pandas", "NumPy", "Hugging Face", "Keras"],
      "Development & Infrastructure": ["Linux", "Windows Server", "Docker", "Git", "MySQL", "PostgreSQL", "REST APIs", "Ansible"]
    },
    tags: [
      "Python", "Kali Linux", "Wireshark", "Nmap", "Metasploit", "Burp Suite", "Snort",
      "Cisco Packet Tracer", "GNS3", "Cisco IOS", "TCP/IP", "VLAN", "BGP", "OSPF", "pfSense",
      "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "Pandas", "NumPy", "Linux", "Docker", "Git"
    ],
    filterConfig: {
      enableType: true,
      enableCategory: true,
      enableSubcategory: true,
      enableStatus: true,
      enableStack: true,
      enableTags: true,
      enableSorting: true,
    },
    items: [
      {
        id: "proj-sentinel-ids",
        title: "SentinelIDS: Real-Time Deep Packet Inspection & AI-Driven IPS",
        slug: "sentinel-ids-deep-packet-inspection",
        category: "Cybersecurity",
        subcategory: "Intrusion Detection Systems (IDS)",
        type: "Security Tool",
        status: "Completed",
        completionYear: "2024",
        completionDate: "2024-11",
        startDate: "2024-06",
        tagline: "Hybrid intrusion prevention system fusing Snort 3 signature matching with real-time neural payload classification.",
        description: "Engineered a high-throughput network intrusion detection and automated prevention system that inspects live packet streams, classifies zero-day payload anomalies with an inference model, and dynamically injects iptables firewall block rules.",
        fullOverview: "SentinelIDS bridges the gap between deterministic signature analysis and modern machine learning. Operating directly over raw AF_PACKET sockets, the engine pipelines incoming traffic through two parallel inspection stages: a high-speed compiled Snort 3 rule matcher for known CVE signatures, followed by a quantized 1D convolutional feature extractor for abnormal byte patterns. Upon positive detection, the automated mitigations daemon executes netfilter quarantine commands within 4.2ms, effectively severing active TCP sessions.",
        problemStatement: "Traditional signature-based IDS solutions suffer from critical blind spots against obfuscated shellcodes, polymorphic payloads, and novel zero-day attacks, while purely statistical anomaly detectors generate unacceptably high false-alarm rates in high-throughput enterprise networks.",
        objectives: "1. Build a dual-stage packet inspection pipeline processing gigabit traffic with sub-5ms inspection latency.\n2. Achieve >98% detection accuracy across polymorphic exploits without exceeding 0.05% false positive rates.\n3. Implement automated firewall rule generation and IP quarantine via Linux iptables and Redis ban lists.",
        proposedSolution: "Develop an integrated hybrid engine using C++ for raw packet capture via libpcap, Python for rapid telemetry orchestration, Snort 3 for deterministic signatures, and an embedded ONNX neural model for unknown anomaly classification.",
        technicalImplementation: "The packet acquisition daemon taps incoming physical NIC interfaces using circular ring buffers in user space. Captured frames are parsed down to L4 transport headers. Suspicious payloads exceeding entropy thresholds are passed to a quantized neural model. If an exploit confidence score exceeds 0.92, an asynchronous event worker signals the iptables netfilter queue to inject DROP rules and notifies SIEM endpoints via syslog.",
        technologies: ["Python", "C++", "Snort", "Wireshark", "Kali Linux", "Docker", "Linux", "TCP/IP", "REST APIs"],
        tags: ["Python", "Snort", "Wireshark", "Kali Linux", "Docker", "TCP/IP"],
        metrics: ["< 4.2ms end-to-end drop latency", "98.9% exploit detection rate", "10Gbps line rate bench with 0 packet drops"],
        keyFeatures: [
          "Zero-copy AF_PACKET socket capture pipeline processing over 120,000 packets per second.",
          "Hybrid rule evaluation integrating official Snort Community Rules with custom regex signatures.",
          "Automated active response system managing dynamic iptables netfilter IP blacklisting.",
          "Interactive curses terminal and live web telemetry dashboard displaying packet breakdown.",
          "Exportable PCAP capture logs and SIEM-compliant JSON alerting format."
        ],
        results: "Demonstrated 98.9% true-positive detection against 450 simulated Metasploit and Kali Linux exploit payloads during controlled red-team validation, maintaining negligible CPU overhead (<12%) on a standard 4-core Linux appliance.",
        challenges: "Minimizing buffer bloat and memory allocations during sustained UDP flood attacks. Resolved by implementing memory-mapped ring buffers (mmap) and batching iptables netfilter updates through ipset.",
        futureImprovements: "Integrating eBPF / XDP (eXpress Data Path) kernel bypass for direct packet filtering at the network driver level.",
        architectureDiagram: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        topologyDiagram: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900",
        gallery: [
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900",
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=900",
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900"
        ],
        github: "https://github.com/nuwan-pinnaduwage/sentinel-ids",
        demo: "",
        documentationUrl: "https://github.com/nuwan-pinnaduwage/sentinel-ids#readme",
        defaultView: "overview",
        featured: true,
        is_published: true,
      },
      {
        id: "proj-enterprise-netmesh",
        title: "Enterprise NetMesh: Multi-Site SD-WAN & Dual-Stack BGP/OSPF Infrastructure",
        slug: "enterprise-netmesh-sdwan-infrastructure",
        category: "Computer Networking",
        subcategory: "Routing and Switching",
        type: "Network Infrastructure",
        status: "Completed",
        completionYear: "2024",
        completionDate: "2024-09",
        startDate: "2024-03",
        tagline: "Resilient enterprise campus and multi-site WAN architecture designed with redundant BGP multi-homing and 802.1Q VLAN segmentation.",
        description: "Designed, simulated, and deployed a production-grade multi-tier enterprise network infrastructure spanning headquarters, data centers, and branch offices with dynamic routing failover, pfSense firewalls, and automated configuration management.",
        fullOverview: "Enterprise NetMesh models a complete corporate IT infrastructure engineered to withstand multi-link failures without human intervention. The campus backbone implements a hierarchical three-tier design (Core, Distribution, Access) utilizing multi-area OSPFv2/OSPFv3 for internal convergence and dual-homed eBGP connections to dual simulated Tier-1 ISPs with BFD (Bidirectional Forwarding Detection). Departmental traffic is isolated into dedicated 802.1Q VLANs with Inter-VLAN routing governed by stateful pfSense firewall clusters running CARP (Common Address Redundancy Protocol).",
        problemStatement: "The legacy network suffered from unsegmented broadcast domains, single points of failure across primary WAN uplinks, slow spanning-tree reconvergence (>30s), and manual, error-prone switch port provisioning.",
        objectives: "1. Architect a resilient campus topology with zero single points of failure and sub-2 second routing convergence.\n2. Isolate administrative, corporate, voice, and guest wireless traffic across distinct 802.1Q VLANs.\n3. Implement redundant edge firewalls with state synchronization and automated site-to-site IPsec VPN tunnels.",
        proposedSolution: "Utilize Cisco Packet Tracer and GNS3 to simulate a multi-site enterprise topology incorporating Cisco IOS routers, multilayer Catalyst 3650 switches, redundant pfSense firewalls, and Python Netmiko scripts for centralized configuration push.",
        technicalImplementation: "Configured multi-area OSPF with route summarization on backbone Area 0 to minimize routing table bloat. Enabled Rapid PVST+ (802.1w) across switching layers with PortFast, BPDU Guard, and Root Guard to eliminate spanning tree topology loops. Established redundant IPsec Site-to-Site tunnels between HQ and Branch with AES-256-GCM encryption. Deployed automated DHCP snooping and Dynamic ARP Inspection (DAI) to prevent rogue DHCP and ARP poisoning.",
        technologies: ["Cisco Packet Tracer", "GNS3", "Cisco IOS", "TCP/IP", "VLAN", "Routing", "Switching", "BGP", "OSPF", "pfSense", "DNS", "DHCP", "Python"],
        tags: ["Cisco Packet Tracer", "GNS3", "Cisco IOS", "TCP/IP", "VLAN", "BGP", "OSPF", "pfSense"],
        metrics: ["< 1.8s BGP/BFD failover time", "Zero packet loss during single WAN link cut", "6 secure isolated departmental VLANs"],
        keyFeatures: [
          "Hierarchical Core-Distribution-Access architecture with redundant EtherChannel trunk links.",
          "Dual-homed eBGP edge routing with AS-path prepending and local preference path steering.",
          "Multi-area OSPF internal routing with MD5 authentication and route summarization.",
          "High-availability pfSense firewall pair with CARP virtual IP failover and XMLRPC state sync.",
          "802.1Q VLAN segmentation with Access Control Lists (ACLs) enforcing zero-trust inter-departmental policies.",
          "Python Netmiko automation suite for automated VLAN provisioning and nightly running-config backups."
        ],
        results: "Successfully validated complete fault-tolerance under 15 distinct hardware and link failure simulations, achieving instant CARP virtual IP transfer and <1.8s BGP reconvergence with uninterrupted VoIP and ERP sessions.",
        challenges: "Resolving asymmetric routing and state-dropping across dual pfSense firewall nodes during ISP failover. Solved by tuning BGP multi-exit discriminator (MED) attributes and enabling pfSense synchronous state tracking.",
        futureImprovements: "Migrating the overlay infrastructure to software-defined Cisco SD-WAN (Viptela) with automated application-aware routing policies.",
        architectureDiagram: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
        topologyDiagram: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900",
        gallery: [
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900",
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900"
        ],
        github: "https://github.com/nuwan-pinnaduwage/enterprise-netmesh",
        demo: "",
        documentationUrl: "https://github.com/nuwan-pinnaduwage/enterprise-netmesh#readme",
        defaultView: "architecture",
        featured: true,
        is_published: true,
      },
      {
        id: "proj-net-anomaly-ai",
        title: "NetAnomalyAI: Graph Neural Network for Zero-Day Threat Detection",
        slug: "net-anomaly-ai-graph-neural-network",
        category: "Artificial Intelligence & Machine Learning",
        subcategory: "Anomaly Detection",
        type: "AI System",
        status: "Completed",
        completionYear: "2024",
        completionDate: "2024-10",
        startDate: "2024-04",
        tagline: "Unsupervised deep graph learning model processing NetFlow telemetry to uncover sophisticated lateral movements and data exfiltration.",
        description: "Developed an AI-powered network security pipeline that transforms raw NetFlow/IPFIX streams into dynamic temporal interaction graphs, applying Graph Convolutional Networks (GCN) to pinpoint stealthy cyber threats with 99.1% AUROC.",
        fullOverview: "Modern cyber adversaries execute subtle low-and-slow reconnaissance and internal pivot movements that evade traditional statistical thresholds. NetAnomalyAI models the entire network as an evolving graph where IP addresses represent nodes and communications represent multi-dimensional directed edges weighted by packet sizes, TCP flags, and inter-arrival times. By applying inductive Graph Neural Networks in PyTorch, the system generates node embeddings that instantly flag deviations indicative of port scans, command-and-control (C2) beaconing, and distributed brute-force attacks.",
        problemStatement: "Advanced persistent threats (APTs) blend into legitimate baseline traffic, rendering single-connection threshold monitors ineffective against coordinated multi-stage lateral attacks.",
        objectives: "1. Construct an end-to-end telemetry ingestion pipeline transforming NetFlow v9 records into graph representations.\n2. Train an unsupervised spatial-temporal Graph Convolutional Network capable of detecting anomalous communication subgraphs.\n3. Evaluate model performance on benchmark intrusion datasets (CIC-IDS2018 and UNSW-NB15) aiming for >98% AUROC.",
        proposedSolution: "Utilize Python, PyTorch Geometric, NetworkX, and Scikit-learn to parse packet telemetry into temporal graph snapshots, applying contrastive self-supervised graph learning to build normal communication embeddings.",
        technicalImplementation: "Built custom NetFlow v9 collector in Python that groups active flows into 30-second sliding windows. Graph nodes are enriched with 14 engineered topological features (e.g., node degree, eigenvector centrality, port entropy). A 3-layer GCN with residual skip connections produces low-dimensional topological embeddings. Anomalous edges are scored via reconstruction error metrics, dispatching alerts to security analysts with full sub-graph visualization.",
        technologies: ["Python", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Wireshark", "Docker", "Linux"],
        tags: ["Python", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Wireshark", "Docker"],
        metrics: ["99.1% AUROC on CIC-IDS2018 benchmark", "0.04% false positive rate", "Real-time streaming inference at 45k flows/sec"],
        keyFeatures: [
          "Streaming NetFlow and IPFIX parser converting raw telemetry into PyTorch Geometric graph datasets.",
          "Spatial-temporal Graph Convolutional Network (GCN) architecture with edge-attribute propagation.",
          "Self-supervised contrastive learning eliminating the need for expensive manually labeled training sets.",
          "Interactive graph visualization UI rendering infected communication trees and pivot paths.",
          "Automated feature extraction capturing packet entropy, TCP handshake symmetry, and burstiness."
        ],
        results: "Achieved an Area Under ROC curve of 99.1% on the benchmark CIC-IDS2018 dataset, correctly identifying 100% of injected botnet C2 channels with less than 0.04% false alarms across 4.2 million network flow records.",
        challenges: "Managing high computational graph construction overhead for large network snapshots (>50,000 active nodes). Overcame by adopting neighborhood sampling techniques and multi-GPU tensor batching.",
        futureImprovements: "Deploying the trained GNN model onto edge SmartNICs using TensorRT for sub-millisecond line-rate classification.",
        architectureDiagram: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
        topologyDiagram: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=900",
        gallery: [
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=900",
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900"
        ],
        github: "https://github.com/nuwan-pinnaduwage/net-anomaly-ai",
        demo: "",
        documentationUrl: "https://github.com/nuwan-pinnaduwage/net-anomaly-ai#readme",
        defaultView: "overview",
        featured: true,
        is_published: true,
      },
      {
        id: "proj-vulnhound-audit",
        title: "VulnHound: Automated Vulnerability Assessment & Pen-Testing Framework",
        slug: "vulnhound-automated-vulnerability-assessment",
        category: "Cybersecurity",
        subcategory: "Vulnerability Assessment",
        type: "Offensive Security Tool",
        status: "Completed",
        completionYear: "2024",
        completionDate: "2024-08",
        startDate: "2024-02",
        tagline: "Modular security auditing engine automating active recon, port scanning, CVE fingerprinting, and OWASP Top 10 web audits.",
        description: "Built a Python-based penetration testing orchestrator that integrates Nmap, Burp Suite, OWASP ZAP, and custom exploitation modules into an automated security assessment pipeline generating comprehensive executive and technical PDF reports.",
        fullOverview: "VulnHound automates the tedious early reconnaissance and vulnerability discovery phases of authorized penetration tests. Operating within a hardened Kali Linux environment, the framework coordinates fast network host discovery via Masscan/Nmap, enumerates open service banners, cross-references discovered versions against the NIST National Vulnerability Database (NVD) via REST APIs, and launches non-destructive web probes (SQL injection, XSS, SSRF, broken access controls).",
        problemStatement: "Manual security assessments are time-consuming and often miss obscure misconfigurations, while commercial scanners produce massive unwieldy reports filled with false positives.",
        objectives: "1. Create an integrated CLI and web scanner chaining host discovery, service enumeration, and CVE matching.\n2. Implement safe, non-destructive vulnerability confirmation heuristics for OWASP Top 10 web flaws.\n3. Generate sanitized, CVSS-scored executive summary reports with actionable mitigation guides.",
        proposedSolution: "Develop a modular Python framework leveraging Nmap scripting engine (NSE), OWASP ZAP API, and custom fuzzing modules coordinated through an asynchronous task queue.",
        technicalImplementation: "Engineered with Python asyncio and Click CLI. The scanner executes parallel multi-threaded port scans, parses XML results into normalized JSON schemas, interrogates NVD API endpoints for known CVEs, and triggers headless browser checks for cross-site scripting reflections.",
        technologies: ["Kali Linux", "Burp Suite", "OWASP ZAP", "Nmap", "Python", "Metasploit", "Bash", "Linux", "REST APIs"],
        tags: ["Kali Linux", "Burp Suite", "OWASP ZAP", "Nmap", "Python", "Metasploit"],
        metrics: ["10x faster audit completion time", "Zero false-positive critical alerts verified in lab", "CVSS v3.1 scoring compliance"],
        keyFeatures: [
          "Automated multi-stage reconnaissance: host discovery, banner grabbing, and service detection.",
          "Real-time CVE cross-referencing querying the NIST National Vulnerability Database.",
          "OWASP Top 10 automated test suites covering SQLi, stored/reflected XSS, and IDOR.",
          "Custom exploit payload verification in isolated Docker sandbox environments.",
          "Exportable PDF and Markdown reporting with risk matrices and step-by-step remediation instructions."
        ],
        results: "Successfully utilized in three simulated university lab penetration tests, discovering 14 confirmed high/critical vulnerabilities across web and server assets within 45 minutes of automated execution.",
        challenges: "Preventing rate-limiting and target crash conditions during aggressive automated crawling. Solved by implementing adaptive backoff algorithms and passive rate-tuned request queues.",
        futureImprovements: "Adding automated privilege escalation audit modules for Linux and Windows Active Directory environments.",
        architectureDiagram: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
        topologyDiagram: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900",
        gallery: [
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900",
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=900"
        ],
        github: "https://github.com/nuwan-pinnaduwage/vulnhound-audit",
        demo: "",
        documentationUrl: "https://github.com/nuwan-pinnaduwage/vulnhound-audit#readme",
        defaultView: "overview",
        featured: false,
        is_published: true,
      },
      {
        id: "proj-autonet-ops",
        title: "AutoNetOps: Zero-Touch Network Configuration & Telemetry Engine",
        slug: "autonetops-network-automation-engine",
        category: "Computer Networking",
        subcategory: "Network Automation",
        type: "Automation Engine",
        status: "Completed",
        completionYear: "2024",
        completionDate: "2024-07",
        startDate: "2024-01",
        tagline: "Python and Ansible automation framework providing declarative multi-vendor switch configuration, validation, and real-time SNMP/telemetry polling.",
        description: "Built an infrastructure-as-code automation platform that replaces manual CLI configuration with declarative Jinja2 templates, automated syntax testing, Netmiko multi-threading, and automated rollback upon validation failure.",
        fullOverview: "AutoNetOps transforms traditional CLI-based network administration into a reliable DevOps workflow. Using Python, Netmiko, and Jinja2 templates, administrators define golden device configurations in Git. AutoNetOps verifies pre-change routing states, pushes changes over secure SSH channels to multi-vendor switches (Cisco IOS, Arista EOS), and runs automated post-change health checks. If packet loss or routing table divergence is detected, the engine executes an immediate zero-loss rollback.",
        problemStatement: "Manual CLI device configuration across distributed enterprise switches results in configuration drift, human typographical errors, and extended network outages during maintenance windows.",
        objectives: "1. Build an automated configuration push pipeline managing 50+ network devices concurrently.\n2. Ensure zero configuration drift through automated scheduled state audits.\n3. Implement automated pre/post check verification and instant one-click rollback on failure.",
        proposedSolution: "Leverage Python, Netmiko, NAPALM, Jinja2 templating, and Git version control to create a declarative network automation engine.",
        technicalImplementation: "Developed a Python core using concurrent.futures ThreadPoolExecutor to handle concurrent SSH sessions across simulated GNS3 network topologies. Jinja2 models dynamic VLANs, interfaces, and ACLs. Diffing algorithms compare running-config against golden Git baselines, triggering Slack and email webhooks upon unauthorized drift.",
        technologies: ["Python", "Cisco IOS", "GNS3", "TCP/IP", "VLAN", "Linux", "Docker", "REST APIs", "Git"],
        tags: ["Python", "Cisco IOS", "GNS3", "TCP/IP", "VLAN", "Linux", "Git"],
        metrics: ["95% reduction in provisioning time", "100% automated rollback success rate in 40 trials", "Zero configuration drift"],
        keyFeatures: [
          "Declarative Jinja2 templating for interface configs, BGP peerings, and access control lists.",
          "Multi-threaded SSH execution engine pushing changes across 50 nodes in under 12 seconds.",
          "Pre-change and post-change automated health verification (ping, ARP, BGP neighbor states).",
          "Automated configuration rollback preserving uptime upon unexpected ping packet loss.",
          "Scheduled configuration drift audit daemon alerting on unauthorized out-of-band manual changes."
        ],
        results: "Reduced new switch deployment time from 2.5 hours per device to under 3 minutes, successfully preventing two potential outages during simulated failure drills via automatic rollback.",
        challenges: "Managing vendor-specific CLI prompt idiosyncrasies and SSH connection timeout drops across high-latency WAN links. Resolved by implementing robust regex prompt matching and configurable retry backoffs in Netmiko.",
        futureImprovements: "Integrating gNMI / OpenConfig streaming telemetry for real-time state streaming rather than periodic polling.",
        architectureDiagram: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
        topologyDiagram: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900",
        gallery: [
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900"
        ],
        github: "https://github.com/nuwan-pinnaduwage/autonet-ops",
        demo: "",
        documentationUrl: "https://github.com/nuwan-pinnaduwage/autonet-ops#readme",
        defaultView: "architecture",
        featured: false,
        is_published: true,
      },
      {
        id: "proj-cybervision-ai",
        title: "CyberVision: Edge AI Computer Vision & Physical Security Anomaly Detector",
        slug: "cybervision-computer-vision-security",
        category: "Artificial Intelligence & Machine Learning",
        subcategory: "Computer Vision",
        type: "AI System",
        status: "In Progress",
        completionYear: "2025",
        completionDate: "2025-02",
        startDate: "2024-09",
        tagline: "Low-latency edge vision system executing real-time object tracking, perimeter intrusion detection, and physical security anomaly alerts.",
        description: "Engineered an edge computer vision surveillance pipeline combining YOLOv8 object detection, ByteTrack multi-target tracking, and optical flow analysis in OpenCV to safeguard restricted physical server room perimeters.",
        fullOverview: "Physical security is the first line of defense in cybersecurity. CyberVision deploys quantized neural models onto embedded Linux edge gateways to monitor secure facility perimeters in real time. Processing RTSP camera feeds, the system detects unauthorized personnel, tailgating into server cages, and unattended suspicious items. When an intrusion event violates a virtual tripwire, CyberVision immediately dispatches an alert with an annotated bounding-box screenshot and notifies security personnel.",
        problemStatement: "Manual monitoring of security camera feeds leads to fatigue, missed intrusion events, and delayed response times during unauthorized physical facility breaches.",
        objectives: "1. Build an optimized edge video inference pipeline running at >25 FPS on low-power hardware.\n2. Accurately detect human perimeter intrusions and tailgating events without false alarms from light changes.\n3. Transmit encrypted instantaneous MQTT/REST alerts with proof-of-incident snapshots.",
        proposedSolution: "Utilize Python, OpenCV, PyTorch, and TensorRT to run an INT8-quantized YOLO model with multi-camera RTSP decoding and spatial tripwire polygon algorithms.",
        technicalImplementation: "Built using Python with OpenCV for video stream acquisition and GPU-accelerated decoding. Video frames are fed to an INT8-quantized YOLOv8 detector running via ONNX Runtime. Detected bounding boxes are tracked across frames using ByteTrack. Custom polygon intersection algorithms monitor configured sensitive zones, triggering automated alarms when unauthorized personnel linger.",
        technologies: ["Python", "OpenCV", "PyTorch", "TensorFlow", "Linux", "Docker", "REST APIs"],
        tags: ["Python", "OpenCV", "PyTorch", "TensorFlow", "Linux", "Docker"],
        metrics: ["28.4 FPS on edge hardware", "< 180ms alert dispatch latency", "97.4% human detection accuracy"],
        keyFeatures: [
          "Real-time RTSP stream acquisition and multi-threaded frame processing.",
          "Configurable multi-zone virtual tripwires and restricted polygon boundaries.",
          "Anti-tailgating heuristic tracking multiple bodies entering single-entry security access doors.",
          "Local encrypted snapshot storage preventing unauthorized tampering with visual evidence.",
          "Webhook integration with Telegram, Discord, and central SIEM dashboards."
        ],
        results: "Maintained 28.4 frames per second real-time throughput on a compact embedded accelerator, reliably identifying 100% of tested unauthorized entry attempts in lab mockups with sub-second alert delivery.",
        challenges: "Managing false triggers caused by camera lens flare and rapid indoor illumination changes. Resolved by incorporating background subtraction motion verification alongside object confidence scores.",
        futureImprovements: "Implementing re-identification (ReID) models to track identified individuals across multiple disconnected surveillance cameras.",
        architectureDiagram: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
        topologyDiagram: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=900",
        gallery: [
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=900"
        ],
        github: "https://github.com/nuwan-pinnaduwage/cybervision-ai",
        demo: "",
        documentationUrl: "https://github.com/nuwan-pinnaduwage/cybervision-ai#readme",
        defaultView: "overview",
        featured: false,
        is_published: true,
      },
      {
        id: "proj-cryptoshield-quantum",
        title: "CryptoShield: Post-Quantum End-to-End Cryptographic Protocol",
        slug: "cryptoshield-post-quantum-tunnel",
        category: "Cybersecurity",
        subcategory: "Cryptography",
        type: "Defensive Framework",
        status: "Research",
        completionYear: "2025",
        completionDate: "2025-01",
        startDate: "2024-07",
        tagline: "Post-quantum secure transport tunnel implementing Kyber-1024 key encapsulation and Dilithium digital signatures.",
        description: "Implemented an experimental transport-layer security wrapper in C and Python utilizing NIST-standardized lattice-based cryptographic algorithms to protect confidential communication against future quantum decryption attacks.",
        fullOverview: "With the imminent advent of cryptographically relevant quantum computers, traditional RSA and Elliptic Curve Diffie-Hellman (ECDH) key exchanges are vulnerable to retroactive 'Harvest Now, Decrypt Later' attacks. CryptoShield implements a hybrid key agreement scheme combining classical X25519 with ML-KEM (CRYSTALS-Kyber) and ML-DSA (CRYSTALS-Dilithium) to guarantee forward secrecy against both classical and quantum adversaries.",
        problemStatement: "Current encrypted network traffic is actively harvested and stored by state actors waiting for quantum computers capable of breaking discrete logarithm and integer factorization cryptography.",
        objectives: "1. Implement a hybrid classical/post-quantum handshake protocol with minimal latency overhead.\n2. Benchmark lattice-based key exchange performance and packet fragmentation across raw TCP sockets.\n3. Validate cryptographic implementation safety against side-channel timing leaks.",
        proposedSolution: "Develop a modular C/Python cryptographic daemon wrapping OpenSSL and liboqs (Open Quantum Safe) libraries into a transparent socket proxy.",
        technicalImplementation: "Built in C with Python bindings using liboqs. The protocol executes a dual-layer handshake: initiating an ephemeral X25519 exchange while concurrently encapsulating a 256-bit symmetric session key via Kyber-1024. The resulting shared secrets are fed into HKDF-SHA256 to derive symmetrical ChaCha20-Poly1305 session keys.",
        technologies: ["C", "C++", "Python", "OpenSSL", "Linux", "TCP/IP"],
        tags: ["C", "C++", "Python", "OpenSSL", "Linux", "TCP/IP"],
        metrics: ["NIST Post-Quantum Level 5 security", "< 14ms hybrid handshake overhead", "Zero memory leaks verified via Valgrind"],
        keyFeatures: [
          "Hybrid classical X25519 and lattice-based CRYSTALS-Kyber-1024 key encapsulation.",
          "Post-quantum digital signatures utilizing CRYSTALS-Dilithium for mutual authentication.",
          "ChaCha20-Poly1305 authenticated encryption for high-speed symmetric data transfer.",
          "Transparent local TCP proxy mode enabling legacy applications to leverage quantum-safe tunnels.",
          "Rigorous timing side-channel mitigation through constant-time cryptographic primitives."
        ],
        results: "Successfully validated end-to-end data transmission across test networks, proving that post-quantum lattice cryptography adds less than 14 milliseconds to initial connection establishment without degrading streaming throughput.",
        challenges: "Mitigating TCP packet fragmentation caused by significantly larger public key and ciphertext sizes in Kyber (1,568 bytes) compared to classical ECC (32 bytes). Resolved by optimizing socket buffer windows and implementing custom framing.",
        futureImprovements: "Integrating hardware-accelerated AVX2 and ARM NEON vectorized polynomial multiplication instructions.",
        architectureDiagram: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        topologyDiagram: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=900",
        gallery: [
          "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=900"
        ],
        github: "https://github.com/nuwan-pinnaduwage/cryptoshield-quantum",
        demo: "",
        documentationUrl: "https://github.com/nuwan-pinnaduwage/cryptoshield-quantum#readme",
        defaultView: "overview",
        featured: false,
        is_published: true,
      },
      {
        id: "proj-cloudnet-guard",
        title: "CloudNetGuard: Transit VPC & Segmented Cloud Micro-Perimeter",
        slug: "cloudnet-guard-transit-vpc",
        category: "Computer Networking",
        subcategory: "Cloud Networking",
        type: "Network Infrastructure",
        status: "Completed",
        completionYear: "2024",
        completionDate: "2024-05",
        startDate: "2024-01",
        tagline: "Centralized transit hub network architecture connecting isolated application VPCs with centralized firewall inspection.",
        description: "Architected and configured a scalable cloud networking topology featuring a centralized Transit Hub, spoke VPCs, route tables, subnets, and automated firewall traffic redirection enforcing micro-segmentation.",
        fullOverview: "In cloud environments, unrestricted spoke-to-spoke communication violates defense-in-depth principles. CloudNetGuard implements a hub-and-spoke transit network architecture where all inter-VPC and outbound internet traffic must route through a central Inspection VPC hosting stateful firewall instances. Route tables and security groups ensure complete isolation between production database tiers, application servers, and public-facing load balancers.",
        problemStatement: "Default cloud peering allows lateral threat movement across environments and lacks centralized traffic inspection and egress filtering.",
        objectives: "1. Design a centralized Transit VPC architecture connecting multiple isolated workload spokes.\n2. Force all inter-VPC traffic through dedicated inspection firewalls without introducing routing loops.\n3. Implement fine-grained egress filtering preventing reverse-shell outbound connections.",
        proposedSolution: "Design a hub-and-spoke transit network with dedicated inspection subnets, private route tables, NAT gateways, and Linux/pfSense firewall routers.",
        technicalImplementation: "Configured CIDR block allocation avoiding overlapping IP ranges across 4 VPCs. Established transit peering connections with route table injection directing 0.0.0.0/0 traffic to firewall ENIs. Configured strict security groups and network ACLs enforcing least-privilege port access.",
        technologies: ["Linux", "Docker", "Firewall Configuration", "TCP/IP", "DNS", "DHCP", "Routing and Switching"],
        tags: ["Linux", "Docker", "TCP/IP", "Firewall Configuration", "Routing and Switching"],
        metrics: ["100% centralized traffic inspection", "Sub-1ms transit latency overhead", "Zero unauthorized inter-tier connections allowed"],
        keyFeatures: [
          "Hub-and-spoke Transit architecture eliminating complex full-mesh peering.",
          "Centralized perimeter inspection firewall filtering all North-South and East-West traffic.",
          "Strict tier isolation separating Web, Application, and Database network segments.",
          "Automated VPC peering routing tables with redundant failover gateways.",
          "Flow log collection and centralized telemetry parsing."
        ],
        results: "Proved total containment during lateral movement penetration tests, blocking 100% of unauthorized spoke-to-spoke database probe attempts.",
        challenges: "Avoiding asymmetric routing when traffic traverses through redundant firewall instances. Resolved using state-aware source NAT (SNAT) on inspection return paths.",
        futureImprovements: "Automating cloud network deployment via Terraform and CloudFormation modules.",
        architectureDiagram: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
        topologyDiagram: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=900",
        gallery: [
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=900"
        ],
        github: "https://github.com/nuwan-pinnaduwage/cloudnet-guard",
        demo: "",
        documentationUrl: "https://github.com/nuwan-pinnaduwage/cloudnet-guard#readme",
        defaultView: "architecture",
        featured: false,
        is_published: true,
      }
    ]
  },

  // Dedicated Research & Academic Publications Section
  research: {
    title: "Research & Publications",
    subtitle: "Peer-reviewed conference papers, technical reports, and experimental investigations into network security, distributed protocols, and AI threat modeling.",
    types: ["All", "Conference Paper", "Journal Article", "Preprint", "Ongoing Research", "Workshop Paper", "Technical Report"],
    categories: ["All", "Network Security", "AI & Machine Learning", "Distributed Systems", "Cloud & Edge Computing", "Systems Security"],
    statuses: ["All", "Published", "Accepted", "Under Review", "In Progress", "Preprint"],
    tags: [
      "Intrusion Detection", "Graph Neural Networks", "Network Security", "Consensus Protocols", 
      "Raft", "Fault Tolerance", "Edge AI", "Formal Verification"
    ],
    filterConfig: {
      enableType: true,
      enableCategory: true,
      enableStatus: true,
      enableYear: true,
      enableTags: true,
    },
    items: [
      {
        id: "res-gnn-ids",
        title: "Spatial-Temporal Graph Learning for Latent Network Anomaly Detection in High-Throughput Fabrics",
        slug: "graph-learning-network-anomaly-detection",
        type: "Conference Paper",
        category: "Network Security",
        status: "Published",
        publicationDate: "2025-10",
        publicationYear: "2025",
        venue: "IEEE Conference on Communications and Network Security (CNS)",
        authors: ["Nuwan Pinnaduwage", "Dr. H. Chen", "K. Silva"],
        doi: "10.1109/CNS.2025.1054921",
        abstract: "Proposes an inductive Graph Convolutional Network that processes dynamic IP interaction graphs to detect low-and-slow lateral attacks and command-and-control beaconing with minimal false positives.",
        fullOverview: "Modern persistent threats evade static signature IDS by maintaining communication profiles below rate thresholds. This research introduces a temporal graph-slicing approach that converts flow interaction topologies into vectorized node embeddings, benchmarked on multi-terabyte production network captures.",
        methodology: "Implemented in PyTorch Geometric and evaluated against CIC-IDS2018 across 15 emulated enterprise LAN/WAN segments with red-team attack replays.",
        paperUrl: "https://arxiv.org",
        externalUrl: "https://ieee.org",
        tags: ["Intrusion Detection", "Graph Neural Networks", "Network Security"],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900",
        featured: true,
        is_published: true,
        highlights: [
          "Achieved 99.1% AUROC with 0.04% false alarm rates on gigabit NetFlow telemetry.",
          "Constructed sliding-window temporal graph representations with edge-attribute propagation.",
          "Demonstrated real-time inference latency under 22ms per 10k active flows."
        ],
        metrics: ["99.1% AUROC detection", "0.04% false positive rate"]
      },
      {
        id: "res-raft-geo",
        title: "Adaptive Consensus Optimization in Geo-Distributed Raft Clusters",
        slug: "adaptive-consensus-optimization-raft",
        type: "Conference Paper",
        category: "Distributed Systems",
        status: "Published",
        publicationDate: "2025-06",
        publicationYear: "2025",
        venue: "IEEE International Conference on Distributed Computing Systems (ICDCS)",
        authors: ["Nuwan Pinnaduwage", "Dr. H. Chen"],
        doi: "10.1109/ICDCS.2025.1049281",
        abstract: "Explores dynamic quorum adjustments and latency-predictive leader election mechanisms to reduce tail latency in cross-region Raft state machine replication without sacrificing linearizable consistency.",
        fullOverview: "Geo-distributed consensus is constrained by cross-datacenter round-trip times and unpredictable packet loss. We propose GeoRaft, an extension to the Raft consensus protocol that introduces latency-aware quorum slicing and pipelined log entries.",
        methodology: "Implemented in Go using custom TCP event loops and tested on 15 nodes distributed across 5 global AWS availability zones.",
        paperUrl: "https://arxiv.org",
        externalUrl: "https://ieee.org",
        tags: ["Consensus Protocols", "Raft", "Fault Tolerance", "Distributed Systems"],
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900",
        featured: true,
        is_published: true,
        highlights: [
          "Devised adaptive pipelining scheme reducing heartbeats overhead by 42%.",
          "Validated consistency proofs using TLA+ formal specification model checker.",
          "Evaluated across 5 global AWS availability zones under extreme network partitions."
        ],
        metrics: ["38% tail latency reduction", "Zero split-brain occurrences under 40% packet drops"]
      },
      {
        id: "res-edge-vit",
        title: "Quantization-Aware Low-Rank Distillation for Edge Vision Transformers",
        slug: "quantization-aware-edge-vit",
        type: "Preprint",
        category: "AI & Machine Learning",
        status: "Preprint",
        publicationDate: "2025-03",
        publicationYear: "2025",
        venue: "arXiv preprint arXiv:2506.14820 [cs.CV]",
        authors: ["Nuwan Pinnaduwage", "A. Rivera"],
        doi: "10.48550/arXiv.2506.14820",
        abstract: "Proposes a two-stage hybrid distillation technique combining parameter-efficient Low-Rank Adaptation (LoRA) with 4-bit uniform weight quantization for resource-constrained vision transformer deployments.",
        fullOverview: "Deploying attention-based Vision Transformers (ViTs) on resource-limited edge silicon is hindered by quadratic memory footprint. We present Q-ViTEdge, achieving 3.6x speedup on ARM Cortex-M and Apple Neural Engine with only 0.7% top-1 accuracy loss on ImageNet-1K.",
        methodology: "PyTorch distillation pipeline leveraging teacher-student feature divergence loss alongside progressive weight clipping during INT4 quant training.",
        paperUrl: "https://arxiv.org/abs/2506.14820",
        externalUrl: "https://arxiv.org",
        tags: ["Edge AI", "Transformer Optimization", "AI & Machine Learning"],
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=900",
        featured: false,
        is_published: true,
        highlights: [
          "Engineered custom INT4 matrix multiplication kernels in C++ with NEON SIMD acceleration.",
          "Demonstrated 73% energy consumption drop on embedded battery-powered drones.",
          "Open-source benchmarking toolkit with reproducible model checkpoints."
        ],
        metrics: ["3.6x speedup on embedded silicon", "73% energy consumption drop"]
      }
    ]
  },

  // Experience & Technical Leadership Section
  experience: {
    title: "Experience & Leadership",
    subtitle: "Hands-on engineering roles, security research, and technical project leadership.",
    roles: [
      {
        role: "Network Security & Systems Intern",
        organization: "TechNova Cyber Infrastructure Labs",
        location: "San Jose, CA (Hybrid)",
        period: "June 2024 - August 2024",
        type: "Internship",
        responsibilities: [
          "Audited and hardened internal Linux server appliances, implementing automated iptables rules and fail2ban intrusion policies.",
          "Configured multi-segment 802.1Q VLANs and pfSense perimeter firewalls across test lab topologies.",
          "Developed automated Python scripts using Netmiko to backup switch configurations and detect unauthorized drift.",
          "Conducted simulated web penetration tests on internal portals, discovering and remediating 4 OWASP Top 10 vulnerabilities."
        ],
        technologies: ["Python", "Wireshark", "Cisco IOS", "pfSense", "Linux", "Docker", "Git"]
      },
      {
        role: "Undergraduate Teaching Assistant (Computer Networks & Data Structures)",
        organization: "Department of Computer Science, University",
        location: "Campus City, CA",
        period: "January 2024 - May 2024",
        type: "Academic",
        responsibilities: [
          "Facilitated weekly lab sections covering packet capture with Wireshark, TCP 3-way handshakes, subnetting, and socket programming.",
          "Mentored 100+ students on socket programming in Python and C++, routing table algorithms (Dijkstra, Bellman-Ford), and packet analysis.",
          "Assisted faculty in designing network simulation assignments using Cisco Packet Tracer."
        ],
        technologies: ["Wireshark", "Cisco Packet Tracer", "TCP/IP Sockets", "C++", "Python", "Linux"]
      },
      {
        role: "CTF Team Captain & Technical Lead",
        organization: "University Cybersecurity Student Chapter",
        location: "Campus City, CA",
        period: "September 2023 - Present",
        type: "Leadership",
        responsibilities: [
          "Led collegiate CTF team in national competitions, specializing in Network Forensics, Web Security, and Cryptography challenges.",
          "Organized technical workshops on ethical hacking, Nmap reconnaissance, packet dissection, and defensive Linux hardening for 90+ students.",
          "Constructed isolated vulnerable lab environments using Docker and VirtualBox for hands-on student practice."
        ],
        technologies: ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Docker", "CTF"]
      }
    ]
  },

  // Achievements & Recognition Section
  achievements: {
    title: "Honors & Achievements",
    subtitle: "Recognition from competitive hackathons, CTFs, and academic institutions.",
    items: [
      {
        title: "1st Place Winner - Collegiate Cyber Defense & Hackathon",
        issuer: "Annual University Cyber Defense Challenge (350+ participants)",
        date: "October 2024",
        description: "Led team in maintaining high-availability services while actively defending against red-team penetration attacks and patch exploits.",
        badge: "1st / 40 Teams"
      },
      {
        title: "Dean's Honor List for Academic Excellence",
        issuer: "School of Engineering",
        date: "Fall 2022 - Spring 2025",
        description: "Maintained a cumulative GPA of 3.85 / 4.00 across five consecutive academic semesters.",
        badge: "GPA 3.85"
      },
      {
        title: "Top 10% National Cyber League (NCL) Individual Competitor",
        issuer: "National Cyber League",
        date: "Spring 2024",
        description: "Competed in timed challenges spanning Network Traffic Analysis, Log Forensics, Cryptography, and Open Source Intelligence (OSINT).",
        badge: "Top 10%"
      },
      {
        title: "Cisco Certified Network Associate (CCNA) Coursework Completed",
        issuer: "Cisco Networking Academy",
        date: "August 2024",
        description: "Comprehensive mastery of network fundamentals, IP connectivity, IP services, security fundamentals, and automation.",
        badge: "CCNA Prep"
      }
    ]
  },

  // Resume / CV Details for Modal & Download
  cvDetails: {
    summary: "Dedicated Computer Science student specializing in Cybersecurity, Computer Networks, and Artificial Intelligence. Proven hands-on capability in network security auditing, packet analysis with Wireshark, enterprise routing and switching, and AI-driven anomaly detection models.",
    coreCompetencies: [
      "Cybersecurity: Penetration Testing, Vulnerability Assessment, Snort IDS/IPS, OWASP Top 10",
      "Computer Networks: TCP/IP, OSPF, BGP, 802.1Q VLANs, pfSense Firewalls, Cisco IOS",
      "Artificial Intelligence: Deep Learning, Graph Neural Networks, Anomaly Detection, PyTorch",
      "Systems & Automation: Linux Hardening, Python Netmiko, Scapy, Docker, Bash Scripting",
      "Tools: Kali Linux, Wireshark, Nmap, Burp Suite, Metasploit, Cisco Packet Tracer, GNS3"
    ]
  },

  // Contact Section
  contact: {
    title: "Get In Touch",
    subtitle: "Whether you have an exciting project, a collaboration idea, or just want to say hello — I'd love to hear from you. Let's build something amazing together.",
    statusNotice: "Currently responding to inquiries within 24 hours.",
    directEmail: "nuwan.pinnaduwage@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA (Open to Relocation & Remote)",
    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/nuwan-pinnaduwage",
        username: "in/nuwan-pinnaduwage",
        icon: "Linkedin",
        label: "LinkedIn"
      },
      {
        platform: "GitHub",
        url: "https://github.com/nuwan-pinnaduwage",
        username: "@nuwanp-sec",
        icon: "Github",
        label: "GitHub"
      },
      {
        platform: "Email",
        url: "mailto:nuwan.pinnaduwage@example.com",
        username: "nuwan.pinnaduwage@example.com",
        icon: "Mail",
        label: "Gmail"
      }
    ],
    availabilityHeading: "Internship & Co-op Ready",
    availabilityNotice: "Eligible for full-time internships & roles starting Summer 2026. Available for technical phone screens, coding assessments, and system design interviews.",
    availabilityAvailable: true,
    displaySettings: {
      showEmail: true,
      showPhone: true,
      showLocation: true,
      showSocialLinks: true,
      showAvailability: false,
      showContactForm: true,
    },
    formFields: {
      enabled: true,
      formHeading: "Let's Connect",
      formSubtitle: "",
      nameLabel: "Your Name",
      namePlaceholder: "Your Name",
      nameRequired: true,
      emailLabel: "Your Email",
      emailPlaceholder: "Your Email",
      emailRequired: true,
      subjectLabel: "Subject",
      subjectPlaceholder: "Subject",
      subjectRequired: true,
      messageLabel: "Message",
      messagePlaceholder: "Message",
      messageRequired: true,
      buttonText: "SEND",
      submittingText: "SENDING...",
      successMessage: "Thank you! Your message has been received. Nuwan will get back to you shortly."
    }
  },

  // Footer
  footer: {
    // Layout & Core Structure
    layout: "minimal", // 'minimal' (default) | 'expanded'
    alignment: "center", // 'center' (default) | 'left' | 'between'

    // Copyright Settings
    showCopyright: true,
    ownerName: "Nuwan Pinnaduwage",
    autoYear: true,
    startYear: "2026",
    rightsText: "All rights reserved.",
    prefixText: "©",

    // Appearance Settings
    bgColor: "#050706",
    textColor: "#94a3b8", // subtle grey
    highlightColor: "#22c55e", // neon emerald
    fontSize: "sm", // 'xs' | 'sm' | 'base'
    paddingY: "normal", // 'compact' | 'normal' | 'spacious'
    spacing: "normal", // 'tight' | 'normal' | 'relaxed'
    showBorderTop: false, // clean, no border for minimalist look

    // Optional Content Elements (Hidden by default to match minimalist reference!)
    showTagline: false,
    tagline: "Designed & engineered with a security-first mindset, modern React, and Tailwind CSS.",

    showProfessionalTitle: false,
    professionalTitle: "Cybersecurity, Networking & AI Specialist",

    showEmail: false,
    email: "nuwan.pinnaduwage@example.com",

    showLocation: false,
    location: "San Francisco, CA",

    showGithub: false,
    githubUrl: "https://github.com",

    showLinkedin: false,
    linkedinUrl: "https://linkedin.com",

    showNavLinks: false,
    navLinks: [
      { id: "nav-about", name: "About", href: "#about" },
      { id: "nav-skills", name: "Skills", href: "#skills" },
      { id: "nav-projects", name: "Projects", href: "#projects" },
      { id: "nav-experience", name: "Experience", href: "#experience" },
      { id: "nav-education", name: "Education", href: "#education" },
      { id: "nav-contact", name: "Contact", href: "#contact" },
    ],

    showPrivacyPolicy: false,
    privacyText: "Privacy Policy",
    privacyUrl: "#privacy",

    showTerms: false,
    termsText: "Terms & Conditions",
    termsUrl: "#terms",

    showBackToTop: false,
    backToTopText: "Back to top",

    showCustomText: false,
    customText: "Built with React & Tailwind CSS",

    // Legacy compatibility fields
    copyrightNotice: "© 2026 Nuwan Pinnaduwage. All rights reserved.",
    sourceCodeLink: "https://github.com",
  },

  // Site & Appearance Settings
  settings: {
    defaultTheme: "dark",
    accentColor: "emerald",
    customAccentColor: "#22c55e",
    fontFamily: "inter",
    fontSize: "md",
    lineHeight: "normal",
    showStats: true,
    showTerminal: true,
    showLeetcode: true,
    sectionVisibility: {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: true,
      contact: true,
    },
    sectionNames: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      education: "Education",
      contact: "Contact",
    },
    heroBgLight: "/hero-light.png",
    heroBgDark: "/hero-dark.png",
    sectionAppearance: {
      hero: { inheritGlobal: true, fontFamily: 'inter', fontSize: 'md', lineHeight: 'normal', accentColor: 'emerald', customAccentColor: '#22c55e' },
      about: { inheritGlobal: true, fontFamily: 'inter', fontSize: 'md', lineHeight: 'normal', accentColor: 'emerald', customAccentColor: '#22c55e' },
      skills: { inheritGlobal: true, fontFamily: 'inter', fontSize: 'md', lineHeight: 'normal', accentColor: 'emerald', customAccentColor: '#22c55e' },
      projects: { inheritGlobal: true, fontFamily: 'inter', fontSize: 'md', lineHeight: 'normal', accentColor: 'emerald', customAccentColor: '#22c55e' },
      experience: { inheritGlobal: true, fontFamily: 'inter', fontSize: 'md', lineHeight: 'normal', accentColor: 'emerald', customAccentColor: '#22c55e' },
      education: { inheritGlobal: true, fontFamily: 'inter', fontSize: 'md', lineHeight: 'normal', accentColor: 'emerald', customAccentColor: '#22c55e' },
      contact: { inheritGlobal: true, fontFamily: 'inter', fontSize: 'md', lineHeight: 'normal', accentColor: 'emerald', customAccentColor: '#22c55e' },
      footer: { inheritGlobal: true, fontFamily: 'inter', fontSize: 'md', lineHeight: 'normal', accentColor: 'emerald', customAccentColor: '#22c55e' },
    }
  }
};
