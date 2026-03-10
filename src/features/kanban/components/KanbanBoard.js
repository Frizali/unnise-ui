import { useState, useRef } from "react";
import { KanbanColumn } from "./KanbanColumn";

const INIT_COLUMNS = [
  { id: "todo", label: "To Do", color: "#6366f1" },
  { id: "inprogress", label: "In Progress", color: "#f59e0b" },
  { id: "review", label: "Review", color: "#8b5cf6" },
  { id: "done", label: "Done", color: "#10b981" },
];

const INITIAL_CARDS = [
  {
    id: "c1",
    title: "Design wireframes",
    desc: "Create initial mockups for all pages",
    column: "todo",
    priority: "high",
    position: 0,
  },
  {
    id: "c2",
    title: "Set up CI/CD pipeline",
    desc: "Configure GitHub Actions for deployment",
    column: "todo",
    priority: "medium",
    position: 1,
  },
  {
    id: "c3",
    title: "Build auth system",
    desc: "JWT-based authentication flow",
    column: "inprogress",
    priority: "high",
    position: 0,
  },
  {
    id: "c4",
    title: "Write unit tests",
    desc: "Coverage for core modules",
    column: "inprogress",
    priority: "low",
    position: 1,
  },
  {
    id: "c5",
    title: "API integration",
    desc: "Connect frontend to REST endpoints",
    column: "review",
    priority: "medium",
    position: 0,
  },
  {
    id: "c6",
    title: "Launch v1.0",
    desc: "Initial public release",
    column: "done",
    priority: "high",
    position: 0,
  },
];

const PRIORITY_META = {
  high: { label: "High", color: "#dc2626" },
  medium: { label: "Medium", color: "#d97706" },
  low: { label: "Low", color: "#16a34a" },
};

const MEMBERS = [
  { id: "m1", name: "Alice", avatar: "A", color: "#6366f1" },
  { id: "m2", name: "Bob", avatar: "B", color: "#f59e0b" },
  { id: "m3", name: "Carol", avatar: "C", color: "#10b981" },
  { id: "m4", name: "Dan", avatar: "D", color: "#8b5cf6" },
];

const SORT_OPTIONS = [
  { id: "none", label: "Default" },
  { id: "title_asc", label: "Title A → Z" },
  { id: "title_desc", label: "Title Z → A" },
  { id: "priority_high", label: "Priority: High first" },
  { id: "priority_low", label: "Priority: Low first" },
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function Dropdown({ onClose, children }) {
  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 200 }}
        onClick={onClose}
      />
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          zIndex: 201,
          background: "#1e1e2e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          minWidth: 210,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
}

