// Elementos DOM
const barbeariaSelect = document.getElementById("barbearia");
const dataInput = document.getElementById("data");
const resultados = document.getElementById("resultados");
const consultarBtn = document.getElementById("consultar");

// Função para formatar a data no formato amigável (exemplo: 18/05/2025)
function formatarData(dataISO) {
  const dt = new Date(dataISO);
  return dt.toLocaleDateString("pt-BR");
}

// Carrega as barbearias para popular o select
async function carregarBarbearias() {
  const { data: barbearias, error } = await supabase
    .from("barbearias")
    .select("id, nome")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao carregar barbearias:", error);
    resultados.innerHTML = "<p>Erro ao carregar barbearias.</p>";
    return;
  }

  barbeariaSelect.innerHTML = `<option value="">Selecione uma barbearia</option>`;
  barbearias.forEach(({ id, nome }) => {
    const option = document.createElement("option");
    option.value = id; // id é o UUID da barbearia
    option.textContent = nome;
    barbeariaSelect.appendChild(option);
  });

  barbeariaSelect.disabled = false;
  consultarBtn.disabled = false;
}

// Busca os agendamentos da barbearia e data selecionados
async function buscarAgenda() {
  const barbearia = barbeariaSelect.value; // UUID
  const data = dataInput.value; // formato YYYY-MM-DD

  if (!barbearia || !data) {
    resultados.innerHTML = "<p>Selecione uma barbearia e uma data.</p>";
    return;
  }

  resultados.innerHTML = "<p>Carregando agenda...</p>";

  const { data: agendamentos, error } = await supabase
    .from("agendamentos")
    .select(`
      barbeiro,
      hora,
      barbearia_id (nome)
    `)
    .eq("barbearia_id", barbearia)
    .eq("data", data)
    .order("hora", { ascending: true });

  if (error) {
    resultados.innerHTML = "<p>Erro ao buscar agendamentos.</p>";
    console.error("Erro ao buscar agenda:", error);
    return;
  }

  if (!agendamentos || agendamentos.length === 0) {
    resultados.innerHTML = `<p>Nenhum horário ocupado em ${formatarData(data)} para a barbearia selecionada.</p>`;
    return;
  }

  const nomeBarbearia = agendamentos[0].barbearia_id.nome;

  const agrupado = {};
  agendamentos.forEach(({ barbeiro, hora }) => {
    const primeiroNome = barbeiro.split(" ")[0];
    if (!agrupado[primeiroNome]) agrupado[primeiroNome] = [];
    agrupado[primeiroNome].push(hora);
  });

  resultados.innerHTML = `<h2>Agenda de ${nomeBarbearia} - ${formatarData(data)}</h2>`;
  Object.entries(agrupado).forEach(([barbeiro, horarios]) => {
    const div = document.createElement("div");
    div.classList.add("agenda-item");
    div.innerHTML = `
      <h3>Barbeiro: ${barbeiro}</h3>
      <ul>${horarios.map(h => `<li>${h}</li>`).join("")}</ul>
    `;
    resultados.appendChild(div);
  });
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  carregarBarbearias();
  consultarBtn.addEventListener("click", buscarAgenda);
});
