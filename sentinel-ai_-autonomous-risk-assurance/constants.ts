import { RiskSeverity, CapabilityDefinition, CIAMApplication } from './types';
import { Shield, FileSearch, Zap, Bot, Lock, Search, Cloud, FileText, Database, UserCheck, MessageSquare, Server, Code, GitBranch, Key } from 'lucide-react';

export const SEVERITY_COLORS = {
  [RiskSeverity.LOW]: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  [RiskSeverity.MEDIUM]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  [RiskSeverity.HIGH]: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  [RiskSeverity.CRITICAL]: 'bg-red-500/20 text-red-400 border-red-500/50',
};

export const INITIAL_CAPABILITIES: CapabilityDefinition[] = [
  {
    id: 'GENERIC_AUDIT',
    name: 'General Auditor',
    description: 'Standard control verification logic for general purpose auditing.',
    iconName: 'Shield'
  },
  {
    id: 'IAM_ASSURANCE',
    name: 'IAM Specialist',
    description: 'Analyzes identity graphs, toxic combinations, and segregation of duties.',
    iconName: 'Lock'
  },
  {
    id: 'EVIDENCE_COLLECTION',
    name: 'Evidence Collector',
    description: 'Automates log retrieval, hashing, and chain-of-custody preservation.',
    iconName: 'FileSearch'
  },
  {
    id: 'ANOMALY_DETECTION',
    name: 'Anomaly Detector',
    description: 'Statistical analysis for fraud detection using Benford\'s Law and Z-Scores.',
    iconName: 'Zap'
  },
  {
    id: 'CIAM_ATTESTATION',
    name: 'CIAM Scout',
    description: 'Source code analysis to map business logic to authentication flows.',
    iconName: 'Code'
  }
];

export const AGENT_BLUEPRINTS: Record<string, string> = {
  'IAM_ASSURANCE': `// AGENT BLUEPRINT: ACCESS_CONTROL_V2
// MODEL: GEMINI-1.5-PRO
// CONTEXT_WINDOW: 1M Tokens

class AccessControlAgent extends AssuranceAgent {
  async execute(context) {
    // 1. Ingest Data
    const idpGraph = await this.connect('Okta_API').fetchEntitlements();
    const hrData = await this.connect('Workday_API').fetchTerminations();

    // 2. Toxic Combination Analysis (Graph Theory)
    const toxicPaths = idpGraph.findPaths({
      source: 'User',
      targets: ['Vendor.Create', 'Payment.Approve'],
      constraints: { concurrent: true }
    });

    if (toxicPaths.length > 0) {
      this.flagRisk('SOD_VIOLATION', toxicPaths);
    }

    // 3. Orphaned Account Detection
    const orphans = idpGraph.users.filter(u => 
      hrData.terminatedEmployees.includes(u.email) && u.isActive
    );
    
    return this.generateForensicReport(toxicPaths, orphans);
  }
}`,
  'CIAM_ATTESTATION': `// AGENT BLUEPRINT: CIAM_SCOUT_X1
// ARCHITECTURE: RAG + MCP (Model Context Protocol)
// KNOWLEDGE_BASE: Source Code Vector DB

class CIAMAttestationAgent extends Agent {
  constructor() {
    this.mcpServer = new MCPServer('sqlite:codebase_db');
    this.ragEngine = new CodebaseRAG();
  }

  async auditTransaction(entryPoint: string) {
    // 1. Discovery & Token Optimization
    // Extract only relevant execution paths to save context
    const trace = await this.ragEngine.traceExecutionPath(entryPoint, {
      optimizeTokens: true,
      depth: 'full-stack'
    });

    // 2. Logic Stitching (Code-to-Logic)
    const sequence = this.stitchLogic({
      frontend: trace.filter(n => n.type === 'React/TS'),
      middleware: trace.filter(n => n.type === 'Java/Spring'),
      mainframe: trace.filter(n => n.type === 'COBOL')
    });

    // 3. Compliance Validation
    const gaps = [];
    if (!sequence.includes('StepUpAuth') && trace.isHighValue) {
       gaps.push('MISSING_MFA_ON_HIGH_VALUE');
    }

    return new AttestationReport(sequence, gaps);
  }
}`
};

