const COLOR_OPTIONS = [
  { value: "#6366f1", label: "Indigo"  },
  { value: "#10b981", label: "Emerald" },
  { value: "#f59e0b", label: "Amber"   },
  { value: "#ef4444", label: "Red"     },
  { value: "#8b5cf6", label: "Violet"  },
  { value: "#3b82f6", label: "Blue"    },
  { value: "#ec4899", label: "Pink"    },
  { value: "#14b8a6", label: "Teal"    },
  { value: "#f97316", label: "Orange"  },
  { value: "#a3e635", label: "Lime"    },
];

export function ColorSwatch({ value, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      title={COLOR_OPTIONS.find((c) => c.value === value)?.label}
      style={{
        width: 32, height: 32, borderRadius: "50%",
        border: `2px solid ${selected ? value : "transparent"}`,
        boxShadow: selected ? `0 0 0 1px ${value}55, 0 0 12px ${value}44` : "none",
        cursor: "pointer", padding: 0, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.15s, box-shadow 0.15s, transform 0.1s",
        transform: selected ? "scale(1.12)" : "scale(1)",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = value + "88";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "transparent";
      }}
    >
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        border: `2px solid ${value}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s",
        background: selected ? value + "33" : "transparent",
      }}>
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke={value} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}