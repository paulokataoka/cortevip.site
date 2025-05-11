document.addEventListener("DOMContentLoaded", () => {
  // Animação suave ao carregar
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

  // Efeito de digitação automática no subtítulo
  const frases = [
    "Agende seu corte com facilidade.",
    "Seu estilo começa aqui.",
    "CorteVip. Simples. Rápido. Profissional."
  ];

  let i = 0; // índice da frase
  let j = 0; // índice da letra
  let apagando = false;
  const speed = 100;
  const delayEntreFrases = 2000;
  const typedText = document.getElementById("typed-text");

  function digitar() {
    const fraseAtual = frases[i];
    if (!apagando && j <= fraseAtual.length) {
      typedText.textContent = fraseAtual.substring(0, j++);
      setTimeout(digitar, speed);
    } else if (apagando && j >= 0) {
      typedText.textContent = fraseAtual.substring(0, j--);
      setTimeout(digitar, speed / 2);
    } else {
      apagando = !apagando;
      if (!apagando) {
        i = (i + 1) % frases.length;
      }
      setTimeout(digitar, delayEntreFrases);
    }
  }

  digitar(); // Iniciar a digitação após o carregamento
});



