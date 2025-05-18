const barbeariaSelect = document.getElementById("barbearia");
const dataInput = document.getElementById("data");
const consultarBtn = document.getElementById("consultar");
const resultados = document.getElementById("resultados");

// Define data de hoje por padrão
dataInput.valueAsDate = new Date();

// Carrega barbearias ao abrir a página
document.addEventListener("DOMContentLoaded", async () => {
  await carregarBarbearias();
  buscarAgenda(); // opcional: já mostra a agenda do dia atual para a primeira barbearia
});

consultarBtn.addEventListener("click", buscarAgenda);

async function carregarBarbearias() {
  const { data, error } = await supabase
    .from("agendamentos")
    .select("barbearia")
    .neq("barbearia", null);

  if (error || !data) {
    barbeariaSelect.innerHTML = `<option value="">Erro ao carregar</option>`;
    return;
  }

  const barbeariasUnicas = [...new Set(data.map(item => item.barbearia))];

  barbeariaSelect.innerHTML = barbeariasUnicas.map(nome => `
    <option value="${nome}">${nome}</option>
  `).join("");
}

async function buscarAgenda() {
  const barbearia = barbeariaSelect.value;
  const data = dataInput.value;

  if (!barbearia || !data) {
    resultados.innerHTML = "<p>Selecione uma barbearia e uma data.</p>";
    return;
  }

  resultados.innerHTML = "<p>Carregando agenda...</p>";

  const { data: agendamentos, error } = await supabase
    .from("agendamentos")
    .select("barbearia, barbeiro, horario")
    .eq("barbearia", barbearia)
    .eq("data", data)
    .order("horario", { ascending: true });

  if (error) {
    resultados.innerHTML = "<p>Erro ao buscar agendamentos.</p>";
    return;
  }

  if (!agendamentos || agendamentos.length === 0) {
    resultados.innerHTML = `<p>Nenhum horário ocupado em ${formatarData(data)} para <strong>${barbearia}</strong>.</p>`;
    return;
  }

  // Agrupa por barbeiro
  const agrupado = {};
  agendamentos.forEach(({ barbeiro, horario }) => {
    if (!agrupado[barbeiro]) agrupado[barbeiro] = [];
    agrupado[barbeiro].push(horario);
  });

  resultados.innerHTML = `<h2>Agenda de ${barbearia} - ${formatarData(data)}</h2>`;
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

function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
}

