import React, { useEffect, useState } from 'react';
import { 
Container, Grid, Card, CardMedia, CardContent, Typography, 
Rating, Chip, Box, CircularProgress, Alert, Button, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios'; // 👈 تم الإصلاح هنا
// import axiosInstance from 'axios'; // تأكدي من أن الـ import صحيح حسب مشروعك

const API_BASE_URL = "http://localhost:8000"; 

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/books-with-ratings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setBooks(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "فشل في تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    const deleteBook = async (id) => {
        if (!window.confirm("هل أنتِ متأكدة من حذف الكتاب؟")) return;

        try {
            const response = await axios.delete(`${API_BASE_URL}/api/admin/books/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setBooks(prev => prev.filter(book => book.id !== id));
            }
        } catch (err) {
            alert(err.response?.data?.message || "فشل في الحذف");
        }
    };

    // دالة مساعدة لتحديد لون ونص نوع الوصول (مجاني، مدفوع...)
    const getAccessTypeDetails = (type) => {
        switch (type) {
            case 'paid':
            case 'مدفوع':
                return { label: 'مدفوع', color: 'error' };
            case 'free':
            case 'مجاني':
                return { label: 'مجاني', color: 'success' };
            case 'trial':
            case 'تجريبي':
                return { label: 'تجريبي', color: 'warning' };
            case 'conditional':
            case 'مشروط':
                return { label: 'مشروط', color: 'info' };
            default:
                return { label: type || 'غير محدد', color: 'default' };
        }
    };

    if (loading)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );

    if (error)
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'right', color: '#4a154b' }}>
                إحصائيات وتقييمات الكتب
            </Typography>

            <Grid container spacing={3} dir="rtl">
                {books.map((book) => {
                    const access = getAccessTypeDetails(book.access_type);
                    
                    return (
                        <Grid item xs={12} sm={6} md={4} key={book.id}>
                            <Card
                                sx={{
                                    position: 'relative',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                }}
                            >
                                {/* شارة نوع الوصول (مجاني / مدفوع) أعلى اليمين */}
                                <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                                    <Chip 
                                        label={access.label} 
                                        color={access.color} 
                                        size="small" 
                                        sx={{ fontWeight: 'bold', direction: 'rtl' }}
                                    />
                                </Box>

                                {/* زر الحذف أعلى اليسار */}
                                <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
                                    <IconButton
                                        onClick={() => deleteBook(book.id)}
                                        sx={{
                                            bgcolor: 'white',
                                            '&:hover': { bgcolor: '#f8d7da' },
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Box>

                                <CardMedia
                                    component="img"
                                    height="280"
                                    image={book.cover_img || 'https://via.placeholder.com/280x400?text=No+Cover'}
                                    alt={book.title}
                                    sx={{
                                        objectFit: 'contain',
                                        bgcolor: '#f5f5f5',
                                        p: 1
                                    }}
                                />

                                <CardContent sx={{ flexGrow: 1, textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {book.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        المؤلف: {book.author}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1, flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                                        <Rating value={Number(book.average_rating)} readOnly precision={0.5} size="small" />
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            ({Number(book.average_rating).toFixed(1)})
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5, flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                                        {book.geners && book.geners.map((gen) => (
                                            <Chip
                                                key={gen.id}
                                                label={gen.name}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderColor: '#4a154b', color: '#4a154b' }}
                                            />
                                        ))}
                                    </Box>

                                    {/* معلومات إضافية: عدد الصفحات + السعر أو الشروط المخصصة */}
                                    <Box sx={{ mb: 2, mt: 'auto' }}>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            عدد الصفحات: {book.pages}
                                        </Typography>

                                        {/* إذا كان الكتاب مدفوعاً، أظهر السعر */}
                                        {(book.access_type === 'paid' || book.access_type === 'مدفوع') && (
                                            <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                                                السعر: {book.price} $
                                            </Typography>
                                        )}

                                        {/* إذا كان الكتاب تجريبياً، أظهر عدد الصفحات المتاحة */}
                                        {(book.access_type === 'trial' || book.access_type === 'تجريبي') && book.trial_pages && (
                                            <Typography variant="body2" color="warning.main" sx={{ mt: 0.5 }}>
                                                الصفحات المتاحة للتجربة: {book.trial_pages}
                                            </Typography>
                                        )}

                                        {/* إذا كان الكتاب مشروطاً */}
                                        {(book.access_type === 'conditional' || book.access_type === 'مشروط') && book.required_books_read && (
                                            <Typography variant="body2" color="info.main" sx={{ mt: 0.5 }}>
                                                يتطلب قراءة: {book.required_books_read} كتب
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box>
                                        {book.pdf && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => window.open(book.pdf, '_blank')}
                                                sx={{ bgcolor: '#541029', '&:hover': { bgcolor: '#350d35' } }}
                                            >
                                                قراءة الكتاب
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default BooksList;