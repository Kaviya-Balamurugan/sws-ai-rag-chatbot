# SWS AI RAG Chatbot

A Retrieval-Augmented Generation (RAG) chatbot built using FastAPI, LangChain, ChromaDB, React, and Ollama.

The chatbot answers company-related questions using uploaded PDF documents and displays the source documents used to generate each response.

---

# Features

- RAG-based architecture
- PDF document ingestion
- Semantic search using embeddings
- Chroma vector database
- Local LLM inference using Ollama
- Source attribution for transparency
- React chat interface
- FastAPI backend

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

# Chunking Strategy

Used RecursiveCharacterTextSplitter with:

- chunk_size = 500
- chunk_overlap = 50

Why?
- Prevents context loss
- Maintains semantic continuity
- Improves retrieval quality

---

# Embedding Model Choice

Used:
sentence-transformers/all-MiniLM-L6-v2

Why?
- Lightweight
- Fast
- Good semantic similarity performance
- Works well for local RAG systems

---

# Vector Database Choice

Used ChromaDB because:
- Simple local setup
- Fast semantic retrieval
- No external cloud dependency
- Easy integration with LangChain

---

# Retrieval Strategy

- Top-K retrieval = 3
- Retrieves most relevant document chunks using vector similarity search

---

# Prompt Design

The LLM is instructed to:
- Answer only using retrieved context
- Avoid hallucinations
- Return fallback response when information is unavailable

Fallback response:
"I don't have that information in the company documents."

---

# Backend Setup

## Create virtual environment

```bash
python -m venv .venv