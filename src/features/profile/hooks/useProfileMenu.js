import { useState } from "react";
const user = {
  email: "frizali@gmail.com",
  globalName: "Frizali",
};

function useProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return {
    user,
    anchorEl,
    open,
    handleOpen,
    handleClose
  };
}

export default useProfileMenu;
