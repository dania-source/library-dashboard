import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Box, CircularProgress, Chip 
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://127.0.0.1:8000/api/admin/users-progress", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUsers(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("خطأ في الربط:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress sx={{ color: "#541029" }} />
    </Box>
  );

  return (
    <Box 
      sx={{ 
        // 1. الإزاحة لتجنب التداخل مع القائمة والشريط العلوي
        marginRight: { xs: 0, md: "260px" }, // عرض القائمة الجانبية
        marginTop: "64px", // ارتفاع الشريط العلوي (NavBar)
        
        // 2. جعل الخلفية تملأ كامل الشاشة ومنع المساحة البيضاء بالأسفل
        minHeight: "calc(100vh - 64px)", 
        bgcolor: "#f4f1ea", // لون الخلفية كما في الصورة
        
        p: 4,
        display: "flex",
        flexDirection: "column",
        transition: "0.3s ease"
      }}
    >
      {/* العنوان - محاذاة لليمين ولون متناسق */}
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          color: "#541029", 
          fontWeight: "bold", 
          textAlign: 'right' 
        }}
      >
        المستخدمين
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}
      >
     <Table dir="rtl">
  <TableHead sx={{ bgcolor: "#541029" }}>
    <TableRow>
      {/* 1. اسم المستخدم أولاً من اليمين */}
      <TableCell align="left" sx={{ color: "white", fontWeight: "bold" }}>المستخدم</TableCell>
      
      {/* 2. اللقب في المنتصف */}
      <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>اللقب الحالي</TableCell>
      
      {/* 3. الكتب المنجزة في اليسار */}
      <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>الكتب المنجزة</TableCell>
    </TableRow>
  </TableHead>
  
  <TableBody>
    {users.map((user, index) => (
      <TableRow key={index} sx={{ '&:hover': { bgcolor: '#fcfaf7' } }}>
        {/* يجب أن يتطابق ترتيب البيانات مع العناوين أعلاه */}
        
        {/* اسم المستخدم يظهر أولاً على اليمين */}
        <TableCell align="leht" sx={{ fontWeight: "500" }}>
          {user.name}
        </TableCell>

        {/* اللقب في المنتصف */}
        <TableCell align="center">
          <Chip 
            label={user.nickname} 
            sx={{ bgcolor: "#f0e4e8", color: "#541029", fontWeight: "bold" }} 
          />
        </TableCell>

        {/* الكتب المنجزة في اليسار */}
        <TableCell align="center">
          <Typography sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            {user.books_read} كتب
          </Typography>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
      </TableContainer>
    </Box>
  );
};

export default Users;