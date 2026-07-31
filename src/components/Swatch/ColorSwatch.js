import { Box } from "@mui/material";
import { Check } from "lucide-react"

export function ColorSwatch({ size = 10, value, selected, ...props }) {
  return (
    <Box
      style={{
        cursor: "pointer",
        width: size,
        height: size,
        border: `2px solid ${selected ? value : "transparent"}`,
        transition: "border-color 0.15s, box-shadow 0.15s, transform 0.1s",
        borderRadius: "50%",
        background: value,
        boxShadow: `0 0 8px ${value}`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...props}
    >
      {selected && (
        <Check size={16} color="white"/>
      )}
    </Box>
  );
}
