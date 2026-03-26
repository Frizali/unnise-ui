import { Box } from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

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
      }}
      {...props}
    >
      {selected && (
        <CheckOutlinedIcon fontSize="small" sx={{color:"white"}}/>
      )}
    </Box>
  );
}
