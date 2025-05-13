// Aguardando o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Preenchendo o campo de hora com a hora atual
    const horaInput = document.getElementById('hora');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    horaInput.value = time;

    // Captura o formulário de agendamento
    const agendamentoForm = document.getElementById('agendamento-form');
    
    // Quando o formulário for submetido
    agendamentoForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o comportamento padrão de envio do formulário
        
        // Coleta os dados do formulário
        const nome = document.getElementById('nome').value;
        const celular = document.getElementById('celular').value;
        const barbearia = document.getElementById('barbearia').value;
        const barbeiro = document.getElementById('barbeiro').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const servico = document.getElementById('servico').value;

        // Valida se todos os campos foram preenchidos
        if (!nome || !celular || !barbearia || !barbeiro || !data || !hora || !servico) {
            document.getElementById('mensagem').textContent = 'Por favor, preencha todos os campos.';
            document.getElementById('mensagem').style.color = 'red';
            return;
        }

        // Exibe a mensagem de sucesso
        document.getElementById('mensagem').textContent = 'Agendamento realizado com sucesso!';
        document.getElementById('mensagem').style.color = 'green';

        // Aqui você pode adicionar a lógica para salvar os dados no Supabase ou outro banco de dados
        // Exemplo: Salvar os dados no banco de dados, enviar via API, etc.
        // Supondo que você esteja usando o Supabase, algo como:
        /*
        const { data, error } = await supabase
            .from('agendamentos')
            .insert([
                { nome, celular, barbearia, barbeiro, data, hora, servico }
            ]);
        */
        
        // Limpar o formulário após o envio
        agendamentoForm.reset();
    });

    // Funcionalidade para a aceitação dos cookies
    const acceptCookiesButton = document.getElementById('accept-cookies');
    const declineCookiesButton = document.getElementById('decline-cookies');
    const cookieBanner = document.getElementById('cookie-banner');

    // Exibir o banner de cookies se ainda não foi aceito
    if (!localStorage.getItem('cookies-aceitos')) {
        cookieBanner.style.display = 'block';
    }

    acceptCookiesButton.addEventListener('click', function() {
        localStorage.setItem('cookies-aceitos', 'true');
        cookieBanner.style.display = 'none';
    });

    declineCookiesButton.addEventListener('click', function() {
        localStorage.setItem('cookies-aceitos', 'false');
        cookieBanner.style.display = 'none';
    });
});


