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

    // Vérifier si une nouvelle conversation doit être créée
    if (currentChatIndex === -1) {
        chatHistory.push([]);
        currentChatIndex = chatHistory.length - 1;
    }

    // Ajouter le message de l'utilisateur à l'historique
    chatHistory[currentChatIndex].push({ type: 'user', content: message });

    messageInput.value = '';

    fetch(`/chat?message=${encodeURIComponent(message)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = `<div class="message-content">${data.response}</div>`;
            chatBody.appendChild(botMessageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            // Ajouter la réponse du bot à l'historique
            chatHistory[currentChatIndex].push({ type: 'bot', content: data.response });

            // Mettre à jour l'historique affiché
            updateChatHistory();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Fonction pour mettre à jour l'affichage de l'historique des chats
// Fonction pour mettre à jour l'affichage de l'historique des chats
function updateChatHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';  // Vider l'historique actuel
    chatHistory.forEach((chat, index) => {
        const historyItem = document.createElement('li');
        
        // Utilisation d'un élément cliquable (par exemple, un <button> ou un <a>)
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
    if (currentChatIndex === index) {
        currentChatIndex = -1;  // Réinitialiser l'index de la conversation actuelle
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

// Fonction pour basculer entre les modes clair et sombre
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});
// Fonction pour envoyer une question automatiquement// Fonction pour envoyer un message au bot et afficher la réponse
function sendMessage(message) {
    const chatBody = document.getElementById('chat-body');

    // Ajouter le message de l'utilisateur à l'interface
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.innerText = message;
    chatBody.appendChild(userMessage);

    // Scroller vers le bas pour voir le dernier message
    chatBody.scrollTop = chatBody.scrollHeight;

    // Envoyer la question au bot via AJAX (fetch)
    fetch(`/chat?message=${encodeURIComponent(message)}`)
        .then(response => response.json())
        .then(data => {
            // Ajouter la réponse du bot à l'interface
            const botResponse = document.createElement('div');
            botResponse.classList.add('bot-message');
            botResponse.innerText = data.response;
            chatBody.appendChild(botResponse);

            // Scroller vers le bas pour voir le dernier message du bot
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => {
            console.error('Error:', error);

            // Afficher un message d'erreur si une erreur se produit
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('bot-message');
            errorMessage.innerText = "Erreur lors de la communication avec le bot.";
            chatBody.appendChild(errorMessage);

            // Scroller vers le bas pour voir le message d'erreur
            chatBody.scrollTop = chatBody.scrollHeight;
        });
}

// Ajouter des événements de clic sur les boutons de suggestions
document.querySelectorAll('.suggestion-button').forEach(button => {
    button.addEventListener('click', function() {
        const message = this.innerText;
        sendMessage(message);  // Envoie la question cliquée
    });
});

// Gérer l'envoi du formulaire de chat
document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Empêche le rechargement de la page
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();  // Supprime les espaces inutiles

    if (message !== '') {
        sendMessage(message);  // Envoie la question de l'utilisateur
        messageInput.value = '';  // Vide le champ de saisie après envoi
    }
});


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
