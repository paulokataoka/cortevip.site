document.addEventListener('DOMContentLoaded', () => {
    // ✅ Aqui está diferente agora:
    const supabaseClient = supabase.createClient(
        'https://smfeazihfcqmtmmnhknm.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmVhemloZmNxbXRtbW5oa25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzMzOTcsImV4cCI6MjA2MTk0OTM5N30.iiFgvwJ89Jnm6Z5HDJm24LJrwhK_3tc_arHzDMOZvwc'
    );

    const horariosDisponiveis = ['09:00', '11:00', '13:00', '15:00', '17:00'];

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
            .insert([{ nome, celular, unidade, barbeiro, data, hora, servico }]);

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
// Verifica se o usuário já aceitou ou recusou os cookies
if (!localStorage.getItem('cookies-accepted')) {
  document.getElementById('cookie-banner').style.display = 'block';
}

// Quando o usuário aceita os cookies
document.getElementById('accept-cookies').addEventListener('click', function() {
  localStorage.setItem('cookies-accepted', 'true');
  document.getElementById('cookie-banner').style.display = 'none';
});

// Quando o usuário recusa os cookies
document.getElementById('decline-cookies').addEventListener('click', function() {
  localStorage.setItem('cookies-accepted', 'false');
  document.getElementById('cookie-banner').style.display = 'none';
});




