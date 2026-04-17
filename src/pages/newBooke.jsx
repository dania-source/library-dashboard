import React, { useState } from 'react';
import { 
  TextField, Button, Chip, Stack, Typography, Box, Paper, Alert 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const AddBookForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        PageNumber: '',
        description: '',
        gener: [], // سنقوم بتخزين التصنيفات هنا
    });
    
    const [currentGenre, setCurrentGenre] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    // التعامل مع الحقول النصية
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // التعامل مع إضافة الـ Genres (التصنيفات)
    const handleAddGenre = (e) => {
        if (e.key === 'Enter' && currentGenre.trim()) {
            e.preventDefault();
            setFormData({ ...formData, gener: [...formData.gener, currentGenre] });
            setCurrentGenre('');
        }
    };

    const handleDeleteGenre = (genreToDelete) => {
        setFormData({ ...formData, gener: formData.gener.filter(g => g !== genreToDelete) });
    };

    // إرسال البيانات
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // استخدام FormData لأن لدينا ملفات
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('PageNumber', formData.PageNumber);
        data.append('description', formData.description);
        
        // إرسال المصفوفة (Laravel يتوقعها كـ array)
        formData.gener.forEach((g, index) => {
            data.append(`gener[${index}]`, g);
        });

        if (coverImage) data.append('cover_image', coverImage);
        if (pdfFile) data.append('pdf_path', pdfFile);

        try {
            const response = await axios.post('http://localhost:8000/api/books', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // إذا كان هناك نظام حماية
                }
            });
            setMessage({ type: 'success', text: response.data.message });
        } catch (error) {
            const errorMsg = error.response?.data?.message || "حدث خطأ ما";
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>إضافة كتاب جديد</Typography>
            
            {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField label="عنوان الكتاب" name="title" fullWidth required onChange={handleChange} />
                    <TextField label="اسم المؤلف" name="author" fullWidth required onChange={handleChange} />
                    <TextField label="عدد الصفحات" name="PageNumber" type="number" fullWidth required onChange={handleChange} />
                    
                    <TextField 
                        label="التصنيفات (اضغط Enter للإضافة)" 
                        value={currentGenre}
                        onChange={(e) => setCurrentGenre(e.target.value)}
                        onKeyDown={handleAddGenre}
                        fullWidth 
                    />
                    <Box>
                        {formData.gener.map((g, i) => (
                            <Chip key={i} label={g} onDelete={() => handleDeleteGenre(g)} sx={{ m: 0.5 }} />
                        ))}
                    </Box>

                    <TextField label="وصف الكتاب" name="description" multiline rows={3} fullWidth onChange={handleChange} />

                    <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                        رفع صورة الغلاف
                        <input type="file" hidden accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
                    </Button>
                    {coverImage && <Typography variant="caption">{coverImage.name}</Typography>}

                    <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} color="secondary">
                        رفع ملف PDF
                        <input type="file" hidden accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
                    </Button>
                    {pdfFile && <Typography variant="caption">{pdfFile.name}</Typography>}

                    <Button type="submit" variant="contained" color="primary" size="large">حفظ الكتاب</Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default AddBookForm;