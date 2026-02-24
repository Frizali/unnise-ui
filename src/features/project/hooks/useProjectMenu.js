import { useState } from "react";
const data = [
  { id: "1", name: "Project Management Gamification" },
  { id: "2", name: "Navigate Bike" },
  { id: "3", name: "Human Resource" },
];

export const useProjectMenu = () => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(!open);
  };

  return { data, open, handleOpen };
};
