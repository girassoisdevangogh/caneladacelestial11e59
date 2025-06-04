document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const skyContainer = document.getElementById("sky-container");
  const allStar = document.getElementById("allstar");
  const explosion = document.getElementById("explosion");
  const tooltip = document.getElementById("tooltip");
  const titleText = "🌌 Assim estava o céu naquela noite em que o rumo das nossas vidas se encontraram... ";
  let titleIndex = 0;

  setInterval(() => {
    document.title = titleText.slice(titleIndex) + titleText.slice(0, titleIndex);
    titleIndex = (titleIndex + 1) % titleText.length;
  }, 200);

  const messages = {
    sol: "☀️ Sol: Eu sou aquela luz que ilumina do jeitinho diferente, meio doido, meio sonhador, tipo um abraço inesperado que te faz sorrir sem saber por quê.",
    lua: "🌙 Lua: E eu observo tudo de longe, como quem não se apega, mas sente. Sou o aconchego nas noites de silêncio, o sussurro doce que chega de mansinho.",
    venus: "💖 Vênus: Amor, pra mim, é liberdade de existir ao lado, sem cobrar presença. É toque que acontece até no silêncio entre dois olhares.",
    marte: "🔥 Marte: Sou o fogo que arde no peito, o chute que te empurra pra frente, e o abraço quente que não te solta.",
    mercurio: "🧠 Mercúrio: Falo baixinho, nas entrelinhas, com um toque de mistério e poesia que só quem sabe ouvir entende.",
    jupiter: "🌱 Júpiter: Crescer não é pressa, é raiz. A fé é uma semente que escolhe seu tempo pra brotar.",
    saturno: "⏳ Saturno: O tempo me ensinou que o que é verdadeiro não se apressa. A maturidade é um gesto calmo de quem já esperou muito.",
    urano: "⚡ Urano: Toda mudança começa com um incômodo. Sou o estalo que tira o véu dos olhos.",
    netuno: "🌊 Netuno: Sou a névoa dos sonhos e das saudades que a gente não sabe de onde vêm.",
    plutao: "🏹 Plutão: Dentro da dor mora a semente da transformação. Eu sou o fim que prepara terreno pro recomeço."
  };

  let animationStarted = false;

  giftBox.addEventListener("click", () => {
    if (animationStarted) return;
    animationStarted = true;

    giftBox.classList.add("kick-animation");
    allStar.classList.add("animate");

    setTimeout(() => explosion.classList.add("animate"), 500);

    setTimeout(() => {
      giftBox.style.display = "none";
      skyContainer.style.display = "block";
      allStar.style.opacity = "0";
      startMessageLoop();
    }, 2000);
  });

  function positionTooltip(planet, message) {
    tooltip.style.opacity = "0"; // fade out rápido antes de reposicionar
    tooltip.textContent = message;

    // Espera um pouco para pegar o tamanho atualizado do tooltip
    requestAnimationFrame(() => {
      const tooltipRect = tooltip.getBoundingClientRect();
      const rect = planet.getBoundingClientRect();

      let top = window.scrollY + rect.top - tooltipRect.height - 12;
      let left = window.scrollX + rect.left + rect.width / 2 - tooltipRect.width / 2;

      left = Math.min(Math.max(left, 8), window.innerWidth - tooltipRect.width - 8);
      if (top < window.scrollY + 8) top = window.scrollY + rect.bottom + 12;

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.style.opacity = "1";
      tooltip.classList.add("visible");
    });
  }

  function startMessageLoop() {
    const planets = [...document.querySelectorAll(".planet")];
    let current = planets.findIndex(p => p.classList.contains("sol"));
    if (current === -1) current = 0;

    function showNextTooltip() {
      const planet = planets[current];
      const key = [...planet.classList].find(c => messages[c]) || "";
      positionTooltip(planet, messages[key] || "");

      current = (current + 1) % planets.length;
      setTimeout(showNextTooltip, 7000);
    }

    showNextTooltip();
  }

  document.addEventListener("mousemove", (e) => {
    const star = document.createElement("div");
    star.className = "star";
    star.style.position = "fixed";
    star.style.left = `${e.clientX}px`;
    star.style.top = `${e.clientY}px`;
    star.style.pointerEvents = "none";
    document.body.appendChild(star);

    setTimeout(() => {
      if (star.parentNode) star.parentNode.removeChild(star);
    }, 1000);
  });
});
