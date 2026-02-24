import { ButtonBase, Avatar, Tooltip, Menu, MenuItem } from "@mui/material";
import useProfileMenu from "../hooks/useProfileMenu";

function ProfileMenu() {
  const { user, open, handleOpen } = useProfileMenu();

  return (
    <>
      <Tooltip title={user.email} placement="bottom">
        <ButtonBase
          sx={{
            padding: 0,
            textTransform: "none",
            minWidth: 0,
          }}
          onClick={handleOpen}
        >
          <Avatar sx={{ width: 24, height: 24 }} />
        </ButtonBase>
      </Tooltip>
      {/* <Menu
        open={open}
        transformOrigin={{ vertical: "bottom" }}
        anchorOrigin={{ vertical: "bottom" }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu> */}
    </>
  );
}

export default ProfileMenu;
