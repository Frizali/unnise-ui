import { useState } from "react";
const data = [
  { id: "1", name: "Project Management Gamification" },
  { id: "2", name: "Navigate Bike" },
  { id: "3", name: "Human Resource" },
];

export const useProjectMenu = () => {
  const [openMenu, setOpenMenu] = useState(true);

  function handleOpenMenu () {
    setOpenMenu(!openMenu);
  };

  return { data, openMenu, handleOpenMenu };
};
