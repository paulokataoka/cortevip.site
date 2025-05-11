// Animação suave ao carregar
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  container.style.opacity = "0";
  container.style.transform = "translateY(20px)";
  setTimeout(() => {
    container.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    container.style.opacity = "1";
    container.style.transform = "translateY(0)";
  }, 100);

  // Detectar modo escuro/claro do sistema
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

  // Efeito de clique ou som opcional (ativar se desejar)
  /*
  const buttons = document.querySelectorAll(".btn");
  const clickSound = new Audio("click.mp3");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      clickSound.play();
    });
  });
  */
});
