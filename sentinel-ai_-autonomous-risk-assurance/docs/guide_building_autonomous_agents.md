# Engineering Guide: Building Autonomous Risk Agents

This document outlines the technical roadmap for constructing the autonomous agents demonstrated in Sentinel AI. It bridges the gap between a standard LLM chatbot and an agent capable of performing rigorous audit tasks.

---

## Phase 1: Definition & Persona Design

Before writing code, we must define the agent's narrow scope. Generalist agents fail at auditing; specialist agents succeed.

### Step 1.1: Define the "Job to be Done"
Example for **IAM Assurance Agent**:
*   **Goal:** Verify no user has "Toxic Combinations" of access (e.g., Create Vendor + Pay Vendor).
*   **Persona:** Forensic Security Analyst.
*   **Tone:** Skeptical, precise, technical.

### Step 1.2: The "Constitution" (System Prompt)
We craft a System Instruction that acts as the agent's immutable rules of engagement.
*   *Constraint:* "You are read-only. You must never modify data."
*   *Constraint:* "You must cite the specific log ID for every finding."
*   *Constraint:* "You must output reasoning before conclusion (Chain-of-Thought)."

---

## Phase 2: The Toolbelt (Function Calling)

An autonomous agent differs from a chat bot because it can "touch" external systems. We use **Google Gemini Enterprise Function Calling**.

### Step 2.1: Define Tools (OpenAPI Specs)
We define the functions the agent *can* call.

```typescript
// Tool Definition Example
const tools = [
  {
    name: "fetch_user_entitlements",
    description: "Retrieves a list of all groups and roles assigned to a specific user email.",
    parameters: {
      type: "object",
      properties: {
        email: { type: "string" },
        system: { type: "string", enum: ["Okta", "ActiveDirectory"] }
      },
      required: ["email", "system"]
    }
  },
  {
    name: "query_splunk_logs",
    description: "Searches SIEM logs for specific event codes within a time window.",
    parameters: { ... }
  }
];
```

### Step 2.2: The Tool Execution Layer
When Gemini returns a `functionCall`, our backend must execute the actual logic:
1.  **Parse** the arguments provided by the LLM.
2.  **Authenticate** against the real API (e.g., Okta SDK, Splunk REST API).
3.  **Execute** the query.
4.  **Return** the JSON result back to Gemini's context window.

---

## Phase 3: The Cognitive Loop (ReAct)

We implement a "Reason + Act" loop to allow the agent to navigate complex problems.

### Step 3.1: The Loop Logic
1.  **User Input:** "Check J.Doe for SoD violations."
2.  **Model Think:** "I need to know J.Doe's roles first." -> *Calls `fetch_user_entitlements`*.
3.  **System Action:** Returns `["Finance_Admin", "Procurement_Viewer"]`.
4.  **Model Think:** "Finance_Admin allows payment approval. I need to check if Procurement_Viewer allows vendor creation. I will query the policy database." -> *Calls `query_policy_db`*.
5.  **System Action:** Returns "No, Procurement_Viewer is read-only."
6.  **Model Final Answer:** "J.Doe does not have an SoD violation."

---

## Phase 4: Output & Structured Reporting

Auditors cannot use free-text chat. They need structured data for compliance.

### Step 4.1: JSON Mode Enforcement
We configure the model to output strictly in JSON schemas.
*   **Schema:** `AssessmentResult`
*   **Fields:** `status` (Pass/Fail), `evidence_hash`, `methodology`, `timestamp`.

### Step 4.2: Cryptographic Signing
To ensure "Chain of Custody":
1.  Take the Agent's final JSON output.
2.  Concatenate with the raw log data returned from the Tools.
3.  Generate a SHA-256 Hash.
4.  Store this hash in a WORM (Write Once, Read Many) ledger.

---

## Phase 5: Implementation Checklist

| Component | Technology | Status |
| :--- | :--- | :--- |
| **Model** | Gemini Enterprise 1.5 Pro (High Reasoning) | ✅ Selected |
| **Orchestration** | LangChain or Custom Loop | 🔲 In Development |
| **Identity** | Service Account with Read-Only Scopes | 🔲 In Development |
| **Vector DB** | Pinecone/Chroma (for Policy RAG) | 🔲 In Development |
| **Frontend** | React + Streaming UI | ✅ Completed |