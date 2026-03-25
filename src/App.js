import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUp from "./features/auth/pages/SignUp";
import SignIn from "./features/auth/pages/SignIn";
import MainLayout from "./layouts/MainLayout";
import { ProjectLayout } from "./layouts/ProjectLayout";
import { ProjectInvitation } from "./features/project/pages/ProjectInvitation";
import { Navigate } from "react-router-dom";
import KanbanBoard from "./features/kanban/components/KanbanBoard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="main" element={<MainLayout />}>
        <Route path="projects/:id" element={<ProjectLayout />}>
          <Route index element={<Navigate to="board" replace />} />
          <Route path="board" element={<KanbanBoard />} />
          {/* <Route path="timeline" element={<TimelineView />} />
          <Route path="chart" element={<ChartView />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="leaderboard" element={<LeaderboardView />} /> */}
        </Route>
      </Route>
      <Route path="invitation/:token" element={<ProjectInvitation />} />
    </Routes>
  );
}

export default App;
