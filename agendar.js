document.addEventListener('DOMContentLoaded', async () => {
    const supabaseClient = supabase.createClient(
        'https://smfeazihfcqmtmmnhknm.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc'
    );

    const horariosDisponiveis = ['10:00', '11:00', '13:00', '14:00', '16:00', '17:00'];

    const horaSelect = document.getElementById('hora');
    const barbeiroSelect = document.getElementById('barbeiro');
    
    // Função para verificar as vagas ocupadas para cada horário de um barbeiro
    async function verificarHorariosOcupados(dataSelecionada) {
        const { data: agendamentos, error } = await supabaseClient
            .from('agendamentos')
            .select('hora, barbeiro')
            .eq('data', dataSelecionada); // Filtra pela data selecionada
        
        if (error) {
            console.error(error);
            return [];
        }

        // Contabiliza os horários ocupados por barbeiro
        const vagasOcupadas = {};

        horariosDisponiveis.forEach(hora => {
            vagasOcupadas[hora] = {};
            barbeiroSelect.querySelectorAll('option').forEach(option => {
                const barbeiro = option.value;
                vagasOcupadas[hora][barbeiro] = 0;
            });
        });

        agendamentos.forEach(agendamento => {
            const { hora, barbeiro } = agendamento;
            if (vagasOcupadas[hora] && vagasOcupadas[hora][barbeiro] < 5) {
                vagasOcupadas[hora][barbeiro]++;
            }
        });

        return vagasOcupadas;
    }

    // Função para atualizar as opções de horários com base nas vagas
    async function atualizarHorariosDisponiveis(dataSelecionada) {
        const vagasOcupadas = await verificarHorariosOcupados(dataSelecionada);

        // Limpa as opções atuais de horário
        horaSelect.innerHTML = '';

        horariosDisponiveis.forEach((hora) => {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora;

            // Verifica se o horário está ocupado para o barbeiro
            const barbeiro = barbeiroSelect.value;
            const vagas = vagasOcupadas[hora]?.[barbeiro] || 0;

            if (vagas >= 5) {
                option.disabled = true;
                option.textContent = `${hora} (sem vagas)`;
            }

            horaSelect.appendChild(option);
        });
    }

    // Atualiza os horários assim que a data é selecionada
    document.getElementById('data').addEventListener('change', (event) => {
        atualizarHorariosDisponiveis(event.target.value);
    });

    // Atualiza os horários quando o barbeiro é alterado
    barbeiroSelect.addEventListener('change', async (event) => {
        const dataSelecionada = document.getElementById('data').value;
        if (dataSelecionada) {
            await atualizarHorariosDisponiveis(dataSelecionada);
        }
    });

    const form = document.querySelector('.agendamento-form');
    const mensagem = document.createElement('div');
    mensagem.id = 'mensagem';
    form.appendChild(mensagem);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const unidade = document.getElementById('unidade').value;
        const barbeiro = document.getElementById('barbeiro').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const servico = document.getElementById('servico').value;

        const { error } = await supabaseClient
            .from('agendamentos')
            .insert([{ nome, celular, unidade, barbeiro, data, hora, servico }]);

        if (error) {
            console.error(error);
            mensagem.textContent = '❌ Ocorreu um erro ao enviar seu agendamento. Tente novamente.';
            mensagem.style.color = 'red';
        } else {
            mensagem.textContent = '✅ Agendamento realizado com sucesso!';
            mensagem.style.color = 'green';
            form.reset();
            // Atualiza os horários disponíveis após um novo agendamento
            await atualizarHorariosDisponiveis(data);
        }
    });

    // Inicializa as opções de horários ao carregar a página
    const dataSelecionada = document.getElementById('data').value;
    if (dataSelecionada) {
        await atualizarHorariosDisponiveis(dataSelecionada);
    }
});

// Cookies
if (!localStorage.getItem('cookies-accepted')) {
    document.getElementById('cookie-banner').style.display = 'block';
}

document.getElementById('accept-cookies').addEventListener('click', function() {
    localStorage.setItem('cookies-accepted', 'true');
    document.getElementById('cookie-banner').style.display = 'none';
});

document.getElementById('decline-cookies').addEventListener('click', function() {
    localStorage.setItem('cookies-accepted', 'false');
    document.getElementById('cookie-banner').style.display = 'none';
});



