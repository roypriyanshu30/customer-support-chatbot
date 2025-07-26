// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// src/App.tsx
import React from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import { ChatProvider } from "./context/ChatContext";

const App = () => (
  <ChatProvider>
    <div className="flex h-screen">
      <Sidebar />
      <ChatWindow />
    </div>
  </ChatProvider>
);

export default App;


// src/components/ChatWindow.tsx
import React from "react";
import MessageList from "./MessageList";
import UserInput from "./UserInput";

const ChatWindow = () => (
  <div className="flex flex-col flex-1 bg-gray-100 p-4">
    <MessageList />
    <UserInput />
  </div>
);

export default ChatWindow;


// src/components/MessageList.tsx
import React from "react";
import { useChat } from "../context/ChatContext";
import Message from "./Message";

const MessageList = () => {
  const { messages } = useChat();

  return (
    <div className="flex-1 overflow-y-auto mb-4">
      {messages.map((msg, idx) => (
        <Message key={idx} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
};

export default MessageList;


// src/components/Message.tsx
import React from "react";

const Message = ({ text, sender }: { text: string; sender: string }) => {
  const isUser = sender === "user";
  return (
    <div className={`mb-2 ${isUser ? "text-right" : "text-left"}`}>
      <span
        className={`inline-block px-4 py-2 rounded-xl max-w-[60%] ${
          isUser ? "bg-blue-500 text-white ml-auto" : "bg-white text-black mr-auto"
        }`}
      >
        {text}
      </span>
    </div>
  );
};

export default Message;


// src/components/UserInput.tsx
import React, { useState } from "react";
import { useChat } from "../context/ChatContext";

const UserInput = () => {
  const [input, setInput] = useState("");
  const { sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <form className="flex" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
      >
        Send
      </button>
    </form>
  );
};

export default UserInput;


// src/components/Sidebar.tsx
import React from "react";
import { useChat } from "../context/ChatContext";

const Sidebar = () => {
  const { conversationHistory, loadConversation } = useChat();

  return (
    <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>
      {conversationHistory.map((conv, idx) => (
        <div
          key={idx}
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => loadConversation(idx)}
        >
          Conversation {idx + 1}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;


// src/context/ChatContext.tsx
import React, { createContext, useContext, useState } from "react";

type Message = {
  text: string;
  sender: "user" | "ai";
};

type Conversation = Message[];

type ChatContextType = {
  messages: Message[];
  sendMessage: (text: string) => void;
  conversationHistory: Conversation[];
  loadConversation: (idx: number) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Conversation[]>([]);

  const sendMessage = (text: string) => {
    const userMsg: Message = { text, sender: "user" };
    const aiMsg: Message = {
      text: `Echo: ${text}`,
      sender: "ai",
    };
    const newMessages = [...messages, userMsg, aiMsg];
    setMessages(newMessages);
    setHistory((prev) => [...prev, newMessages]);
  };

  const loadConversation = (idx: number) => {
    setMessages(history[idx]);
  };

  return (
    <ChatContext.Provider
      value={{ messages, sendMessage, conversationHistory: history, loadConversation }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
