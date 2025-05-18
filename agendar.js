document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("agendamento-form");
  const mensagem = document.getElementById("mensagem");
  const barbeiroSelect = document.getElementById("barbeiro");
  const barbeariaSelect = document.getElementById("barbearia");
  const botaoSubmit = form.querySelector("button[type='submit']");
  let ultimaBarbeariaId = null;


  // Carrega barbearias reais
  async function carregarBarbearias() {
    const { data, error } = await supabaseClient
      .from("barbearias")
      .select("id, nome, endereco");

    if (error || !data) {
      barbeariaSelect.innerHTML = '<option value="">Erro ao carregar barbearias</option>';
      return;
    }

    barbeariaSelect.innerHTML = '<option value="">Selecione uma barbearia</option>';
    data.forEach(b => {
      const option = document.createElement("option");
      option.value = b.id;
      option.textContent = `${b.nome} - ${b.endereco}`;
      barbeariaSelect.appendChild(option);
    });
  }

  // Carrega barbeiros vinculados à barbearia selecionada
  async function carregarBarbeirosPorBarbearia(barbeariaId) {
    if (!barbeariaId) return;

    barbeiroSelect.innerHTML = '<option value="">Carregando barbeiros...</option>';

    const { data, error } = await supabaseClient
      .from("barbeiros")
      .select("id, nome")
      .eq("barbearia_id", barbeariaId)
      .order("nome", { ascending: true });

    if (error || !data) {
      barbeiroSelect.innerHTML = '<option value="">Erro ao carregar barbeiros</option>';
      return;
    }

    barbeiroSelect.innerHTML = '<option value="">Selecione um barbeiro</option>';
    data.forEach(barbeiro => {
      const option = document.createElement("option");
      option.value = barbeiro.id;
      option.textContent = barbeiro.nome;
      barbeiroSelect.appendChild(option);
    });
  }

  // Quando uma barbearia for selecionada
  barbeariaSelect.addEventListener("change", (e) => {
    const barbeariaId = e.target.value;
    if (barbeariaId && barbeariaId !== ultimaBarbeariaId) {
      ultimaBarbeariaId = barbeariaId;
      carregarBarbeirosPorBarbearia(barbeariaId);
    }
  });

  // Envio do formulário
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    exibirMensagem("", ""); // Limpa mensagens
    botaoSubmit.disabled = true;

    const nome = document.getElementById("nome").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const barbearia = barbeariaSelect.value;
    const barbeiro = barbeiroSelect.value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const servico = document.getElementById("servico").value;

    if (!nome || !celular || !barbearia || !barbeiro || !data || !hora || !servico) {
      exibirMensagem("Por favor, preencha todos os campos obrigatórios.", "erro");
      botaoSubmit.disabled = false;
      return;
    }

    const celularValido = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(celular);
    if (!celularValido) {
      exibirMensagem("Por favor, insira um número de celular válido.", "erro");
      botaoSubmit.disabled = false;
      return;
    }

    try {
      exibirMensagem("Verificando disponibilidade...", "carregando");

      const { data: existentes, error } = await supabaseClient
        .from("agendamentos")
        .select("*")
        .eq("data", data)
        .eq("hora", hora)
        .eq("barbeiro_id", barbeiro);

      if (error) throw error;

      if (existentes.length > 0) {
        exibirMensagem("Este horário já está ocupado. Por favor, escolha outro horário.", "erro");
        botaoSubmit.disabled = false;
        return;
      }

      const { error: erroInsercao } = await supabaseClient
        .from("agendamentos")
        .insert([{
          nome,
          celular,
          barbearia_id: barbearia,
          barbeiro_id: barbeiro,
          data,
          hora,
          servico
        }]);

      if (erroInsercao) throw erroInsercao;

      exibirMensagem("Agendamento realizado com sucesso!", "sucesso");
      form.reset();
    } catch (err) {
      console.error(err);
      exibirMensagem("Erro ao agendar. Tente novamente.", "erro");
    } finally {
      botaoSubmit.disabled = false;
    }
  });

  function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
  }

  // Inicializa
  carregarBarbearias();
});
