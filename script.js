document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const skyContainer = document.getElementById("sky-container");
  const allStar = document.getElementById("allstar");
  const explosion = document.getElementById("explosion");
  const tooltip = document.getElementById("tooltip");

  giftBox.addEventListener("click", () => {
    giftBox.classList.add("kick-animation");
    allStar.classList.add("animate");

    setTimeout(() => {
      explosion.classList.add("animate");
    }, 500);

    setTimeout(() => {
      giftBox.style.display = "none";
      skyContainer.style.display = "block";
      allStar.style.opacity = "0"; // some com o tênis depois do chute
      startMessageLoop();
    }, 2000);
  });

  const messages = {
    sol: "Sol: Eu brilho no meio da névoa pisciana.",
    lua: "Lua: E eu observo tudo de longe, como quem não se apega, mas sente.",
    venus: "Vênus: Prefiro o toque que vem do olhar.",
    marte: "Marte: Mas às vezes o fogo não se apaga tão fácil.",
    mercurio: "Mercúrio: Eu sou o pensamento rápido e a emoção afiada.",
    jupiter: "Júpiter: Crescendo devagar e firme, a vida é terra e semente.",
    saturno: "Saturno: Tempo é a lição que ninguém quer aprender fácil.",
    urano: "Urano: A faísca da mudança e da revolução.",
    netuno: "Netuno: Sonhos líquidos que nos carregam pra longe.",
    plutao: "Plutão: O segredo escondido no escuro, mas que transforma tudo."
  };

  function startMessageLoop() {
    const planets = Array.from(document.querySelectorAll(".planet"));
    let current = 0;

    function showNextTooltip() {
      if (current >= planets.length) {
        tooltip.classList.remove("visible");
        return;
      }
      const planet = planets[current];
      const key = planet.classList[1]; // ex: "sol", "lua", etc
      const message = messages[key] || "";

      tooltip.textContent = message;
      tooltip.style.opacity = "1";
      tooltip.classList.add("visible");

      // posicionar tooltip próximo ao planeta
      const rect = planet.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      tooltip.style.top = window.scrollY + rect.top - tooltipRect.height - 8 + "px";
      tooltip.style.left = window.scrollX + rect.left + rect.width / 2 - tooltipRect.width / 2 + "px";

      current++;
      setTimeout(showNextTooltip, 3500);
    }

    showNextTooltip();
  }
});
