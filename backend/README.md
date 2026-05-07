# SWS AI RAG Chatbot

A premium Retrieval-Augmented Generation (RAG) chatbot built using FastAPI, LangChain, ChromaDB, React, and Ollama.

The chatbot answers company-related questions using uploaded PDF documents and displays the source documents used to generate each response.

---

# Features

- RAG-based chatbot architecture
- PDF ingestion pipeline
- Semantic retrieval using embeddings
- Chroma vector database
- Local LLM inference using Ollama
- Source attribution
- Hallucination prevention
- Premium enterprise-style chat UI
- Responsive frontend design
- Typing animation
- Suggested prompts
- FastAPI backend API

---

# Tech Stack

## Backend
- Python
- FastAPI
- LangChain
- ChromaDB
- Ollama

## Frontend
- React
- Vite
- Axios

## Embedding Model
- sentence-transformers/all-MiniLM-L6-v2

## LLM
- phi3 via Ollama

---

# RAG Architecture

PDF Documents  
↓  
Text Extraction  
↓  
Chunking  
↓  
Embeddings  
↓  
Chroma Vector DB  
↓  
User Question  
↓  
Semantic Retrieval  
↓  
LLM + Retrieved Context  
↓  
Grounded Answer + Sources

---

# How It Works

1. Company PDF documents are loaded and parsed.
2. Documents are split into smaller chunks using RecursiveCharacterTextSplitter.
3. Each chunk is converted into embeddings using MiniLM embeddings.
4. Embeddings are stored in ChromaDB.
5. User questions are embedded using the same embedding model.
6. Top-k relevant chunks are retrieved using semantic similarity search.
7. Retrieved context is passed to the Phi-3 language model through Ollama.
8. The chatbot generates grounded answers only from retrieved context.
9. Source documents are returned for transparency.

---

# Chunking Strategy

Used:

```python
RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
Why?
Prevents context loss
Maintains semantic continuity
Improves retrieval quality
Optimized for RAG pipelines

Embedding Model Choice

Used:

sentence-transformers/all-MiniLM-L6-v2
Why?
Lightweight
Fast inference
Good semantic similarity performance
Works efficiently for local RAG systems
Vector Database Choice

Used:

ChromaDB
Why?
Easy local setup
Fast vector similarity search
No external cloud dependency
Excellent LangChain integration
Ideal for prototypes and hackathons
Retrieval Strategy

Used:

k=3
Why?
Balanced context retrieval
Reduces irrelevant chunks
Improves answer quality
Faster inference
Prompt Design

The LLM is instructed to:

Answer only from retrieved context
Avoid hallucinations
Return fallback response if information is unavailable

Fallback response:

"I don't have that information in the company documents."
Hallucination Prevention

The chatbot avoids generating unsupported information by restricting the LLM to retrieved context only.

If information is not found in the documents, the chatbot responds with a fallback message instead of inventing answers.

Project Structure
sws-ai-rag-chatbot/
│
├── backend/
│   ├── app.py
│   ├── ingest.py
│   ├── data/
│   ├── chroma_db/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│
├── README.md
Backend Setup
Clone Repository
git clone https://github.com/Kaviya-Balamurugan/sws-ai-rag-chatbot.git
Create Virtual Environment
python -m venv .venv
Activate Environment
Windows
.venv\Scripts\activate
Mac/Linux
source .venv/bin/activate
Install Backend Dependencies
pip install fastapi uvicorn langchain langchain-community langchain-text-splitters chromadb sentence-transformers pypdf python-dotenv ollama
Ollama Setup

Install Ollama:

https://ollama.com/download

Pull Phi-3 model:

ollama run phi3
Document Ingestion

Place all company PDFs inside:

backend/data/

Run ingestion pipeline:

python ingest.py

This will:

parse PDFs
split into chunks
generate embeddings
create Chroma vector database
Run Backend

Inside backend folder:

uvicorn app:app --reload

Backend runs at:

http://127.0.0.1:8000

Swagger Docs:

http://127.0.0.1:8000/docs
Frontend Setup

Inside frontend folder:

Install dependencies
npm install
npm install axios
Run Frontend
npm run dev

Frontend runs at:

http://localhost:5173
API Endpoint
POST /api/chat
Request
{
  "question": "What is the leave policy?"
}
Response
{
  "answer": "Employees receive 18 earned leaves annually...",
  "sources": [
    "SWS-AI-leave-policy.pdf"
  ]
}
Frontend Features
Premium glassmorphism UI
Typing animation
Auto-scroll
Suggested prompts
Responsive layout
Source attribution pills
Enter-key support
White & blue enterprise theme
Livvic font
Example Questions
What is the leave policy?
What are the health insurance benefits?
What is the resignation process?
What is the compensation package?
What are the onboarding rules?
Future Improvements
Streaming responses
Authentication
Chat history persistence
Docker support
Cloud deployment
Hybrid search
Role-based access
Author

Kaviya Balamurugan