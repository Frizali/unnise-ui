import { useState } from "react";

const PRIORITY_META = {
  high: { label: "High", bg: "#fee2e2", color: "#dc2626" },
  medium: { label: "Medium", bg: "#fef3c7", color: "#d97706" },
  low: { label: "Low", bg: "#dcfce7", color: "#16a34a" },
};

export function AddCardModal({ columnId, onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("medium");

  function generateId() {
    return "c" + Math.random().toString(36).slice(2, 9);
  }

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      id: generateId(),
      title: title.trim(),
      desc: desc.trim(),
      column: columnId,
      priority,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1e1e2e",
          borderRadius: 16,
          padding: 28,
          width: 380,
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 20px",
            color: "#e2e8f0",
            fontFamily: "'Sora', sans-serif",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          Add New Card
        </h3>

        <label
          style={{
            display: "block",
            marginBottom: 6,
            color: "#94a3b8",
            fontSize: 11,
            fontFamily: "monospace",
            letterSpacing: 1,
          }}
        >
          TITLE *
        </label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Card title..."
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            background: "#2a2a3e",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            fontSize: 14,
            fontFamily: "'Sora', sans-serif",
            outline: "none",
            marginBottom: 16,
            boxSizing: "border-box",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: 6,
            color: "#94a3b8",
            fontSize: 11,
            fontFamily: "monospace",
            letterSpacing: 1,
          }}
        >
          DESCRIPTION
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Optional description..."
          rows={3}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            background: "#2a2a3e",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            fontSize: 14,
            fontFamily: "'Sora', sans-serif",
            outline: "none",
            marginBottom: 16,
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: 8,
            color: "#94a3b8",
            fontSize: 11,
            fontFamily: "monospace",
            letterSpacing: 1,
          }}
        >
          PRIORITY
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["low", "medium", "high"].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 8,
                border: "1px solid",
                borderColor:
                  priority === p
                    ? PRIORITY_META[p].color
                    : "rgba(255,255,255,0.1)",
                background:
                  priority === p
                    ? PRIORITY_META[p].color + "22"
                    : "transparent",
                color: priority === p ? PRIORITY_META[p].color : "#64748b",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'Sora', sans-serif",
                fontWeight: priority === p ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {PRIORITY_META[p].label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "#64748b",
              cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: 8,
              border: "none",
              background: title.trim()
                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                : "#2a2a3e",
              color: title.trim() ? "#fff" : "#475569",
              cursor: title.trim() ? "pointer" : "not-allowed",
              fontFamily: "'Sora', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.15s",
            }}
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}
