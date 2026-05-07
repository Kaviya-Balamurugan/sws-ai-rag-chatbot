import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const sendMessage = async () => {

    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question
    };

    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    const currentQuestion = question;

    setQuestion("");

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
        text: "Something went wrong."
      };

      setMessages(prev => [...prev, errorMessage]);

      console.log(error);
    }

    setLoading(false);
  };

  // Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="container">

      <h1>SWS AI Assistant</h1>

      <div className="chat-box">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`message ${msg.role}`}
          >

            <div className="message-content">
              {msg.text}
            </div>

            {msg.sources && (
              <div className="sources">
                Sources:
                {" "}
                {msg.sources.join(", ")}
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="message bot">
            <div className="message-content">
              Thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>

      </div>

      <div className="input-area">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask company questions..."
        />

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>

      </div>

    </div>
  );
}

export default App;