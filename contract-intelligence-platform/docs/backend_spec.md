# Backend Integration Specification

## 1. Recommended Tech Stack
*   **Runtime:** Node.js (TypeScript) or Python (FastAPI).
*   **Database:** PostgreSQL (for structured metadata).
*   **Vector DB:** Pinecone or Weaviate (for semantic document search/RAG).
*   **AI Orchestration:** LangChain or LlamaIndex.
*   **Storage:** AWS S3 or Google Cloud Storage (for raw PDF files).
*   **Auth:** Auth0 or Clerk.

## 2. Data Models

### 2.1 Contract (PostgreSQL)
```sql
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    title VARCHAR(255) NOT NULL,
    contract_type VARCHAR(50),
    industry VARCHAR(50),
    risk_score INT CHECK (risk_score >= 0 AND risk_score <= 10),
    effective_date DATE,
    expiration_date DATE,
    governing_law VARCHAR(100),
    metadata JSONB -- For industry-specific fields
);
```

### 2.2 Clause (PostgreSQL)
```sql
CREATE TABLE clauses (
    id UUID PRIMARY KEY,
    contract_id UUID REFERENCES contracts(id),
    type VARCHAR(100), -- e.g., 'Limitation of Liability'
    summary TEXT,
    original_text TEXT,
    risk_level VARCHAR(10), -- Low, Medium, High
    page_number INT
);
```

## 3. API Endpoints (REST)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/contracts/upload` | Upload PDF and trigger AI extraction pipeline. |
| `GET` | `/api/contracts` | List all contracts (with filtering). |
| `GET` | `/api/contracts/:id` | Detailed metadata and clauses for one contract. |
| `POST` | `/api/ai/query` | Submit NLQ string and get filtered IDs + narrative. |
| `PATCH` | `/api/contracts/:id/tags` | Update tags for a contract. |

## 4. AI Pipeline Architecture
1.  **Ingestion:** User uploads PDF.
2.  **OCR/Parsing:** Text extracted using Google Document AI or Gemini Multimodal.
3.  **Extraction:** Gemini Pro analyzes text to populate `contracts` and `clauses` tables.
4.  **Embedding:** Contract chunks are converted to vectors and stored in the Vector DB.
5.  **Retrieval:** When user asks a question, the backend performs a similarity search in the Vector DB and feeds the context to Gemini for a final answer.
