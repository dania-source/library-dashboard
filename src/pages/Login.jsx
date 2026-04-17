import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper, Alert, Container, CircularProgress } from "@mui/material";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      // تعديل: أضفنا Headers للتأكد أن لارافيل يفهم الرد كـ JSON
      const response = await axios.post("http://localhost:8000/api/admin/login", 
        { email, password },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      // التأكد من وصول التوكن
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // ضبط الهيدر للطلبات القادمة
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setAuth(true);
      } else {
        setError("فشل تسجيل الدخول: لم يتم استلام رمز التحقق");
      }
    } catch (err) {
      console.error("Login Error Detailed:", err.response); // تفاصيل أكثر في الكونسول
      
      if (err.response) {
        // إذا كان الخطأ من السيرفر (مثل 500 أو 401)
        const serverMessage = err.response.data.message;
        
        if (err.response.status === 500) {
          setError("خطأ داخلي في السيرفر (500). تأكد من إعدادات قاعدة البيانات أو الـ HasApiTokens في موديل Admin.");
        } else if (err.response.status === 419) {
          setError("انتهت الجلسة (CSRF)، تأكد أن المسار في api.php وليس web.php");
        } else {
          setError(serverMessage || "بيانات الدخول غير صحيحة");
        }
      } else if (err.request) {
        setError("لا يمكن الوصول للسيرفر. تأكد من تشغيل Laravel (php artisan serve)");
      } else {
        setError("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 4, bgcolor: '#fdfdfd' }}>
          <Typography variant="h5" sx={{ mb: 3, color: "#541029", fontWeight: 'bold', textAlign: 'center' }}>
            لوحة تحكم المكتبة - دخول المدير
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth label="البريد الإلكتروني"
              type="email" margin="normal"
              required value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth label="كلمة المرور"
              type="password" margin="normal"
              required value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              fullWidth variant="contained" 
              type="submit"
              disabled={loading}
              sx={{ mt: 3, p: 1.5, bgcolor: "#541029", "&:hover": { bgcolor: "#3d0b1e" }, fontSize: '1.1rem' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "دخول"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;