import React from "react";
import { Box, Divider,Typography,List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart"; // 1. استيراد أيقونة التحليلات
// 1. أضفنا setActivePage هنا لكي نستقبلها من الأب (App.js)
const InternalSidebar = ({ darkMode, setActivePage }) => {
return (
    <Box sx={{
    width: "20%",
    bgcolor: darkMode ? "#2b2a28" : "#E4DED2",
    borderLeft: "6px solid",
    borderColor: "#541029",
    p: 2,
    
    // --- الإضافات لجعلها ثابتة ---
    position: "sticky",    // تجعل العنصر يلتصق عند التمرير
    top: "64px",           // المسافة من الأعلى (يفضل أن تكون نفس ارتفاع Navbar)
    height: "calc(100vh - 64px)", // لكي تأخذ طول الشاشة بالكامل ناقص ارتفاع Navbar
    overflowY: "auto",     // لكي يظهر سكرول داخلي للسايد بار إذا كثرت الخيارات
    // ----------------------------
}}
>
    <Typography variant="h6" sx={{ mb: 2, color: "#541029", fontWeight: "bold" }}>
        الخيارات
    </Typography>

<List>
        {/* 2. أضفنا onClick لكل زر لتغيير الحالة في الأب */}
        <ListItemButton 
        sx={{ borderRadius: 2, mb: 1 }} 
        onClick={() => setActivePage("home")}>
        <ListItemText primary="الصفحة الرئيسية" />
        </ListItemButton>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItemButton 
        sx={{ borderRadius: 2, mb: 1 }} 
        onClick={() => setActivePage("newBooks")}
        >
        <ListItemText primary="إضافة كتاب جديد" />
        </ListItemButton>


        <Divider sx={{ my: 1 }} />


        <ListItemButton 
        sx={{ borderRadius: 2 }} 
        onClick={() => setActivePage("suggestions")}
        >
        <ListItemText primary=" عرض التوصيات" />
        </ListItemButton>


        <Divider sx={{ my: 1 }} />

        <ListItemButton 
        sx={{ borderRadius: 2 }} 
        onClick={() => setActivePage("Books")}
        >
        <ListItemText primary=" عرض الكتب" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />
        
        <ListItemButton 
        sx={{ borderRadius: 2 }} 
        onClick={() => setActivePage("updateBook")}
        >
        <ListItemText primary=" تعديل كتاب " />
        </ListItemButton>
         <Divider sx={{ my: 1 }} />
{/* 2. التبويبة الجديدة: التقارير المالية والتحليلات */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setActivePage("analytics")}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary="التقارير المالية" />
          </ListItemButton>
        </ListItem>

        </List>
    </Box>
);
};

export default InternalSidebar;