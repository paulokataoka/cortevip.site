document.addEventListener('DOMContentLoaded', async () => {
  const supabaseClient = supabase.createClient(
    'https://smfeazihfcqmtmmnhknm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc'
  );

  const horariosDisponiveis = ['10:00', '11:00', '13:00', '14:00', '16:00', '17:00'];

  const horaSelect = document.getElementById('hora');
  const barbeiroSelect = document.getElementById('barbeiro');

  async function verificarHorariosOcupados(dataSelecionada) {
    const { data: agendamentos, error } = await supabaseClient
      .from('agendamentos')
      .select('hora, barbeiro')
      .eq('data', dataSelecionada);

    if (error) {
      console.error(error);
      return {};
    }

    const vagasOcupadas = {};
    horariosDisponiveis.forEach(h => {
      vagasOcupadas[h] = {};
      barbeiroSelect.querySelectorAll('option').forEach(opt => {
        if (opt.value) vagasOcupadas[h][opt.value] = 0;
      });
    });

    agendamentos.forEach(({ hora, barbeiro }) => {
      if (vagasOcupadas[hora] && vagasOcupadas[hora][barbeiro] < 5) {
        vagasOcupadas[hora][barbeiro]++;
      }
    });

    return vagasOcupadas;
  }

  async function atualizarHorariosDisponiveis(dataSelecionada) {
    const vagasOcupadas = await verificarHorariosOcupados(dataSelecionada);
    horaSelect.innerHTML = '';

    horariosDisponiveis.forEach(hora => {
      const option = document.createElement('option');
      option.value = hora;
      option.textContent = hora;
      const barbeiro = barbeiroSelect.value;
      const vagas = vagasOcupadas[hora]?.[barbeiro] || 0;

      if (vagas >= 5) {
        option.disabled = true;
        option.textContent = `${hora} (sem vagas)`;
      }

      horaSelect.appendChild(option);
    });
  }

  document.getElementById('data').addEventListener('change', e => {
    atualizarHorariosDisponiveis(e.target.value);
  });

  barbeiroSelect.addEventListener('change', () => {
    const dataSelecionada = document.getElementById('data').value;
    if (dataSelecionada) atualizarHorariosDisponiveis(dataSelecionada);
  });

  const form = document.querySelector('.agendamento-form');
  const mensagem = document.createElement('div');
  mensagem.id = 'mensagem';
  form.appendChild(mensagem);

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const dados = {
      nome: document.getElementById('nome').value.trim(),
      celular: document.getElementById('celular').value.trim(),
      unidade: document.getElementById('unidade').value,
      barbeiro: document.getElementById('barbeiro').value,
      data: document.getElementById('data').value,
      hora: document.getElementById('hora').value,
      servico: document.getElementById('servico').value
    };

    const { error } = await supabaseClient.from('agendamentos').insert([dados]);

    if (error) {
      mensagem.textContent = '❌ Ocorreu um erro ao enviar seu agendamento. Tente novamente.';
      mensagem.style.color = 'red';
    } else {
      mensagem.textContent = '✅ Agendamento realizado com sucesso!';
      mensagem.style.color = 'green';
      form.reset();
      await atualizarHorariosDisponiveis(dados.data);
    }
  });

  // Inicializa com a data atual, se houver
  const dataAtual = document.getElementById('data').value;
  if (dataAtual) await atualizarHorariosDisponiveis(dataAtual);
});

// Cookies
if (!localStorage.getItem('cookies-accepted')) {
  document.getElementById('cookie-banner').style.display = 'block';
}

document.getElementById('accept-cookies').addEventListener('click', () => {
  localStorage.setItem('cookies-accepted', 'true');
  document.getElementById('cookie-banner').style.display = 'none';
});

document.getElementById('decline-cookies').addEventListener('click', () => {
  localStorage.setItem('cookies-accepted', 'false');
  document.getElementById('cookie-banner').style.display = 'none';
});

