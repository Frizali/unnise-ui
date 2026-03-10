import { useState } from "react";

const PRIORITY_META = {
  high:   { label: "High",   color: "#dc2626" },
  medium: { label: "Medium", color: "#d97706" },
  low:    { label: "Low",    color: "#16a34a" },
};

export function KanbanCard({ card, onDelete, onMoveCard, columns, isDropTarget, onDragStart, onDragEnd, onDragOver, onDrop }) {
  const [showMenu, setShowMenu]     = useState(false);
  const [dragging, setDragging]     = useState(false);
  const p = PRIORITY_META[card.priority];

  return (
    <div
      draggable
      onDragStart={e => { onDragStart(e, card.id); setDragging(true); }}
      onDragEnd={e => { onDragEnd(e); setDragging(false); }}
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(card.id); }}
      onDrop={e => { e.preventDefault(); e.stopPropagation(); onDrop(card.id); }}
      style={{
        background: dragging ? "#2d2d45" : "#252537",
        border: `1px solid ${isDropTarget ? "#6366f1" : "rgba(255,255,255,0.07)"}`,
        borderRadius:12, padding:"14px 16px", marginBottom:10,
        cursor:"grab", userSelect:"none",
        boxShadow: dragging ? "0 20px 40px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.2)",
        opacity: dragging ? 0.4 : 1,
        transform: isDropTarget ? "translateY(-3px)" : "none",
        transition: dragging ? "none" : "all 0.15s",
        position:"relative",
      }}
    >
      {isDropTarget && <div style={{ position:"absolute", top:-5, left:10, right:10, height:3, borderRadius:4, background:"#6366f1", boxShadow:"0 0 8px #6366f1" }} />}

      <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:p.color+"22", border:`1px solid ${p.color}44`, borderRadius:20, padding:"2px 8px", marginBottom:8 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:p.color }} />
        <span style={{ fontSize:10, color:p.color, fontFamily:"monospace", letterSpacing:0.5 }}>{p.label.toUpperCase()}</span>
      </div>

      <p style={{ margin:"0 0 6px", color:"#e2e8f0", fontSize:14, fontWeight:600, fontFamily:"'Sora',sans-serif", lineHeight:1.4 }}>{card.title}</p>
      {card.desc && <p style={{ margin:"0 0 12px", color:"#64748b", fontSize:12, fontFamily:"'Sora',sans-serif", lineHeight:1.5 }}>{card.desc}</p>}

      <div style={{ display:"flex", justifyContent:"flex-end", gap:4, position:"relative" }}>
        <button onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:6, color:"#94a3b8", cursor:"pointer", padding:"4px 10px", fontSize:11, fontFamily:"'Sora',sans-serif" }}>↗ Move</button>
        <button onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onDelete(card.id); }}
          style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:6, color:"#f87171", cursor:"pointer", padding:"4px 10px", fontSize:11 }}>✕</button>

        {showMenu && (
          <div onMouseDown={e => e.stopPropagation()} style={{ position:"absolute", bottom:"calc(100% + 6px)", right:0, zIndex:50, background:"#1e1e2e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden", boxShadow:"0 10px 30px rgba(0,0,0,0.4)", minWidth:150 }}>
            <div style={{ padding:"8px 14px 6px", color:"#475569", fontSize:10, fontFamily:"monospace", letterSpacing:1 }}>MOVE TO</div>
            {columns.filter(c => c.id !== card.column).map(col => (
              <button key={col.id} onClick={() => { onMoveCard(card.id, col.id); setShowMenu(false); }}
                style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 14px", background:"transparent", border:"none", color:"#cbd5e1", cursor:"pointer", fontSize:13, fontFamily:"'Sora',sans-serif", textAlign:"left" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:col.color, flexShrink:0 }} />{col.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
