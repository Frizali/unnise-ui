import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUp from "./features/auth/pages/SignUp";
import SignIn from "./features/auth/pages/SignIn";
import MainLayout from "./layouts/MainLayout";
import { ProjectLayout } from "./layouts/ProjectLayout";
import { ProjectInvitation } from "./features/project/pages/ProjectInvitation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="main" element={<MainLayout />}>
        <Route path="projects/:id" element={<ProjectLayout />} />
      </Route>
      <Route path="invitation/:token" element={<ProjectInvitation />} />
    </Routes>
  );
}

export default App;
