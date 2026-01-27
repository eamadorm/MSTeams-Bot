
export type IndustryTrack = "All" | "Financial Services" | "Healthcare" | "Manufacturing" | "Base";

export interface Contract {
  id: string;
  fileName: string;
  fileUrl: string;
  industryTrack: IndustryTrack;
  contractTitle: string;
  contractType: "MSA" | "ISDA" | "BAA" | "NDA" | "Lease" | "Loan Covenant" | "Payer Contract" | "Supply Agreement" | "Equipment Lease" | "Logistics Contract" | "Other";
  parties: string[];
  agreementDate: string;
  effectiveDate: string;
  expirationDate: string;
  governingLaw: string;
  executiveSummary: string;
  riskAnalysis: string;
  riskScore: number;
  isConfidential: boolean;
  renewalTerms: string;
  terminationTerms: string;
  liabilityTerms: string;
  tags: string[];
  industrySpecific: { [key: string]: any };
}
