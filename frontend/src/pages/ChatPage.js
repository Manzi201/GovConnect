import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    Send as SendIcon,
    Circle as CircleIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { messagesAPI, authAPI } from '../services/api';
import io from 'socket.io-client';
import './ChatPage.css';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export default function ChatPage() {
    const { otherUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const socketRef = useRef();
    const chatEndRef = useRef();

    const fetchOtherUser = useCallback(async () => {
        try {
            const response = await authAPI.getUserById(otherUserId);
            setOtherUser(response.data.user);
        } catch (error) {
            console.error('Failed to get user details', error);
        }
    }, [otherUserId]);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await messagesAPI.getMessages(otherUserId);
            setMessages(response.data.messages);
            messagesAPI.markAsRead(otherUserId);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    }, [otherUserId]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);

        fetchOtherUser();
        fetchMessages();

        socketRef.current = io(SOCKET_URL);

        if (user) {
            socketRef.current.emit('join-user', user.id);
        }

        socketRef.current.on('new-message', (message) => {
            if (message.senderId === otherUserId) {
                setMessages(prev => [...prev, message]);
                messagesAPI.markAsRead(otherUserId);
            }
        });

        return () => socketRef.current.disconnect();
    }, [otherUserId, fetchOtherUser, fetchMessages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            receiverId: otherUserId,
            content: newMessage,
            senderId: currentUser.id
        };

        try {
            const response = await messagesAPI.sendMessage(messageData);
            setMessages(prev => [...prev, response.data.message]);
            socketRef.current.emit('send-message', response.data.message);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    if (!otherUser) return <div className="loading-state glass">Connecting to service...</div>;

    return (
        <div className="chat-page-container fade-in">
            <div className="chat-window glass">
                <header className="chat-header">
                    <div className="avatar-sm">
                        {otherUser.profilePhoto ? <img src={otherUser.profilePhoto} alt="" /> : otherUser.name.charAt(0)}
                    </div>
                    <div className="header-info">
                        <h3>{otherUser.name}</h3>
                        <span className="status-online">
                            <CircleIcon sx={{ fontSize: 8, mr: 0.5 }} /> Online
                        </span>
                        <div className="official-area">
                            <BusinessIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} />
                            {otherUser.serviceArea || 'General'} • {otherUser.institution || 'Government'}
                        </div>
                    </div>
                </header>

                <div className="messages-area">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-wrapper ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}>
                            <div className="message-bubble">
                                <p>{msg.content}</p>
                                <div className="message-time">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn-send" disabled={!newMessage.trim()}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}
