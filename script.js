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
    sol: "Sol: Eu sou aquela luz que ilumina do jeitinho diferente, meio doido, meio sonhador, tipo um abraço inesperado que te faz sorrir sem saber por quê.",
    lua: "Lua: E eu observo tudo de longe, como quem não se apega, mas sente. Sou seu aconchego nas noites de silêncio, o sussurro doce que chega de mansinho e te lembra que até nas sombras tem beleza.",
    venus: "Vênus: Prefiro o toque que vem do olhar.",
    marte: "Marte: Sou o fogo que arde no peito, aquele chute que te empurra pra frente, mas também o abraço quente que não te solta.",
    mercurio: "Mercúrio: Falo baixinho, nas entrelinhas, com um toque de mistério e poesia que só quem sabe ouvir consegue entender.",
    jupiter: "Júpiter: Crescendo devagar e firme, a vida é terra e semente.",
    saturno: "Saturno: Tempo é a lição que ninguém quer aprender fácil.",
    urano: "Urano: A faísca da mudança e da revolução.",
    netuno: "Netuno: Sonhos líquidos que nos carregam pra longe.",
    plutao: "Plutão: O segredo escondido no escuro, mas que transforma tudo."
  };

  let messageTimeout;

  function positionTooltip(planet, message) {
    tooltip.textContent = message;
    tooltip.style.opacity = "0";
    tooltip.classList.add("visible");
    tooltip.style.top = "0px";
    tooltip.style.left = "0px";

    // Força reflow para pegar o tamanho correto do tooltip
    const tooltipRect = tooltip.getBoundingClientRect();
    const rect = planet.getBoundingClientRect();

    let top = window.scrollY + rect.top - tooltipRect.height - 8;
    let left = window.scrollX + rect.left + rect.width / 2 - tooltipRect.width / 2;

    // Ajuste para não sair da tela na horizontal
    left = Math.min(Math.max(left, 8), window.innerWidth - tooltipRect.width - 8);

    // Se ultrapassar o topo da tela, mostra abaixo do planeta
    if (top < window.scrollY + 8) {
      top = window.scrollY + rect.bottom + 8;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.opacity = "1";
  }

  function startMessageLoop() {
    const planets = Array.from(document.querySelectorAll(".planet"));
    let current = 0;

    function showNextTooltip() {
      if (current >= planets.length) {
        tooltip.classList.remove("visible");
        return;
      }

      const planet = planets[current];
      // Busca a classe que está no messages
      const key = Array.from(planet.classList).find(c => messages[c]) || "";
      const message = messages[key] || "";

      positionTooltip(planet, message);

      current++;
      messageTimeout = setTimeout(showNextTooltip, 3500);
    }

    showNextTooltip();
  }
});
