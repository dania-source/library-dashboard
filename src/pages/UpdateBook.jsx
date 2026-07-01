import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Box, Typography, CircularProgress, MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BooksManager = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    
    // حالة الكتاب المختار للتعديل
    const [selectedBook, setSelectedBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        PageNumber: '',
        description: '',
        gener: '', 
        // الحقول الجديدة المضافة
        access_type: 'free',
        price: '',
        trial_pages: '',
        required_books_read: ''
    });

    // حالات الملفات
    const [coverImg, setCoverImg] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const API_URL = 'http://localhost:8000/api/books';
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(API_URL, config);
            setBooks(response.data.data);
        } catch (err) {
            console.error("خطأ في جلب الكتب", err);
        } finally {
            setLoading(false);
        }
    };

    // فتح نافذة التعديل وتعبئة البيانات القادمة من السيرفر
    const handleEditClick = (book) => {
        setSelectedBook(book);
        setFormData({
            title: book.title || '',
            author: book.author || '',
            PageNumber: book.PageNumber || book.pages || '', 
            description: book.description || '',
            gener: book.geners?.map(g => g.name).join(', ') || '',
            // تعبئة الحقول الجديدة
            access_type: book.access_type || 'free',
            price: book.price || '',
            trial_pages: book.trial_pages || '',
            required_books_read: book.required_books_read || ''
        });
        setCoverImg(null); // إعادة تعيين الملفات المرفوعة سابقاً
        setPdfFile(null);
        setEditMode(true);
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('_method', 'PUT'); // لإعلام Laravel بأنها عملية تحديث
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('PageNumber', formData.PageNumber);
        data.append('description', formData.description);
        
        // الحقول الجديدة
        data.append('access_type', formData.access_type);
        if (formData.access_type === 'paid') data.append('price', formData.price);
        if (formData.access_type === 'trial') data.append('trial_pages', formData.trial_pages);
        if (formData.access_type === 'conditional') data.append('required_books_read', formData.required_books_read);

        const generArray = formData.gener.split(',').map(item => item.trim());
        generArray.forEach(g => data.append('gener[]', g));

        if (coverImg) data.append('cover_img', coverImg);
        if (pdfFile) data.append('pdf_path', pdfFile);

        try {
            const response = await axios.post(`${API_URL}/${selectedBook.id}`, data, {
                headers: { 
                    ...config.headers,
                    'Content-Type': 'multipart/form-data' 
                }
            });

            if (response.data.success) {
                alert('تم تحديث بيانات الكتاب بنجاح');
                setEditMode(false);
                fetchBooks(); 
            }
        } catch (err) {
            alert(err.response?.data?.message || 'فشلت عملية التعديل');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, pt: '100px', direction: 'rtl' }}> 
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#333', borderBottom: '2px solid #800020', pb: 1, display: 'inline-block' }}>
                إدارة الكتب المتاحة
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell align="right"><b>العنوان</b></TableCell>
                            <TableCell align="right"><b>المؤلف</b></TableCell>
                            <TableCell align="right"><b>نوع الوصول</b></TableCell> 
                            <TableCell align="right"><b>الوصف (الملخص)</b></TableCell> {/* 🆕 رأس الحقل الجديد */}
                            <TableCell align="right"><b>عدد الصفحات</b></TableCell>
                            <TableCell align="center"><b>التحكم</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id} hover>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{book.title}</TableCell>
                                <TableCell align="right">{book.author}</TableCell>
                                <TableCell align="right">{book.access_type || 'مجاني'}</TableCell>
                                
                                {/* 🆕 خلية عرض الوصف بشكل مختصر ومحمي من تشويه التصميم */}
                                <TableCell 
                                    align="right" 
                                    sx={{ 
                                        maxWidth: '180px', 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis' 
                                    }}
                                >
                                    {book.description || "لا يوجد وصف"}
                                </TableCell>

                                <TableCell align="right">{book.pages || book.PageNumber}</TableCell>
                                <TableCell align="center">
                                    <Button variant="outlined" size="small" onClick={() => handleEditClick(book)}>
                                        تعديل
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* نافذة التعديل */}
            <Dialog open={editMode} onClose={() => setEditMode(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ textAlign: 'right' }}>تعديل بيانات: {selectedBook?.title}</DialogTitle>
                <form onSubmit={handleUpdate}>
                    <DialogContent dir="rtl">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                            <TextField label="عنوان الكتاب" fullWidth value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                            <TextField label="اسم المؤلف" fullWidth value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
                            <TextField label="عدد الصفحات" type="number" fullWidth value={formData.PageNumber} onChange={(e) => setFormData({...formData, PageNumber: e.target.value})} />
                            <TextField label="التصنيفات (افصل بينها بفاصلة)" placeholder="خيال, دراما, تاريخ" fullWidth value={formData.gener} onChange={(e) => setFormData({...formData, gener: e.target.value})} />
                            <TextField label="وصف الكتاب" multiline rows={3} fullWidth value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />

                            {/* قائمة منسدلة لاختيار نوع الوصول */}
                            <TextField
                                select
                                label="نوع الوصول"
                                fullWidth
                                value={formData.access_type}
                                onChange={(e) => setFormData({...formData, access_type: e.target.value})}
                            >
                                <MenuItem value="free">مجاني</MenuItem>
                                <MenuItem value="paid">مدفوع</MenuItem>
                                <MenuItem value="conditional">مشروط</MenuItem>
                            </TextField>

                            {/* الحقول الشرطية: تظهر وتختفي ديناميكياً بناءً على نوع الوصول المختار */}
                            {formData.access_type === 'paid' && (
                                <TextField 
                                    label="سعر الكتاب" 
                                    type="number" 
                                    fullWidth 
                                    value={formData.price} 
                                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                />
                            )}



                            {formData.access_type === 'conditional' && (
                                <TextField 
                                    label="عدد الكتب المطلوب قراءتها لفتح هذا الكتاب" 
                                    type="number" 
                                    fullWidth 
                                    value={formData.required_books_read} 
                                    onChange={(e) => setFormData({...formData, required_books_read: e.target.value})} 
                                />
                            )}

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>تغيير صورة الغلاف:</Typography>
                                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} fullWidth>
                                    رفع صورة
                                    <input type="file" hidden accept="image/*" onChange={(e) => setCoverImg(e.target.files[0])} />
                                </Button>
                                {coverImg && <Typography variant="caption" color="success.main">{coverImg.name}</Typography>}
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom>تغيير ملف PDF:</Typography>
                                <Button variant="outlined" component="label" color="secondary" startIcon={<CloudUploadIcon />} fullWidth>
                                    رفع ملف PDF جديد
                                    <input type="file" hidden accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
                                </Button>
                                {pdfFile && <Typography variant="caption" color="success.main">{pdfFile.name}</Typography>}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setEditMode(false)} color="inherit">إلغاء</Button>
                        <Button type="submit" variant="contained" sx={{ px: 4 }}>حفظ التعديلات</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default BooksManager;