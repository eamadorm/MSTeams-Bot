import { GoogleGenAI, Type } from "@google/genai";
import { Risk, RiskSeverity, AgentCapability } from '../types';
import { getAgentSystemInstruction } from './prompts';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Mock Data Generator ---
export const generateInitialRisks = async (domain: string): Promise<Risk[]> => {
  const ai = getAiClient();
  
  // We explicitly guide the model to generate risks that align with our realistic agent portfolio
  // Removed strict responseSchema to prevent XHR errors with complex nested types in preview models
  const prompt = `
    Generate 3 high-fidelity organizational risks for a Modern Enterprise (${domain}).
    
    Output a strictly valid JSON array of objects. Do not wrap in markdown code blocks.
    Structure:
    [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "severity": "Low" | "Medium" | "High" | "Critical",
        "category": "string",
        "scoring": number (0-100),
        "controls": [
          {
            "id": "string",
            "name": "string",
            "description": "string",
            "type": "Preventative" | "Detective" | "Corrective",
            "agentCapability": "IAM_ASSURANCE" | "EVIDENCE_COLLECTION" | "ANOMALY_DETECTION" | "GENERIC_AUDIT",
            "frameworkMappings": ["string"]
          }
        ]
      }
    ]

    Required Risks:
    1. Security Risk related to 'Excessive Privileged Access' or 'Toxic Combinations' (mapped to IAM_ASSURANCE agent).
    2. Compliance Risk related to 'Missing Audit Evidence' or 'Regulatory Reporting' (mapped to EVIDENCE_COLLECTION agent).
    3. Financial Risk related to 'Fraudulent Disbursements' or 'General Ledger Anomalies' (mapped to ANOMALY_DETECTION agent).

    For each risk, provide a specific control and mapping to frameworks (SOX, ISO 27001, COSO).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text || '[]') as Risk[];
  } catch (e) {
    console.error("Failed to generate risks", e);
    // Fallback Data tailored to the requested agents
    return [
      {
        id: 'r-1',
        title: 'Toxic Access Combinations (SoD)',
        description: 'Risk of users holding conflicting permissions (e.g., create vendor + pay vendor) leading to fraud.',
        severity: RiskSeverity.CRITICAL,
        category: 'Identity & Access',
        scoring: 95,
        controls: [
          { 
            id: 'c-1', 
            name: 'Continuous SoD Analysis', 
            description: 'Automated verification of conflicting roles across ERP and Identity Provider.', 
            type: 'Detective',
            agentCapability: 'IAM_ASSURANCE',
            frameworkMappings: ['COSO Principle 11', 'SOX ITGC: Logical Access', 'ISO 27001: A.9.2']
          }
        ]
      },
      {
        id: 'r-2',
        title: 'Incomplete Audit Trails (SOX)',
        description: 'Risk that required evidence for change management is not retained, leading to regulatory findings.',
        severity: RiskSeverity.HIGH,
        category: 'Compliance',
        scoring: 88,
        controls: [
          { 
            id: 'c-2', 
            name: 'Automated Evidence Repository', 
            description: 'Systematic collection and hashing of approval logs for all production deployments.', 
            type: 'Preventative',
            agentCapability: 'EVIDENCE_COLLECTION',
            frameworkMappings: ['SOX Sec 404', 'ISO 27001: A.12.4', 'COSO Principle 10']
          }
        ]
      },
      {
        id: 'r-3',
        title: 'Procurement Fraud Patterns',
        description: 'Risk of anomalous payments to shell vendors or duplicate invoices bypassing standard checks.',
        severity: RiskSeverity.CRITICAL,
        category: 'Financial Crime',
        scoring: 92,
        controls: [
          { 
            id: 'c-3', 
            name: 'AI Transaction Forensics', 
            description: 'Real-time statistical anomaly detection on outgoing wire transfers and vendor master updates.', 
            type: 'Detective',
            agentCapability: 'ANOMALY_DETECTION',
            frameworkMappings: ['COSO Principle 8', 'SOX Sec 302', 'ISO 27001: A.16.1']
          }
        ]
      }
    ];
  }
};

// --- Streaming Agent Simulation ---
export async function* streamAuditSimulation(risk: Risk, controlName: string, agentCapability: AgentCapability) {
  let useFallback = false;
  let responseStream;

  try {
    const ai = getAiClient();
    // Use the refined, centralized prompt templates
    const systemInstruction = getAgentSystemInstruction(risk, controlName, agentCapability);

    responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: `Initialize Agent: ${agentCapability}. Target Control: ${controlName}. Begin autonomous verification sequence.`,
      config: {
        systemInstruction: systemInstruction,
      }
    });
  } catch (e) {
    console.warn("Gemini API unavailable, using high-fidelity simulation fallback.", e);
    useFallback = true;
  }

  if (!useFallback && responseStream) {
    try {
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
            yield text;
        }
      }
    } catch (e) {
      console.warn("Stream interrupted, switching to fallback.", e);
      useFallback = true;
    }
  }

  if (useFallback) {
    // High-fidelity fallback scenarios for demo purposes
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    const mockLogs = [
      JSON.stringify({ type: "log", action: "INIT_CONNECTION", detail: `Establishing secure mTLS connection to ${agentCapability === 'CIAM_ATTESTATION' ? 'GitHub Enterprise & SonarQube' : 'Enterprise Data Lake'}...`, status: "info" }),
      JSON.stringify({ type: "log", action: "CONTEXT_LOAD", detail: "Retrieving architecture maps and security policies from VectorDB...", status: "info" }),
      JSON.stringify({ type: "log", action: "DISCOVERY_SCAN", detail: `Scanning target scope for control: ${controlName}. Found 14 active endpoints.`, status: "success" }),
      JSON.stringify({ type: "log", action: "AST_ANALYSIS", detail: "Parsing Abstract Syntax Tree (AST) to identify authentication gates in legacy code modules...", status: "info" }),
      JSON.stringify({ type: "log", action: "MCP_QUERY", detail: "Querying Model Context Protocol (MCP) server for business logic constraints...", status: "info" }),
      JSON.stringify({ type: "log", action: "TRACE_EXECUTION", detail: "Stitched execution path: Mobile_App -> API_Gateway -> Auth_Service -> Core_Banking.", status: "success" }),
      JSON.stringify({ type: "log", action: "VULNERABILITY_CHECK", detail: "Analyzing 'StepUpAuth' logic in TransactionController.java against policy threshold ($10,000).", status: "warning" }),
      JSON.stringify({ type: "log", action: "COMPLIANCE_FAIL", detail: "Detected logic gap: High-value transactions bypass MFA if originating from trusted subnets.", status: "error" }),
      JSON.stringify({ type: "log", action: "REPORT_GEN", detail: "Compiling deficiency report and generating sequence diagram...", status: "success" }),
      JSON.stringify({ 
        type: "result", 
        data: { 
          score: 45, 
          effective: false, 
          summary: "The CIAM agent detected a critical logic flaw where step-up authentication is bypassed for internal subnets, violating Zero Trust policies for high-value transfers.", 
          gaps: ["MFA Bypass on Internal Subnets", "Hardcoded Trusted IP List"], 
          recommendations: ["Remove IP-based trust", "Enforce adaptive MFA globally"], 
          scenario: "CIAM_LOGIC_GAP" 
        } 
      })
    ];

    for (const log of mockLogs) {
      await delay(800 + Math.random() * 500); // Realistic typing delay
      yield log + "\n";
    }
  }
}