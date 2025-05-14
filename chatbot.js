// chatbot.js
let chatWindowVisible = false;

function toggleChatWindow() {
  const chatWindow = document.getElementById('chatWindow');
  chatWindow.style.display = chatWindowVisible ? 'none' : 'flex';
  chatWindowVisible = !chatWindowVisible;
}

function sendMessage() {
  const userMessage = document.getElementById('userMessage').value.trim();

  if (userMessage) {
    const chatContent = document.querySelector('.chat-content');
    
    // Adiciona a mensagem do usuário
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('message', 'user-message');
    userMessageElement.textContent = userMessage;
    chatContent.appendChild(userMessageElement);

    // Resposta do bot (simples, pode ser melhorada com IA ou integração com backend)
    const botResponse = document.createElement('div');
    botResponse.classList.add('message', 'bot-message');
    botResponse.textContent = "Estou verificando a sua solicitação..."; // A resposta pode ser mais dinâmica
    chatContent.appendChild(botResponse);

    // Limpar o campo de entrada
    document.getElementById('userMessage').value = '';

    // Scroll até a última mensagem
    chatContent.scrollTop = chatContent.scrollHeight;
  }
}
