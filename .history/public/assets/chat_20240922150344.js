let chatHistory = [];  // Tableau pour stocker l'historique des conversations
let currentChatIndex = -1;  // Index de la conversation actuelle

// Fonction pour envoyer un message
function sendMessage(message) {
    const chatBody = document.getElementById('chat-body');

    // Ajouter le message de l'utilisateur dans l'interface
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.innerHTML = `<img src="{{ asset('assets/images/photo-1.jpg') }}" alt="User" class="user-img">${message}`;
    chatBody.appendChild(userMessage);

    // Vérifier si une nouvelle conversation doit être créée
    if (currentChatIndex === -1) {
        chatHistory.push([]); // Créer une nouvelle conversation
        currentChatIndex = chatHistory.length - 1; // Mettre à jour l'index de la conversation actuelle
    }

    // Ajouter le message de l'utilisateur à l'historique
    chatHistory[currentChatIndex].push({ type: 'user', content: message });

    // Envoyer la question à Llama via AJAX
    fetch(`/chat?message=${encodeURIComponent(message)}`)
        .then(response => response.json())
        .then(data => {
            const botResponse = document.createElement('div');
            botResponse.classList.add('bot-message');
            botResponse.innerHTML = `<img src="{{ asset('assets/images/llama.jpg') }}" alt="Llama3" class="bot-img">${data.response}`;
            chatBody.appendChild(botResponse);
            
            // Ajouter la réponse du bot à l'historique
            chatHistory[currentChatIndex].push({ type: 'bot', content: data.response });

            // Scroller vers le bas pour voir le dernier message
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => console.error('Error:', error));

    // Scroller vers le bas pour voir le dernier message
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Gérer l'envoi du formulaire de chat
document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Empêche le rechargement de la page
    const messageInput = document.getElementById('message');
    const message = messageInput.value;

    if (message.trim() !== '') {
        sendMessage(message);  // Envoie la question de l'utilisateur
        messageInput.value = '';  // Vide le champ de saisie
    }
});

// Gérer les boutons de suggestions
document.querySelectorAll('.suggestion-button').forEach(button => {
    button.addEventListener('click', function() {
        sendMessage(this.innerText);  // Envoie la question cliquée
    });
});
