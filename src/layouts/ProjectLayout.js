import { Box } from "@mui/material";
import { ProjectHeader } from "../features/project/components/ProjectHeader";
import KanbanBoard from "../features/kanban/components/KanbanBoard";

export function ProjectLayout() {
  return (
    <Box sx={{display:"flex", flexDirection:"column", flex:1}}>
      <ProjectHeader />
      <KanbanBoard />
    </Box>
  );
}
