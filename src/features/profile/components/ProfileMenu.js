import {
  ButtonBase,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Stack,
  Box,
} from "@mui/material";
import useProfileMenu from "../hooks/useProfileMenu";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

function ProfileMenu() {
  const { user, anchorEl, open, handleOpen, handleClose } = useProfileMenu();

  return (
    <>
      <Tooltip title={user.email} placement="bottom">
        <ButtonBase
          sx={{
            padding: 0,
            minWidth: 0,
            display: "flex",
            gap: ".25rem",
          }}
          onClick={handleOpen}
        >
          <Avatar sx={{ width: 24, height: 24 }} />
          <Typography fontWeight={600} color="text.primary" variant="body2">
            Frizali
          </Typography>
        </ButtonBase>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 220,
            mt: "14px",
            borderRadius: "6px",
            boxShadow:
              "rgba(30, 31, 33, 0.15) 0px 8px 12px 0px, rgba(30, 31, 33, 0.31) 0px 0px 1px 0px",
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <Stack direction="row" gap={0.5}>
            <Box
              sx={{
                minWidth: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PersonOutlineOutlinedIcon
                sx={{ color: "icon.main" }}
                fontSize="small"
              />
            </Box>
            <Typography color="text.primary" variant="body2">
              My profile
            </Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Stack direction="row" gap={0.5}>
            <Box
              sx={{
                minWidth: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SettingsOutlinedIcon
                sx={{ color: "icon.main" }}
                fontSize="small"
              />
            </Box>
            <Typography color="text.primary" variant="body2">
              Settings
            </Typography>
          </Stack>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleClose}>
          <Stack direction="row" gap={0.5}>
            <Box
              sx={{
                minWidth: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LogoutOutlinedIcon
                sx={{ color: "icon.main" }}
                fontSize="small"
              />
            </Box>
            <Typography color="text.primary" variant="body2">
              Log out
            </Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu;
