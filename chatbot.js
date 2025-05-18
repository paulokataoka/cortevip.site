<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Chat Pré-Cadastro Barbearia</title>
  <style>
    /* CSS básico para o chat */
    #chatWindow {
      display: none;
      flex-direction: column;
      width: 320px;
      height: 480px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: #fafafa;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .chat-content {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: white;
      border-bottom: 1px solid #ddd;
    }
    .message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 20px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }
    .bot-message {
      background-color: #32cd32;
      color: white;
      align-self: flex-start;
      border-bottom-left-radius: 0;
    }
    .user-message {
      background-color: #e1e1e1;
      color: #333;
      align-self: flex-end;
      border-bottom-right-radius: 0;
    }
    .chat-buttons {
      padding: 10px;
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    .chat-buttons button {
      padding: 8px 16px;
      border: none;
      background-color: #32cd32;
      color: white;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }
    .chat-buttons button:hover {
      background-color: #28a428;
    }
    #input-area {
      display: flex;
      padding: 10px;
      gap: 10px;
      background: #f0f0f0;
    }
    #userMessage {
      flex: 1;
      padding: 10px 14px;
      border-radius: 20px;
      border: 1px solid #ccc;
      font-size: 14px;
      outline: none;
    }
    #userMessage:disabled {
      background-color: #ddd;
    }
    #sendButton {
      padding: 10px 18px;
      border: none;
      background-color: #32cd32;
      color: white;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }
    #sendButton:disabled {
      background-color: #a3d9a3;
      cursor: not-allowed;
    }
    #openChatButton {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 14px 20px;
      border: none;
      background-color: #32cd32;
      color: white;
      border-radius: 50px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1001;
      transition: background-color 0.3s ease;
    }
    #openChatButton:hover {
      background-color: #28a428;
    }
  </style>
