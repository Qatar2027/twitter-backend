import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../../styles/main.css';

export default function Home() {
    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const currentUsername = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    const fetchTweets = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/tweets/timeline', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTweets(data);
            }
        } catch (error) {
            console.error("خطأ في جلب التغريدات", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTweets();
        }
    }, []);

    const handlePublish = async (e) => {
        e.preventDefault();
        const text = content.trim();
        if (!text) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/tweets/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: text,
                    image_url: ""
                })
            });

            if (response.ok) {
                setContent('');
                fetchTweets();
            } else {
                const error = await response.json();
                alert(error.detail || "فشل نشر التغريدة");
            }
        } catch (error) {
            console.error("خطأ في نشر التغريدة", error);
            alert("فشل نشر التغريدة");
        } finally {
            setLoading(false);
        }
    };

    // ✅ دالة الإعجاب المعدلة - ستظهر في Network الآن
    const handleLike = async (tweetId) => {
        console.log("تم الضغط على إعجاب للتغريدة:", tweetId);
        
        try {
            const response = await fetch(`http://localhost:8000/api/tweets/like/${tweetId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("استجابة الإعجاب:", response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log("تم الإعجاب بنجاح:", data);
                // تحديث التغريدة المحددة فقط بدلاً من جلب الكل
                setTweets(prevTweets =>
                    prevTweets.map(tweet =>
                        tweet.id === tweetId
                            ? { ...tweet, likes: data.likes }
                            : tweet
                    )
                );
            } else {
                const error = await response.json();
                console.error("خطأ:", error);
                alert(error.detail || "فشل تسجيل الإعجاب");
            }
        } catch (error) {
            console.error("خطأ في الاتصال:", error);
            alert("فشل الاتصال بالخادم");
        }
    };

    const handleDelete = async (tweetId) => {
        const confirmDelete = window.confirm("هل تريد حذف هذه التغريدة؟");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/api/tweets/delete/${tweetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                fetchTweets();
            } else {
                const error = await response.json();
                alert(error.detail || "فشل حذف التغريدة");
            }
        } catch (error) {
            console.error("خطأ في حذف التغريدة", error);
            alert("فشل حذف التغريدة");
        }
    };

    const handleFollow = async (authorUsername) => {
        if (!authorUsername) return;

        try {
            const response = await fetch(`http://localhost:8000/api/auth/follow/${authorUsername}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                alert(`أنت الآن تتابع @${authorUsername}`);
                fetchTweets();
            } else {
                const error = await response.json();
                alert(error.detail || "حدث خطأ في المتابعة");
            }
        } catch (error) {
            console.error("خطأ في المتابعة", error);
            alert("أنت تتابع هذا المستخدم بالفعل أو أنه حسابك الشخصي!");
        }
    };

    return (
        <div className="main-layout">
            <Sidebar />

            <div className="content-area">
                <h2>الرئيسية</h2>

                <form onSubmit={handlePublish} className="tweet-box">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="ماذا يدور في ذهنك؟"
                        maxLength={280}
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "جاري النشر..." : "تغريد"}
                    </button>
                </form>

                <div className="tweets-list">
                    {tweets.length === 0 ? (
                        <p className="no-tweets">لا توجد تغريدات بعد</p>
                    ) : (
                        tweets.map((tweet) => {
                            const authorUsername = tweet.author?.username || 'مستخدم';
                            const isOwner = authorUsername === currentUsername;

                            return (
                                <div key={tweet.id} className="tweet-card">
                                    <div className="tweet-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4>@{authorUsername}</h4>
                                        {!isOwner && (
                                            <button onClick={() => handleFollow(authorUsername)} className="follow-btn">
                                                ➕ متابعة
                                            </button>
                                        )}
                                    </div>

                                    <p>{tweet.content}</p>

                                    <div className="tweet-actions" style={{ marginTop: '10px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        {/* ✅ تغيير من span إلى button */}
                                        <button
                                            onClick={() => handleLike(tweet.id)}
                                            style={{
                                                cursor: 'pointer',
                                                color: '#e0245e',
                                                fontWeight: 'bold',
                                                background: 'none',
                                                border: 'none',
                                                fontSize: 'inherit'
                                            }}
                                        >
                                            ❤️ {tweet.likes ?? 0} إعجاب
                                        </button>

                                        <span className="tweet-date">
                                            {new Date(tweet.created_at).toLocaleString('ar-EG')}
                                        </span>

                                        {isOwner && (
                                            <button
                                                onClick={() => handleDelete(tweet.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                    background: 'none',
                                                    border: 'none',
                                                    fontSize: 'inherit'
                                                }}
                                            >
                                                🗑️ حذف
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}