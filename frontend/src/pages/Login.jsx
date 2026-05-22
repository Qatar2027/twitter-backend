import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('username', response.data.username);
            navigate('/'); // الانتقال للصفحة الرئيسية
        } catch (error) {
            alert("اسم المستخدم أو كلمة المرور غير صحيحة");
        }
    };

    return (
        <div className="auth-form">
            <h2>تسجيل الدخول إلى تويتر</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="اسم المستخدم" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="كلمة المرور" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">دخول</button>
            </form>
            
            {/* تم وضع السطر هنا بشكل آمن داخل المجلد الرئيسي المتكامل */}
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
                ليس لديك حساب؟ <Link to="/register" style={{ color: '#1da1f2' }}>إنشاء حساب جديد</Link>
            </p>
        </div>
    );
}