</head>
<body>

  <button id="openChatButton" aria-label="Abrir chat">💬</button>

  <div id="chatWindow" role="dialog" aria-modal="true" aria-labelledby="chatTitle">
    <div class="chat-content" aria-live="polite" aria-atomic="false" tabindex="0"></div>

    <div id="input-area">
      <input type="text" id="userMessage" placeholder="Digite sua mensagem" autocomplete="off" aria-label="Campo para digitar mensagem" />
      <button id="sendButton" aria-label="Enviar mensagem">Enviar</button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js"></script>
  <script>
    // --- Código JavaScript atualizado e melhorado ---

    // Configuração Supabase
    const supabaseUrl = 'https://smfeazihfcqmtmmnhknm.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    let chatWindowVisible = false;
    let isWelcomeMessageSent = false;
    let cadastroEtapa = 0;
    let cadastroBarbearia = { nome: "", endereco: "", telefone: "", servicos: "" };

    const openChatButton = document.getElementById('openChatButton');
    const chatWindow = document.getElementById('chatWindow');
    const chatContent = document.querySelector('.chat-content');
    const userInput = document.getElementById('userMessage');
    const sendButton = document.getElementById('sendButton');

    openChatButton.addEventListener('click', toggleChatWindow);
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });

    function toggleChatWindow() {
      if (chatWindowVisible) {
        chatWindow.style.display = 'none';
        openChatButton.style.display = 'block';
      } else {
        chatWindow.style.display = 'flex';
        openChatButton.style.display = 'none';

        if (!isWelcomeMessageSent) {
          sendWelcomeMessage();
        }
      }
      chatWindowVisible = !chatWindowVisible;
      chatContent.focus();
    }

    function sendWelcomeMessage() {
      clearChat();
      enviarMensagemBot("Olá! Tudo bem? Vamos fazer o Pré-cadastro da sua barbearia. Posso te perguntar algumas coisas rapidinho?");
      const botButtons = document.createElement('div');
      botButtons.classList.add('chat-buttons');
      botButtons.innerHTML = `<button id="btn-start-cadastro" aria-label="Sim, claro!">Sim, claro!</button>`;
      chatContent.appendChild(botButtons);

      document.getElementById('btn-start-cadastro').addEventListener('click', () => {
        botButtons.remove();
        iniciarCadastro();
      });

      isWelcomeMessageSent = true;
    }

    function clearChat() {
      chatContent.innerHTML = '';
    }

    function iniciarCadastro() {
      cadastroEtapa = 1;
      cadastroBarbearia = { nome: "", endereco: "", telefone: "", servicos: "" };
      fazerPergunta();
      enableInput(true);
    }

    function sendMessage() {
      const userMessage = userInput.value.trim();
      if (!userMessage) return;

      adicionarMensagemUsuario(userMessage);
      userInput.value = '';
      processarResposta(userMessage);
    }

    function adicionarMensagemUsuario(texto) {
      const userMessageElement = document.createElement('div');
      userMessageElement.classList.add('message', 'user-message');
      userMessageElement.textContent = texto;
      chatContent.appendChild(userMessageElement);
      scrollChatToBottom();
    }

    function enviarMensagemBot(mensagem) {
      const botMessage = document.createElement('div');
      botMessage.classList.add('message', 'bot-message');
      botMessage.textContent = mensagem;
      chatContent.appendChild(botMessage);
      scrollChatToBottom();
    }

    function scrollChatToBottom() {
      chatContent.scrollTop = chatContent.scrollHeight;
    }

    function processarResposta(resposta) {
      switch (cadastroEtapa) {
        case 1:
          cadastroBarbearia.nome = resposta;
          cadastroEtapa++;
          fazerPergunta();
          break;
        case 2:
          cadastroBarbearia.endereco = resposta;
          cadastroEtapa++;
          fazerPergunta();
          break;
        case 3:
          cadastroBarbearia.telefone = resposta;
          cadastroEtapa++;
          fazerPergunta();
          break;
        case 4:
          cadastroBarbearia.servicos = resposta;
          cadastroEtapa++;
          fazerPergunta();
          break;
        case 5:
          enableInput(false);
          salvarCadastro();
          break;
        default:
          enviarMensagemBot("Cadastro concluído! Se quiser começar de novo, feche o chat e abra novamente.");
          enableInput(false);
      }
    }

    function fazerPergunta() {
      switch (cadastroEtapa) {
        case 1:
          enviarMensagemBot("Qual o nome da sua barbearia?");
          break;
        case 2:
          enviarMensagemBot("Qual o endereço?");
          break;
        case 3:
          enviarMensagemBot("Qual o telefone para contato?");
          break;
        case 4:
          enviarMensagemBot("Quais serviços oferece? (ex: corte, barba, etc.)");
          break;
        case 5:
          enviarMensagemBot("Muito obrigado! Estou salvando seus dados...");
          break;
      }
    }

    async function salvarCadastro() {
      try {
        const { data, error } = await supabaseClient
          .from('barbearias')
          .insert([
            {
              nome: cadastroBarbearia.nome,
              endereco: cadastroBarbearia.endereco,
              telefone: cadastroBarbearia.telefone,
              servicos: cadastroBarbearia.servicos,
            }
          ]);

        if (error) {
          throw error;
        }

        enviarMensagemBot("✅ Cadastro salvo com sucesso! Entraremos em contato em breve. ✂️");
      } catch (err) {
        console.error("Erro ao salvar cadastro:", err);
        enviarMensagemBot("❌ Ocorreu um erro ao salvar seu cadastro. Por favor, tente novamente mais tarde.");
        enableInput(true); // Permite tentar enviar novamente
        cadastroEtapa = 4; // Volta para última pergunta para facilitar correção
        fazerPergunta();
      }
    }

    function enableInput(enable) {
      userInput.disabled = !enable;
      sendButton.disabled = !enable;
      if (enable) {
        userInput.focus();
      }
    }
  </script>

</body>
</html>
