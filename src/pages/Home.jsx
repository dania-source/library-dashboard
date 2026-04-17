import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Box, CircularProgress, LinearProgress 
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // ملاحظة: يجب إرسال الـ Token في الـ Headers لأن الكود محمي
        const token = localStorage.getItem("token"); 
        
        const response = await axios.get("http://127.0.0.1:8000/api/admin/users-progress", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // ركزي هنا: البيانات موجودة داخل response.data.data بناءً على كود الباك
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

  if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 5 }} />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#541029", fontWeight: "bold" }}>
        تقدم المستخدمين والأهداف الأسبوعية
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#541029" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>المستخدم</TableCell>
              <TableCell sx={{ color: "white" }}>البريد الإلكتروني</TableCell>
              <TableCell sx={{ color: "white" }}>إجمالي النقاط</TableCell>
              <TableCell sx={{ color: "white" }}>نسبة الإنجاز</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {user.points} نقطة
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: '250px' }}>
                  {/* عرض نسبة التقدم كشريط مرئي */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={user.progress_percentage} 
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="body2">{Math.round(user.progress_percentage)}%</Typography>
                  </Box>
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