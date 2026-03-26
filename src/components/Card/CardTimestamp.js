import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Typography, Box } from "@mui/material";

dayjs.extend(relativeTime);

export default function CardTimestamp({ createdAt, updatedAt }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <Typography fontSize={12} color="text.secondary">
        Created {dayjs(createdAt).format("MMMM D, YYYY [at] h:mm A")}
      </Typography>
      <Typography fontSize={12} color="text.secondary">
        Updated {dayjs(updatedAt).fromNow()}
      </Typography>
    </Box>
  );
}