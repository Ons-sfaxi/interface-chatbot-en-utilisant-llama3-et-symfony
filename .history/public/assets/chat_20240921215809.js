let chatHistory = [];  // Tableau pour stocker l'historique des conversations
let currentChatIndex = -1;  // Index de la conversation actuelle

document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();

    if (message === '') return;

    const chatBody = document.getElementById('chat-body');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatBody.appendChild(userMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (currentChatIndex === -1) {
        chatHistory.push([]);
        currentChatIndex = chatHistory.length - 1;
    }
    chatHistory[currentChatIndex].push({ role: 'user', content: message });

    messageInput.value = '';
    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.innerHTML = `<div class="message-content">Ceci est une réponse générée par le bot.</div>`;
        chatBody.appendChild(botMessageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        chatHistory[currentChatIndex].push({ role: 'bot', content: 'Ceci est une réponse générée par le bot.' });
    }, 1000);
});

function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'block';
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}

document.getElementById('new-chat').addEventListener('click', function() {
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = '';
    chatHistory.push([]);
    currentChatIndex = chatHistory.length - 1;
});

document.querySelector('.user-image').addEventListener('click', function() {
    document.getElementById('upload-avatar').click();
});

document.getElementById('upload-avatar').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.profile-img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
