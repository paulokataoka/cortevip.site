document.addEventListener('DOMContentLoaded', () => {
    const supabaseClient = supabase.createClient(
        'https://smfeazihfcqmtmmnhknm.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc'
    );

    const horariosDisponiveis = ['9:00','11:30','14:00','16:00','19:00', '20:30'];
    const horaSelect = document.getElementById('hora');
    const form = document.querySelector('.agendamento-form');
    const mensagem = document.createElement('div');
    mensagem.id = 'mensagem';
    form.appendChild(mensagem);

    const barbeiroInput = document.getElementById('barbeiro');
    const dataInput = document.getElementById('data');

    // Função para buscar horários ocupados e atualizar a lista
    async function atualizarHorarios() {
        const barbeiro = barbeiroInput.value;
        const data = dataInput.value;

        // Só atualiza se ambos estiverem preenchidos
        if (!barbeiro || !data) return;

        // Buscar agendamentos existentes para o barbeiro e data
        const { data: agendamentos, error } = await supabaseClient
            .from('agendamentos')
            .select('hora')
            .eq('barbeiro', barbeiro)
            .eq('data', data);

        if (error) {
            console.error('Erro ao buscar horários:', error);
            return;
        }

        // Extrair horários ocupados
        const horasOcupadas = agendamentos.map(a => a.hora);

        // Limpar opções antigas
        horaSelect.innerHTML = '<option value="">Selecione o horário</option>';

        // Adicionar apenas horários livres
        horariosDisponiveis.forEach(hora => {
            if (!horasOcupadas.includes(hora)) {
                const option = document.createElement('option');
                option.value = hora;
                option.textContent = hora;
                horaSelect.appendChild(option);
            }
        });
    }

    // Atualiza os horários ao mudar barbeiro ou data
    barbeiroInput.addEventListener('change', atualizarHorarios);
    dataInput.addEventListener('change', atualizarHorarios);

    // Envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const barbearia = document.getElementById('barbearia').value;
        const barbeiro = barbeiroInput.value;
        const data = dataInput.value;
        const hora = horaSelect.value;
        const servico = document.getElementById('servico').value;

        if (!nome || !celular || !barbearia || !barbeiro || !data || !hora || !servico) {
            mensagem.textContent = '❌ Por favor, preencha todos os campos.';
            mensagem.style.color = 'red';
            return;
        }

        const { error } = await supabaseClient
            .from('agendamentos')
            .insert([{ nome, celular, barbearia, barbeiro, data, hora, servico }]);

        if (error) {
            console.error(error);
            mensagem.textContent = '❌ Ocorreu um erro ao enviar seu agendamento. Tente novamente.';
            mensagem.style.color = 'red';
        } else {
            mensagem.textContent = '✅ Agendamento realizado com sucesso!';
            mensagem.style.color = 'green';
            form.reset();
            horaSelect.innerHTML = '<option value="">Selecione o horário</option>';
            setTimeout(() => {
                mensagem.textContent = '';
            }, 3000);
        }
    });
});

