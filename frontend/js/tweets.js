// js/tweets.js

import React, { useState, useEffect } from 'react';
// ... أي imports أخرى موجودة

const Tweets = () => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // دالة الإعجاب
    const handleLike = async (tweetId) => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`/api/tweets/like/${tweetId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                // تحديث حالة التغريدات
                setTweets(prevTweets => 
                    prevTweets.map(tweet => 
                        tweet.id === tweetId 
                            ? { ...tweet, likes: data.likes }
                            : tweet
                    )
                );
            } else if (response.status === 401) {
                // غير مسجل دخول
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert(error.detail || 'حدث خطأ');
            }
        } catch (error) {
            console.error('خطأ:', error);
            alert('فشل الإعجاب بالتغريدة');
        }
    };
    
    // باقي الكود الموجود مثل جلب التغريدات...
    
    return (
        <div>
            {tweets.map(tweet => (
                <div key={tweet.id} className="tweet">
                    <p>{tweet.content}</p>
                    <button 
                        onClick={() => handleLike(tweet.id)}
                        className="like-btn"
                    >
                        ❤️ {tweet.likes || 0}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Tweets;