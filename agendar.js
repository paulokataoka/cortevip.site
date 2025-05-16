document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("agendamento-form");
  const mensagem = document.getElementById("mensagem");
  const barbeiroSelect = document.getElementById("barbeiro");

  // Exemplo de barbeiros com UUID - substitua pelos reais do seu banco
  const barbeiros = [
    { id: "9a1f8b2e-3f47-4b2a-9eac-5c7d9a1e2345", nome: "Paulo Kataoka" },
    { id: "c3e45d79-682a-4f4b-a47c-39f2d8a8b56a", nome: "João Silva" },
    { id: "d5f7b3c2-8a2e-4bda-9450-f8a3d7c987c2", nome: "Carlos Souza" }
  ];

  // Função para popular select dos barbeiros
  function popularBarbeiros() {
    barbeiroSelect.innerHTML = '<option value="">Selecione um barbeiro</option>';
    barbeiros.forEach(b => {
      const option = document.createElement("option");
      option.value = b.id;
      option.textContent = b.nome;
      barbeiroSelect.appendChild(option);
    });
  }

  popularBarbeiros();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Limpa mensagens anteriores
    mensagem.textContent = "";
    mensagem.className = "mensagem";

    // Coleta os dados do formulário
    const nome = document.getElementById("nome").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const barbearia = document.getElementById("barbearia").value;
    const barbeiro = barbeiroSelect.value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const servico = document.getElementById("servico").value;

    // Validação básica
    if (!nome || !celular || !barbearia || !barbeiro || !data || !hora || !servico) {
      exibirMensagem("Por favor, preencha todos os campos obrigatórios.", "erro");
      return;
    }

    try {
      exibirMensagem("Verificando disponibilidade...", "carregando");

      // Verifica se já existe um agendamento para a mesma data, hora e barbeiro
      const { data: agendamentosExistentes, error: erroConsulta } = await supabaseClient
        .from("agendamentos")
        .select("*")
        .eq("data", data)
        .eq("hora", hora)
        .eq("barbeiro", barbeiro);

      if (erroConsulta) throw erroConsulta;

      if (agendamentosExistentes.length > 0) {
        exibirMensagem("Este horário já está ocupado. Por favor, escolha outro horário.", "erro");
        return;
      }

      // Envia os dados para o Supabase
      const { error: erroInsercao } = await supabaseClient
        .from("agendamentos")
        .insert([
          {
            nome,
            celular,
            barbearia,
            barbeiro,
            data,
            hora,
            servico
          }
        ]);

      if (erroInsercao) throw erroInsercao;

      exibirMensagem("Agendamento realizado com sucesso!", "sucesso");
      form.reset();
    } catch (erro) {
      console.error("Erro ao agendar:", erro);
      exibirMensagem("Erro ao processar agendamento. Tente novamente mais tarde.", "erro");
    }
  });

  function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
  }
});
