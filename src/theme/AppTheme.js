import { createTheme } from "@mui/material";

export const getAppTheme = (darkMode) =>
  createTheme({
    direction: "rtl",
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#541029",
      },
    },
  });