function ToolbarButton({ icon, label, active, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => children && setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 8,
          border: `1px solid ${active ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`,
          background: active
            ? "rgba(99,102,241,0.15)"
            : "rgba(255,255,255,0.03)",
          color: active ? "#a5b4fc" : "#94a3b8",
          cursor: "pointer",
          fontSize: 13,
          fontFamily: "'Sora',sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        <span>{icon}</span>
        {label}
        {children && <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>}
      </button>
      {children && open && (
        <Dropdown onClose={() => setOpen(false)}>
          {typeof children === "function"
            ? children(() => setOpen(false))
            : children}
        </Dropdown>
      )}
    </div>
  );
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState(INIT_COLUMNS);
  const [cards, setCards] = useState(INITIAL_CARDS);

  const dragRef = useRef({ type: null, cardId: null, columnId: null });

  const [overCol, setOverCol] = useState(null);
  const [cardDropTarget, setCardDropTarget] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterPrios, setFilterPrios] = useState([]);
  const [filterMembers, setFilterMembers] = useState([]);
  const [sortBy, setSortBy] = useState("none");

  const addCard = (card) =>
    setCards((prev) => {
      const pos = prev.filter((c) => c.column === card.column).length;
      return [...prev, { ...card, position: pos }];
    });
  const deleteCard = (id) =>
    setCards((prev) => prev.filter((c) => c.id !== id));
  const moveToColumn = (cardId, colId) =>
    setCards((prev) => {
      const pos = prev.filter((c) => c.column === colId).length;
      return prev.map((c) =>
        c.id === cardId ? { ...c, column: colId, position: pos } : c,
      );
    });

  const handleColHeaderDragStart = (e, columnId) => {
    dragRef.current = { type: "column", columnId, cardId: null };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `col:${columnId}`);
  };

  const handleColHeaderDragEnd = () => {
    dragRef.current = { type: null, columnId: null, cardId: null };
    setOverCol(null);
  };

  const handleColDragOver = (colId) => {
    const d = dragRef.current;
    if (d.type === "column" && d.columnId !== colId) {
      setOverCol(colId);
    } else if (d.type === "card") {
      setOverCol(colId);
    }
  };

  const handleColDrop = (targetColId) => {
    const d = dragRef.current;
    if (d.type === "column") {
      const srcId = d.columnId;
      if (srcId && srcId !== targetColId) {
        setColumns((prev) => {
          const arr = [...prev];
          const si = arr.findIndex((c) => c.id === srcId);
          const ti = arr.findIndex((c) => c.id === targetColId);
          if (si === -1 || ti === -1) return prev;
          const [moved] = arr.splice(si, 1);
          arr.splice(ti, 0, moved);
          return arr;
        });
      }
      dragRef.current = { type: null, columnId: null, cardId: null };
      setOverCol(null);
    } else if (d.type === "card") {
      const srcId = d.cardId;
      if (srcId) {
        setCards((prev) => {
          const pos = prev.filter(
            (c) => c.column === targetColId && c.id !== srcId,
          ).length;
          return prev.map((c) =>
            c.id === srcId ? { ...c, column: targetColId, position: pos } : c,
          );
        });
      }
      dragRef.current = { type: null, columnId: null, cardId: null };
      setCardDropTarget(null);
      setOverCol(null);
    }
  };

  const handleCardDragStart = (e, cardId) => {
    dragRef.current = { type: "card", cardId, columnId: null };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `card:${cardId}`);
  };

  const handleCardDragEnd = () => {
    dragRef.current = { type: null, cardId: null, columnId: null };
    setCardDropTarget(null);
    setOverCol(null);
  };

  const handleCardDragOverCard = (targetCardId) => {
    const d = dragRef.current;
    if (d.type === "card" && d.cardId !== targetCardId) {
      setCardDropTarget(targetCardId);
    }
  };

  const handleCardDropOnCard = (targetCardId) => {
    const d = dragRef.current;
    if (d.type !== "card") return;
    const srcId = d.cardId;
    if (!srcId || srcId === targetCardId) {
      setCardDropTarget(null);
      return;
    }

    setCards((prev) => {
      const target = prev.find((c) => c.id === targetCardId);
      if (!target) return prev;
      const col = target.column;
      const src = prev.find((c) => c.id === srcId);
      if (!src) return prev;

      let siblings = prev
        .filter((c) => c.column === col && c.id !== srcId)
        .sort((a, b) => a.position - b.position);

      const insertAt = siblings.findIndex((c) => c.id === targetCardId);
      siblings.splice(insertAt, 0, { ...src, column: col });

      const reindexed = siblings.map((c, i) => ({ ...c, position: i }));
      return [
        ...prev.filter((c) => c.column !== col && c.id !== srcId),
        ...reindexed,
      ];
    });

    dragRef.current = { type: null, cardId: null, columnId: null };
    setCardDropTarget(null);
    setOverCol(null);
  };

  const getVisible = (colId) => {
    let r = cards
      .filter((c) => c.column === colId)
      .sort((a, b) => a.position - b.position);
    if (searchQuery.trim())
      r = r.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.desc.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    if (filterPrios.length)
      r = r.filter((c) => filterPrios.includes(c.priority));
    if (filterMembers.length)
      r = r.filter((c) => filterMembers.includes(c.assignee));
    if (sortBy === "title_asc")
      r = [...r].sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "title_desc")
      r = [...r].sort((a, b) => b.title.localeCompare(a.title));
    if (sortBy === "priority_high")
      r = [...r].sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
      );
    if (sortBy === "priority_low")
      r = [...r].sort(
        (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
      );
    return r;
  };

  const togglePrio = (p) =>
    setFilterPrios((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  const toggleMember = (id) =>
    setFilterMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const activeFilterCount = filterPrios.length + filterMembers.length;
  const isFiltered =
    !!searchQuery || activeFilterCount > 0 || sortBy !== "none";
  const doneCards = cards.filter((c) => c.column === "done").length;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 48px)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "24px 24px 40px",
          overflowX: "auto",
          alignItems: "flex-start",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          setOverCol(null);
          setCardDropTarget(null);
          dragRef.current = { type: null, cardId: null, columnId: null };
        }}
      >
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={getVisible(col.id)}
            allColumns={columns}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onMoveCard={moveToColumn}
            isColOver={overCol === col.id}
            cardDropTargetId={cardDropTarget}
            onColHeaderDragStart={handleColHeaderDragStart}
            onColHeaderDragEnd={handleColHeaderDragEnd}
            onColDragOver={handleColDragOver}
            onColDrop={handleColDrop}
            onCardDragStart={handleCardDragStart}
            onCardDragEnd={handleCardDragEnd}
            onCardDragOverCard={handleCardDragOverCard}
            onCardDropOnCard={handleCardDropOnCard}
            onCardDropOnColumn={handleColDrop}
          />
        ))}
      </div>
    </div>
  );
}
