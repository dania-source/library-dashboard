// import React from "react";
// import { Box, Typography,darkMode } from "@mui/material";

// const Home = ({ darkMode }) => {
//   return (
//     <Box>
//       <Typography variant="h4" sx={{ color: darkMode ?"#EFEDE1" : "#541029", mb: 2 }}>
//         الإحصائيات
//       </Typography>
//       <Typography>
//         هنا ستظهر إحصائيات المكتبة (عدد الكتب، المستخدمين، إلخ).
//       </Typography>
//     </Box>
//   );
// };

// export default Home;
import React from "react";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Box, Chip 
} from "@mui/material";

const Home = () => {
  // بيانات وهمية للمستخدمين
  const users = [
    { id: 1, name: "أحمد محمد", email: "ahmed@example.com", role: "مدير", status: "نشط" },
    { id: 2, name: "سارة أحمد", email: "sara@example.com", role: "أمين مكتبة", status: "نشط" },
    { id: 3, name: "خالد علي", email: "khaled@example.com", role: "مستخدم", status: "محظور" },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "#541029", mb: 3, fontWeight: "bold" }}>
        إدارة المستخدمين
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#541029" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>الاسم</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>البريد الإلكتروني</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>الصلاحية</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>الحالة</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.status} 
                    color={user.status === "نشط" ? "success" : "error"} 
                    variant="outlined" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Home;