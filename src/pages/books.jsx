import React, { useEffect, useState } from 'react';
import { 
Container, Grid, Card, CardMedia, CardContent, Typography, 
Rating, Chip, Box, CircularProgress, Alert, Button, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

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
                {books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                        <Card
                            sx={{
                                position: 'relative', // 👈 مهم
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }}
                        >

                            {/* زر الحذف فوق */}
                            <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
                                <IconButton
                                    onClick={() => deleteBook(book.id)}
                                    sx={{
                                        bgcolor: 'white',
                                        '&:hover': { bgcolor: '#f8d7da' }
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

                            <CardContent sx={{ flexGrow: 1, textAlign: 'right' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    {book.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    المؤلف: {book.author}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1, flexDirection: 'row-reverse' }}>
                                    <Rating value={Number(book.average_rating)} readOnly precision={0.5} size="small" />
                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                        ({Number(book.average_rating).toFixed(1)})
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5, flexDirection: 'row-reverse' }}>
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

                                <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                                    عدد الصفحات: {book.pages}
                                </Typography>

                                <Box sx={{ mt: 'auto' }}>
                                    {book.pdf && (
                                        <Button
                                            variant="contained"
                                            onClick={() => window.open(book.pdf, '_blank')}
                                        >
                                            قراءة الكتاب
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default BooksList;