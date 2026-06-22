import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4d4bfe",
      background:"#D9D7FF"
    },

    text: {
      primary: "#0E0D35",
      secondary: "#626C7A",
    },

    icon: {
      main: "#626C7A",
    },

    border: {
      main: "#D1D9E0",
    },

    status: {
      danger: "#F44336",
      warning: "#FDAB3D",
      success: "#00C875",
    },

    tag: {
      primary: {
        main: "#268DAF",
        background: "#D9F4F8",
      },
      pink: {
        main: "#FE02B9",
        background: "#FDE7FE",
      },
      green: {
        main: "#41A06A",
        background: "#D4F4D4",
      },
    },
  },
  typography: {
    fontFamily: `"Urbanist", sans-serif`,
  },
});
