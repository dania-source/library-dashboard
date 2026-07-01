import React, { useState } from 'react';
import { 
  TextField, Button, Box, Typography, Container, Paper, 
  Autocomplete, Chip, Alert, CircularProgress, MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const AddBook = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        PageNumber: '',
        description: '',
        gener: [],
        access_type: 'free', 
        price: '',
        trial_pages: '',
        required_books_read: '',
    });
    const [files, setFiles] = useState({
        cover_img: null,
        pdf_path: null
    });

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('title', bookData.title);
        formData.append('author', bookData.author);
        formData.append('PageNumber', bookData.PageNumber);
        formData.append('description', bookData.description);
        
        // تحويل القيمة العربية إلى الإنجليزية قبل الإرسال لتتطابق مع الـ Validation في الباك إيند
        formData.append('access_type', bookData.access_type);

        // إرسال الحقول الإضافية بناءً على نوع الوصول المختار
        if (bookData.access_type === 'paid') formData.append('price', bookData.price);
        if (bookData.access_type === 'trial') formData.append('trial_pages', bookData.trial_pages);
        if (bookData.access_type === 'conditional') formData.append('required_books_read', bookData.required_books_read);
        
        // 👈 الطريقة الصحيحة لإرسال المصفوفة ليفهمها لارافيل الأصلي كـ array
        bookData.gener.forEach((g, index) => {
            formData.append(`gener[${index}]`, g);
        });

        if (files.cover_img) formData.append('cover_img', files.cover_img);
        if (files.pdf_path) formData.append('pdf_path', files.pdf_path);

        try {
            const response = await axios.post('http://localhost:8000/api/books', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setMessage({ type: 'success', text: response.data.message });

            // تفريغ الحقول بعد النجاح
            setBookData({
                title: '',
                author: '',
                PageNumber: '',
                description: '',
                gener: [],
                access_type: 'free',
                price: '',
                trial_pages: '',
                required_books_read: '',
            });
            setFiles({
                cover_img: null,
                pdf_path: null
            });

        } catch (error) {
            // إظهار تفاصيل أخطاء الـ Validation القادمة من لارافيل لمعرفة السبب فوراً لو فشل
            if (error.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors).flat().join(' - ');
                setMessage({ type: 'error', text: validationErrors });
            } else {
                const errorMsg = error.response?.data?.message || "حدث خطأ أثناء الإضافة";
                setMessage({ type: 'error', text: errorMsg });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
                <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
                    إضافة كتاب جديد للمكتبة
                </Typography>

                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth label="عنوان الكتاب" name="title"
                        value={bookData.title} onChange={handleChange}
                        margin="normal" required
                    />

                    <TextField
                        fullWidth label="المؤلف" name="author"
                        value={bookData.author} onChange={handleChange}
                        margin="normal" required
                    />

                    <TextField
                        fullWidth label="عدد الصفحات" name="PageNumber" type="number"
                        value={bookData.PageNumber} onChange={handleChange}
                        margin="normal" required
                    />

                    {/* قائمة اختيار نوع الوصول ترسل القيم الإنجليزية مباشرة للباك إيند */}
                    <TextField
                        select
                        fullWidth
                        label="نوع الوصول للكتاب"
                        name="access_type"
                        value={bookData.access_type}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        <MenuItem value="free">مجاني</MenuItem>
                        <MenuItem value="paid">مدفوع</MenuItem>
                        <MenuItem value="conditional">مشروط</MenuItem>
                    </TextField>

                    {/* ظهور مشروط للحقول الإضافية المطلوبة في الباك إيند */}
                    {bookData.access_type === 'paid' && (
                        <TextField
                            fullWidth label="سعر الكتاب" name="price" type="number"
                            value={bookData.price} onChange={handleChange}
                            margin="normal" required
                        />
                    )}



                    {bookData.access_type === 'conditional' && (
                        <TextField
                            fullWidth label="عدد الكتب المطلوب قراءتها لفتح هذا الكتاب" name="required_books_read" type="number"
                            value={bookData.required_books_read} onChange={handleChange}
                            margin="normal" required
                        />
                    )}

                    <Autocomplete
                        multiple
                        freeSolo
                        options={[]} 
                        value={bookData.gener}
                        onChange={(event, newValue) => setBookData({ ...bookData, gener: newValue })}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip label={option} {...getTagProps({ index })} key={index} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="التصنيفات (اضغط Enter للإضافة)" margin="normal" />
                        )}
                        sx={{ mt: 1 }}
                    />

                    <TextField
                        fullWidth label="وصف الكتاب" name="description"
                        multiline rows={3} value={bookData.description}
                        onChange={handleChange} margin="normal"
                    />

                    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined" component="label"
                            startIcon={<CloudUploadIcon />}
                            color={files.cover_img ? "success" : "primary"}
                        >
                            {files.cover_img ? "تم اختيار الغلاف" : "غلاف الكتاب"}
                            <input type="file" hidden name="cover_img" accept="image/*" onChange={handleFileChange} />
                        </Button>

                        <Button
                            variant="outlined" component="label"
                            startIcon={<CloudUploadIcon />}
                            color={files.pdf_path ? "success" : "primary"}
                        >
                            {files.pdf_path ? "تم اختيار ملف PDF" : "ملف PDF"}
                            <input type="file" hidden name="pdf_path" accept=".pdf" onChange={handleFileChange} />
                        </Button>
                    </Box>

                    <Button
                        type="submit" fullWidth variant="contained"
                        sx={{ mt: 4, py: 1.5 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "إضافة الكتاب"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddBook;