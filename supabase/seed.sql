-- =========================================================================
-- SUPABASE INITIAL DATA SEED SCRIPT
-- Populates your Supabase database with Nuwan Pinnaduwage's portfolio data
-- =========================================================================

-- 1. Clear existing content data (safely preserving admin_users)
TRUNCATE TABLE 
  public.profiles, 
  public.projects, 
  public.skills, 
  public.education, 
  public.experience, 
  public.achievements, 
  public.certificates,
  public.research,
  public.site_settings 
RESTART IDENTITY CASCADE;

-- 2. Insert Profile
INSERT INTO public.profiles (
  id, name, preferred_name, role, degree, specialization, university, expected_graduation,
  status_available, status_text, location, email, phone, bio_short, bio_paragraphs,
  who_i_am_heading, professional_summary, avatar_url, cv_url, cv_filename,
  quick_stats, social_links, hero_backgrounds, terminal_facts, about_highlights
)
SELECT
  'c5e752f5-faa9-401f-8755-dd868e50a25e'::uuid,
  'Nuwan Pinnaduwage',
  'Nuwan',
  'Cybersecurity, Networking & AI Specialist | Computer Science Undergraduate',
  'Bachelor of Science in Computer Science',
  'Cybersecurity, Computer Networking & Artificial Intelligence',
  'State University of Technology',
  'May 2026',
  true,
  'AVAILABLE FOR OPPORTUNITIES.',
  'San Francisco, CA (Open to Remote & Relocation)',
  'nuwan.pinnaduwage@example.com',
  '+1 (555) 019-2834',
  'Computer Science undergraduate specializing in offensive & defensive cybersecurity, network infrastructure engineering, and artificial intelligence. Dedicated to building hardened networks, vulnerability research, and intelligent security automation.',
  '["I am a Computer Science undergraduate focused on the intersection of Cybersecurity, Computer Networking, and Artificial Intelligence. My journey began with low-level systems programming and network protocol analysis, evolving into penetration testing, network automation, and deep learning for threat detection.","I have hands-on experience designing secure multi-segment network topologies, configuring firewalls and routing protocols, performing vulnerability assessments, and engineering AI pipelines for behavioral anomaly detection. I approach technology with a security-first mindset: understanding how systems break to engineer robust defenses.","Beyond lab simulations and coursework, I actively engage in CTF competitions, explore packet-level protocol internals, and automate security telemetry. I aim to bridge network infrastructure reliability with modern machine learning intelligence."]'::jsonb,
  'Who I Am',
  'Dedicated Computer Science undergraduate focused on the intersection of Cybersecurity, Computer Networks, and Artificial Intelligence.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  '',
  'Nuwan_Pinnaduwage_Technical_Resume.pdf',
  '[{"label":"Technical Focus","value":"Cyber, Net & AI"},{"label":"Degree Focus","value":"B.S. in CS"},{"label":"Technical Projects","value":"14+"},{"label":"Security Labs","value":"25+"}]'::jsonb,
  '[{"platform":"GitHub","url":"https://github.com/nuwan-pinnaduwage","username":"@nuwanp-sec","icon":"Github"},{"platform":"LinkedIn","url":"https://linkedin.com/in/nuwan-pinnaduwage","username":"in/nuwan-pinnaduwage","icon":"Linkedin"},{"platform":"TryHackMe","url":"https://tryhackme.com","username":"nuwan_cyber","icon":"Terminal"},{"platform":"Email","url":"mailto:nuwan.pinnaduwage@example.com","username":"nuwan.pinnaduwage@example.com","icon":"Mail"}]'::jsonb,
  '{"light":"/hero-light.png","dark":"/hero-dark.png"}'::jsonb,
  '[{"key":"degree","value":"\"B.S. Computer Science\""},{"key":"standing","value":"\"Senior (4th Year)\""},{"key":"focusAreas","value":"[\"Cybersecurity\", \"Computer Networks\", \"Artificial Intelligence\"]"},{"key":"securityTools","value":"[\"Kali Linux\", \"Wireshark\", \"Nmap\", \"Snort\", \"Burp Suite\", \"Metasploit\"]"},{"key":"networkingStack","value":"[\"Cisco IOS\", \"Packet Tracer\", \"GNS3\", \"TCP/IP\", \"pfSense\", \"BGP/OSPF\"]"},{"key":"aiFrameworks","value":"[\"PyTorch\", \"TensorFlow\", \"Scikit-learn\", \"OpenCV\", \"Pandas\"]"},{"key":"availability","value":"\"Open to Full-Time Security & Engineering Roles (2026)\""}]'::jsonb,
  '[{"icon":"Shield","title":"Cybersecurity & Defense","description":"Vulnerability assessment, network penetration testing, intrusion detection (IDS/IPS), security auditing, and defensive system hardening."},{"icon":"Network","title":"Networking & Infrastructure","description":"LAN/WAN design, routing (OSPF, BGP), switching (VLANs), firewall configuration, packet analysis, and network automation with Python."},{"icon":"Cpu","title":"AI & Machine Learning","description":"Deep learning models for network anomaly detection, predictive security analytics, computer vision for surveillance, and NLP classification."},{"icon":"Terminal","title":"Systems & Security Automation","description":"Linux server administration, packet dissection with Wireshark, automated configuration management, Docker containerization, and REST APIs."}]'::jsonb;

-- 3. Insert Site Settings
INSERT INTO public.site_settings (
  id, default_theme, accent_color, custom_accent_color, show_stats, show_terminal, show_leetcode,
  font_family, font_size, line_height, hero_bg_light, hero_bg_dark,
  footer_tagline, footer_copyright, section_visibility, section_content
)
SELECT
  'c2ac0f95-8842-49dc-bdaa-2f18cc99520a'::uuid,
  'dark',
  'neon-emerald',
  '#22c55e',
  true,
  true,
  false,
  'inter',
  'md',
  'normal',
  '/hero-light.png',
  '/hero-dark.png',
  'Designed & engineered with a security-first mindset, modern React, and Tailwind CSS.',
  '© 2026 Nuwan Pinnaduwage. All rights reserved.',
  '{"about": true, "skills": true, "education": true, "projects": true, "experience": true, "contact": true}'::jsonb,
  '{"about_title":"About Me","about_subtitle":"Defending networks, engineering resilient infrastructure, and deploying machine intelligence.","about_who_i_am":"Who I Am","skills_title":"Skills & Technologies","skills_subtitle":"A balanced technical toolkit spanning Computer Networking, Cyber Security, and Computer Science & Analytical Fundamentals.","projects_title":"Technical Projects Showcase","projects_subtitle":"A collection of hands-on security frameworks, enterprise network infrastructures, and artificial intelligence models engineered with real-world architectures.","projects_categories":["All","Cybersecurity","Computer Networking","Artificial Intelligence & Machine Learning"],"projects_subcategories":{"Cybersecurity":["Network Security","Ethical Hacking","Penetration Testing","Vulnerability Assessment","Security Auditing","Web Application Security","Cryptography","Digital Forensics","Intrusion Detection Systems (IDS)","Malware Analysis","Security Automation"],"Computer Networking":["Network Infrastructure","Network Configuration","Routing and Switching","Network Monitoring","Network Automation","TCP/IP and Network Protocols","LAN/WAN Design","Network Simulation","Firewall Configuration","Server Administration","Cloud Networking"],"Artificial Intelligence & Machine Learning":["Machine Learning","Deep Learning","Natural Language Processing (NLP)","Computer Vision","AI Chatbots","Predictive Analytics","Intelligent Automation","AI-Powered Security","Anomaly Detection","Data Science"]},"projects_types":["All","Security Tool","Network Infrastructure","AI System","Simulation Lab","Automation Engine","Defensive Framework","Offensive Security Tool"],"projects_statuses":["All","Completed","In Progress","Research","Planned"],"projects_tags":["Python","Kali Linux","Wireshark","Nmap","Metasploit","Burp Suite","Snort","Cisco Packet Tracer","GNS3","Cisco IOS","TCP/IP","VLAN","BGP","OSPF","pfSense","TensorFlow","PyTorch","Scikit-learn","OpenCV","Pandas","NumPy","Linux","Docker","Git"],"projects_categorized_tags":{"Programming":["Python","Java","JavaScript","C","C++","PHP","Bash","Go"],"Cybersecurity":["Kali Linux","Wireshark","Nmap","Metasploit","Burp Suite","OWASP ZAP","Snort","Suricata","OpenSSL","Ghidra"],"Networking":["Cisco Packet Tracer","GNS3","Cisco IOS","TCP/IP","DNS","DHCP","VLAN","Routing","Switching","BGP","OSPF","pfSense"],"AI/ML":["Python","TensorFlow","PyTorch","Scikit-learn","OpenCV","Pandas","NumPy","Hugging Face","Keras"],"Development & Infrastructure":["Linux","Windows Server","Docker","Git","MySQL","PostgreSQL","REST APIs","Ansible"]},"projects_filter_config":{"enableType":true,"enableCategory":true,"enableSubcategory":true,"enableStatus":true,"enableStack":true,"enableTags":true,"enableSorting":true},"research_title":"Research & Publications","research_subtitle":"Peer-reviewed conference papers, technical reports, and experimental investigations into network security, distributed protocols, and AI threat modeling.","research_types":["All","Conference Paper","Journal Article","Preprint","Ongoing Research","Workshop Paper","Technical Report"],"research_categories":["All","Network Security","AI & Machine Learning","Distributed Systems","Cloud & Edge Computing","Systems Security"],"research_statuses":["All","Published","Accepted","Under Review","In Progress","Preprint"],"research_tags":["Intrusion Detection","Graph Neural Networks","Network Security","Consensus Protocols","Raft","Fault Tolerance","Edge AI","Formal Verification"],"research_filter_config":{"enableType":true,"enableCategory":true,"enableStatus":true,"enableYear":true,"enableTags":true},"contact":{"title":"Get In Touch","subtitle":"Whether you have an exciting project, a collaboration idea, or just want to say hello — I''''d love to hear from you. Let''''s build something amazing together.","directEmail":"nuwan.pinnaduwage@example.com","phone":"+1 (555) 019-2834","location":"San Francisco, CA (Open to Relocation & Remote)","socialLinks":[{"platform":"LinkedIn","url":"https://linkedin.com/in/nuwan-pinnaduwage","username":"in/nuwan-pinnaduwage","icon":"Linkedin","label":"LinkedIn"},{"platform":"GitHub","url":"https://github.com/nuwan-pinnaduwage","username":"@nuwanp-sec","icon":"Github","label":"GitHub"},{"platform":"Email","url":"mailto:nuwan.pinnaduwage@example.com","username":"nuwan.pinnaduwage@example.com","icon":"Mail","label":"Gmail"}],"displaySettings":{"showEmail":true,"showPhone":true,"showLocation":true,"showSocialLinks":true,"showAvailability":false,"showContactForm":true},"formFields":{"enabled":true,"formHeading":"Let''''s Connect","formSubtitle":"","nameLabel":"Your Name","namePlaceholder":"Your Name","nameRequired":true,"emailLabel":"Your Email","emailPlaceholder":"Your Email","emailRequired":true,"subjectLabel":"Subject","subjectPlaceholder":"Subject","subjectRequired":true,"messageLabel":"Message","messagePlaceholder":"Message","messageRequired":true,"buttonText":"SEND","submittingText":"SENDING...","successMessage":"Thank you! Your message has been received. Nuwan will get back to you shortly."}},"footer":{"tagline":"Designed & engineered with a security-first mindset, modern React, and Tailwind CSS.","copyrightNotice":"© 2026 Nuwan Pinnaduwage. All rights reserved.","layout":"minimal","alignment":"center","showCopyright":true,"ownerName":"Nuwan Pinnaduwage","autoYear":true,"startYear":"2026","rightsText":"All rights reserved.","prefixText":"©","bgColor":"#050706","textColor":"#94a3b8","highlightColor":"#22c55e","fontSize":"sm","paddingY":"normal","spacing":"normal","showBorderTop":false,"showTagline":false,"showProfessionalTitle":false,"professionalTitle":"Cybersecurity, Networking & AI Specialist","showEmail":false,"email":"nuwan.pinnaduwage@example.com","showLocation":false,"location":"San Francisco, CA","showGithub":false,"githubUrl":"https://github.com","showLinkedin":false,"linkedinUrl":"https://linkedin.com","showNavLinks":false,"navLinks":[{"id":"nav-about","name":"About","href":"#about"},{"id":"nav-skills","name":"Skills","href":"#skills"},{"id":"nav-projects","name":"Projects","href":"#projects"},{"id":"nav-experience","name":"Experience","href":"#experience"},{"id":"nav-education","name":"Education","href":"#education"},{"id":"nav-contact","name":"Contact","href":"#contact"}],"showPrivacyPolicy":false,"privacyText":"Privacy Policy","privacyUrl":"#privacy","showTerms":false,"termsText":"Terms & Conditions","termsUrl":"#terms","showBackToTop":false,"backToTopText":"Back to top","showCustomText":false,"customText":"Built with React & Tailwind CSS","sourceCodeLink":"https://github.com"},"appearance":{"accentColor":"neon-emerald","customAccentColor":"#22c55e","fontFamily":"inter","fontSize":"md","lineHeight":"normal","sections":{"hero":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"about":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"skills":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"projects":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"experience":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"education":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"contact":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"footer":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"}}},"sectionAppearance":{"hero":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"about":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"skills":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"projects":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"experience":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"education":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"contact":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"},"footer":{"inheritGlobal":true,"fontFamily":"inter","fontSize":"md","lineHeight":"normal","accentColor":"emerald","customAccentColor":"#22c55e"}}'::jsonb;

-- 4. Insert Projects (All 8 Projects)
INSERT INTO public.projects (
  slug, title, category, subcategory, type, status, completion_year, completion_date, start_date,
  tagline, description, full_overview, problem_statement, objectives, proposed_solution,
  methodology, technical_implementation, results, challenges, future_improvements,
  architecture_diagram, topology_diagram, documentation_url, paper_url,
  technologies, tags, metrics, highlights, default_view, featured, is_published, image, gallery, order_index
) VALUES (
  'sentinel-ids-deep-packet-inspection',
  'SentinelIDS: Real-Time Deep Packet Inspection & AI-Driven IPS',
  'Cybersecurity',
  'Intrusion Detection Systems (IDS)',
  'Security Tool',
  'Completed',
  '2024',
  '2024-11',
  '2024-06',
  'Hybrid intrusion prevention system fusing Snort 3 signature matching with real-time neural payload classification.',
  'Engineered a high-throughput network intrusion detection and automated prevention system that inspects live packet streams, classifies zero-day payload anomalies with an inference model, and dynamically injects iptables firewall block rules.',
  'SentinelIDS bridges the gap between deterministic signature analysis and modern machine learning. Operating directly over raw AF_PACKET sockets, the engine pipelines incoming traffic through two parallel inspection stages: a high-speed compiled Snort 3 rule matcher for known CVE signatures, followed by a quantized 1D convolutional feature extractor for abnormal byte patterns. Upon positive detection, the automated mitigations daemon executes netfilter quarantine commands within 4.2ms, effectively severing active TCP sessions.',
  'Traditional signature-based IDS solutions suffer from critical blind spots against obfuscated shellcodes, polymorphic payloads, and novel zero-day attacks, while purely statistical anomaly detectors generate unacceptably high false-alarm rates in high-throughput enterprise networks.',
  '1. Build a dual-stage packet inspection pipeline processing gigabit traffic with sub-5ms inspection latency.
2. Achieve >98% detection accuracy across polymorphic exploits without exceeding 0.05% false positive rates.
3. Implement automated firewall rule generation and IP quarantine via Linux iptables and Redis ban lists.',
  'Develop an integrated hybrid engine using C++ for raw packet capture via libpcap, Python for rapid telemetry orchestration, Snort 3 for deterministic signatures, and an embedded ONNX neural model for unknown anomaly classification.',
  '',
  'The packet acquisition daemon taps incoming physical NIC interfaces using circular ring buffers in user space. Captured frames are parsed down to L4 transport headers. Suspicious payloads exceeding entropy thresholds are passed to a quantized neural model. If an exploit confidence score exceeds 0.92, an asynchronous event worker signals the iptables netfilter queue to inject DROP rules and notifies SIEM endpoints via syslog.',
  'Demonstrated 98.9% true-positive detection against 450 simulated Metasploit and Kali Linux exploit payloads during controlled red-team validation, maintaining negligible CPU overhead (<12%) on a standard 4-core Linux appliance.',
  'Minimizing buffer bloat and memory allocations during sustained UDP flood attacks. Resolved by implementing memory-mapped ring buffers (mmap) and batching iptables netfilter updates through ipset.',
  'Integrating eBPF / XDP (eXpress Data Path) kernel bypass for direct packet filtering at the network driver level.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
  'https://github.com/nuwan-pinnaduwage/sentinel-ids#readme',
  '',
  ARRAY['Python', 'C++', 'Snort', 'Wireshark', 'Kali Linux', 'Docker', 'Linux', 'TCP/IP', 'REST APIs']::text[],
  ARRAY['Python', 'Snort', 'Wireshark', 'Kali Linux', 'Docker', 'TCP/IP']::text[],
  ARRAY['< 4.2ms end-to-end drop latency', '98.9% exploit detection rate', '10Gbps line rate bench with 0 packet drops']::text[],
  ARRAY['Zero-copy AF_PACKET socket capture pipeline processing over 120,000 packets per second.', 'Hybrid rule evaluation integrating official Snort Community Rules with custom regex signatures.', 'Automated active response system managing dynamic iptables netfilter IP blacklisting.', 'Interactive curses terminal and live web telemetry dashboard displaying packet breakdown.', 'Exportable PCAP capture logs and SIEM-compliant JSON alerting format.']::text[],
  'overview',
  true,
  true,
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
  ARRAY['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=900', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900']::text[],
  1
);
INSERT INTO public.projects (
  slug, title, category, subcategory, type, status, completion_year, completion_date, start_date,
  tagline, description, full_overview, problem_statement, objectives, proposed_solution,
  methodology, technical_implementation, results, challenges, future_improvements,
  architecture_diagram, topology_diagram, documentation_url, paper_url,
  technologies, tags, metrics, highlights, default_view, featured, is_published, image, gallery, order_index
) VALUES (
  'enterprise-netmesh-sdwan-infrastructure',
  'Enterprise NetMesh: Multi-Site SD-WAN & Dual-Stack BGP/OSPF Infrastructure',
  'Computer Networking',
  'Routing and Switching',
  'Network Infrastructure',
  'Completed',
  '2024',
  '2024-09',
  '2024-03',
  'Resilient enterprise campus and multi-site WAN architecture designed with redundant BGP multi-homing and 802.1Q VLAN segmentation.',
  'Designed, simulated, and deployed a production-grade multi-tier enterprise network infrastructure spanning headquarters, data centers, and branch offices with dynamic routing failover, pfSense firewalls, and automated configuration management.',
  'Enterprise NetMesh models a complete corporate IT infrastructure engineered to withstand multi-link failures without human intervention. The campus backbone implements a hierarchical three-tier design (Core, Distribution, Access) utilizing multi-area OSPFv2/OSPFv3 for internal convergence and dual-homed eBGP connections to dual simulated Tier-1 ISPs with BFD (Bidirectional Forwarding Detection). Departmental traffic is isolated into dedicated 802.1Q VLANs with Inter-VLAN routing governed by stateful pfSense firewall clusters running CARP (Common Address Redundancy Protocol).',
  'The legacy network suffered from unsegmented broadcast domains, single points of failure across primary WAN uplinks, slow spanning-tree reconvergence (>30s), and manual, error-prone switch port provisioning.',
  '1. Architect a resilient campus topology with zero single points of failure and sub-2 second routing convergence.
2. Isolate administrative, corporate, voice, and guest wireless traffic across distinct 802.1Q VLANs.
3. Implement redundant edge firewalls with state synchronization and automated site-to-site IPsec VPN tunnels.',
  'Utilize Cisco Packet Tracer and GNS3 to simulate a multi-site enterprise topology incorporating Cisco IOS routers, multilayer Catalyst 3650 switches, redundant pfSense firewalls, and Python Netmiko scripts for centralized configuration push.',
  '',
  'Configured multi-area OSPF with route summarization on backbone Area 0 to minimize routing table bloat. Enabled Rapid PVST+ (802.1w) across switching layers with PortFast, BPDU Guard, and Root Guard to eliminate spanning tree topology loops. Established redundant IPsec Site-to-Site tunnels between HQ and Branch with AES-256-GCM encryption. Deployed automated DHCP snooping and Dynamic ARP Inspection (DAI) to prevent rogue DHCP and ARP poisoning.',
  'Successfully validated complete fault-tolerance under 15 distinct hardware and link failure simulations, achieving instant CARP virtual IP transfer and <1.8s BGP reconvergence with uninterrupted VoIP and ERP sessions.',
  'Resolving asymmetric routing and state-dropping across dual pfSense firewall nodes during ISP failover. Solved by tuning BGP multi-exit discriminator (MED) attributes and enabling pfSense synchronous state tracking.',
  'Migrating the overlay infrastructure to software-defined Cisco SD-WAN (Viptela) with automated application-aware routing policies.',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  'https://github.com/nuwan-pinnaduwage/enterprise-netmesh#readme',
  '',
  ARRAY['Cisco Packet Tracer', 'GNS3', 'Cisco IOS', 'TCP/IP', 'VLAN', 'Routing', 'Switching', 'BGP', 'OSPF', 'pfSense', 'DNS', 'DHCP', 'Python']::text[],
  ARRAY['Cisco Packet Tracer', 'GNS3', 'Cisco IOS', 'TCP/IP', 'VLAN', 'BGP', 'OSPF', 'pfSense']::text[],
  ARRAY['< 1.8s BGP/BFD failover time', 'Zero packet loss during single WAN link cut', '6 secure isolated departmental VLANs']::text[],
  ARRAY['Hierarchical Core-Distribution-Access architecture with redundant EtherChannel trunk links.', 'Dual-homed eBGP edge routing with AS-path prepending and local preference path steering.', 'Multi-area OSPF internal routing with MD5 authentication and route summarization.', 'High-availability pfSense firewall pair with CARP virtual IP failover and XMLRPC state sync.', '802.1Q VLAN segmentation with Access Control Lists (ACLs) enforcing zero-trust inter-departmental policies.', 'Python Netmiko automation suite for automated VLAN provisioning and nightly running-config backups.']::text[],
  'architecture',
  true,
  true,
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900',
  ARRAY['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900']::text[],
  2
);
INSERT INTO public.projects (
  slug, title, category, subcategory, type, status, completion_year, completion_date, start_date,
  tagline, description, full_overview, problem_statement, objectives, proposed_solution,
  methodology, technical_implementation, results, challenges, future_improvements,
  architecture_diagram, topology_diagram, documentation_url, paper_url,
  technologies, tags, metrics, highlights, default_view, featured, is_published, image, gallery, order_index
) VALUES (
  'net-anomaly-ai-graph-neural-network',
  'NetAnomalyAI: Graph Neural Network for Zero-Day Threat Detection',
  'Artificial Intelligence & Machine Learning',
  'Anomaly Detection',
  'AI System',
  'Completed',
  '2024',
  '2024-10',
  '2024-04',
  'Unsupervised deep graph learning model processing NetFlow telemetry to uncover sophisticated lateral movements and data exfiltration.',
  'Developed an AI-powered network security pipeline that transforms raw NetFlow/IPFIX streams into dynamic temporal interaction graphs, applying Graph Convolutional Networks (GCN) to pinpoint stealthy cyber threats with 99.1% AUROC.',
  'Modern cyber adversaries execute subtle low-and-slow reconnaissance and internal pivot movements that evade traditional statistical thresholds. NetAnomalyAI models the entire network as an evolving graph where IP addresses represent nodes and communications represent multi-dimensional directed edges weighted by packet sizes, TCP flags, and inter-arrival times. By applying inductive Graph Neural Networks in PyTorch, the system generates node embeddings that instantly flag deviations indicative of port scans, command-and-control (C2) beaconing, and distributed brute-force attacks.',
  'Advanced persistent threats (APTs) blend into legitimate baseline traffic, rendering single-connection threshold monitors ineffective against coordinated multi-stage lateral attacks.',
  '1. Construct an end-to-end telemetry ingestion pipeline transforming NetFlow v9 records into graph representations.
2. Train an unsupervised spatial-temporal Graph Convolutional Network capable of detecting anomalous communication subgraphs.
3. Evaluate model performance on benchmark intrusion datasets (CIC-IDS2018 and UNSW-NB15) aiming for >98% AUROC.',
  'Utilize Python, PyTorch Geometric, NetworkX, and Scikit-learn to parse packet telemetry into temporal graph snapshots, applying contrastive self-supervised graph learning to build normal communication embeddings.',
  '',
  'Built custom NetFlow v9 collector in Python that groups active flows into 30-second sliding windows. Graph nodes are enriched with 14 engineered topological features (e.g., node degree, eigenvector centrality, port entropy). A 3-layer GCN with residual skip connections produces low-dimensional topological embeddings. Anomalous edges are scored via reconstruction error metrics, dispatching alerts to security analysts with full sub-graph visualization.',
  'Achieved an Area Under ROC curve of 99.1% on the benchmark CIC-IDS2018 dataset, correctly identifying 100% of injected botnet C2 channels with less than 0.04% false alarms across 4.2 million network flow records.',
  'Managing high computational graph construction overhead for large network snapshots (>50,000 active nodes). Overcame by adopting neighborhood sampling techniques and multi-GPU tensor batching.',
  'Deploying the trained GNN model onto edge SmartNICs using TensorRT for sub-millisecond line-rate classification.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  'https://github.com/nuwan-pinnaduwage/net-anomaly-ai#readme',
  '',
  ARRAY['Python', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Wireshark', 'Docker', 'Linux']::text[],
  ARRAY['Python', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Wireshark', 'Docker']::text[],
  ARRAY['99.1% AUROC on CIC-IDS2018 benchmark', '0.04% false positive rate', 'Real-time streaming inference at 45k flows/sec']::text[],
  ARRAY['Streaming NetFlow and IPFIX parser converting raw telemetry into PyTorch Geometric graph datasets.', 'Spatial-temporal Graph Convolutional Network (GCN) architecture with edge-attribute propagation.', 'Self-supervised contrastive learning eliminating the need for expensive manually labeled training sets.', 'Interactive graph visualization UI rendering infected communication trees and pivot paths.', 'Automated feature extraction capturing packet entropy, TCP handshake symmetry, and burstiness.']::text[],
  'overview',
  true,
  true,
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=900',
  ARRAY['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=900', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900']::text[],
  3
);
INSERT INTO public.projects (
  slug, title, category, subcategory, type, status, completion_year, completion_date, start_date,
  tagline, description, full_overview, problem_statement, objectives, proposed_solution,
  methodology, technical_implementation, results, challenges, future_improvements,
  architecture_diagram, topology_diagram, documentation_url, paper_url,
  technologies, tags, metrics, highlights, default_view, featured, is_published, image, gallery, order_index
) VALUES (
  'vulnhound-automated-vulnerability-assessment',
  'VulnHound: Automated Vulnerability Assessment & Pen-Testing Framework',
  'Cybersecurity',
  'Vulnerability Assessment',
  'Offensive Security Tool',
  'Completed',
  '2024',
  '2024-08',
  '2024-02',
  'Modular security auditing engine automating active recon, port scanning, CVE fingerprinting, and OWASP Top 10 web audits.',
  'Built a Python-based penetration testing orchestrator that integrates Nmap, Burp Suite, OWASP ZAP, and custom exploitation modules into an automated security assessment pipeline generating comprehensive executive and technical PDF reports.',
  'VulnHound automates the tedious early reconnaissance and vulnerability discovery phases of authorized penetration tests. Operating within a hardened Kali Linux environment, the framework coordinates fast network host discovery via Masscan/Nmap, enumerates open service banners, cross-references discovered versions against the NIST National Vulnerability Database (NVD) via REST APIs, and launches non-destructive web probes (SQL injection, XSS, SSRF, broken access controls).',
  'Manual security assessments are time-consuming and often miss obscure misconfigurations, while commercial scanners produce massive unwieldy reports filled with false positives.',
  '1. Create an integrated CLI and web scanner chaining host discovery, service enumeration, and CVE matching.
2. Implement safe, non-destructive vulnerability confirmation heuristics for OWASP Top 10 web flaws.
3. Generate sanitized, CVSS-scored executive summary reports with actionable mitigation guides.',
  'Develop a modular Python framework leveraging Nmap scripting engine (NSE), OWASP ZAP API, and custom fuzzing modules coordinated through an asynchronous task queue.',
  '',
  'Engineered with Python asyncio and Click CLI. The scanner executes parallel multi-threaded port scans, parses XML results into normalized JSON schemas, interrogates NVD API endpoints for known CVEs, and triggers headless browser checks for cross-site scripting reflections.',
  'Successfully utilized in three simulated university lab penetration tests, discovering 14 confirmed high/critical vulnerabilities across web and server assets within 45 minutes of automated execution.',
  'Preventing rate-limiting and target crash conditions during aggressive automated crawling. Solved by implementing adaptive backoff algorithms and passive rate-tuned request queues.',
  'Adding automated privilege escalation audit modules for Linux and Windows Active Directory environments.',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  'https://github.com/nuwan-pinnaduwage/vulnhound-audit#readme',
  '',
  ARRAY['Kali Linux', 'Burp Suite', 'OWASP ZAP', 'Nmap', 'Python', 'Metasploit', 'Bash', 'Linux', 'REST APIs']::text[],
  ARRAY['Kali Linux', 'Burp Suite', 'OWASP ZAP', 'Nmap', 'Python', 'Metasploit']::text[],
  ARRAY['10x faster audit completion time', 'Zero false-positive critical alerts verified in lab', 'CVSS v3.1 scoring compliance']::text[],
  ARRAY['Automated multi-stage reconnaissance: host discovery, banner grabbing, and service detection.', 'Real-time CVE cross-referencing querying the NIST National Vulnerability Database.', 'OWASP Top 10 automated test suites covering SQLi, stored/reflected XSS, and IDOR.', 'Custom exploit payload verification in isolated Docker sandbox environments.', 'Exportable PDF and Markdown reporting with risk matrices and step-by-step remediation instructions.']::text[],
  'overview',
  false,
  true,
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900',
  ARRAY['https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=900', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=900']::text[],
  4
);
INSERT INTO public.projects (
  slug, title, category, subcategory, type, status, completion_year, completion_date, start_date,
  tagline, description, full_overview, problem_statement, objectives, proposed_solution,
  methodology, technical_implementation, results, challenges, future_improvements,
  architecture_diagram, topology_diagram, documentation_url, paper_url,
  technologies, tags, metrics, highlights, default_view, featured, is_published, image, gallery, order_index
) VALUES (
  'autonetops-network-automation-engine',
  'AutoNetOps: Zero-Touch Network Configuration & Telemetry Engine',
  'Computer Networking',
  'Network Automation',
  'Automation Engine',
  'Completed',
  '2024',
  '2024-07',
  '2024-01',
  'Python and Ansible automation framework providing declarative multi-vendor switch configuration, validation, and real-time SNMP/telemetry polling.',
  'Built an infrastructure-as-code automation platform that replaces manual CLI configuration with declarative Jinja2 templates, automated syntax testing, Netmiko multi-threading, and automated rollback upon validation failure.',
  'AutoNetOps transforms traditional CLI-based network administration into a reliable DevOps workflow. Using Python, Netmiko, and Jinja2 templates, administrators define golden device configurations in Git. AutoNetOps verifies pre-change routing states, pushes changes over secure SSH channels to multi-vendor switches (Cisco IOS, Arista EOS), and runs automated post-change health checks. If packet loss or routing table divergence is detected, the engine executes an immediate zero-loss rollback.',
  'Manual CLI device configuration across distributed enterprise switches results in configuration drift, human typographical errors, and extended network outages during maintenance windows.',
  '1. Build an automated configuration push pipeline managing 50+ network devices concurrently.
2. Ensure zero configuration drift through automated scheduled state audits.
3. Implement automated pre/post check verification and instant one-click rollback on failure.',
  'Leverage Python, Netmiko, NAPALM, Jinja2 templating, and Git version control to create a declarative network automation engine.',
  '',
  'Developed a Python core using concurrent.futures ThreadPoolExecutor to handle concurrent SSH sessions across simulated GNS3 network topologies. Jinja2 models dynamic VLANs, interfaces, and ACLs. Diffing algorithms compare running-config against golden Git baselines, triggering Slack and email webhooks upon unauthorized drift.',
  'Reduced new switch deployment time from 2.5 hours per device to under 3 minutes, successfully preventing two potential outages during simulated failure drills via automatic rollback.',
  'Managing vendor-specific CLI prompt idiosyncrasies and SSH connection timeout drops across high-latency WAN links. Resolved by implementing robust regex prompt matching and configurable retry backoffs in Netmiko.',
  'Integrating gNMI / OpenConfig streaming telemetry for real-time state streaming rather than periodic polling.',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  'https://github.com/nuwan-pinnaduwage/autonet-ops#readme',
  '',
  ARRAY['Python', 'Cisco IOS', 'GNS3', 'TCP/IP', 'VLAN', 'Linux', 'Docker', 'REST APIs', 'Git']::text[],
  ARRAY['Python', 'Cisco IOS', 'GNS3', 'TCP/IP', 'VLAN', 'Linux', 'Git']::text[],
  ARRAY['95% reduction in provisioning time', '100% automated rollback success rate in 40 trials', 'Zero configuration drift']::text[],
  ARRAY['Declarative Jinja2 templating for interface configs, BGP peerings, and access control lists.', 'Multi-threaded SSH execution engine pushing changes across 50 nodes in under 12 seconds.', 'Pre-change and post-change automated health verification (ping, ARP, BGP neighbor states).', 'Automated configuration rollback preserving uptime upon unexpected ping packet loss.', 'Scheduled configuration drift audit daemon alerting on unauthorized out-of-band manual changes.']::text[],
  'architecture',
  false,
  true,
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900',
  ARRAY['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900']::text[],
  5
);
INSERT INTO public.projects (
  slug, title, category, subcategory, type, status, completion_year, completion_date, start_date,
  tagline, description, full_overview, problem_statement, objectives, proposed_solution,
  methodology, technical_implementation, results, challenges, future_improvements,
  architecture_diagram, topology_diagram, documentation_url, paper_url,
  technologies, tags, metrics, highlights, default_view, featured, is_published, image, gallery, order_index
) VALUES (
  'cybervision-computer-vision-security',
  'CyberVision: Edge AI Computer Vision & Physical Security Anomaly Detector',
  'Artificial Intelligence & Machine Learning',
  'Computer Vision',
  'AI System',
  'In Progress',
  '2025',
  '2025-02',
  '2024-09',
  'Low-latency edge vision system executing real-time object tracking, perimeter intrusion detection, and physical security anomaly alerts.',
  'Engineered an edge computer vision surveillance pipeline combining YOLOv8 object detection, ByteTrack multi-target tracking, and optical flow analysis in OpenCV to safeguard restricted physical server room perimeters.',
  'Physical security is the first line of defense in cybersecurity. CyberVision deploys quantized neural models onto embedded Linux edge gateways to monitor secure facility perimeters in real time. Processing RTSP camera feeds, the system detects unauthorized personnel, tailgating into server cages, and unattended suspicious items. When an intrusion event violates a virtual tripwire, CyberVision immediately dispatches an alert with an annotated bounding-box screenshot and notifies security personnel.',
  'Manual monitoring of security camera feeds leads to fatigue, missed intrusion events, and delayed response times during unauthorized physical facility breaches.',
  '1. Build an optimized edge video inference pipeline running at >25 FPS on low-power hardware.
2. Accurately detect human perimeter intrusions and tailgating events without false alarms from light changes.
3. Transmit encrypted instantaneous MQTT/REST alerts with proof-of-incident snapshots.',
  'Utilize Python, OpenCV, PyTorch, and TensorRT to run an INT8-quantized YOLO model with multi-camera RTSP decoding and spatial tripwire polygon algorithms.',
  '',
  'Built using Python with OpenCV for video stream acquisition and GPU-accelerated decoding. Video frames are fed to an INT8-quantized YOLOv8 detector running via ONNX Runtime. Detected bounding boxes are tracked across frames using ByteTrack. Custom polygon intersection algorithms monitor configured sensitive zones, triggering automated alarms when unauthorized personnel linger.',
  'Maintained 28.4 frames per second real-time throughput on a compact embedded accelerator, reliably identifying 100% of tested unauthorized entry attempts in lab mockups with sub-second alert delivery.',
  'Managing false triggers caused by camera lens flare and rapid indoor illumination changes. Resolved by incorporating background subtraction motion verification alongside object confidence scores.',
  'Implementing re-identification (ReID) models to track identified individuals across multiple disconnected surveillance cameras.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
  'https://github.com/nuwan-pinnaduwage/cybervision-ai#readme',
  '',
  ARRAY['Python', 'OpenCV', 'PyTorch', 'TensorFlow', 'Linux', 'Docker', 'REST APIs']::text[],
  ARRAY['Python', 'OpenCV', 'PyTorch', 'TensorFlow', 'Linux', 'Docker']::text[],
  ARRAY['28.4 FPS on edge hardware', '< 180ms alert dispatch latency', '97.4% human detection accuracy']::text[],
  ARRAY['Real-time RTSP stream acquisition and multi-threaded frame processing.', 'Configurable multi-zone virtual tripwires and restricted polygon boundaries.', 'Anti-tailgating heuristic tracking multiple bodies entering single-entry security access doors.', 'Local encrypted snapshot storage preventing unauthorized tampering with visual evidence.', 'Webhook integration with Telegram, Discord, and central SIEM dashboards.']::text[],
  'overview',
  false,
  true,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=900',
  ARRAY['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=900']::text[],
  6
);
INSERT INTO public.projects (
  slug, title, category, subcategory, type, status, completion_year, completion_date, start_date,
  tagline, description, full_overview, problem_statement, objectives, proposed_solution,
  methodology, technical_implementation, results, challenges, future_improvements,
  architecture_diagram, topology_diagram, documentation_url, paper_url,
  technologies, tags, metrics, highlights, default_view, featured, is_published, image, gallery, order_index
) VALUES (
  'cryptoshield-post-quantum-tunnel',
  'CryptoShield: Post-Quantum End-to-End Cryptographic Protocol',
  'Cybersecurity',
  'Cryptography',
  'Defensive Framework',
  'Research',
  '2025',
  '2025-01',
  '2024-07',
  'Post-quantum secure transport tunnel implementing Kyber-1024 key encapsulation and Dilithium digital signatures.',
  'Implemented an experimental transport-layer security wrapper in C and Python utilizing NIST-standardized lattice-based cryptographic algorithms to protect confidential communication against future quantum decryption attacks.',
  'With the imminent advent of cryptographically relevant quantum computers, traditional RSA and Elliptic Curve Diffie-Hellman (ECDH) key exchanges are vulnerable to retroactive ''Harvest Now, Decrypt Later'' attacks. CryptoShield implements a hybrid key agreement scheme combining classical X25519 with ML-KEM (CRYSTALS-Kyber) and ML-DSA (CRYSTALS-Dilithium) to guarantee forward secrecy against both classical and quantum adversaries.',
  'Current encrypted network traffic is actively harvested and stored by state actors waiting for quantum computers capable of breaking discrete logarithm and integer factorization cryptography.',
  '1. Implement a hybrid classical/post-quantum handshake protocol with minimal latency overhead.
2. Benchmark lattice-based key exchange performance and packet fragmentation across raw TCP sockets.
3. Validate cryptographic implementation safety against side-channel timing leaks.',
  'Develop a modular C/Python cryptographic daemon wrapping OpenSSL and liboqs (Open Quantum Safe) libraries into a transparent socket proxy.',
  '',
  'Built in C with Python bindings using liboqs. The protocol executes a dual-layer handshake: initiating an ephemeral X25519 exchange while concurrently encapsulating a 256-bit symmetric session key via Kyber-1024. The resulting shared secrets are fed into HKDF-SHA256 to derive symmetrical ChaCha20-Poly1305 session keys.',
  'Successfully validated end-to-end data transmission across test networks, proving that post-quantum lattice cryptography adds less than 14 milliseconds to initial connection establishment without degrading streaming throughput.',
  'Mitigating TCP packet fragmentation caused by significantly larger public key and ciphertext sizes in Kyber (1,568 bytes) compared to classical ECC (32 bytes). Resolved by optimizing socket buffer windows and implementing custom framing.',
  'Integrating hardware-accelerated AVX2 and ARM NEON vectorized polynomial multiplication instructions.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
  'https://github.com/nuwan-pinnaduwage/cryptoshield-quantum#readme',
  '',
  ARRAY['C', 'C++', 'Python', 'OpenSSL', 'Linux', 'TCP/IP']::text[],
  ARRAY['C', 'C++', 'Python', 'OpenSSL', 'Linux', 'TCP/IP']::text[],
  ARRAY['NIST Post-Quantum Level 5 security', '< 14ms hybrid handshake overhead', 'Zero memory leaks verified via Valgrind']::text[],
  ARRAY['Hybrid classical X25519 and lattice-based CRYSTALS-Kyber-1024 key encapsulation.', 'Post-quantum digital signatures utilizing CRYSTALS-Dilithium for mutual authentication.', 'ChaCha20-Poly1305 authenticated encryption for high-speed symmetric data transfer.', 'Transparent local TCP proxy mode enabling legacy applications to leverage quantum-safe tunnels.', 'Rigorous timing side-channel mitigation through constant-time cryptographic primitives.']::text[],
  'overview',
  false,
  true,
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=900',
  ARRAY['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=900']::text[],
  7
);
INSERT INTO public.projects (
  slug, title, category, subcategory, type, status, completion_year, completion_date, start_date,
  tagline, description, full_overview, problem_statement, objectives, proposed_solution,
  methodology, technical_implementation, results, challenges, future_improvements,
  architecture_diagram, topology_diagram, documentation_url, paper_url,
  technologies, tags, metrics, highlights, default_view, featured, is_published, image, gallery, order_index
) VALUES (
  'cloudnet-guard-transit-vpc',
  'CloudNetGuard: Transit VPC & Segmented Cloud Micro-Perimeter',
  'Computer Networking',
  'Cloud Networking',
  'Network Infrastructure',
  'Completed',
  '2024',
  '2024-05',
  '2024-01',
  'Centralized transit hub network architecture connecting isolated application VPCs with centralized firewall inspection.',
  'Architected and configured a scalable cloud networking topology featuring a centralized Transit Hub, spoke VPCs, route tables, subnets, and automated firewall traffic redirection enforcing micro-segmentation.',
  'In cloud environments, unrestricted spoke-to-spoke communication violates defense-in-depth principles. CloudNetGuard implements a hub-and-spoke transit network architecture where all inter-VPC and outbound internet traffic must route through a central Inspection VPC hosting stateful firewall instances. Route tables and security groups ensure complete isolation between production database tiers, application servers, and public-facing load balancers.',
  'Default cloud peering allows lateral threat movement across environments and lacks centralized traffic inspection and egress filtering.',
  '1. Design a centralized Transit VPC architecture connecting multiple isolated workload spokes.
2. Force all inter-VPC traffic through dedicated inspection firewalls without introducing routing loops.
3. Implement fine-grained egress filtering preventing reverse-shell outbound connections.',
  'Design a hub-and-spoke transit network with dedicated inspection subnets, private route tables, NAT gateways, and Linux/pfSense firewall routers.',
  '',
  'Configured CIDR block allocation avoiding overlapping IP ranges across 4 VPCs. Established transit peering connections with route table injection directing 0.0.0.0/0 traffic to firewall ENIs. Configured strict security groups and network ACLs enforcing least-privilege port access.',
  'Proved total containment during lateral movement penetration tests, blocking 100% of unauthorized spoke-to-spoke database probe attempts.',
  'Avoiding asymmetric routing when traffic traverses through redundant firewall instances. Resolved using state-aware source NAT (SNAT) on inspection return paths.',
  'Automating cloud network deployment via Terraform and CloudFormation modules.',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  'https://github.com/nuwan-pinnaduwage/cloudnet-guard#readme',
  '',
  ARRAY['Linux', 'Docker', 'Firewall Configuration', 'TCP/IP', 'DNS', 'DHCP', 'Routing and Switching']::text[],
  ARRAY['Linux', 'Docker', 'TCP/IP', 'Firewall Configuration', 'Routing and Switching']::text[],
  ARRAY['100% centralized traffic inspection', 'Sub-1ms transit latency overhead', 'Zero unauthorized inter-tier connections allowed']::text[],
  ARRAY['Hub-and-spoke Transit architecture eliminating complex full-mesh peering.', 'Centralized perimeter inspection firewall filtering all North-South and East-West traffic.', 'Strict tier isolation separating Web, Application, and Database network segments.', 'Automated VPC peering routing tables with redundant failover gateways.', 'Flow log collection and centralized telemetry parsing.']::text[],
  'architecture',
  false,
  true,
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=900',
  ARRAY['https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=900']::text[],
  8
);

-- 5. Insert Research (All 3 Publications)
INSERT INTO public.research (
  slug, title, type, category, status, publication_date, publication_year, venue, authors, doi,
  abstract, full_overview, methodology, paper_url, external_url, tags, image, featured, is_published,
  highlights, metrics, order_index
) VALUES (
  'graph-learning-network-anomaly-detection',
  'Spatial-Temporal Graph Learning for Latent Network Anomaly Detection in High-Throughput Fabrics',
  'Conference Paper',
  'Network Security',
  'Published',
  '2025-10',
  '2025',
  'IEEE Conference on Communications and Network Security (CNS)',
  ARRAY['Nuwan Pinnaduwage', 'Dr. H. Chen', 'K. Silva']::text[],
  '10.1109/CNS.2025.1054921',
  'Proposes an inductive Graph Convolutional Network that processes dynamic IP interaction graphs to detect low-and-slow lateral attacks and command-and-control beaconing with minimal false positives.',
  'Modern persistent threats evade static signature IDS by maintaining communication profiles below rate thresholds. This research introduces a temporal graph-slicing approach that converts flow interaction topologies into vectorized node embeddings, benchmarked on multi-terabyte production network captures.',
  'Implemented in PyTorch Geometric and evaluated against CIC-IDS2018 across 15 emulated enterprise LAN/WAN segments with red-team attack replays.',
  'https://arxiv.org',
  'https://ieee.org',
  ARRAY['Intrusion Detection', 'Graph Neural Networks', 'Network Security']::text[],
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
  true,
  true,
  ARRAY['Achieved 99.1% AUROC with 0.04% false alarm rates on gigabit NetFlow telemetry.', 'Constructed sliding-window temporal graph representations with edge-attribute propagation.', 'Demonstrated real-time inference latency under 22ms per 10k active flows.']::text[],
  ARRAY['99.1% AUROC detection', '0.04% false positive rate']::text[],
  1
);
INSERT INTO public.research (
  slug, title, type, category, status, publication_date, publication_year, venue, authors, doi,
  abstract, full_overview, methodology, paper_url, external_url, tags, image, featured, is_published,
  highlights, metrics, order_index
) VALUES (
  'adaptive-consensus-optimization-raft',
  'Adaptive Consensus Optimization in Geo-Distributed Raft Clusters',
  'Conference Paper',
  'Distributed Systems',
  'Published',
  '2025-06',
  '2025',
  'IEEE International Conference on Distributed Computing Systems (ICDCS)',
  ARRAY['Nuwan Pinnaduwage', 'Dr. H. Chen']::text[],
  '10.1109/ICDCS.2025.1049281',
  'Explores dynamic quorum adjustments and latency-predictive leader election mechanisms to reduce tail latency in cross-region Raft state machine replication without sacrificing linearizable consistency.',
  'Geo-distributed consensus is constrained by cross-datacenter round-trip times and unpredictable packet loss. We propose GeoRaft, an extension to the Raft consensus protocol that introduces latency-aware quorum slicing and pipelined log entries.',
  'Implemented in Go using custom TCP event loops and tested on 15 nodes distributed across 5 global AWS availability zones.',
  'https://arxiv.org',
  'https://ieee.org',
  ARRAY['Consensus Protocols', 'Raft', 'Fault Tolerance', 'Distributed Systems']::text[],
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=900',
  true,
  true,
  ARRAY['Devised adaptive pipelining scheme reducing heartbeats overhead by 42%.', 'Validated consistency proofs using TLA+ formal specification model checker.', 'Evaluated across 5 global AWS availability zones under extreme network partitions.']::text[],
  ARRAY['38% tail latency reduction', 'Zero split-brain occurrences under 40% packet drops']::text[],
  2
);
INSERT INTO public.research (
  slug, title, type, category, status, publication_date, publication_year, venue, authors, doi,
  abstract, full_overview, methodology, paper_url, external_url, tags, image, featured, is_published,
  highlights, metrics, order_index
) VALUES (
  'quantization-aware-edge-vit',
  'Quantization-Aware Low-Rank Distillation for Edge Vision Transformers',
  'Preprint',
  'AI & Machine Learning',
  'Preprint',
  '2025-03',
  '2025',
  'arXiv preprint arXiv:2506.14820 [cs.CV]',
  ARRAY['Nuwan Pinnaduwage', 'A. Rivera']::text[],
  '10.48550/arXiv.2506.14820',
  'Proposes a two-stage hybrid distillation technique combining parameter-efficient Low-Rank Adaptation (LoRA) with 4-bit uniform weight quantization for resource-constrained vision transformer deployments.',
  'Deploying attention-based Vision Transformers (ViTs) on resource-limited edge silicon is hindered by quadratic memory footprint. We present Q-ViTEdge, achieving 3.6x speedup on ARM Cortex-M and Apple Neural Engine with only 0.7% top-1 accuracy loss on ImageNet-1K.',
  'PyTorch distillation pipeline leveraging teacher-student feature divergence loss alongside progressive weight clipping during INT4 quant training.',
  'https://arxiv.org/abs/2506.14820',
  'https://arxiv.org',
  ARRAY['Edge AI', 'Transformer Optimization', 'AI & Machine Learning']::text[],
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=900',
  false,
  true,
  ARRAY['Engineered custom INT4 matrix multiplication kernels in C++ with NEON SIMD acceleration.', 'Demonstrated 73% energy consumption drop on embedded battery-powered drones.', 'Open-source benchmarking toolkit with reproducible model checkpoints.']::text[],
  ARRAY['3.6x speedup on embedded silicon', '73% energy consumption drop']::text[],
  3
);

-- 6. Insert Skills (All 34 Skills across 8 Categories)
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Computer Networking Fundamentals',
  'network',
  'Network',
  'network',
  'Network',
  90,
  'Shield',
  '90%',
  'Foundational principles of network topologies, packet transmission, and architecture.',
  '',
  1,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'TCP/IP and OSI Models',
  'network',
  'Network',
  'network',
  'Network',
  92,
  'Shield',
  '92%',
  'Layered network communication models, protocol abstraction, and packet encapsulation.',
  '',
  2,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'IPv4 and IPv6 Addressing',
  'network',
  'Network',
  'network',
  'Network',
  88,
  'Shield',
  '88%',
  'Hierarchical IP address schemes, dual-stack deployment, and address planning.',
  '',
  3,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Subnetting and VLSM',
  'network',
  'Network',
  'network',
  'Network',
  90,
  'Shield',
  '90%',
  'Variable Length Subnet Masking, CIDR prefix calculations, and address optimization.',
  '',
  4,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Routing and Switching',
  'network',
  'Network',
  'network',
  'Network',
  86,
  'Shield',
  '86%',
  'Layer 2 CAM table switching and Layer 3 static and dynamic packet routing.',
  '',
  5,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'VLANs',
  'network',
  'Network',
  'network',
  'Network',
  88,
  'Shield',
  '88%',
  '802.1Q virtual LAN segmentation, trunking, and broadcast domain isolation.',
  '',
  6,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'DNS and DHCP',
  'network',
  'Network',
  'network',
  'Network',
  89,
  'Shield',
  '89%',
  'Hierarchical name resolution, resource records, and dynamic IP leasing services.',
  '',
  7,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Network Protocols',
  'network',
  'Network',
  'network',
  'Network',
  87,
  'Shield',
  '87%',
  'Transport (TCP/UDP), ICMP, ARP, NAT, HTTP/S, SSH, and network telemetry.',
  '',
  8,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Network Configuration and Troubleshooting',
  'network',
  'Network',
  'network',
  'Network',
  85,
  'Shield',
  '85%',
  'Diagnosing connectivity issues, packet inspection, and device configuration.',
  '',
  9,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Network Administration',
  'network',
  'Network',
  'network',
  'Network',
  84,
  'Shield',
  '84%',
  'Hardware provisioning, switch/router CLI management, and network monitoring.',
  '',
  10,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Cybersecurity Fundamentals',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  88,
  'Shield',
  '88%',
  'Core CIA triad model, defense-in-depth strategies, and threat landscape analysis.',
  '',
  11,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Information Security',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  86,
  'Shield',
  '86%',
  'Data protection, security governance, risk assessment, and confidentiality policies.',
  '',
  12,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Network Security',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  88,
  'Shield',
  '88%',
  'Firewall packet filtering, perimeter defense, and Intrusion Detection Systems.',
  '',
  13,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Ethical Hacking Fundamentals',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  84,
  'Shield',
  '84%',
  'Authorized penetration testing methodologies, security scoping, and ethical disclosure.',
  '',
  14,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Vulnerability Assessment',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  85,
  'Shield',
  '85%',
  'Automated scanning, manual verification, and CVSS severity scoring workflows.',
  '',
  15,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Security Auditing',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  80,
  'Shield',
  '80%',
  'System log auditing, baseline verification, and security compliance checks.',
  '',
  16,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Linux Security',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  88,
  'Shield',
  '88%',
  'Hardening Linux servers, user permissions, PAM, and secure SSH configuration.',
  '',
  17,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Cryptography Fundamentals',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  82,
  'Shield',
  '82%',
  'Symmetric/asymmetric encryption, hashing algorithms, and digital certificates.',
  '',
  18,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Authentication and Authorization',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  87,
  'Shield',
  '87%',
  'Identity verification, Multi-Factor Authentication (MFA), and Role-Based Access Control.',
  '',
  19,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Security Tools and Technologies',
  'cyber_security',
  'Cyber Security',
  'cyber_security',
  'Cyber Security',
  86,
  'Shield',
  '86%',
  'Hands-on utility experience with Wireshark, Nmap, Burp Suite, and security platforms.',
  '',
  20,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Programming Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  92,
  'Shield',
  '92%',
  'Core procedural structures, control flows, memory references, and algorithmic logic.',
  '',
  21,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Object-Oriented Programming',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  90,
  'Shield',
  '90%',
  'Encapsulation, inheritance, polymorphism, abstraction, and software design principles.',
  '',
  22,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Data Structures and Algorithms',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  88,
  'Shield',
  '88%',
  'Arrays, linked lists, trees, graphs, sorting, searching, and Big-O complexity.',
  '',
  23,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Database Management Systems',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  85,
  'Shield',
  '85%',
  'Relational schema design, normalization, transactions, ACID properties, and SQL.',
  '',
  24,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Operating Systems',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  84,
  'Shield',
  '84%',
  'Process scheduling, multi-threading, concurrency locks, virtual memory, and file systems.',
  '',
  25,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Web Development Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  86,
  'Shield',
  '86%',
  'Client-server architectures, RESTful APIs, modern JavaScript, and responsive UI.',
  '',
  26,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Software Engineering',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  85,
  'Shield',
  '85%',
  'SDLC methodologies, Agile workflows, Git version control, and unit testing.',
  '',
  27,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Discrete Mathematics',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  84,
  'Shield',
  '84%',
  'Set theory, propositional logic, graph theory, relations, and proof techniques.',
  '',
  28,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Linear Algebra',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  82,
  'Shield',
  '82%',
  'Matrix operations, vector spaces, dot products, eigenvalues, and linear transformations.',
  '',
  29,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Probability and Statistics',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  83,
  'Shield',
  '83%',
  'Probability distributions, random variables, sample statistics, and hypothesis testing.',
  '',
  30,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Machine Learning Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  82,
  'Shield',
  '82%',
  'Supervised and unsupervised learning, cost functions, training pipelines, and metrics.',
  '',
  31,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Multiple Linear Regression (MLR)',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  80,
  'Shield',
  '80%',
  'Multivariate regression modeling, residual analysis, and coefficient significance.',
  '',
  32,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Analysis of Variance (ANOVA)',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  78,
  'Shield',
  '78%',
  'Comparing statistical variance across independent sample groups.',
  '',
  33,
  true
);
INSERT INTO public.skills (
  name, category_id, category_name, catalog_id, catalog_name, level, icon, tag, description, duration, order_index, is_published
) VALUES (
  'Mathematical and Statistical Research Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  'cs_fundamentals',
  'CS Fundamentals',
  84,
  'Shield',
  '84%',
  'Empirical study design, academic literature review, and experimental validation.',
  '',
  34,
  true
);

-- 7. Insert Certificates (All 4 Certificates)
INSERT INTO public.certificates (
  title, issuer, year, tags, image, credential_url, order_index, is_published
) VALUES (
  '1st Place Winner - Collegiate Cyber Defense & Hackathon',
  'Annual University Cyber Defense Challenge',
  '2024',
  ARRAY['Cybersecurity', 'Defense', 'Red-Team']::text[],
  '',
  '',
  1,
  true
);
INSERT INTO public.certificates (
  title, issuer, year, tags, image, credential_url, order_index, is_published
) VALUES (
  'Dean''s Honor List for Academic Excellence',
  'School of Engineering',
  '2022-2025',
  ARRAY['Academic Honors', 'Dean''s List']::text[],
  '',
  '',
  2,
  true
);
INSERT INTO public.certificates (
  title, issuer, year, tags, image, credential_url, order_index, is_published
) VALUES (
  'Top 10% National Cyber League (NCL) Competitor',
  'National Cyber League',
  '2024',
  ARRAY['Network Forensics', 'Cryptography', 'OSINT']::text[],
  '',
  '',
  3,
  true
);
INSERT INTO public.certificates (
  title, issuer, year, tags, image, credential_url, order_index, is_published
) VALUES (
  'Cisco Certified Network Associate (CCNA) Coursework Completed',
  'Cisco Networking Academy',
  '2024',
  ARRAY['Networking', 'Cisco', 'Routing & Switching']::text[],
  '',
  '',
  4,
  true
);

-- 8. Insert Education
INSERT INTO public.education (
  degree, institution, location, period, gpa, honors, description, coursework, extracurriculars, order_index, is_published
) VALUES (
  'Bachelor of Science in Computer Science',
  'State University of Technology',
  'Campus City, CA',
  'August 2022 - Expected May 2026',
  '3.85 / 4.00',
  ARRAY['Dean''s Honors List (All semesters)', 'Academic Excellence Scholarship in STEM']::text[],
  'Concentration in Cybersecurity, Computer Networks, and Machine Learning Systems.',
  ARRAY['Computer Networks & Internet Protocols', 'Network Security & Cryptography', 'Operating Systems & Kernel Architecture', 'Artificial Intelligence & Machine Learning', 'Data Structures & Algorithm Analysis', 'Database Management Systems', 'Computer System Architecture', 'Distributed Systems & Cloud Computing']::text[],
  ARRAY['Cybersecurity Club - Technical Lead & CTF Team Captain', 'Undergraduate Peer Tutor for Computer Networks & Data Structures', 'ACM Student Chapter - Systems & Security Workshop Organizer']::text[],
  1,
  true
);

-- 9. Insert Experience (All 3 Positions)
INSERT INTO public.experience (
  role, organization, location, period, type, responsibilities, technologies, order_index, is_published
) VALUES (
  'Network Security & Systems Intern',
  'TechNova Cyber Infrastructure Labs',
  'San Jose, CA (Hybrid)',
  'June 2024 - August 2024',
  'Internship',
  ARRAY['Audited and hardened internal Linux server appliances, implementing automated iptables rules and fail2ban intrusion policies.', 'Configured multi-segment 802.1Q VLANs and pfSense perimeter firewalls across test lab topologies.', 'Developed automated Python scripts using Netmiko to backup switch configurations and detect unauthorized drift.', 'Conducted simulated web penetration tests on internal portals, discovering and remediating 4 OWASP Top 10 vulnerabilities.']::text[],
  ARRAY['Python', 'Wireshark', 'Cisco IOS', 'pfSense', 'Linux', 'Docker', 'Git']::text[],
  1,
  true
);
INSERT INTO public.experience (
  role, organization, location, period, type, responsibilities, technologies, order_index, is_published
) VALUES (
  'Undergraduate Teaching Assistant (Computer Networks & Data Structures)',
  'Department of Computer Science, University',
  'Campus City, CA',
  'January 2024 - May 2024',
  'Academic',
  ARRAY['Facilitated weekly lab sections covering packet capture with Wireshark, TCP 3-way handshakes, subnetting, and socket programming.', 'Mentored 100+ students on socket programming in Python and C++, routing table algorithms (Dijkstra, Bellman-Ford), and packet analysis.', 'Assisted faculty in designing network simulation assignments using Cisco Packet Tracer.']::text[],
  ARRAY['Wireshark', 'Cisco Packet Tracer', 'TCP/IP Sockets', 'C++', 'Python', 'Linux']::text[],
  2,
  true
);
INSERT INTO public.experience (
  role, organization, location, period, type, responsibilities, technologies, order_index, is_published
) VALUES (
  'CTF Team Captain & Technical Lead',
  'University Cybersecurity Student Chapter',
  'Campus City, CA',
  'September 2023 - Present',
  'Leadership',
  ARRAY['Led collegiate CTF team in national competitions, specializing in Network Forensics, Web Security, and Cryptography challenges.', 'Organized technical workshops on ethical hacking, Nmap reconnaissance, packet dissection, and defensive Linux hardening for 90+ students.', 'Constructed isolated vulnerable lab environments using Docker and VirtualBox for hands-on student practice.']::text[],
  ARRAY['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Docker', 'CTF']::text[],
  3,
  true
);

-- 10. Insert Achievements (All 4 Honors)
INSERT INTO public.achievements (
  title, issuer, date, description, badge, order_index, is_published
) VALUES (
  '1st Place Winner - Collegiate Cyber Defense & Hackathon',
  'Annual University Cyber Defense Challenge (350+ participants)',
  'October 2024',
  'Led team in maintaining high-availability services while actively defending against red-team penetration attacks and patch exploits.',
  '1st / 40 Teams',
  1,
  true
);
INSERT INTO public.achievements (
  title, issuer, date, description, badge, order_index, is_published
) VALUES (
  'Dean''s Honor List for Academic Excellence',
  'School of Engineering',
  'Fall 2022 - Spring 2025',
  'Maintained a cumulative GPA of 3.85 / 4.00 across five consecutive academic semesters.',
  'GPA 3.85',
  2,
  true
);
INSERT INTO public.achievements (
  title, issuer, date, description, badge, order_index, is_published
) VALUES (
  'Top 10% National Cyber League (NCL) Individual Competitor',
  'National Cyber League',
  'Spring 2024',
  'Competed in timed challenges spanning Network Traffic Analysis, Log Forensics, Cryptography, and Open Source Intelligence (OSINT).',
  'Top 10%',
  3,
  true
);
INSERT INTO public.achievements (
  title, issuer, date, description, badge, order_index, is_published
) VALUES (
  'Cisco Certified Network Associate (CCNA) Coursework Completed',
  'Cisco Networking Academy',
  'August 2024',
  'Comprehensive mastery of network fundamentals, IP connectivity, IP services, security fundamentals, and automation.',
  'CCNA Prep',
  4,
  true
);
