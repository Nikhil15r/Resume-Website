import { CVDocument } from '../types/cv';

export const INITIAL_CV: CVDocument = {
  id: 'doc-julian-thorne',
  title: 'Executive CV — Julian Thorne',
  createdAt: '2026-01-15T09:00:00Z',
  lastModified: '2026-10-27T10:30:00Z',
  personalInfo: {
    fullName: 'Julian Thorne',
    title: 'Vice President of Engineering & Cloud Systems',
    email: 'julian.thorne@alum.mit.edu',
    phone: '+1 (415) 890-4321',
    location: 'San Francisco, CA & Zurich, Switzerland',
    website: 'julianthorne.io',
    linkedin: 'linkedin.com/in/julian-thorne',
    github: 'github.com/julianthorne'
  },
  summary: 'Transformational technology executive with 14+ years scaling mission-critical distributed infrastructure and high-velocity engineering organizations. Proven record guiding 180+ person multi-disciplinary teams across North America and Europe, spearheading $45M+ cloud modernization programs, and delivering resilient enterprise architectures serving 40M+ global users with 99.995% availability.',
  experience: [
    {
      id: 'exp-1',
      role: 'Vice President of Platform Engineering',
      company: 'Aetheris Financial Technologies',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Lead enterprise architecture, global infrastructure, site reliability, and developer tooling across 4 global engineering centers.',
      achievements: [
        'Architected high-throughput real-time settlement engine processing $1.8B in daily transactional volume across US and EU banking rails.',
        'Scaled engineering organization from 65 to 190 engineers while reducing annual attrition to under 4.2% through transparent engineering governance.',
        'Migrated monolithic core to multi-region Kubernetes on AWS, cutting infrastructure COGS by 34% ($6.2M annual run-rate savings).',
        'Implemented enterprise-wide zero-trust security fabric, achieving SOC-2 Type II, ISO 27001, and FedRAMP readiness in record 9 months.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Senior Director of Infrastructure & Systems',
      company: 'Kavalan Cloud Systems',
      location: 'Seattle, WA',
      startDate: '2018',
      endDate: '2022',
      current: false,
      description: 'Directed cloud platforms, distributed storage, and operational telemetry for tier-1 enterprise SaaS products.',
      achievements: [
        'Spearheaded transition to event-driven streaming architecture (Kafka/Flink), decreasing end-to-end data latency from 450ms to 28ms at P99.',
        'Managed $22M capital and cloud operational budget with under 1.5% variance across 4 consecutive fiscal years.',
        'Championed internal platform engineering initiative, improving developer cycle time by 48% and reducing deployment rollback rate by 70%.'
      ]
    },
    {
      id: 'exp-3',
      role: 'Staff Distributed Systems Architect',
      company: 'OmniVanguard Systems',
      location: 'Boston, MA',
      startDate: '2014',
      endDate: '2018',
      current: false,
      description: 'Principal technical lead responsible for distributed consensus, stateful clustering, and high-availability storage subsystems.',
      achievements: [
        'Designed custom Raft-based consensus protocol powering real-time distributed ledger with sub-millisecond local failover.',
        'Mentored 18 senior and staff engineers; co-authored 3 US patents in distributed checkpointing and asynchronous data replication.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Master of Science (M.S.)',
      field: 'Computer Science & Distributed Systems',
      school: 'Massachusetts Institute of Technology (MIT)',
      location: 'Cambridge, MA',
      startDate: '2012',
      endDate: '2014',
      gpa: '3.94 / 4.0',
      honors: 'MIT Presidential Fellow • Graduate Research Assistantship'
    },
    {
      id: 'edu-2',
      degree: 'Bachelor of Science (B.S.) with High Distinction',
      field: 'Electrical Engineering & Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2008',
      endDate: '2012',
      gpa: '3.91 / 4.0',
      honors: 'EECS Departmental Honors • Tau Beta Pi Engineering Honor Society'
    }
  ],
  skills: [
    {
      id: 'sk-1',
      category: 'Strategic & Executive Leadership',
      items: ['Enterprise Architecture', 'Global Org Scaling (150+)', 'Cloud CapEx/OpEx Optimization', 'M&A Technical Diligence', 'Cross-Border Governance']
    },
    {
      id: 'sk-2',
      category: 'Distributed Systems & Cloud',
      items: ['Multi-Region Kubernetes', 'AWS & GCP Infrastructure', 'Kafka / Flink Streaming', 'gRPC & Service Mesh', 'High-Frequency FinTech Rails']
    },
    {
      id: 'sk-3',
      category: 'Data, Security & Compliance',
      items: ['Zero-Trust Architecture', 'SOC 2 & ISO 27001', 'PostgreSQL / CockroachDB', 'Distributed Consensus (Raft/Paxos)', 'eBPF Observability']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'AetherRail — Global Ultra-Low Latency Clearing Mesh',
      role: 'Executive Sponsor & Chief Architect',
      startDate: '2023',
      endDate: '2024',
      description: 'Fault-tolerant financial messaging fabric connecting institutional tier-1 liquidity providers with deterministic execution guarantees.',
      highlights: [
        'Maintains deterministic P99 latency below 12 microseconds under peak loads exceeding 450,000 requests per second.',
        'Deployed across 3 synchronized active-active global availability zones with seamless automated partition recovery.'
      ],
      techStack: ['Rust', 'gRPC', 'eBPF', 'AWS Outposts', 'Hardware Timestamping']
    },
    {
      id: 'proj-2',
      title: 'Kavalan Sentinel — Autonomous Cloud SRE Fabric',
      role: 'Principal Architectural Lead',
      startDate: '2019',
      endDate: '2021',
      description: 'Machine-learning anomaly detection and auto-remediation control plane for multi-cluster enterprise deployments.',
      highlights: [
        'Preemptively identified 82% of latent network degradation events prior to user-facing impact.',
        'Reduced mean time to resolution (MTTR) from 24 minutes to under 90 seconds.'
      ],
      techStack: ['Go', 'Kubernetes Operator', 'Prometheus', 'TensorFlow', 'Terraform']
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect — Professional',
      issuer: 'Amazon Web Services',
      date: '2023'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022'
    }
  ],
  publications: [
    {
      id: 'pub-1',
      title: 'Deterministic State Machine Replication in Ultra-Scale Financial Clearing Systems',
      publisher: 'IEEE Transactions on Parallel & Distributed Systems',
      date: '2021',
      authors: 'J. Thorne, E. Vance, D. Alverez'
    },
    {
      id: 'pub-2',
      title: 'Practical eBPF Telemetry for Multi-Tenant Kubernetes Clusters',
      publisher: 'ACM SIGCOMM Workshop on Hot Topics in Networks',
      date: '2019',
      authors: 'J. Thorne, M. Chen'
    }
  ],
  awards: [
    {
      id: 'aw-1',
      title: 'Enterprise Technology Innovator of the Year',
      organization: 'Bay Area Technology Council',
      date: '2023',
      summary: 'Recognized for groundbreaking cost efficiency and architecture in global clearing infrastructure.'
    }
  ],
  customSections: [],
  settings: {
    templateId: 'corporate-classic',
    paperSize: 'a4',
    primaryColor: '#0A0A0A',
    accentColor: '#8C8172',
    fontFamily: 'serif',
    fontSize: 'normal',
    margins: 'normal',
    lineSpacing: 'normal',
    showBorders: true
  }
};

export const INITIAL_COVER_LETTER = {
  id: 'cl-julian-thorne',
  title: 'Cover Letter — Board & Executive Appointment',
  lastModified: '2026-10-27T10:30:00Z',
  recipientName: 'Eleanor Sterling',
  recipientTitle: 'Chair of the Executive Nominating Committee',
  companyName: 'Apex Global Financial Holdings',
  companyAddress: '100 Wall Street, 38th Floor, New York, NY 10005',
  date: 'October 27, 2026',
  salutation: 'Dear Ms. Sterling and Members of the Nominating Committee,',
  openingParagraph: 'I am writing to express my enthusiastic interest in the Vice President of Enterprise Systems & Platform Engineering mandate at Apex Global Financial Holdings. Having followed Apex\'s strategic consolidation of institutional digital assets, I have long admired the firm\'s uncompromising dedication to engineering rigor and operational resilience.',
  bodyParagraphs: [
    'Over the past fourteen years, I have dedicated my career to designing and operating distributed transaction architectures that safeguard billions in institutional capital. In my current capacity as Vice President of Platform Engineering at Aetheris, I direct a global team of 190 engineers, orchestrating multi-region clearing systems processing $1.8B daily. During my tenure, we compressed core infrastructure expenses by 34% while elevating platform availability to a resilient 99.995%.',
    'What distinguishes my executive leadership is the deliberate convergence of deep architectural stewardship with organizational clarity. At Apex Global, where real-time settlement speed, regulatory rigor, and generational scale intersect, I bring proven expertise in modernizing legacy monoliths into cloud-native architectures without disrupting mission-critical client operations.',
    'Moreover, I have consistently championed an engineering culture grounded in high autonomy, psychological safety, and metric-driven operational excellence. Under my stewardship, cross-regional teams deliver high velocity while maintaining industry-low voluntary attrition.'
  ],
  closingParagraph: 'I would welcome the opportunity to discuss how my architectural vision and leadership pedigree can accelerate Apex Global\'s next era of platform leadership. Thank you for your consideration and time.',
  signoff: 'Sincerely,',
  senderName: 'Julian Thorne',
  senderTitle: 'Vice President of Engineering & Cloud Systems',
  senderEmail: 'julian.thorne@alum.mit.edu',
  senderPhone: '+1 (415) 890-4321',
  senderLocation: 'San Francisco, CA & Zurich, Switzerland',
  templateId: 'corporate-classic' as const
};
