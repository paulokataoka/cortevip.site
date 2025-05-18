// Inicialização do Supabase
const supabaseUrl = 'https://smfeazihfcqmtmmnhknm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Controle do chatbot
let chatWindowVisible = false;
let isWelcomeMessageSent = false;
let etapa = 0;

const cadastro = {
  barbearia: {
    nome: '',
    endereco: '',
    telefone: '',
    servicos: ''
  },
  barbeiro: {
    nome: '',
    especialidade: '',
    telefone: ''
  }
};

// Exibir/esconder chat
function toggleChatWindow() {
  const chatWindow = document.getElementById('chatWindow');
  chatWindow.style.display = chatWindowVisible ? 'none' : 'flex';
  chatWindowVisible = !chatWindowVisible;
  if (!isWelcomeMessageSent) {
    sendWelcomeMessage();
  }
}

// Mensagem de boas-vindas
function sendWelcomeMessage() {
  const chat = document.querySelector('.chat-content');
  chat.innerHTML = '';
  appendBotMessage("Olá! Vamos fazer o pré-cadastro da sua barbearia. Posso perguntar algumas coisas rapidinho?");
  appendButtons([{ text: "Sim, claro!", onClick: iniciarCadastro }]);
  isWelcomeMessageSent = true;
}

function appendButtons(buttons) {
  const chat = document.querySelector('.chat-content');
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('chat-buttons');
  buttonDiv.innerHTML = buttons.map(btn => `<button onclick="${btn.onClick.name}()">${btn.text}</button>`).join('');
  chat.appendChild(buttonDiv);
  chat.scrollTop = chat.scrollHeight;
}

function iniciarCadastro() {
  document.querySelector('.chat-buttons')?.remove();
  etapa = 1;
  perguntar();
}

function sendMessage() {
  const input = document.getElementById('userMessage');
  const msg = input.value.trim();
  if (!msg) return;
  appendUserMessage(msg);
  input.value = '';
  processarResposta(msg);
}

function appendUserMessage(text) {
  const chat = document.querySelector('.chat-content');
  const msg = document.createElement('div');
  msg.className = 'message user-message';
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function appendBotMessage(text) {
  const chat = document.querySelector('.chat-content');
  const msg = document.createElement('div');
  msg.className = 'message bot-message';
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// Fluxo de perguntas
function perguntar() {
  switch (etapa) {
    case 1: appendBotMessage("Primeiro, qual o nome da sua barbearia?"); break;
    case 2: appendBotMessage("Legal! Qual o endereço completo da barbearia?"); break;
    case 3: appendBotMessage("Show! Agora me diga o telefone de contato da barbearia."); break;
    case 4: appendBotMessage("E quais serviços vocês oferecem?"); break;
    case 5: appendBotMessage("Agora vamos cadastrar o barbeiro. Qual o nome dele?"); break;
    case 6: appendBotMessage("Qual a especialidade do barbeiro?"); break;
    case 7: appendBotMessage("E o telefone do barbeiro?"); break;
    case 8: appendBotMessage("Cadastro completo! Salvando no sistema... ✂️"); salvarTudo(); break;
    default: appendBotMessage("Se precisar de algo mais, estou por aqui!"); break;
  }
}

// Processa cada resposta do usuário
function processarResposta(resposta) {
  switch (etapa) {
    case 1: cadastro.barbearia.nome = resposta; break;
    case 2: cadastro.barbearia.endereco = resposta; break;
    case 3: cadastro.barbearia.telefone = resposta; break;
    case 4: cadastro.barbearia.servicos = resposta; break;
    case 5: cadastro.barbeiro.nome = resposta; break;
    case 6: cadastro.barbeiro.especialidade = resposta; break;
    case 7: cadastro.barbeiro.telefone = resposta; break;
  }
  etapa++;
  perguntar();
}

// Salvar nos bancos do Supabase
async function salvarTudo() {
  try {
    // 1. Salvar barbearia
    const { data: barbearia, error: err1 } = await supabase.from('barbearias').insert([cadastro.barbearia]).select().single();
    if (err1) throw err1;

    // 2. Salvar barbeiro
    const { data: barbeiro, error: err2 } = await supabase.from('barbeiros').insert([cadastro.barbeiro]).select().single();
    if (err2) throw err2;

    // 3. Relacionar
    const { error: err3 } = await supabase.from('barbearia_barbeiro').insert([
      { barbearia_id: barbearia.id, barbeiro_id: barbeiro.id }
    ]);
    if (err3) throw err3;

    appendBotMessage("✅ Tudo certo! Cadastro salvo com sucesso. Obrigado!");
    appendBotMessage(`Resumo:\n• Barbearia: ${cadastro.barbearia.nome}\n• Barbeiro: ${cadastro.barbeiro.nome}`);
  } catch (err) {
    console.error("Erro no cadastro:", err);
    appendBotMessage("❌ Algo deu errado ao salvar os dados. Tente novamente.");
  }
}

// Escuta Enter no campo de texto
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userMessage").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
});

