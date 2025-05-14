const form = document.getElementById("agendamento-form");
const mensagemElement = document.getElementById("mensagem");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Coleta de dados do formulário
    const nome = document.getElementById("nome").value;
    const celular = document.getElementById("celular").value;
    const barbearia = document.getElementById("barbearia").value;
    const barbeiro = document.getElementById("barbeiro").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const servico = document.getElementById("servico").value;

    if (!nome || !celular || !barbearia || !barbeiro || !data || !hora || !servico) {
        mensagemElement.textContent = "Por favor, preencha todos os campos.";
        mensagemElement.style.color = "red";
        return;
    }

    // Simulação de chamada para salvar no banco (Supabase)
    // Após sucesso na inserção, exibir mensagem de confirmação
    mensagemElement.textContent = "Agendamento realizado com sucesso!";
    mensagemElement.style.color = "green";

    // Limpa os campos do formulário
    form.reset();
});


