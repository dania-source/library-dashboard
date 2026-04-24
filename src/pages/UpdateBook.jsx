import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Box, Typography, CircularProgress, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
        gener: '' // سنرسلها كمصفوفة لاحقاً
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
        console.log("البيانات القادمة:", response.data.data); // تفقد هذا السطر في المتصفح (F12)
        setBooks(response.data.data);
    } catch (err) {
        console.error("خطأ في جلب الكتب", err);
    } finally {
        setLoading(false);
    }
};

    // فتح نافذة التعديل وتعبئة البيانات
const handleEditClick = (book) => {
    setSelectedBook(book);
    setFormData({
        title: book.title || '',
        author: book.author || '',
        // تنبيه: هل الجدول يعرضها كـ PageNumber أم pages؟ 
        // إذا كنتِ غيرتها في الـ API إلى pages، اكتبي هنا book.pages
        PageNumber: book.PageNumber || book.pages || '', 
        description: book.description || '',
        gener: book.geners?.map(g => g.name).join(', ') || ''
    });
    setEditMode(true);
};
    

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // استخدام FormData لأننا نرفع ملفات (Images, PDF)
        const data = new FormData();
        data.append('_method', 'PUT'); // مهم جداً لـ Laravel ليفهم أنها عملية Update عند استخدام FormData
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('PageNumber', formData.PageNumber);
        data.append('description', formData.description);
        
        // تحويل نص التصنيفات إلى مصفوفة كما يتوقع Laravel
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
                fetchBooks(); // تحديث الجدول
            }
        } catch (err) {
            alert(err.response?.data?.message || 'فشلت عملية التعديل');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4, direction: 'rtl' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>إدارة الكتب المتاحة</Typography>

  <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
    <Table>
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
                {/* الترتيب هنا يجب أن يطابق الترتيب في الأسفل تماماً */}
                <TableCell align="right"><b>العنوان</b></TableCell>
                <TableCell align="right"><b>المؤلف</b></TableCell>
                <TableCell align="right"><b>الملخص</b></TableCell>
                <TableCell align="right"><b>عددالصفحات</b></TableCell>
                <TableCell align="center"><b>التحكم</b></TableCell>
            </TableRow>
        </TableHead>
      <TableBody>
    {books.map((book) => (
        <TableRow key={book.id} hover>
            {/* 1. العنوان */}
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {book.title}
            </TableCell>

            {/* 2. المؤلف */}
            <TableCell align="right">
                {book.author}
            </TableCell>

            {/* 3. الوصف (الملخص) */}
            <TableCell 
                align="right" 
                sx={{ 
                    minWidth: '250px', 
                    maxWidth: '400px', 
                    whiteSpace: 'normal', 
                    wordWrap: 'break-word', 
                    lineHeight: '1.6', 
                    fontSize: '0.875rem',
                    color: '#555' 
                }}
            >
                {/* تأكد أن الاسم هنا مطابق لما يرسله السيرفر (description) */}
{book.description ? String(book.description) : "الحقل فارغ تماماً"}    
        </TableCell>

<TableCell align="right">
    {book.pages}
</TableCell>



            {/* 4. التحكم */}
            <TableCell align="center">
                <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleEditClick(book)}
                >
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
                            <TextField label="عنوان الكتاب" fullWidth value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})} />
                            
                            <TextField label="اسم المؤلف" fullWidth value={formData.author} 
                                onChange={(e) => setFormData({...formData, author: e.target.value})} />
                            
                            <TextField label="عدد الصفحات" type="number" fullWidth value={formData.PageNumber} 
                                onChange={(e) => setFormData({...formData, PageNumber: e.target.value})} />

                            <TextField label="التصنيفات (افصل بينها بفاصلة)" placeholder="خيال, دراما, تاريخ" fullWidth value={formData.gener} 
                                onChange={(e) => setFormData({...formData, gener: e.target.value})} />

                            <TextField label="وصف الكتاب" multiline rows={3} fullWidth value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})} />

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