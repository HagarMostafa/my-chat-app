// pages/chat.js
import { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from './chat.module.css'; // Import your CSS styles

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("chat message", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    // Emit the message to the server
    socket.emit("chat message", message);

    // Clear the input field
    setMessage("");
  };

  return (
<div>
      <ul>
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`${styles.message} ${msg.sentByCurrentUser ? styles.me : styles.other}`}
          >
            {msg.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
