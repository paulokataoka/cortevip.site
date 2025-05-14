let chatWindowVisible = false;

// Função para alternar a visibilidade da janela do chat
function toggleChatWindow() {
  const chatWindow = document.getElementById('chatWindow');
  chatWindow.style.display = chatWindowVisible ? 'none' : 'flex';
  chatWindowVisible = !chatWindowVisible;
}

// Função para enviar mensagem
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
    botResponse.textContent = getBotResponse(userMessage); // Função que gera a resposta do bot
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

  // Saudações iniciais
  if (userMessage === "" || lowerMessage.includes("olá") || lowerMessage.includes("oi")) {
    response = "Olá! Bem-vindo ao CorteVip! Como posso ajudá-lo hoje?";
  }
  
  // Respostas específicas
  else if (lowerMessage.includes("cadastrar barbearia")) {
    response = "Para cadastrar sua barbearia, por favor, forneça o nome, endereço e os serviços que oferece.";
  } 
  
  else if (lowerMessage.includes("encontrar barbearia") || lowerMessage.includes("procurar barbearia")) {
    response = "Para encontrar uma barbearia, por favor, forneça a sua localização ou nome da barbearia.";
  }

  else if (lowerMessage.includes("agendar horário")) {
    response = "Para agendar um horário, me diga a barbearia de sua escolha e o horário desejado.";
  }

  else if (lowerMessage.includes("localização")) {
    response = "Por favor, me forneça sua localização para que eu possa ajudar a encontrar a barbearia mais próxima de você.";
  }

  else {
    response = "Desculpe, não entendi. Como posso te ajudar?";
  }

  return response;
}

// Quando a janela de chat carregar, enviar boas-vindas
document.addEventListener("DOMContentLoaded", function() {
  // Adicionar boas-vindas automaticamente quando o chat for aberto
  const chatContent = document.querySelector('.chat-content');
  const botWelcome = document.createElement('div');
  botWelcome.classList.add('message', 'bot-message');
  botWelcome.textContent = "Olá! Bem-vindo ao CorteVip! Como posso ajudá-lo hoje?";
  chatContent.appendChild(botWelcome);

  // Scroll até a última mensagem
  chatContent.scrollTop = chatContent.scrollHeight;
});
