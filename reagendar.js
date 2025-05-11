document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reagendar-form");
  const mensagemSucesso = document.getElementById("mensagem-sucesso");

  // Animação suave ao carregar
  const container = document.querySelector(".container");
  container.style.opacity = "0";
  container.style.transform = "translateY(20px)";
  setTimeout(() => {
    container.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    container.style.opacity = "1";
    container.style.transform = "translateY(0)";
  }, 100);

  // Modo escuro/claro automático
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

  // Manipular envio do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const celular = form.celular.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !celular || !mensagem) {
      mensagemSucesso.textContent = "Por favor, preencha todos os campos.";
      mensagemSucesso.style.color = "red";
      return;
    }

    // Simulação de envio (pode ser adaptado para Supabase ou outro backend)
    setTimeout(() => {
      mensagemSucesso.textContent = "Solicitação enviada com sucesso! Retornaremos em breve.";
      mensagemSucesso.style.color = "green";
      form.reset();
    }, 500);
  });
});


