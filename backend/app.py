from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

import ollama
from dotenv import load_dotenv

import os

load_dotenv()

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Embedding Model
# -----------------------------
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# -----------------------------
# Vector Database
# -----------------------------
db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding_model
)

# -----------------------------
# Request Schema
# -----------------------------
class ChatRequest(BaseModel):
    question: str

# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "SWS AI RAG Chatbot Running"
    }

# -----------------------------
# Chat Endpoint
# -----------------------------
@app.post("/api/chat")
def chat(req: ChatRequest):

    # Retrieve top-k chunks
    results = db.similarity_search(
        req.question,
        k=3
    )

    # Build context
    context = "\n\n".join([
        doc.page_content for doc in results
    ])

    # Extract source metadata
    sources = list(set([
        doc.metadata.get("source", "Unknown")
        for doc in results
    ]))

    # Prompt
    prompt = f"""
You are a company policy assistant chatbot.

Answer ONLY using the provided context.

If the answer is not available in the context,
reply exactly with:

"I don't have that information in the company documents."

Keep answers concise and professional.

Context:
{context}

Question:
{req.question}
"""

    # Local LLM via Ollama
    response = ollama.chat(
        model="phi3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    answer = response["message"]["content"]

    if "I don't have that information" in answer:
        sources = []
        
    return {
    "answer": answer,
    "sources": sources
}