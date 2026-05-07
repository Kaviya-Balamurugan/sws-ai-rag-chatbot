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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding_model
)

class ChatRequest(BaseModel):
    question: str

@app.get("/")
def home():
    return {
        "message": "RAG Chatbot Running"
    }

@app.post("/api/chat")
def chat(req: ChatRequest):

    results = db.similarity_search(req.question, k=4)

    context = "\n\n".join([
        doc.page_content for doc in results
    ])

    sources = list(set([
        doc.metadata.get("source", "Unknown")
        for doc in results
    ]))

    prompt = f"""
You are a company policy assistant chatbot.

Answer ONLY using the provided context.

If the answer is not in the context, say:
"I don't have that information in the company documents."

Context:
{context}

Question:
{req.question}
"""

    response = ollama.chat(
    model="llama3",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]
)
    answer = response["message"]["content"]

    return {
        "answer": answer,
        "sources": sources
    }