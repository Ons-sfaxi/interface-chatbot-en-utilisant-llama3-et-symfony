let chatHistory = [];  // Tableau pour stocker l'historique des conversations
let currentChatIndex = -1;  // Index de la conversation actuelle

// Gestion de l'envoi du formulaire de chat
document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();

    if (message === '') return;

    sendMessage(message);  // Envoie le message saisi
    messageInput.value = '';  // Vide le champ de saisie après l'envoi
});

// Fonction pour envoyer un message à Llama et gérer l'affichage
// Fonction pour envoyer un message à Llama et gérer l'affichage
function sendMessage(message) {
    const chatBody = document.getElementById('chat-body');

    // Ajouter le message de l'utilisateur à l'interface avec une image utilisateur
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.innerHTML = `
        <div class="message-wrapper">
            <img src="{{ asset('assets/images/user-photo.jpg') }}" alt="User Photo" class="message-avatar user-avatar">
            <div class="message-content">${message}</div>
        </div>`;
    chatBody.appendChild(userMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Si aucune conversation active, en créer une nouvelle
    if (currentChatIndex === -1) {
        chatHistory.push([]);  // Créer une nouvelle conversation
        currentChatIndex = chatHistory.length - 1;  // Mettre à jour l'index de conversation
    }

    // Ajouter le message de l'utilisateur à l'historique
    chatHistory[currentChatIndex].push({ type: 'user', content: message });

    // Envoyer la requête au chatbot
    fetch(`/chat?message=${encodeURIComponent(message)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Ajouter la réponse du bot avec une image Llama3
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = `
                <div class="message-wrapper">
                    <img src="{{ asset('../assetsimages/llama.jpg') }}" alt="Llama3 Logo" class="message-avatar bot-avatar">
                    <div class="message-content">${data.response}</div>
                </div>`;
            chatBody.appendChild(botMessageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            // Ajouter la réponse du bot à l'historique
            chatHistory[currentChatIndex].push({ type: 'bot', content: data.response });

            // Mettre à jour l'historique affiché
            updateChatHistory();
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
}


// Fonction pour mettre à jour l'affichage de l'historique des chats
function updateChatHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';  // Vider l'historique actuel

    chatHistory.forEach((chat, index) => {
        const historyItem = document.createElement('li');

        // Utilisation d'un bouton cliquable pour charger ou supprimer la conversation
        historyItem.innerHTML = `
            <button class="chat-link" onclick="loadChat(${index})">Conversation ${index + 1}</button>
            <button onclick="deleteChat(${index})" class="delete-chat">X</button>
        `;
        historyList.appendChild(historyItem);
    });
}

// Fonction pour charger une conversation précédente
function loadChat(index) {
    currentChatIndex = index;
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = '';  // Vider la zone de chat

    // Reconstituer les messages de la conversation
    chatHistory[currentChatIndex].forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.type}`;
        messageDiv.innerHTML = `<div class="message-content">${message.content}</div>`;
        chatBody.appendChild(messageDiv);
    });

    chatBody.scrollTop = chatBody.scrollHeight;  // Faire défiler vers le bas
}

// Fonction pour supprimer une conversation
function deleteChat(index) {
    chatHistory.splice(index, 1);  // Supprimer la conversation de l'historique

    // Réinitialiser l'index de la conversation actuelle si elle est supprimée
    if (currentChatIndex === index) {
        currentChatIndex = -1;
        document.getElementById('chat-body').innerHTML = '';  // Vider la zone de chat
    } else if (currentChatIndex > index) {
        currentChatIndex--;  // Ajuster l'index si nécessaire
    }
    updateChatHistory();  // Mettre à jour l'affichage de l'historique
}

// Fonction pour réinitialiser la conversation
document.getElementById('new-chat').addEventListener('click', function() {
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = '';  // Supprimer tous les messages
    currentChatIndex = chatHistory.length;  // Réinitialiser l'index de la conversation actuelle
    chatHistory.push([]);  // Ajouter une nouvelle conversation vide
    updateChatHistory();  // Mettre à jour l'affichage de l'historique
});

// Gestion des boutons de suggestions
document.querySelectorAll('.suggestion-button').forEach(button => {
    button.addEventListener('click', function() {
        const message = this.innerText;  // Récupère le texte de la suggestion
        sendMessage(message);  // Envoie la question cliquée
    });
});
