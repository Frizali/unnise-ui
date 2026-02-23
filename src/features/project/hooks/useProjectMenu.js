import { useState, useCallback } from "react";
const data = [
  { id: "1", name: "Project Management" },
  { id: "2", name: "Navigate Bike" },
  { id: "3", name: "Human Resource" },
];

export const useProjectMenu = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (data, open, handleOpen);
};
