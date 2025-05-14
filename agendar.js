<!-- HTML do formulário de agendamento -->
<form id="agendamento-form">
    <div class="form-group">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" name="nome" required />
    </div>

    <div class="form-group">
        <label for="celular">Celular:</label>
        <input type="text" id="celular" name="celular" required />
    </div>

    <div class="form-group">
        <label for="barbearia">Barbearia:</label>
        <input type="text" id="barbearia" name="barbearia" required />
    </div>

    <div class="form-group">
        <label for="barbeiro">Barbeiro:</label>
        <input type="text" id="barbeiro" name="barbeiro" required />
    </div>

    <div class="form-group">
        <label for="data">Data:</label>
        <input type="date" id="data" name="data" required />
    </div>

    <div class="form-group">
        <label for="hora">Hora:</label>
        <input type="time" id="hora" name="hora" min="09:00" max="18:00" step="3600" required />
    </div>

    <div class="form-group">
        <label for="servico">Serviço:</label>
        <input type="text" id="servico" name="servico" required />
    </div>

    <button type="submit">Agendar</button>

    <p id="mensagem"></p>
</form>

<script>
// Função para verificar se o horário já está ocupado
async function verificarHorarioOcupado(data, hora) {
    // Simulação de consulta ao banco de dados para verificar agendamento
    const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('data', data)
        .eq('hora', hora);

    if (agendamentos.length > 0) {
        return true; // Horário ocupado
    }
    return false; // Horário livre
}

// Função para verificar e salvar o agendamento
const form = document.getElementById("agendamento-form");
const mensagemElement = document.getElementById("mensagem");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Coleta de dados do formulário
    const nome = document.getElementById("nome").value;
    const celular = document.getElementById("celular").value;
    const barbearia = document.getElementById("barbearia").value;
    const barbeiro = document.getElementById("barbeiro").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const servico = document.getElementById("servico").value;

    // Verifica se todos os campos foram preenchidos
    if (!nome || !celular || !barbearia || !barbeiro || !data || !hora || !servico) {
        mensagemElement.textContent = "Por favor, preencha todos os campos.";
        mensagemElement.style.color = "red";
        return;
    }

    // Verifica se o horário está ocupado
    const horarioOcupado = await verificarHorarioOcupado(data, hora);
    if (horarioOcupado) {
        mensagemElement.textContent = "Este horário já está ocupado. Por favor, escolha outro.";
        mensagemElement.style.color = "red";
        return;
    }

    // Simulação de chamada para salvar no banco (Supabase)
    // Após sucesso na inserção, exibir mensagem de confirmação
    const { error } = await supabase
        .from('agendamentos')
        .insert([
            {
                nome,
                celular,
                barbearia,
                barbeiro,
                data,
                hora,
                servico,
            }
        ]);

    if (error) {
        mensagemElement.textContent = "Erro ao realizar o agendamento. Tente novamente.";
        mensagemElement.style.color = "red";
    } else {
        mensagemElement.textContent = "Agendamento realizado com sucesso!";
        mensagemElement.style.color = "green";
        // Limpa os campos do formulário
        form.reset();
    }
});
</script>
