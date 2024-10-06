document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value;

    if (message.trim() === '') return;

    const chatBody = document.getElementById('chat-body');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.innerHTML = `<img src="{{ asset('./images/photo-1.jpg') }}" alt="User Profile">` + message;
    chatBody.appendChild(userMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    messageInput.value = '';

    fetch(`/chat?message=${encodeURIComponent(message)}`)
        .then(response => response.json())
        .then(data => {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = `<img src="{{ asset('/images/chat.jpg') }}" alt="Bot Profile">` + data.response;
            chatBody.appendChild(botMessageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        });
});

document.getElementById('new-chat').addEventListener('click', function() {
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = ''; // Efface les messages
    // Ajoutez également la logique pour gérer l'historique ici si nécessaire
});
