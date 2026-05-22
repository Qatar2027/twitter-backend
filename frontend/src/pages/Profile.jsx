import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Profile() {
    const { username } = useParams(); // جلب اسم المستخدم من رابط الصفحة
    const [userTweets, setUserTweets] = useState([]);

    useEffect(() => {
        const fetchUserTweets = async () => {
            try {
                // طلب التغريدات الخاصة بهذا المستخدم فقط من السيرفر الخلفي
                const response = await API.get(`/tweets/user/${username}`);
                setUserTweets(response.data);
            } catch (error) {
                console.error("خطأ في جلب تغريدات المستخدم", error);
            }
        };
        fetchUserTweets();
    }, [username]);

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content-area">
                <div className="profile-header">
                    <h2>@{username}</h2>
                    <p style={{ color: '#8899a6' }}>مطور منصة تويتر كلوون 🚀</p>
                </div>
                
                <h3 style={{ borderBottom: '1px solid #38444d', paddingBottom: '10px' }}>التغريدات</h3>
                <div className="tweets-list">
                    {userTweets.length === 0 ? (
                        <p className="no-tweets">لم يقم هذا المستخدم بالتغريد بعد.</p>
                    ) : (
                        userTweets.map((tweet) => (
                            <div key={tweet.id} className="tweet-card">
                                <h4>@{username}</h4>
                                <p>{tweet.content}</p>
                                <span className="tweet-date">{new Date(tweet.created_at).toLocaleString('ar-EG')}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}