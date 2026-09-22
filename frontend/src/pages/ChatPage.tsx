import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/apiClient";
import type { Conversation, Message } from "../types";

type Props = {
  navigate: (to: string) => void;
};

export default function ChatPage({ navigate }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const data = await apiFetch<Conversation[]>("/conversations");
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const data = await apiFetch<Message[]>(`/conversations/${conversationId}/messages`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    await fetchMessages(conv.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedConversation) return;
    try {
      await apiFetch(`/conversations/${selectedConversation.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      setContent("");
      await fetchMessages(selectedConversation.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    try {
      const conv = await apiFetch<Conversation>(`/conversations/${newUsername}`, {
        method: "POST",
      });
      setNewUsername("");
      await fetchConversations();
      await handleSelectConversation(conv);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="chat-page">
      <div className="chat-sidebar">
        <h2>チャット</h2>
        <form onSubmit={handleStartConversation} className="new-chat-form">
          <input
            type="text"
            placeholder="ユーザー名を入力"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button type="submit">開始</button>
        </form>
        <ul className="conversation-list">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={`conversation-item ${selectedConversation?.id === conv.id ? "active" : ""}`}
              onClick={() => handleSelectConversation(conv)}
            >
              <span>{conv.userOne.displayName} & {conv.userTwo.displayName}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  <span className="chat-message-sender">{msg.sender.displayName}</span>
                  <p className="chat-message-content">{msg.content}</p>
                  <span className="chat-message-time">
                    {new Date(msg.createdAt).toLocaleString("ja-JP")}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chat-form">
              <input
                type="text"
                placeholder="メッセージを入力"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button type="submit" disabled={!content.trim()}>
                送信
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <p>会話を選択してください</p>
          </div>
        )}
      </div>
    </main>
  );
}