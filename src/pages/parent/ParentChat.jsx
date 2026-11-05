import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import ParentChildBar from "../../components/ParentChildBar";
import { parentData } from "../../data/parentData";
import "../../styles/parent.css";

// Nielsen H6 Recognition over Recall: Quick Message Presets
const MESSAGE_PRESETS = [
  "Thank you for the thorough exam feedback!",
  "Could we clarify the homework assignment for Thursday?",
  "Ahmed practiced the recommended exercises this weekend.",
  "Just confirming our scheduled conference appointment.",
];

export default function ParentChat() {
  const { teacherId } = useParams();
  const navigate = useNavigate();

  const [activeChildId, setActiveChildId] = useState(() => {
    return localStorage.getItem("parent_active_child") || "ahmed";
  });

  const handleSelectChild = (id) => {
    setActiveChildId(id);
    localStorage.setItem("parent_active_child", id);
  };

  const child =
    parentData.children.find((c) => c.id === activeChildId) ||
    parentData.children[0];

  const selectedTeacher =
    child.teachers.find((t) => t.id === teacherId) || child.teachers[0];

  const [messages, setMessages] = useState(() => {
    return child.chatMessages?.[selectedTeacher.id] || [];
  });

  const [inputVal, setInputVal] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const thread = child.chatMessages?.[selectedTeacher.id] || [];
    setMessages(thread);
  }, [selectedTeacher.id, activeChildId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputVal.trim() || isSending) return;

    setIsSending(true);

    setTimeout(() => {
      const newMsg = {
        id: Date.now(),
        sender: "parent",
        text: inputVal.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newMsg]);
      setInputVal("");
      setIsSending(false);
    }, 250);
  };

  const teacherInitials = selectedTeacher.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div className="parent-page-wrapper">
      <Header role="parent" />
      <ParentChildBar
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        showBack={true}
        backTo="/parent/teachers"
        breadcrumbText={`Chat with ${selectedTeacher.name}`}
      />

      <main className="parent-container">
        {/* Hero Banner: Teacher Name (Item 1 Core Action) */}
        <section className="wireframe-hero">
          <h2 className="wireframe-hero-title">{selectedTeacher.name}</h2>
          <p className="wireframe-hero-subtitle">
            {selectedTeacher.subject} Teacher • {selectedTeacher.room} • Liaison regarding{" "}
            <strong>{child.name}</strong>
          </p>
        </section>

        {/* Section: Message */}
        <section className="parent-card !p-0 overflow-hidden">
          <div className="parent-card-header px-6 pt-5 pb-3 bg-white">
            <h3 className="parent-card-title">Message Channel (P5)</h3>
            <span className="text-xs font-semibold text-forest/70">
              Direct line regarding {child.name}
            </span>
          </div>

          <div className="chat-window !border-0 !rounded-none">
            {/* Messages Scroll Area */}
            <div className="chat-messages-scroll">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-forest/50 text-xs">
                  No previous messages. Send a message to start the conversation!
                </div>
              ) : (
                messages.map((msg) => {
                  const isParent = msg.sender === "parent";
                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${
                        isParent ? "chat-bubble-row-parent" : "chat-bubble-row-teacher"
                      }`}
                    >
                      <div
                        className={`chat-avatar-mini ${
                          isParent ? "bg-forest" : "bg-sage"
                        }`}
                      >
                        {isParent ? "ME" : teacherInitials}
                      </div>

                      <div
                        className={`chat-bubble ${
                          isParent ? "chat-bubble-parent" : "chat-bubble-teacher"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="chat-time flex items-center justify-end gap-1">
                          <span>{msg.time}</span>
                          {isParent && <span>✓✓</span>}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips (Nielsen H6 Recognition) */}
            <div className="px-4 py-2 bg-cream/40 border-t border-sand/20 flex flex-wrap gap-1.5">
              {MESSAGE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInputVal(preset)}
                  className="suggestion-chip"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Input Bar with send button (KLM Efficiency Enter key) */}
            <form onSubmit={handleSendMessage} className="chat-input-bar">
              <input
                type="text"
                autoFocus
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={`Write a message to ${selectedTeacher.name}... (Press Enter to send)`}
                className="chat-input-field"
              />
              <button
                type="submit"
                disabled={isSending || !inputVal.trim()}
                className="chat-send-btn"
                title="Send Message"
                aria-label="Send Message"
              >
                {isSending ? (
                  <span className="loading-spinner text-cream" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
