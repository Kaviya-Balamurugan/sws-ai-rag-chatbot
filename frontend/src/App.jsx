import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const sendMessage = async () => {

    if (!question.trim()) return;

    const currentQuestion = question;

    const userMessage = {
      role: "user",
      text: currentQuestion
    };

    setMessages(prev => [...prev, userMessage]);

    setQuestion("");
    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat",
        {
          question: currentQuestion
        }
      );

      const botMessage = {
        role: "bot",
        text: response.data.answer,
        sources: response.data.sources
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {

      const errorMessage = {
        role: "bot",
        text: "Something went wrong while processing your request."
      };

      setMessages(prev => [...prev, errorMessage]);

      console.log(error);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app-bg">

      <div className="glass-overlay"></div>

      <div className="container">

        <div className="header">

          <div>
            <h1>SWS AI Assistant</h1>

            <p>
              Enterprise RAG Chatbot powered by FastAPI,
              ChromaDB and Ollama
            </p>
          </div>

          <div className="status-badge">
            ● AI Online
          </div>

        </div>

        <div className="chat-box">

          {messages.length === 0 && (

            <div className="welcome-card">

              <h2>Welcome 👋</h2>

              <p>
                Ask questions related to company policies,
                onboarding, compensation, leave policy,
                HR rules, IT security, benefits and more.
              </p>

              <div className="suggestions">

                <div
                  className="suggestion"
                  onClick={() =>
                    setQuestion("What is the leave policy?")
                  }
                >
                  What is the leave policy?
                </div>

                <div
                  className="suggestion"
                  onClick={() =>
                    setQuestion("What are the health benefits?")
                  }
                >
                  What are the health benefits?
                </div>

                <div
                  className="suggestion"
                  onClick={() =>
                    setQuestion("What is the resignation process?")
                  }
                >
                  What is the resignation process?
                </div>

              </div>

            </div>
          )}

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`message ${msg.role}`}
            >

              <div className="message-content">
                {msg.text}
              </div>

              {msg.sources &&
               msg.sources.length > 0 &&
               !msg.text.includes(
                 "I don't have that information"
               ) && (

                <div className="sources">

                  <span>Sources:</span>

                  {msg.sources.map((src, i) => (

                    <div
                      key={i}
                      className="source-pill"
                    >
                      {src}
                    </div>

                  ))}

                </div>
              )}

            </div>
          ))}

          {loading && (

            <div className="message bot">

              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>
          )}

          <div ref={chatEndRef}></div>

        </div>

        <div className="input-area">

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask company-related questions..."
          />

          <button
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;