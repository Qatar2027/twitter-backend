import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import '../../styles/main.css';

export default function Home() {
    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState('');

    const fetchTweets = async () => {
        try {
            const response = await API.get('/tweets/timeline');
            setTweets(response.data);
        } catch (error) {
            console.error("خطأ في جلب التغريدات", error);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await API.post('/tweets/create', { content, image_url: "" });
            setContent('');
            fetchTweets();
        } catch (error) {
            alert("فشل نشر التغريدة");
        }
    };

    const handleLike = async (tweetId) => {
        try {
            await API.post(`/tweets/like/${tweetId}`);
            fetchTweets();
        } catch (error) {
            console.error("خطأ في تسجيل الإعجاب", error);
        }
    };

    const handleDelete = async (tweetId) => {
        try {
            await API.delete(`/tweets/delete/${tweetId}`);
            fetchTweets();
        } catch (error) {
            console.error("خطأ في حذف التغريدة", error);
            alert("فشل حذف التغريدة");
        }
    };

    const handleFollow = async (authorUsername) => {
        try {
            await API.post(`/auth/follow/${authorUsername}`);
            alert(`أنت الآن تتابع @${authorUsername}`);
            fetchTweets();
        } catch (error) {
            alert("أنت تتابع هذا المستخدم بالفعل أو أنه حسابك الشخصي!");
        }
    };

    const currentUsername = localStorage.getItem('username');

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
                    />

                    <button type="submit">تغريد</button>
                </form>

                <div className="tweets-list">
                    {tweets.length === 0 ? (
                        <p className="no-tweets">لا توجد تغريدات بعد</p>
                    ) : (
                        tweets.map((tweet) => (
                            <div key={tweet.id} className="tweet-card">
                                <div
                                    className="tweet-header"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <h4>@{tweet.author ? tweet.author.username : 'مستخدم'}</h4>

                                    {tweet.author?.username !== currentUsername && (
                                        <button
                                            onClick={() => handleFollow(tweet.author?.username)}
                                            className="follow-btn"
                                        >
                                            ➕ متابعة
                                        </button>
                                    )}
                                </div>

                                <p>{tweet.content}</p>

                                <div
                                    className="tweet-actions"
                                    style={{
                                        marginTop: '10px',
                                        display: 'flex',
                                        gap: '15px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span
                                        onClick={() => handleLike(tweet.id)}
                                        style={{
                                            cursor: 'pointer',
                                            color: '#e0245e',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ❤️ {tweet.likes || 0} إعجاب
                                    </span>

                                    <span className="tweet-date">
                                        {new Date(tweet.created_at).toLocaleString('ar-EG')}
                                    </span>

                                    {tweet.author?.username === currentUsername && (
                                        <span
                                            onClick={() => handleDelete(tweet.id)}
                                            style={{
                                                cursor: 'pointer',
                                                color: 'red',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            🗑️ حذف
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}