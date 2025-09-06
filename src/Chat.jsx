import { useState } from "react";
import "./Chat.css";
import logo from "./tklogo.png"; // 👉 thay logo.png bằng ảnh logo cá nhân của bạn trong src/

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://tkbot-loap.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Trích xuất câu trả lời từ Gemini
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Lỗi AI";

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error("Frontend error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Lỗi server hoặc kết nối" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={logo} alt="Logo" className="chat-logo" />
        <span> Tài Kind Chat</span>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <b>{m.role === "user" ? "Bạn" : "NTC-AI"}:</b>
            <p className="msg-text">{m.text}</p>
          </div>
        ))}
        {loading && <div className="message bot">⏳ Đợi tí...</div>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
