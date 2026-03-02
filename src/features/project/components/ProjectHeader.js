import { Box, Typography } from "@mui/material";
import { useProjectHeader } from "../hooks/useProjectHeader";

export function ProjectHeader() {
  const { project, loading } = useProjectHeader();

  return (
    <Box>
      <Typography variant="h5" fontWeight="600">
        {project.name}
      </Typography>
    </Box>
  );
}
