let chatWindowVisible = false;
let isWelcomeMessageSent = false; // Variável para verificar se a saudação já foi enviada

// Função para alternar a visibilidade da janela do chat
function toggleChatWindow() {
  const chatWindow = document.getElementById('chatWindow');
  chatWindow.style.display = chatWindowVisible ? 'none' : 'flex';
  chatWindowVisible = !chatWindowVisible;

  // Enviar a mensagem de boas-vindas se for a primeira vez que o chat é aberto
  if (!isWelcomeMessageSent) {
    sendWelcomeMessage();
  }
}

// Função para enviar a mensagem de boas-vindas
function sendWelcomeMessage() {
  const chatContent = document.querySelector('.chat-content');
  const botWelcome = document.createElement('div');
  botWelcome.classList.add('message', 'bot-message');
  botWelcome.textContent = "Olá! Bem-vindo ao CorteVip! Como posso ajudá-lo hoje?";
  chatContent.appendChild(botWelcome);

  // Botões de opções
  const botButtons = document.createElement('div');
  botButtons.classList.add('chat-buttons');
  botButtons.innerHTML = `
    <button onclick="handleUserSelection('Cadastrar Barbearia')">Cadastrar Barbearia</button>
    <button onclick="handleUserSelection('Encontrar Barbearia')">Encontrar Barbearia</button>
    <button onclick="handleUserSelection('Agendar Horário')">Agendar Horário</button>
    <button onclick="handleUserSelection('Localização')">Localização</button>
  `;
  chatContent.appendChild(botButtons);

  // Scroll até a última mensagem
  chatContent.scrollTop = chatContent.scrollHeight;

  // Marcar que a saudação foi enviada
  isWelcomeMessageSent = true;
}

// Função para enviar uma mensagem do usuário
function sendMessage() {
  const userMessage = document.getElementById('userMessage').value.trim();

  if (userMessage) {
    const chatContent = document.querySelector('.chat-content');
    
    // Adiciona a mensagem do usuário
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('message', 'user-message');
    userMessageElement.textContent = userMessage;
    chatContent.appendChild(userMessageElement);

    // Resposta do bot
    const botResponse = document.createElement('div');
    botResponse.classList.add('message', 'bot-message');
    botResponse.textContent = getBotResponse(userMessage);
    chatContent.appendChild(botResponse);

    // Limpar o campo de entrada
    document.getElementById('userMessage').value = '';

    // Scroll até a última mensagem
    chatContent.scrollTop = chatContent.scrollHeight;
  }
}

// Função que gera a resposta do bot
function getBotResponse(userMessage) {
  let response = "";
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("cadastrar barbearia")) {
    response = "Por favor, forneça o nome, endereço e os serviços que você oferece.";
  } 
  
  else if (lowerMessage.includes("encontrar barbearia")) {
    response = "Informe a sua localização ou o nome da barbearia para encontrar.";
  }

  else if (lowerMessage.includes("agendar horário")) {
    response = "Diga-me a barbearia de sua escolha e o horário desejado.";
  }

  else if (lowerMessage.includes("localização")) {
    response = "Por favor, me forneça sua localização para que eu possa encontrar a barbearia mais próxima.";
  }

  else {
    response = "Desculpe, não entendi. Como posso te ajudar?";
  }

  return response;
}

// Função que lida com a seleção de botões
function handleUserSelection(selection) {
  const chatContent = document.querySelector('.chat-content');

  // Adiciona a escolha do usuário
  const userMessageElement = document.createElement('div');
  userMessageElement.classList.add('message', 'user-message');
  userMessageElement.textContent = selection;
  chatContent.appendChild(userMessageElement);

  // Resposta do bot baseada na escolha
  const botResponse = document.createElement('div');
  botResponse.classList.add('message', 'bot-message');
  botResponse.textContent = getBotResponse(selection);
  chatContent.appendChild(botResponse);

  // Scroll até a última mensagem
  chatContent.scrollTop = chatContent.scrollHeight;
}

// Quando a janela de chat carregar, enviar boas-vindas (só se ainda não foi enviada)
document.addEventListener("DOMContentLoaded", function() {
  if (!isWelcomeMessageSent) {
    sendWelcomeMessage();
  }
});
