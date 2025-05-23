// Supabase config (usa variáveis globais definidas no HTML)
const supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

let chatWindowVisible = false;
let isWelcomeMessageSent = false;
let cadastroEtapa = 0;

let cadastroBarbearia = { nome: "", endereco: "", telefone: "", servicos: "" };
let cadastroBarbeiro = { nome: "", telefone: "", especialidade: "" };
let barbeariaId = null;

function toggleChatWindow() {
  const chatWindow = document.getElementById('chatWindow');
  chatWindow.style.display = chatWindowVisible ? 'none' : 'flex';
  chatWindowVisible = !chatWindowVisible;

  if (!isWelcomeMessageSent) sendWelcomeMessage();
}

function sendWelcomeMessage() {
  const chatContent = document.querySelector('.chat-content');
  chatContent.innerHTML = '';

  const welcome = document.createElement('div');
  welcome.classList.add('message', 'bot-message');
  welcome.innerHTML = `
    Olá! Vamos fazer o pré-cadastro da sua barbearia.<br/><br/>
    Antes de começarmos, você pode ler nossa 
    <a href="política-de-cookies.html" target="_blank" style="color:#32cd32;text-decoration:underline;">Política de Privacidade</a>.<br/><br/>
    Você aceita os termos?
  `;
  chatContent.appendChild(welcome);

  const buttons = document.createElement('div');
  buttons.classList.add('chat-buttons');
  buttons.innerHTML = `
    <button onclick="confirmarLeituraPolitica()">✔️ Li e aceito</button>
    <button onclick="recusarPolitica()">Agora não</button>
  `;
  chatContent.appendChild(buttons);

  chatContent.scrollTop = chatContent.scrollHeight;
  isWelcomeMessageSent = true;
}

function confirmarLeituraPolitica() {
  document.querySelector('.chat-buttons')?.remove();
  cadastroEtapa = 1;
  fazerPergunta();
}

function recusarPolitica() {
  document.querySelector('.chat-buttons')?.remove();
  enviarMensagemBot("Sem problemas! Quando quiser continuar, estarei aqui. 💈");
}

function iniciarCadastro() {
  document.querySelector('.chat-buttons')?.remove();
  cadastroEtapa = 1;
  fazerPergunta();
}

function sendMessage() {
  const input = document.getElementById('userMessage');
  const msg = input.value.trim();
  if (!msg) return;

  const chatContent = document.querySelector('.chat-content');
  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user-message');
  userMsg.textContent = msg;
  chatContent.appendChild(userMsg);

  input.value = '';
  chatContent.scrollTop = chatContent.scrollHeight;

  processarResposta(msg);
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
      salvarCadastroBarbearia();
      break;
    case 6:
      cadastroBarbeiro.nome = resposta;
      cadastroEtapa++;
      fazerPergunta();
      break;
    case 7:
      cadastroBarbeiro.telefone = resposta;
      cadastroEtapa++;
      fazerPergunta();
      break;
    case 8:
      cadastroBarbeiro.especialidade = resposta;
      salvarCadastroBarbeiro();
      break;
    default:
      enviarMensagemBot("Se precisar de algo mais, estou por aqui! ✂️");
  }
}

function fazerPergunta() {
  switch (cadastroEtapa) {
    case 1:
      enviarMensagemBot("Qual o nome da sua barbearia?");
      break;
    case 2:
      enviarMensagemBot("Qual o endereço completo?");
      break;
    case 3:
      enviarMensagemBot("Qual o telefone para contato?");
      break;
    case 4:
      enviarMensagemBot("Quais serviços sua barbearia oferece?");
      break;
    case 6:
      enviarMensagemBot("Agora vamos cadastrar o primeiro barbeiro. Qual o nome dele?");
      break;
    case 7:
      enviarMensagemBot("Qual o telefone do barbeiro?");
      break;
    case 8:
      enviarMensagemBot("Qual a especialidade dele? (ex: fade, navalhado...)");
      break;
  }
}

function enviarMensagemBot(texto) {
  const chatContent = document.querySelector('.chat-content');
  const botMsg = document.createElement('div');
  botMsg.classList.add('message', 'bot-message');
  botMsg.textContent = texto;
  chatContent.appendChild(botMsg);
  chatContent.scrollTop = chatContent.scrollHeight;
}

async function salvarCadastroBarbearia() {
  const { data, error } = await supabaseClient
    .from('barbearias')
    .insert([cadastroBarbearia])
    .select();

  if (error) {
    console.error("Erro ao salvar barbearia:", error.message);
    enviarMensagemBot("❌ Ocorreu um erro ao salvar sua barbearia.");
  } else {
    barbeariaId = data[0].id;
    enviarMensagemBot("✅ Barbearia cadastrada com sucesso!");
    cadastroEtapa = 6;
    fazerPergunta();
  }
}

async function salvarCadastroBarbeiro() {
  const { error } = await supabaseClient
    .from('barbeiros')
    .insert([{ ...cadastroBarbeiro, barbearia_id: barbeariaId }]);

  if (error) {
    console.error("Erro ao salvar barbeiro:", error.message);
    enviarMensagemBot("❌ Erro ao salvar o barbeiro.");
  } else {
    enviarMensagemBot("✅ Barbeiro cadastrado com sucesso!");
    enviarMensagemBot("Obrigado pelo cadastro! Em breve entraremos em contato. 💈");
  }
}
