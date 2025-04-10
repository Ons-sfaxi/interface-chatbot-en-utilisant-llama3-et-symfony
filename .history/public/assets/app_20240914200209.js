import React from 'react';
import ReactDOM from 'react-dom';
import Chatbot from './components/chatbot.js';
import './styles/app.css';
import './styles/chatbot.css';
<div id="chatbot-root"></div>
<script src="{{ asset('assets/app.js') }}"></script>
    <div class="chat-container">
        <div class="chat-header">
            <img src="{{ asset('assets/images/llama.jpg') }}" alt="Chatbot Logo" style="height: 40px; position: absolute; left: 20px; top: 20px;">
            LLAMA3-CHAT
            <div class="status-indicator"></div>
        </div>
        <div class="chat-body" id="chat-body">
            <!-- Messages will be displayed here -->
        </div>
        <div class="quick-reply-buttons">
            <button onclick="sendQuickReply('Hello')">Hello</button>
            <button onclick="sendQuickReply('Help')">Help</button>
            <button onclick="sendQuickReply('Bye')">Bye</button>
        </div>
        <form id="chat-form" class="chat-input">
            <input type="text" id="message" placeholder="Ask something...">
            <button type="submit">Send</button>
        </form>
    </div>

    <script>
        document.getElementById('chat-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const messageInput = document.getElementById('message');
            const message = messageInput.value;

            if (message.trim() === '') return;

            const chatBody = document.getElementById('chat-body');
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.innerHTML = `<img src="{{ asset('assets/images/photo-1.jpg') }}" alt="User Profile">` + message;
            chatBody.appendChild(userMessageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
            messageInput.value = '';

            fetch(`/chat?message=${encodeURIComponent(message)}`)
                .then(response => response.json())
                .then(data => {
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.className = 'chat-message bot';
                    botMessageDiv.innerHTML = `<img src="{{ asset('assets/images/chat.jpg') }}" alt="Bot Profile">` + data.response;
                    chatBody.appendChild(botMessageDiv);
                    chatBody.scrollTop = chatBody.scrollHeight;
                });
        });

        function sendQuickReply(message) {
            const messageInput = document.getElementById('message');
            messageInput.value = message;
            document.getElementById('chat-form').dispatchEvent(new Event('submit'));
        }
    </script>

ReactDOM.render(<Chatbot />, document.getElementById('chatbot-root'));
