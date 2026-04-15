import React from "react";
import { Box, Typography,darkMode } from "@mui/material";

const Home = ({ darkMode }) => {
  return (
    <Box>
      <Typography variant="h4" sx={{ color: darkMode ?"#EFEDE1" : "#541029", mb: 2 }}>
        الإحصائيات
      </Typography>
      <Typography>
        هنا ستظهر إحصائيات المكتبة (عدد الكتب، المستخدمين، إلخ).
      </Typography>
    </Box>
  );
};

export default Home;