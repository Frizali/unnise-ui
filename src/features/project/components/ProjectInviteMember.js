import {
  Avatar,
  Dialog,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
  TextField,
  Divider,
  Stack,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import UiButtonIcon from "../../../components/UiButton/UiButtonIcon";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useProjectInviteMember } from "../hooks/useProjectInviteMember";
import UiButton from "../../../components/UiButton/UiButton";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

export function ProjectInviteMember({
  children,
  inviteDialog,
  handleInviteDialog,
}) {
  const {
    options,
    keyword,
    loading,
    sendingInvite,
    members,
    membersLooading,
    handleOptionChange,
    handleKeywordChange,
    handleSendInvite,
  } = useProjectInviteMember({ inviteDialog });

  return (
    <Dialog open={inviteDialog}>
      <Box
        sx={{
          minWidth: "600px",
          padding: "1.5rem",
          boxSizing: "border-box",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" fontWeight="600" color="text.primary">
            Invite to this project
          </Typography>
          <UiButtonIcon title="Close" onClick={handleInviteDialog}>
            <CloseOutlinedIcon />
          </UiButtonIcon>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Assign points for completing tasks, deadlines, and collaboration
          activities.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Stack direction="row" gap={0.5} alignItems="stretch" mb={2}>
          <Autocomplete
            sx={{ flex: 1 }}
            options={options}
            loading={loading}
            inputValue={keyword}
            onInputChange={(event, newKeyword, reason) => {
              handleKeywordChange(newKeyword);
            }}
            onChange={(event, selectedOption) => {
              handleOptionChange(selectedOption?.id ?? null);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.username}
            getOptionDisabled={(option) =>
              option.status === "Member already joined" ||
              option.status === "Invitation already sent"
            }
            renderOption={(props, option) => {
              const { key, ...rest } = props;

              return (
                <Box
                  key={key}
                  {...rest}
                  component="li"
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  <Avatar sx={{ width: 36, height: 36 }} />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.primary">
                        {option.globalName}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {option.status}
                      </Typography>
                    </Box>
                    <Typography fontSize="12px" color="text.secondary">
                      @{option.username}
                    </Typography>
                  </Box>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by username or email address"
                size="small"
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                  },
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          <UiButton
            loading={sendingInvite}
            sx={{ whiteSpace: "nowrap", alignSelf: "stretch" }}
            onClick={handleSendInvite}
          >
            Send invite
          </UiButton>
        </Stack>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            Already in the project
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {members.map((item) => (
              <Box
                key={item.id}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                {membersLooading ? (
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={36}
                    height={36}
                  />
                ) : (
                  <Avatar sx={{ width: 36, height: 36 }} />
                )}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    {membersLooading ? (
                      <>
                        <Skeleton animation="wave" height={14} width="60%" />
                        <Skeleton animation="wave" height={12} width="40%" />
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.primary">
                          {item.globalName}
                        </Typography>
                        <Typography fontSize="12px" color="text.secondary">
                          {item.username}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Box>
                    {item.role !== "Owner" ? (
                      <Select
                        variant="standard"
                        disableUnderline
                        value={item.role}
                        // onChange={(e) => setValue(e.target.value)}
                        IconComponent={KeyboardArrowDownOutlinedIcon}
                        sx={{
                          fontSize: "14px",
                          "&:before": { display: "none" },
                          "&:after": { display: "none" },
                          "& .MuiSelect-select": {
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingLeft: 0,
                            paddingRight: "20px",
                          },
                        }}
                      >
                        <MenuItem value="Admin">
                          <Typography variant="body2" color="text.primary">
                            Admin
                          </Typography>
                        </MenuItem>
                        <MenuItem value="Member">
                          <Typography variant="body2" color="text.primary">
                            Member
                          </Typography>
                        </MenuItem>
                        <MenuItem value="Viewer">
                          <Typography variant="body2" color="text.primary">
                            Viewer
                          </Typography>
                        </MenuItem>
                      </Select>
                    ) : (
                      <Box sx={{ display: "flex" }}>
                        <Typography variant="body2" color="text.primary">
                          Owner
                        </Typography>
                        <CheckCircleOutlineOutlinedIcon sx={{color:"icon.primary"}}/>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
