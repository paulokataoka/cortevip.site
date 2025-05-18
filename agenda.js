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
    .select("barbearia, barbeiro, hora")
    .eq("barbearia", barbearia)
    .eq("data", data)
    .order("hora", { ascending: true });

  if (error) {
    resultados.innerHTML = "<p>Erro ao buscar agendamentos.</p>";
    console.error(error);
    return;
  }

  if (!agendamentos || agendamentos.length === 0) {
    resultados.innerHTML = `<p>Nenhum horário ocupado em ${formatarData(data)} para <strong>${barbearia}</strong>.</p>`;
    return;
  }

  // Agrupa por barbeiro (primeiro nome)
  const agrupado = {};
  agendamentos.forEach(({ barbeiro, hora }) => {
    const primeiroNome = barbeiro.split(" ")[0];
    if (!agrupado[primeiroNome]) agrupado[primeiroNome] = [];
    agrupado[primeiroNome].push(hora);
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


