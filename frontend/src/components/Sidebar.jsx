import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'مستخدم';

    const handleLogout = () => {
        localStorage.clear(); // مسح التوكن وبيانات الجلسة
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="logo" style={{ fontSize: '28px', color: '#1da1f2', marginBottom: '30px' }}>𝕏</div>
            <nav>
                <Link to="/" className="nav-item">🏠 الرئيسية</Link>
                <Link to={`/profile/${username}`} className="nav-item">👤 الملف الشخصي</Link>
            </nav>
            <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
        </div>
    );
}