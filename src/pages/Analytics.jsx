import React, { useState, useEffect } from "react";
import { 
  Box, Grid, Card, CardContent, Typography, Table, TableBody, 
  TableCell, TableHead, TableRow, CircularProgress, Alert,
  Tabs, Tab 
} from "@mui/material";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import axios from "axios";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [booksData, setBooksData] = useState([]);
  const [authorsData, setAuthorsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [mostReadData, setMostReadData] = useState({ books: [], authors: [], categories: [] });

  // ألوان متناسقة ومريحة للعين (تتماشى مع هوية مشروع جليس)
  const COLORS = ["#2E4D68", "#4A7C59", "#D07A3G", "#684E32", "#8E7C68"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const apiBase = "http://localhost:8000/api/analytics"; 

    try {
      const [books, authors, cats, monthly, yearly, mostRead] = await Promise.all([
        axios.get(`${apiBase}/books_earnings`, { headers }),
        axios.get(`${apiBase}/authors_earnings`, { headers }),
        axios.get(`${apiBase}/categories_earnings`, { headers }),
        axios.get(`${apiBase}/monthly_earnings`, { headers }),
        axios.get(`${apiBase}/yearly_earnings`, { headers }),
        axios.get(`${apiBase}/most_read`, { headers }),
      ]);

      setBooksData(books.data.data || []);
      setAuthorsData(authors.data.data || []);
      setCategoriesData(cats.data.data || []);
      setYearlyData(yearly.data.data || []);
      setMostReadData(mostRead.data || { books: [], authors: [], categories: [] });

      const monthNames = ["", "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      const formattedMonthly = Object.entries(monthly.data.monthly_totals || {}).map(([month, total]) => ({
        name: monthNames[parseInt(month)],
        "الأرباح": total
      }));
      setMonthlyData(formattedMonthly);

    } catch (err) {
      setError("فشل في جلب البيانات، تأكد من اتصال الـ Backend وصلاحيات الآدمن");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;

  return (
    <Box sx={{ width: '100%', minHeight: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#4A2E2B' }}>
        لوحة التقارير المالية والإحصائيات
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)} 
        sx={{ 
          mb: 4, 
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiTab-root': { fontWeight: 'bold', fontSize: '15px' }
        }}
      >
        <Tab label="نظرة عامة على الأرباح" />
        <Tab label="أداء المبيعات والمؤلفين" />
        <Tab label="الإحصائيات الأكثر قراءة" />
      </Tabs>

{/* التبويب الأول: الأرباح المالية */}
{activeTab === 0 && (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
    
    {/* 1. مخطط الأرباح الشهرية - معزول تماماً ليأخذ العرض الكامل */}
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
          نمو أرباح السنة الحالية (شهرياً)
        </Typography>
        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="الأرباح" stroke="#2E4D68" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>

    {/* 2. العناصر الأخرى تنزل لسطر جديد وتتقاسم المساحة بالتساوي بنسبة 50% لكل منها */}
    <Grid container spacing={3}>
      {/* أرباح التصنيفات كمخطط دائري */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: '100%', minHeight: 350 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              توزيع الأرباح حسب التصنيفات
            </Typography>
            <Box sx={{ width: '100%', height: 280, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoriesData} 
                    dataKey="total_earnings" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={90} 
                    paddingAngle={5}
                    label
                  >
                    {categoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString()} ل.س`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* جدول الأرشيف السنوي */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: '100%', minHeight: 350 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
              الأرشيف السنوي للأرباح
            </Typography>
            <Table sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F3E9' }}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>السنة</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>عدد المبيعات</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>إجمالي الأرباح</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yearlyData.length > 0 ? yearlyData.map((year) => (
                  <TableRow key={year.year} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{year.year}</TableCell>
                    <TableCell align="right">{year.sales_count}</TableCell>
                    <TableCell align="right" sx={{ color: '#4A7C59', fontWeight: 'bold' }}>
                      {year.total_earnings.toLocaleString()} ل.س
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={3} align="center">لا توجد بيانات متاحة</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

  </Box>
)}

{/* التبويب الثاني: أداء المبيعات للكتب والمؤلفين */}
{activeTab === 1 && (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
    
    {/* جعلنا كرت أرباح الكتب يمتد على كامل العرض لحل مشكلة الانضغاط */}
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
          أرباح أفضل 5 كتب مبيعاً
        </Typography>
        {booksData.length > 0 ? (
          <Box sx={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={booksData.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} ل.س`} />
                <Bar dataKey="total_earnings" fill="#4A7C59" radius={[4, 4, 0, 0]} name="إجمالي الربح" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Typography align="center" sx={{ color: '#aaa', py: 5 }}>لا توجد بيانات مبيعات للكتب حالياً</Typography>
        )}
      </CardContent>
    </Card>

    {/* كرت المؤلفين يأخذ العرض كاملاً بالأسفل */}
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
          أرباح أعلى المؤلفين مبيعاً
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F5F3E9' }}>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>المؤلف</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>الكتب المباعة</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>صافي الأرباح</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authorsData.length > 0 ? authorsData.slice(0, 5).map((author, i) => (
              <TableRow key={i}>
                <TableCell align="right">{author.author || "غير معروف"}</TableCell>
                <TableCell align="right">{author.sales_count}</TableCell>
                <TableCell align="right" sx={{ color: '#2E4D68', fontWeight: 'bold' }}>
                  {parseFloat(author.total_earnings).toLocaleString()} ل.س
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: '#aaa', py: 3 }}>
                  لا توجد بيانات متاحة للمؤلفين
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

  </Box>
)}

      {/* التبويب الثالث: الأكثر قراءة */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* الكتب الأكثر قراءة */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2E4D68' }}>
                  📚 الكتب الأكثر إنهاءً لقراءتها
                </Typography>
                {mostReadData.books?.length > 0 ? mostReadData.books.map((b, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #eee' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{b.title}</Typography>
                    <Typography sx={{ bgcolor: '#E2ECF7', px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: '13px', fontWeight: 'bold', color: '#2E4D68' }}>
                      {b.count} إنهاء
                    </Typography>
                  </Box>
                )) : <Typography align="center" sx={{ color: '#aaa', py: 2 }}>لا توجد إحصائيات بعد</Typography>}
              </CardContent>
            </Card>
          </Grid>

          {/* المؤلفين الأكثر قراءة */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#4A7C59' }}>
                  ✍️ المؤلفون الأكثر قراءة
                </Typography>
                {mostReadData.authors?.length > 0 ? mostReadData.authors.map((a, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #eee' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{a.author}</Typography>
                    <Typography sx={{ bgcolor: '#E6F4EA', px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: '13px', fontWeight: 'bold', color: '#4A7C59' }}>
                      {a.cnt} كتاب منتهي
                    </Typography>
                  </Box>
                )) : <Typography align="center" sx={{ color: '#aaa', py: 2 }}>لا توجد إحصائيات بعد</Typography>}
              </CardContent>
            </Card>
          </Grid>

          {/* التصنيفات الأكثر قراءة */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#D07A3G' }}>
                  🏷️ التصنيفات المفضلة للقراء
                </Typography>
                {mostReadData.categories?.length > 0 ? mostReadData.categories.map((c, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #eee' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{c.name}</Typography>
                    <Typography sx={{ bgcolor: '#FDF2E9', px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: '13px', fontWeight: 'bold', color: '#D07A3G' }}>
                      {c.cnt} قراءة
                    </Typography>
                  </Box>
                )) : <Typography align="center" sx={{ color: '#aaa', py: 2 }}>لا توجد إحصائيات بعد</Typography>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Analytics;