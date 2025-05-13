document.addEventListener('DOMContentLoaded', async () => {
    const supabaseClient = supabase.createClient(
        'https://smfeazihfcqmtmmnhknm.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc'
    );

    const horariosDisponiveis = ['10:00', '11:00', '13:00', '14:00', '16:00', '17:00'];
    const horaSelect = document.getElementById('hora');
    const barbeiroSelect = document.getElementById('barbeiro');
    const form = document.querySelector('.agendamento-form');
    const mensagem = document.createElement('div');
    mensagem.id = 'mensagem';
    form.appendChild(mensagem);

    // Verifica vagas ocupadas por horário e barbeiro
    async function verificarHorariosOcupados(dataSelecionada) {
        const { data: agendamentos, error } = await supabaseClient
            .from('agendamentos')
            .select('hora, barbeiro')
            .eq('data', dataSelecionada);

        if (error) {
            console.error(error);
            return [];
        }

        const vagasOcupadas = {};

        horariosDisponiveis.forEach(hora => {
            vagasOcupadas[hora] = {};
            barbeiroSelect.querySelectorAll('option').forEach(option => {
                const barbeiro = option.value;
                vagasOcupadas[hora][barbeiro] = 0;
            });
        });

        agendamentos.forEach(({ hora, barbeiro }) => {
            if (vagasOcupadas[hora] && vagasOcupadas[hora][barbeiro] < 5) {
                vagasOcupadas[hora][barbeiro]++;
            }
        });

        return vagasOcupadas;
    }

    // Atualiza os horários no select com base nas vagas
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

    // Listeners para alterar horários disponíveis
    document.getElementById('data').addEventListener('change', (e) => {
        atualizarHorariosDisponiveis(e.target.value);
    });

    barbeiroSelect.addEventListener('change', async () => {
        const dataSelecionada = document.getElementById('data').value;
        if (dataSelecionada) {
            await atualizarHorariosDisponiveis(dataSelecionada);
        }
    });

    // Envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const unidade = document.getElementById('unidade').value;
        const barbeiro = document.getElementById('barbeiro').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const servico = document.getElementById('servico').value;

        if (!nome || !celular || !unidade || !barbeiro || !data || !hora || !servico) {
            mensagem.textContent = '⚠️ Por favor, preencha todos os campos.';
            mensagem.style.color = 'orange';
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        const { error } = await supabaseClient
            .from('agendamentos')
            .insert([{ nome, celular, unidade, barbeiro, data, hora, servico }]);

        submitBtn.disabled = false;

        if (error) {
            console.error(error);
            mensagem.textContent = '❌ Erro ao agendar. Tente novamente.';
            mensagem.style.color = 'red';
        } else {
            mensagem.textContent = '✅ Agendamento realizado com sucesso!';
            mensagem.style.color = 'green';
            form.reset();
            await atualizarHorariosDisponiveis(data);
            setTimeout(() => mensagem.textContent = '', 5000);
        }
    });

    // Carrega horários se houver data selecionada
    const dataSelecionada = document.getElementById('data').value;
    if (dataSelecionada) {
        await atualizarHorariosDisponiveis(dataSelecionada);
    }

    // Cookies
    if (!localStorage.getItem('cookies-accepted')) {
        document.getElementById('cookie-banner').style.display = 'block';
    }

    document.getElementById('accept-cookies').addEventListener('click', function () {
        localStorage.setItem('cookies-accepted', 'true');
        document.getElementById('cookie-banner').style.display = 'none';
    });

    document.getElementById('decline-cookies').addEventListener('click', function () {
        localStorage.setItem('cookies-accepted', 'false');
        document.getElementById('cookie-banner').style.display = 'none';
    });
});
