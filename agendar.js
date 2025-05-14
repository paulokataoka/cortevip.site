// Substitua pelos seus dados do Supabase
const SUPABASE_URL = 'https://sfkhdqefmazimmscmjeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // coloque sua chave real aqui

// Inicializa o cliente Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Referência ao formulário e elemento de mensagem
const form = document.getElementById("agendamento-form");
const mensagemElement = document.getElementById("mensagem");

// Verifica se o horário já está ocupado na tabela do Supabase
async function verificarHorarioOcupado(data, hora) {
    const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('data', data)
        .eq('hora', hora);

    if (error) {
        console.error("Erro ao verificar horário:", error.message);
        return false;
    }

    return agendamentos.length > 0;
}

// Lida com o envio do formulário
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Coleta os valores do formulário
    const nome = document.getElementById("nome").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const barbearia = document.getElementById("barbearia").value.trim();
    const barbeiro = document.getElementById("barbeiro").value.trim();
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const servico = document.getElementById("servico").value.trim();

    // Validação simples
    if (!nome || !celular || !barbearia || !barbeiro || !data || !hora || !servico) {
        mensagemElement.textContent = "Por favor, preencha todos os campos.";
        mensagemElement.style.color = "red";
        return;
    }

    // Verifica se o horário já está ocupado
    const ocupado = await verificarHorarioOcupado(data, hora);
    if (ocupado) {
        mensagemElement.textContent = "Este horário já está agendado. Escolha outro.";
        mensagemElement.style.color = "red";
        return;
    }

    // Insere o agendamento no Supabase
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
            },
        ]);

    if (error) {
        console.error("Erro ao agendar:", error.message);
        mensagemElement.textContent = "Erro ao realizar o agendamento.";
        mensagemElement.style.color = "red";
    } else {
        mensagemElement.textContent = "Agendamento realizado com sucesso!";
        mensagemElement.style.color = "green";
        form.reset();
    }
});