export const INITIAL_AGENT_CATALOG = [
  {
    id: 'CIAM_ATTESTATION',
    name: 'CIAM Compliance Scout',
    description: 'An autonomous agent using RAG and MCP to reverse-engineer source code. It maps business logic to technical execution flows across Java, COBOL, and APIs to validate authentication hurdles.',
    icon: Code,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    model: 'Gemini 1.5 Pro (Ent)',
    capabilities: ['Source Code RAG', 'MCP Integration', 'Sequence Mapping'],
    requiredIntegrations: ['github', 'sonarqube', 'servicenow'],
    useCases: [
      'Detect "Toxic Combinations" in CICD pipelines',
      'Validate Step-Up Auth in Legacy Mainframe flows',
      'Automate Self-Attestation for 1000+ Apps'
    ],
    config: {
      temperature: 0.1,
      maxTokens: 8192,
      systemInstruction: "You are a specialized code analysis agent. Focus strictly on authentication paths. Ignore UI components."
    }
  },
  {
    id: 'IAM_ASSURANCE',
    name: 'Access Control Effectiveness',
    description: 'Powered by Gemini 1.5 Pro with a 1M token context window to analyze complex Identity Graphs. It specializes in IGA, utilizing graph theory to detect toxic combinations, SoD conflicts, and lateral movement paths.',
    icon: Shield,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    model: 'Gemini 1.5 Pro',
    capabilities: ['Graph Analysis', 'SoD Conflict Detection', 'Entitlement Review'],
    requiredIntegrations: ['okta', 'workday', 'servicenow'],
    useCases: [
      'Detect "Create Vendor" + "Pay Vendor" conflicts',
      'Identify orphaned accounts vs. HR termination logs',
      'Validate Break-Glass emergency access justification'
    ],
    config: {
      temperature: 0.0,
      maxTokens: 4096,
      systemInstruction: "Act as a strict IAM Auditor. Flag any user with conflicting permission sets defined in the separation of duties matrix."
    }
  },
  {
    id: 'EVIDENCE_COLLECTION',
    name: 'Audit Evidence Collection',
    description: 'Utilizing Gemini 1.5 Flash for high-speed log processing, this agent automates the retrieval, validation, and SHA-256 hashing of compliance artifacts. It ensures strict chain-of-custody by cross-referencing immutable logs.',
    icon: FileSearch,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    model: 'Gemini 1.5 Flash',
    capabilities: ['Log Aggregation', 'SHA-256 Hashing', 'Timestamp Verification'],
    requiredIntegrations: ['splunk', 'jira', 'gcp_audit'],
    useCases: [
      'Validate 100% of change tickets against logs',
      'Verify configuration drift in production servers',
      'Collect and hash evidence for SOX/ISO audits'
    ],
    config: {
      temperature: 0.0,
      maxTokens: 2048,
      systemInstruction: "You are an Evidence Collector. Your output must be raw JSON logs with SHA-256 hashes. Do not provide commentary."
    }
  },
  {
    id: 'ANOMALY_DETECTION',
    name: 'Transaction Anomaly Detection',
    description: 'A hybrid agent combining Gemini 1.5 Pro\'s reasoning with SciKit-Learn statistical models. It applies Benford\'s Law, Z-Score velocity checks, and Isolation Forests to detect high-fidelity fraud patterns.',
    icon: Zap,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    model: 'Gemini 1.5 Pro',
    capabilities: ["Benford's Law", "Z-Score Analysis", "Pattern Recognition"],
    requiredIntegrations: ['bigquery', 'workday'],
    useCases: [
      'Detect invoice structuring/smurfing',
      'Identify ghost vendors via fuzzy matching',
      'Flag duplicate payments across periods'
    ],
    config: {
      temperature: 0.4,
      maxTokens: 16384,
      systemInstruction: "You are a Forensic Accountant AI. Look for statistical outliers in the provided dataset. Use Benford's Law as a primary filter."
    }
  }
];

export const INTEGRATIONS = [
  { id: 'github', name: 'GitHub Enterprise', category: 'Source Control', status: 'connected', lastSync: '1 min ago', icon: GitBranch, color: 'text-white' },
  { id: 'okta', name: 'Okta Identity Cloud', category: 'IAM & Security', status: 'connected', lastSync: '2 mins ago', icon: Lock, color: 'text-blue-500' },
  { id: 'splunk', name: 'Splunk Enterprise', category: 'Log Aggregation', status: 'connected', lastSync: '30 sec ago', icon: Search, color: 'text-emerald-500' },
  { id: 'gcp_audit', name: 'Google Cloud Audit Logs', category: 'Infrastructure', status: 'connected', lastSync: '5 mins ago', icon: Cloud, color: 'text-blue-400' },
  { id: 'jira', name: 'Jira Software', category: 'Ticketing & Approvals', status: 'connected', lastSync: '10 mins ago', icon: FileText, color: 'text-blue-400' },
  { id: 'bigquery', name: 'Google BigQuery', category: 'Data Warehouse', status: 'connected', lastSync: '1 hour ago', icon: Database, color: 'text-teal-400' },
  { id: 'workday', name: 'Workday HRIS', category: 'HR & People', status: 'error', lastSync: '2 days ago', icon: UserCheck, color: 'text-indigo-500' },
  { id: 'servicenow', name: 'ServiceNow ITSM', category: 'Service Management', status: 'pending', lastSync: '-', icon: Server, color: 'text-green-600' }
];

export const MOCK_CIAM_APPS: CIAMApplication[] = [
  { id: 'app-1', name: 'Retail Banking Mobile', language: 'React Native / Node.js', repo: 'fintech/retail-mobile', status: 'Compliant', framework: 'NIST 800-63B', lastScan: '2 hrs ago', monitoringEnabled: true, driftStatus: 'Stable', lastCommit: 'feat: update payment gateway' },
  { id: 'app-2', name: 'Legacy Wire Transfer', language: 'Java / COBOL', repo: 'fintech/core-payments', status: 'Non-Compliant', framework: 'PCI-DSS 4.0', lastScan: '1 day ago', monitoringEnabled: true, driftStatus: 'Re-Auth Required', lastCommit: 'fix: hotfix auth logic' },
  { id: 'app-3', name: 'Wealth Management Portal', language: 'Angular / .NET', repo: 'fintech/wealth-portal', status: 'Compliant', framework: 'SOC 2 Type II', lastScan: '5 hrs ago', monitoringEnabled: false, driftStatus: 'Stable', lastCommit: 'chore: update deps' },
];