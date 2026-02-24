import { ButtonBase, Avatar, Tooltip, Menu, MenuItem } from "@mui/material";
import useProfileMenu from "../hooks/useProfileMenu";

function ProfileMenu() {
  const  { user, anchorEl, open, handleOpen, handleClose } = useProfileMenu();

  return (
    <>
      <Tooltip title={user.email} placement="bottom">
        <ButtonBase
          sx={{
            padding: 0,
            minWidth: 0,
          }}
          onClick={handleOpen}
        >
          <Avatar sx={{ width: 24, height: 24 }} />
        </ButtonBase>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu;
