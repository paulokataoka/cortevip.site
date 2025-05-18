document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatbot-form");
  const mensagem = document.getElementById("mensagem");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const bairro = document.getElementById("bairro").value.trim();

    if (!nome || !cidade || !bairro) {
      exibirMensagem("Por favor, preencha todos os campos obrigatórios.", "erro");
      return;
    }

    try {
      exibirMensagem("Enviando informações...", "carregando");

      const { error } = await supabase
        .from("barbearias")
        .insert([
          {
            nome,
            cidade,
            bairro
          }
        ]);

      if (error) {
        console.error("Erro ao salvar:", error);
        exibirMensagem("Erro ao enviar dados. Tente novamente.", "erro");
      } else {
        exibirMensagem("Pré-cadastro enviado com sucesso! Entraremos em contato em breve.", "sucesso");
        form.reset();
      }
    } catch (erro) {
      console.error("Erro inesperado:", erro);
      exibirMensagem("Erro ao processar o envio. Tente novamente mais tarde.", "erro");
    }
  });

  function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
  }
});

