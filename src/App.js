import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import InternalSidebar from "./components/InternalSidebar";
import Navbar from "./components/Navbar";
import { getAppTheme } from "./theme/AppTheme";
import logo from "./assets/logo3.png";
import Home from "./pages/Home";
import NewBooke from "./pages/newBooke";
import Suggestions from "./pages/Suggestions";
import Login from "./pages/Login";
import Books from "./pages/books";
import Analytics from "./pages/Analytics";
import UpdateBook from "./pages/UpdateBook";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );
  const [activePage, setActivePage] = useState("stats");

  const theme = getAppTheme(darkMode);

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <Home />;
      case "analytics": // إضافة هذا الجزء
        return <Analytics />;
      case "newBooks":
        return <NewBooke />;
      case "suggestions":
        return <Suggestions />;
      case "Books":
        return <Books />;
      case "updateBook":
        return <UpdateBook />;
      default:
        return <Home />;
    }
  };
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login setAuth={setIsAuthenticated} />
      </ThemeProvider>
    );
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Box sx={{ flexGrow: 1 }} dir="rtl">
          <Navbar logo={logo} />

          <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
            <InternalSidebar setActivePage={setActivePage} />

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,

                bgcolor: "#EFEDE1",

                minHeight: "calc(100vh - 64px)",
                transition: "all 0.3s ease",
              }}
            >
              {renderContent()}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
export default App;
