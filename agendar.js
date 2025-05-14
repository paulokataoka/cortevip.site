document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("agendamento-form");
    const mensagem = document.getElementById("mensagem");
    const botaoAgendar = form.querySelector(".btn-agendar");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Desativa botão temporariamente
        botaoAgendar.disabled = true;
        botaoAgendar.textContent = "Aguarde...";

        // Coleta os dados do formulário
        const dados = {
            nome: form.nome.value.trim(),
            celular: form.celular.value.trim(),
            barbearia: form.barbearia.value,
            barbeiro: form.barbeiro.value,
            data: form.data.value,
            hora: form.hora.value,
            servico: form.servico.value,
        };

        // Validação simples extra
        if (!dados.nome || !dados.celular || !dados.barbearia || !dados.barbeiro || !dados.data || !dados.hora || !dados.servico) {
            exibirMensagem("Preencha todos os campos obrigatórios.", false);
            botaoAgendar.disabled = false;
            botaoAgendar.textContent = "Agendar";
            return;
        }

        // Simula envio ao servidor (aqui você pode integrar com Supabase, Google Sheets, etc.)
        setTimeout(() => {
            // Sucesso simulado
            exibirMensagem("Agendamento realizado com sucesso!", true);
            form.reset();
            botaoAgendar.disabled = false;
            botaoAgendar.textContent = "Agendar";
        }, 1500);
    });

    function exibirMensagem(texto, sucesso = true) {
        mensagem.textContent = texto;
        mensagem.className = "mensagem visivel " + (sucesso ? "sucesso" : "erro");

        // Esconde a mensagem após 4 segundos
        setTimeout(() => {
            mensagem.classList.remove("visivel");
        }, 4000);
    }
});
// Efeito de fundo animado (linhas que se movem)
const canvas = document.getElementById("fundo-linhas");
const ctx = canvas.getContext("2d");

let width, height;
let lines = [];

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Gera linhas animadas
function gerarLinhas(qtd) {
  lines = [];
  for (let i = 0; i < qtd; i++) {
    lines.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 100 + 50,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.2
    });
  }
}

gerarLinhas(80);

function animarFundo() {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#32cd32";

  for (let linha of lines) {
    ctx.globalAlpha = linha.opacity;
    ctx.beginPath();
    ctx.moveTo(linha.x, linha.y);
    ctx.lineTo(linha.x + linha.length, linha.y);
    ctx.stroke();

    linha.x += linha.speed;
    if (linha.x > width) {
      linha.x = -linha.length;
      linha.y = Math.random() * height;
    }
  }

  requestAnimationFrame(animarFundo);
}

animarFundo();
