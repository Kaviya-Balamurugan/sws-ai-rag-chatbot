from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

import os
import shutil


DATA_PATH = "data/"
CHROMA_PATH = "chroma_db"


if os.path.exists(CHROMA_PATH):
    shutil.rmtree(CHROMA_PATH)

documents = []


for file in os.listdir(DATA_PATH):

    if file.endswith(".pdf"):

        print(f"Loading: {file}")

        loader = PyPDFLoader(
            os.path.join(DATA_PATH, file)
        )

        docs = loader.load()

        for doc in docs:
            doc.metadata["source"] = file

        documents.extend(docs)

print(f"Loaded {len(documents)} pages")

print("Splitting documents into chunks...")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

chunks = text_splitter.split_documents(documents)

for i, chunk in enumerate(chunks):
    chunk.metadata["chunk_id"] = i

print(f"Created {len(chunks)} chunks")

print("Loading embedding model...")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


print("Creating Chroma vector database...")

db = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    persist_directory=CHROMA_PATH
)

db.persist()

print("Vector database created successfully!")