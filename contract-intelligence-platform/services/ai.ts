
import { GoogleGenAI, Type } from "@google/genai";
import { Contract } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SmartFilterResponse {
  filterReasoning: string;
  filteredIds: string[];
  answer: string;
}

export interface KeyClause {
  type: string;
  originalText: string;
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface PortfolioInsight {
  title: string;
  description: string;
  category: 'risk' | 'milestone' | 'compliance' | 'optimization';
  priority: 'High' | 'Medium' | 'Low';
}

export const queryContracts = async (query: string, contracts: Contract[]): Promise<SmartFilterResponse> => {
  const context = contracts.map(c => ({
    id: c.id,
    title: c.contractTitle,
    type: c.contractType,
    parties: c.parties,
    risk: c.riskScore,
    law: c.governingLaw,
    summary: c.executiveSummary,
    expires: c.expirationDate
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      User Query: "${query}"
      
      Contract Data: ${JSON.stringify(context)}
      
      Task:
      1. Analyze the user query against the contract data.
      2. If the user is looking for specific contracts (e.g., "high risk", "NY law", "expiring soon"), identify their IDs.
      3. Provide a concise narrative answer to the user's question.
      4. Explain your reasoning for the filter.
      
      Return the result strictly in JSON format.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          filterReasoning: { type: Type.STRING },
          filteredIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          answer: { type: Type.STRING }
        },
        required: ["filterReasoning", "filteredIds", "answer"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as SmartFilterResponse;
};

export const getContractInsights = async (contracts: Contract[]): Promise<PortfolioInsight[]> => {
  const summary = contracts.map(c => `${c.contractTitle} (${c.contractType}): Risk ${c.riskScore}`).join(', ');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide 3 strategic insights for a legal team based on this contract portfolio: ${summary}. Each insight should have a short punchy title and a one-sentence description. Use categories: risk, milestone, compliance, or optimization.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['risk', 'milestone', 'compliance', 'optimization'] },
            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
          },
          required: ["title", "description", "category", "priority"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse portfolio insights", e);
    return [];
  }
};

export const extractKeyClauses = async (contract: Contract): Promise<KeyClause[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Analyze this contract metadata and extract realistic simulated clauses for:
      1. Limitation of Liability
      2. Termination
      3. Force Majeure
      
      Contract Details:
      Title: ${contract.contractTitle}
      Type: ${contract.contractType}
      Industry: ${contract.industryTrack}
      Risk Score: ${contract.riskScore}
      
      Return a JSON array of objects with 'type', 'originalText' (the verbatim legal-sounding text), 'summary' (plain english explanation), and 'riskLevel' (Low, Medium, or High).
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            originalText: { type: Type.STRING },
            summary: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
          },
          required: ["type", "originalText", "summary", "riskLevel"]
        }
      }
    }
  });

  try {
      return JSON.parse(response.text || '[]');
  } catch (e) {
      console.error("Failed to parse clauses", e);
      return [];
  }
};
