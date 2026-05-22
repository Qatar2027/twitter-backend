import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // إرسال بيانات المستخدم الجديد إلى سيرفر الـ Backend
            await API.post('/auth/register', { username, email, password });
            alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
            navigate('/login'); // التوجه لصفحة الدخول تلقائياً
        } catch (error) {
            alert(error.response?.data?.detail || "حدث خطأ أثناء التسجيل، ربما اسم المستخدم مستخدم سابقاً");
        }
    };

    return (
        <div className="auth-form">
            <h2>إنشاء حساب جديد في تويتر</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">تسجيل الحساب</button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
                لديك حساب بالفعل؟ <Link to="/login" style={{ color: '#1da1f2' }}>تسجيل الدخول</Link>
            </p>
        </div>
    );
}