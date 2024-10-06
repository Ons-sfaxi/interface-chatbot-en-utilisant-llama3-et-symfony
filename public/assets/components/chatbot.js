import React, { useState, useRef } from 'react';
import '../styles/app.css'; // Assurez-vous d'importer vos styles

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatBodyRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessages = [...messages, { type: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Scroll to the bottom
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;

        try {
            const response = await fetch(`/chat?message=${encodeURIComponent(input)}`);
            const data = await response.json();
            setMessages([...newMessages, { type: 'bot', text: data.response }]);
        } catch (error) {
            console.error('Error fetching the message:', error);
        }
    };

    const handleQuickReply = (message) => {
        setInput(message);
        handleSubmit(new Event('submit'));
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <img src="../chatbot/images/photo-2.jpg" alt="Chatbot Logo" className="chat-logo" />
                Chatbot
                <div className="status-indicator"></div>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}`}>
                        <img src={msg.type === 'user' ? "../chatbot/images/photo-1.jpg" : "../chatbot/images/llama.jpg"} alt={`${msg.type} Profile`} />
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="quick-reply-buttons">
                <button onClick={() => handleQuickReply('Hello')}>Hello</button>
                <button onClick={() => handleQuickReply('Help')}>Help</button>
                <button onClick={() => handleQuickReply('Bye')}>Bye</button>
            </div>
            <form onSubmit={handleSubmit} className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;
