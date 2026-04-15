import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box, Typography } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import InternalSidebar from "./components/InternalSidebar";
// استيراد المكونات التي صنعناها
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { getAppTheme } from "./theme/AppTheme";
import logo from "./assets/logo3.png";
import Home from "./pages/Home";
import newBooke from "./pages/newBooke";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // 1. تعريف حالة الصفحة النشطة (الافتراضية هي stats أو home)
  const [activePage, setActivePage] = useState("stats");

  const theme = getAppTheme(darkMode);

  // 2. دالة لتبديل المحتوى بناءً على الاختيار
  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <Home darkMode={darkMode} />;
      case "newBooks":
        return <newBooke />;
      case "plan":
        return (
          <Box>
            <Typography variant="h4" sx={{ color: "#541029", mb: 2 }}>
              التقارير
            </Typography>
            <Typography>هنا يتم عرض التقارير الدورية للمكتبة.</Typography>
          </Box>
        );
      case "Books":
        return (
          <Box>
            <Typography variant="h4" sx={{ color: "#541029", mb: 2 }}>
              التقارير
            </Typography>
            <Typography>هنا يتم عرض التقارير الدورية للمكتبة.</Typography>
          </Box>
        );
      case "Suggestions":
        return (
          <Box>
            <Typography variant="h4" sx={{ color: "#541029", mb: 2 }}>
              التوصيات
            </Typography>
            <Typography>هنا يتم عرض التقارير الدورية للمكتبة.</Typography>
          </Box>
        );
      case "Questions":
        return (
          <Box>
            <Typography variant="h4" sx={{ color: "#541029", mb: 2 }}>
              الاسئله والاقتراحات
            </Typography>
            <Typography>هنا يتم عرض التقارير الدورية للمكتبة.</Typography>
          </Box>
        );
      default:
        <Typography>هنا يتم عرض التقارير الدورية للمكتبة.</Typography>;
      // return <Home darkMode={darkMode} />;
    }
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }} dir="rtl">
          <Navbar logo={logo} onMenuClick={() => setOpen(true)} />

          <Sidebar
            open={open}
            onClose={() => setOpen(false)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
            {/* 3. تمرير دالة التغيير للمكون الجانبي */}
            <InternalSidebar
              darkMode={darkMode}
              setActivePage={setActivePage}
            />

            {/* 4. عرض المحتوى المتغير */}
            {/* محتوى الصفحة الرئيسي */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                // التعديل هون:
                // منused "الشرط" (Ternary Operator)
                // إذا darkMode صح (true) حط لون غامق، وإذا خطأ (false) حط لونك البيج
                bgcolor: darkMode ? "#2b2a28" : "#EFEDE1",

                minHeight: "calc(100vh - 64px)",
                transition: "all 0.3s ease", // اختيارية: بتخلي قلبة اللون ناعمة للعين
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
