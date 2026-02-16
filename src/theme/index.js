import { createTheme } from "@mui/material";

export const theme = createTheme({
palette: {
  primary: {
    main: "#2D71F8",
  },

  text: {
    primary:"#323338",
    secondary: "#4C4C4C",
  },

  icon:{
    main:"#676879"
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
typography:{
    fontFamily: `"Mona Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif`
}
})