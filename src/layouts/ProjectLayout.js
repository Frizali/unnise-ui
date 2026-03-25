import { Box } from "@mui/material";
import { ProjectHeader } from "../features/project/components/ProjectHeader";
import { Outlet } from "react-router-dom";

export function ProjectLayout() {
  return (
    <Box sx={{display:"flex", flexDirection:"column", flex:1}}>
      <ProjectHeader />
      <Outlet/>
    </Box>
  );
}
