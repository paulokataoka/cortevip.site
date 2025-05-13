document.addEventListener('DOMContentLoaded', () => {
    const supabaseClient = supabase.createClient(
        'https://smfeazihfcqmtmmnhknm.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc'
    );

    // Adicionando os horários da noite
    const horariosDisponiveis = ['19:00', '20:30'];

    const horaSelect = document.getElementById('hora');
    horariosDisponiveis.forEach((hora) => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = hora;
        horaSelect.appendChild(option);
    });

    const form = document.querySelector('.agendamento-form');
    const mensagem = document.createElement('div');
    mensagem.id = 'mensagem';
    form.appendChild(mensagem);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const endereco = document.getElementById("endereco").value;
        const barbeiro = document.getElementById('barbeiro').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const servico = document.getElementById('servico').value;

        const { error } = await supabaseClient
            .from('agendamentos')
            .insert([{ nome, celular, endereco, barbeiro, data, hora, servico }]);

        if (error) {
            console.error(error);
            mensagem.textContent = '❌ Ocorreu um erro ao enviar seu agendamento. Tente novamente.';
            mensagem.style.color = 'red';
        } else {
            mensagem.textContent = '✅ Agendamento realizado com sucesso!';
            mensagem.style.color = 'green';
            form.reset();
        }
    });
});
