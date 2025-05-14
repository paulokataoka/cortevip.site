document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("agendamento-form");
    const mensagem = document.getElementById("mensagem");
    const botaoAgendar = form.querySelector(".btn-agendar");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Desativa botão temporariamente
        botaoAgendar.disabled = true;
        botaoAgendar.textContent = "Aguarde...";

        // Coleta os dados do formulário
        const dados = {
            nome: form.nome.value.trim(),
            celular: form.celular.value.trim(),
            barbearia: form.barbearia.value,
            barbeiro: form.barbeiro.value,
            data: form.data.value,
            hora: form.hora.value,
            servico: form.servico.value,
        };

        // Validação simples extra
        if (!dados.nome || !dados.celular || !dados.barbearia || !dados.barbeiro || !dados.data || !dados.hora || !dados.servico) {
            exibirMensagem("Preencha todos os campos obrigatórios.", false);
            botaoAgendar.disabled = false;
            botaoAgendar.textContent = "Agendar";
            return;
        }

        // Simula envio ao servidor (aqui você pode integrar com Supabase, Google Sheets, etc.)
        setTimeout(() => {
            // Sucesso simulado
            exibirMensagem("Agendamento realizado com sucesso!", true);
            form.reset();
            botaoAgendar.disabled = false;
            botaoAgendar.textContent = "Agendar";
        }, 1500);
    });

    function exibirMensagem(texto, sucesso = true) {
        mensagem.textContent = texto;
        mensagem.className = "mensagem visivel " + (sucesso ? "sucesso" : "erro");

        // Esconde a mensagem após 4 segundos
        setTimeout(() => {
            mensagem.classList.remove("visivel");
        }, 4000);
    }
});
