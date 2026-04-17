import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/admin/books-with-ratings', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            console.log(response.data);
            if (response.data.success) {
                setBooks(response.data.data);
            }
        } catch (err) {
            setError('فشل في جلب البيانات: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // دالة لتنظيف المسار وعرض الصورة بشكل صحيح
const getFileUrl = (path) => {
    if (!path) return null;

    // بما أن المسار عندك يبدأ بـ /public فنحن نحتاج لحذفها
    // السطر التالي سيحذف /public أو public سواء بدأت بسلاش أو لا
    const cleanPath = path.replace(/^\/?public\//, '');

    return `http://localhost:8000/storage/${cleanPath}`;
};

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>جاري تحميل الكتب... 📚</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>;

    return (
        <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>قائمة الكتب وتقييماتها 📖</h2>
            <table style={tableStyle}>
                <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
                        <th style={thStyle}>الغلاف</th>
                        <th style={thStyle}>العنوان</th>
                        <th style={thStyle}>المؤلف</th>
                        <th style={thStyle}>التصنيف</th>
                        <th style={thStyle}>التقييم</th>
                        <th style={thStyle}>ملف PDF</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id} style={trStyle}>
                            <td style={tdStyle}>
    {book.cover_img ? ( // تأكد أنها cover_img وليس cover_imge
        <img 
            src={getFileUrl(book.cover_img)} 
            alt={book.title} 
            style={imageStyle}
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/50x70?text=No+Cover'; 
            }}
        />
    ) : '❌'}
</td>
                            <td style={tdStyle}><strong>{book.title}</strong></td>
                            <td style={tdStyle}>{book.author}</td>
                            <td style={tdStyle}>
                                {Array.isArray(book.gener) ? book.gener.join(' | ') : book.gener}
                            </td>
                            <td style={tdStyle}>
                                <span style={ratingBadge}>
                                ⭐ {parseFloat(book.average_rating).toFixed(1)}
                                </span>
                            </td>
                            <td style={tdStyle}>

{book.pdf ? (
    <a 
        href={getFileUrl(book.pdf)} 
        target="_blank" 
        rel="noopener noreferrer"
        style={pdfLinkStyle}
    >
        فتح الملف 📄
    </a>) : 'غير متوفر'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- التنسيقات (Styles) ---
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff' };
const thStyle = { padding: '15px', textAlign: 'right', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' };
const trStyle = { transition: 'background 0.3s' };
const imageStyle = { width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const ratingBadge = { backgroundColor: '#fff3cd', color: '#856404', padding: '5px 10px', borderRadius: '12px', fontSize: '14px' };
const pdfLinkStyle = { color: '#e74c3c', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #e74c3c', padding: '4px 8px', borderRadius: '4px' };

export default BooksList;