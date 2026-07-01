import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, Box, CircularProgress, Alert,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';

const SuggestionsManager = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const API_URL = 'http://localhost:8000/api/suggestions';
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get(API_URL, config);
            if (response.data.success) {
                setSuggestions(response.data.data);
            }
        } catch (err) {
            setError('حدث خطأ في جلب البيانات.');
        } finally {
            setLoading(false);
        }
    };

const handleAction = async (id, action) => {
    try {
        // نرسل الـ action كما هو (accept أو reject) لكي ينجح الرابط
        const response = await axios.post(`${API_URL}/${id}/${action}`, {}, config);
        
        if (response.data.success) {
            setSuggestions(prev => prev.map(item => {
                if (item.id === id) {
                    // هنا التعديل: نحدث الحالة بالعربي للعرض فقط في الجدول
                    return { 
                        ...item, 
                        status: action === 'accept' ? 'تمت الموافقة' : 'تم الرفض' 
                    };
                }
                return item;
            }));
        }
        
        // إغلاق نافذة التأكيد إذا كان الإجراء "رفض"
        if (action === 'reject') setOpenDialog(false);

    } catch (err) {
        // هذا سينبهك إذا كان هناك مشكلة في الرابط أو السيرفر
        alert(err.response?.data?.message || 'حدث خطأ في الاتصال');
    }
};

    const confirmReject = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, pt: '100px', direction: 'rtl' }}> 
        
        <Typography 
            variant="h5" 
            sx={{ 
                mb: 4, 
                fontWeight: 'bold',
                color: '#333',
                borderBottom: '2px solid #800020', // خط ديكوري أنيق تحت العنوان بلون الـ Navbar
                pb: 1,
                display: 'inline-block' // لجعل الخط على مقاس الكلام فقط
            }}
        >
            لوحة تحكم المدير - طلبات الاقتراحات
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell align="right"><b>المستخدم</b></TableCell>
                            <TableCell align="right"><b>اسم الكتاب</b></TableCell>
                            <TableCell align="right"><b>الوصف</b></TableCell>
                            <TableCell align="center"><b>التحكم</b></TableCell>
                        </TableRow>
                    </TableHead>
                 <TableBody>
    {suggestions.map((row) => {
        // تنظيف القيمة القادمة من قاعدة البيانات من أي فراغات زائدة
        const dbStatus = row.status ? String(row.status).trim() : "";

        // تعريف الحالات بناءً على ما هو موجود فعلياً في قاعدة بياناتك (الصور)
        const isPending = dbStatus === "معلق";
        const isAccepted = dbStatus === "تمت الموافقة";
        const isRejected = dbStatus === "تم الرفض";

        return (
            <TableRow 
                key={row.id} 
                sx={{ 
                    bgcolor: isAccepted ? '#f0fff4' : (isRejected ? '#fff5f5' : 'inherit'),
                    transition: '0.3s'
                }}
            >
                {/* 1. المستخدم */}
                <TableCell align="right">{row.user?.name || 'hanan hasaba'}</TableCell>

                {/* 2. اسم الكتاب */}
                <TableCell align="right">
                    <b>{row.title || row.suggested_title || 'بدون عنوان'}</b>
                </TableCell>

                {/* 3. الوصف (الحقل في القاعدة اسمه description) */}
                <TableCell 
    align="right" 
    sx={{ 
        minWidth: '250px', // الحد الأدنى لعرض العمود
        maxWidth: '400px', // الحد الأقصى لكي لا يشوه الجدول
        whiteSpace: 'normal', // يسمح للنص بالنزول لسطر جديد
        wordWrap: 'break-word', // يكسر الكلمات الطويلة إذا لزم الأمر
        lineHeight: '1.6', // تباعد مريح بين الأسطر
        fontSize: '0.875rem',
        color: '#555' 
    }}
>
    {row.description || "لا يوجد وصف"}
</TableCell>
                
                {/* 4. التحكم (الأزرار تظهر فقط إذا كانت الحالة "معلق") */}
                <TableCell align="center">
                    {isPending ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button 
                                variant="contained" 
                                color="success" 
                                size="small"
                                onClick={() => handleAction(row.id, 'accept')}
                            >
                                موافقة
                            </Button>
                            <Button 
                                variant="contained" 
                                color="error" 
                                size="small"
                                onClick={() => confirmReject(row.id)}
                            >
                                رفض
                            </Button>
                        </Box>
                    ) : (
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontWeight: 'bold', 
                                color: isAccepted ? 'green' : 'red' 
                            }}
                        >
                            {isAccepted ? 'تمت الموافقة' : 'تم الرفض '}
                        </Typography>
                    )}
                </TableCell>
            </TableRow>
        );
    })}
</TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>تأكيد الرفض</DialogTitle>
                <DialogContent><DialogContentText>هل أنت متأكد من رفض هذا الاقتراح؟</DialogContentText></DialogContent>
                <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>تراجع</Button>
    {/* تأكد أن الكلمة هنا 'reject' بالإنجليزية */}
    <Button onClick={() => handleAction(selectedId, 'reject')} color="error">
        إتمام الرفض
    </Button>
</DialogActions>
            </Dialog>
        </Box>
    );
};

export default SuggestionsManager;