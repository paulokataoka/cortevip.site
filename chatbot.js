// Inicialização do Supabase
const supabaseUrl = 'https://smfeazihfcqmtmmnhknm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let chatWindowVisible = false;
let isWelcomeMessageSent = false;
let cadastroEtapa = 0;
let cadastroBarbearia = { nome: "", endereco: "", telefone: "", servicos: "" };

function toggleChatWindow() {
  const chatWindow = document.getElementById('chatWindow');
  if (chatWindowVisible) {
    chatWindow.style.display = 'none';
  } else {
    chatWindow.style.display = 'flex';
    if (!isWelcomeMessageSent) {
      sendWelcomeMessage();
    }
  }
  chatWindowVisible = !chatWindowVisible;
}

function sendWelcomeMessage() {
  const chatContent = document.querySelector('.chat-content');
  chatContent.innerHTML = '';

  const botWelcome = document.createElement('div');
  botWelcome.classList.add('message', 'bot-message');
  botWelcome.textContent = "Olá! Tudo bem? Vamos fazer o Pré-cadastro da sua barbearia. Posso te perguntar algumas coisas rapidinho?";
  chatContent.appendChild(botWelcome);

  const botButtons = document.createElement('div');
  botButtons.classList.add('chat-buttons');
  botButtons.innerHTML = `<button onclick="iniciarCadastro()">Sim, claro!</button>`;
  chatContent.appendChild(botButtons);

  chatContent.scrollTop = chatContent.scrollHeight;
  isWelcomeMessageSent = true;
}

function iniciarCadastro() {
  document.querySelector('.chat-buttons')?.remove();
  cadastroEtapa = 1;
  fazerPergunta();
}

function sendMessage() {
  const userInput = document.getElementById('userMessage');
  const userMessage = userInput.value.trim();

  if (!userMessage) return;

  const chatContent = document.querySelector('.chat-content');

  const userMessageElement = document.createElement('div');
  userMessageElement.classList.add('message', 'user-message');
  userMessageElement.textContent = userMessage;
  chatContent.appendChild(userMessageElement);

  userInput.value = '';
  chatContent.scrollTop = chatContent.scrollHeight;

  processarResposta(userMessage);
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
    default:
      enviarMensagemBot("Se precisar de algo mais, estou por aqui!");
      break;
  }
}

function fazerPergunta() {
  switch (cadastroEtapa) {
    case 1:
      enviarMensagemBot("Primeiro, qual o nome da sua barbearia?");
      break;
    case 2:
      enviarMensagemBot("Show! Agora me diga o endereço completo.");
      break;
    case 3:
      enviarMensagemBot("Beleza. Qual o telefone para contato?");
      break;
    case 4:
      enviarMensagemBot("E por último, quais serviços sua barbearia oferece?");
      break;
    case 5:
      enviarMensagemBot("Cadastro finalizado! Obrigado.Nosso time entrará em contato! 🎉");
      enviarMensagemBot(`Resumo:\n• Nome: ${cadastroBarbearia.nome}\n• Endereço: ${cadastroBarbearia.endereco}\n• Telefone: ${cadastroBarbearia.telefone}\n• Serviços: ${cadastroBarbearia.servicos}`);
      salvarCadastro();
      break;
  }
}

function enviarMensagemBot(mensagem) {
  const chatContent = document.querySelector('.chat-content');
  const botMessage = document.createElement('div');
  botMessage.classList.add('message', 'bot-message');
  botMessage.textContent = mensagem;
  chatContent.appendChild(botMessage);
  chatContent.scrollTop = chatContent.scrollHeight;
}

async function salvarCadastro() {
  const { data, error } = await supabaseClient
    .from('barbearias')
    .insert([
      {
        nome: cadastroBarbearia.nome,
        endereco: cadastroBarbearia.endereco,
        telefone: cadastroBarbearia.telefone,
        servicos: cadastroBarbearia.servicos,
      },
    ]);

  if (error) {
    console.error("Erro ao salvar:", error.message);
    enviarMensagemBot("❌ Ocorreu um erro ao salvar seu cadastro. Tente novamente.");
  } else {
    enviarMensagemBot("✅ Cadastro salvo com sucesso no nosso sistema! ✂️");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Espera o usuário abrir o chat
});
