import { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question
    };

    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat",
        {
          question
        }
      );

      const botMessage = {
        role: "bot",
        text: response.data.answer,
        sources: response.data.sources
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.log(error);
    }

    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="container">

      <h1>SWS AI Assistant</h1>

      <div className="chat-box">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={msg.role}
          >

            <p>{msg.text}</p>

            {msg.sources && (
              <div className="sources">
                Sources:
                {msg.sources.join(", ")}
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="bot">
            Thinking...
          </div>
        )}

      </div>

      <div className="input-area">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask company questions..."
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default App;