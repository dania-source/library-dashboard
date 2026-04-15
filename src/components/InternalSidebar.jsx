import React from "react";
import { Box, Typography, List, ListItemButton, ListItemText, Divider } from "@mui/material";

// 1. أضفنا setActivePage هنا لكي نستقبلها من الأب (App.js)
const InternalSidebar = ({ darkMode, setActivePage }) => {
return (
    <Box sx={{
        width: "20%",
        bgcolor: darkMode ? "#2b2a28" :"#E4DED2",
        borderLeft: "6px solid",
        borderColor: "#541029",
        minHeight: "calc(100vh - 64px)",
        p: 2,}}
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
        onClick={() => setActivePage("plan")}
        >
        <ListItemText primary="إضافة تحدي جديد" />
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
        onClick={() => setActivePage("Suggestions")}
        >
        <ListItemText primary=" عرض التوصيات" />
        </ListItemButton>
         <Divider sx={{ my: 1 }} />

        <ListItemButton 
        sx={{ borderRadius: 2 }} 
        onClick={() => setActivePage("Questions")}
        >
        <ListItemText primary=" عرض الأسئلة والإقتراحات" />
        </ListItemButton>

        </List>
    </Box>
);
};

export default InternalSidebar;