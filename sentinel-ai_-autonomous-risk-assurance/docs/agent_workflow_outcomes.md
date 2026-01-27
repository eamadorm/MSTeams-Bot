# Agent Workflow, Integrations & Outcomes

This document details the operational behavior of the Sentinel AI agents, the specific systems they integrate with, and the tangible outcomes produced for the business.

---

## 1. The Operational Workflow

The autonomous agent follows a standard audit lifecycle, compressed from weeks into seconds.

### Stage 1: Trigger
*   **Scheduled:** e.g., "Run every Monday at 2:00 AM."
*   **Event-Driven:** e.g., "Webhook received: New Admin User Created in Okta."
*   **Manual:** Auditor clicks "Deploy Agent" in Dashboard.

### Stage 2: Ingest & Plan
The agent analyzes the request and breaks it down:
*   *Context:* "I am checking Control 4.1 (Access Management)."
*   *Plan:* "I need data from the HR system (Workday) and the IDP (Okta) to compare active status."

### Stage 3: Autonomous Execution (The "Black Box")
The agent performs the work without human aid:
1.  **Data Retrieval:** Queries APIs to fetch live data (JSON).
2.  **Reasoning:** Compares data against logic (e.g., Benford's Law, Policy Documents).
3.  **Validation:** If data looks ambiguous, it runs a secondary check (e.g., "Check Jira for an approval ticket regarding this anomaly").

### Stage 4: Reporting
The agent synthesizes findings into a structured `AuditResult` object and generates a human-readable summary.

---

## 2. Integrations Map

Sentinel AI agents are designed to plug into the modern enterprise stack.

| Integration | Category | Data Accessed | Used By Agent |
| :--- | :--- | :--- | :--- |
| **Okta / Google Cloud Identity** | Identity (IAM) | User roles, group memberships, last login times. | `IAM_ASSURANCE` |
| **Workday / BambooHR** | HRIS | Employment status, termination dates, department codes. | `IAM_ASSURANCE`, `ANOMALY_DETECTION` |
| **Splunk / Datadog** | Observability | System logs, auth failures, deployment events. | `EVIDENCE_COLLECTION` |
| **Jira / ServiceNow** | ITSM | Change tickets, approval workflows, incident reports. | `EVIDENCE_COLLECTION` |
| **Google Cloud** | Infrastructure | Cloud Audit Logs, VPC Flow Logs. | `GENERIC_AUDIT` |
| **SAP / Oracle ERP** | Financials | General Ledger, AP Subledger, Vendor Master. | `ANOMALY_DETECTION` |
| **BigQuery** | Data Warehouse | Aggregated business data for heavy analytics. | All Agents |

---

## 3. Agent Capabilities & Outcomes

### A. Access Control Effectiveness Agent
*   **Task:** Ensure the "Right People have the Right Access."
*   **Action:** Graph analysis of finding users with toxic combinations of permissions.
*   **Outcome:** 
    *   **Orphan Detection:** List of active accounts belonging to terminated employees.
    *   **SoD Matrix:** Visual graph of conflicting permissions.
    *   **Reduction:** 90% reduction in manual user access review time.

### B. Audit Evidence Collection Agent
*   **Task:** Prove that "If it changed, it was approved."
*   **Action:** Matches production server logs to ticketing system approvals.
*   **Outcome:** 
    *   **Population Testing:** 100% of changes verified (vs. 25 sample tickets).
    *   **Chain of Custody:** SHA-256 hashed evidence packages ready for external auditors (KPMG/EY/PwC).
    *   **Deficiency Memo:** Auto-drafted memo for unauthorized changes.

### C. Transaction Anomaly Detection Agent
*   **Task:** Detect fraud and error in financial flows.
*   **Action:** Applies statistical forensics (Z-Score, Benford's Law) to the General Ledger.
*   **Outcome:**
    *   **Fraud Alert:** Immediate flag for "Structuring" (payments just below approval limits).
    *   **Ghost Vendor Report:** Fuzzy matching of Vendor Bank Accounts vs. Employee Bank Accounts.
    *   **Cost Savings:** Prevention of duplicate payments and fraudulent disbursements.

---

## 4. The Business Value (ROI)

1.  **Continuous Compliance:** Moving from "Point-in-Time" (Audited once a year) to "Continuous" (Audited every day).
2.  **Risk Reduction:** Finding the "needle in the haystack" that sampling misses.
3.  **Audit Fee Reduction:** Reducing the hours billable by external auditors for data gathering and sample testing.