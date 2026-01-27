
export enum RiskSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum AgentStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  EXECUTING = 'EXECUTING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export type AgentCapability = 
  | 'IAM_ASSURANCE' 
  | 'EVIDENCE_COLLECTION' 
  | 'ANOMALY_DETECTION' 
  | 'GENERIC_AUDIT'
  | 'CIAM_ATTESTATION'
  | (string & {}); // Allows custom strings while preserving literal autocomplete

export interface CapabilityDefinition {
  id: string;
  name: string;
  description: string;
  iconName: 'Shield' | 'FileSearch' | 'Zap' | 'Code' | 'Network' | 'Database' | 'Lock' | 'Activity' | 'Cpu' | 'Globe';
}

export interface Control {
  id: string;
  name: string;
  description: string;
  type: 'Preventative' | 'Detective' | 'Corrective';
  agentCapability: AgentCapability;
  frameworkMappings: string[]; // e.g., ["SOX 404", "ISO 27001 A.9"]
  lastTested?: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  category: string;
  scoring: number; // 0-100
  controls: Control[];
}

export interface SimulationStep {
  timestamp: string;
  action: string;
  detail: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface AuditResult {
  score: number; // 0-100
  effective: boolean;
  summary: string;
  gaps: string[];
  recommendations: string[];
  scenario?: string;
  durationMs?: number;
  executionLogs?: SimulationStep[];
}

export interface ActiveSession {
  riskId: string;
  controlId: string;
  status: AgentStatus;
  logs: SimulationStep[];
  result?: AuditResult;
  startTime?: number;
}

export interface SequenceStep {
  id: string;
  from: string;
  to: string;
  label: string;
  details?: string;
  status: 'default' | 'success' | 'error' | 'warning';
  timestamp?: number;
}

export interface CIAMApplication {
  id: string;
  name: string;
  language: string;
  repo: string;
  framework?: string;
  status: 'Compliant' | 'Non-Compliant' | 'Untested';
  lastScan: string;
  monitoringEnabled?: boolean;
  driftStatus?: 'Stable' | 'Drift Detected' | 'Re-Auth Required';
  lastCommit?: string;
}

// Swarm / Scale Types
export interface SwarmCluster {
  id: string;
  name: string;
  techStack: 'Mainframe (COBOL/JCL)' | 'Microservices (Java/Go)' | 'Frontend (React/TS)' | 'Data (Python/SQL)';
  repoCount: number;
  activeAgents: number;
  linesOfCode: string; // e.g. "32M"
  status: 'idle' | 'scanning' | 'synthesizing' | 'completed';
  progress: number;
  findings: number;
}
