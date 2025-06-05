document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const skyContainer = document.getElementById("sky-container");
  const allStar = document.getElementById("allstar");
  const explosion = document.getElementById("explosion");
  const tooltip = document.getElementById("tooltip");
  const bgMusic = document.getElementById("bg-music");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const mainContainer = document.querySelector(".container");

  const planets = [...document.querySelectorAll(".planet")];
  let currentPlanetIndex = planets.findIndex(p => p.classList.contains("sol"));
  if (currentPlanetIndex === -1) {
    currentPlanetIndex = 0;
  }

  const titleText = "🌌 Assim estava o céu quando o rumo das nossas vidas se cruzaram";
  let titleIndex = 0;

  let messageLoopTimeoutId;
  let isHovering = false;
  const TOOLTIP_TRANSITION_DURATION = 500; // Duração da transição do tooltip em ms (igual ao seu CSS)
  const AUTO_MESSAGE_DELAY = 8500; // Tempo que a mensagem fica visível antes de mudar

  setInterval(() => {
    document.title = titleText.slice(titleIndex) + titleText.slice(0, titleIndex);
    titleIndex = (titleIndex + 1) % titleText.length;
  }, 800);

  const messages = {
    sol: "☀️ Sou aquele raio de luz meio torto que invade o aquário, faz cócegas e anima o peixinho, provocando sorrisos sem nem pedir licença ☀️",
    lua: "🌙 E eu observo tudo de longe, como quem não se apega, mas sente. Sou o aconchego nas noites de silêncio, o sussurro doce que chega de mansinho 🌙",
    venus: "💖 Amor, pra mim, é liberdade de coexistir lado a lado, sem cobrar nada em troca. Sou o toque que acontece até no silêncio entre dois olhares 💖",
    marte: "🔥 Sou o fogo que arde no peito, o chute na canela empurra suavemente ao progresso e o abraço quente de quem não tem intenção de te soltar 🔥",
    mercurio: "🧠 Falo baixinho, nas entrelinhas, com um toque de mistério e poesia que só quem sabe ouvir entende 🧠",
    jupiter: "🌱 Crescer não é pressa, é raiz. Sou a fé, a semente que escolhe seu tempo pra brotar 🌱",
    saturno: "⏳ O tempo me ensinou que o que é verdadeiro não se apressa. A maturidade é um gesto calmo de quem já esperou muito ⏳",
    urano: "⚡ Sou o estalo que tira o véu dos olhos, com leveza para não assustar e firmeza para permanecer ⚡",
    netuno: "🌊 Sou a névoa dos sonhos e das saudades que a gente não sabe de onde vêm mas sempre atende 🌊",
    plutao: "🏹 Dentro da desconstrução mora a semente da transformação. Eu sou o fim que prepara terreno pro recomeço 🏹"
  };

  let animationStarted = false;

  function updateMusicButtonState() {
    playPauseBtn.textContent = bgMusic.paused ? "▶️" : "⏸️";
  }

  giftBox.addEventListener("click", async () => {
    if (animationStarted) return;
    animationStarted = true;

    try {
      await bgMusic.play();
      updateMusicButtonState();
    } catch (e) {
      console.log("Autoplay bloqueado pelo navegador. Por favor, interaja para reproduzir a música.");
    }

    giftBox.classList.add("kick-animation");
    allStar.classList.add("animate");

    setTimeout(() => explosion.classList.add("animate"), 500);
    setTimeout(() => {
      giftBox.style.display = "none";
      allStar.style.opacity = "0";
      explosion.classList.remove("animate");

      mainContainer.classList.add("hidden");

      skyContainer.style.visibility = "visible";
      skyContainer.style.opacity = "1";
      playPauseBtn.style.display = "inline-block";

      startMessageLoop();
      addPlanetHoverListeners();
    }, 2000);
  });

  playPauseBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
    updateMusicButtonState();
  });

  bgMusic.addEventListener('play', updateMusicButtonState);
  bgMusic.addEventListener('pause', updateMusicButtonState);
  bgMusic.addEventListener('ended', updateMusicButtonState);

  // Função para posicionar e mostrar o tooltip
  function showTooltip(planet, message) {
    tooltip.textContent = message; // Define o conteúdo antes de posicionar para pegar o tamanho correto

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

  // Função para esconder o tooltip
  function hideTooltip() {
    tooltip.style.opacity = "0";
    tooltip.classList.remove("visible");
  }

  // Função para iniciar ou reiniciar o loop de mensagens automáticas
  function startMessageLoop() {
    clearTimeout(messageLoopTimeoutId); // Limpa qualquer loop anterior

    // Se o mouse estiver sobre um planeta, não iniciamos o loop automático
    if (isHovering) {
        return;
    }

    // Primeiro, esconde o tooltip atual para iniciar o fade-out
    hideTooltip();

    // Depois de um pequeno atraso (igual à duração do fade-out), mostra o próximo tooltip
    messageLoopTimeoutId = setTimeout(() => {
      // Se o mouse estiver sobre um planeta durante o atraso, aborta a mudança automática
      if (isHovering) {
          clearTimeout(messageLoopTimeoutId);
          return;
      }

      const planetToDisplay = planets[currentPlanetIndex];
      // Encontra a classe do planeta que corresponde a uma chave nas mensagens
      const keyToDisplay = [...planetToDisplay.classList].find(c => messages[c]) || "";

      if (messages[keyToDisplay]) {
          showTooltip(planetToDisplay, messages[keyToDisplay]); // Mostra o novo tooltip
      }

      currentPlanetIndex = (currentPlanetIndex + 1) % planets.length; // Prepara para o próximo planeta
      // Agenda a próxima mudança automática
      messageLoopTimeoutId = setTimeout(startMessageLoop, AUTO_MESSAGE_DELAY);
    }, TOOLTIP_TRANSITION_DURATION); // Espera a transição de fade-out terminar
  }


  function addPlanetHoverListeners() {
    planets.forEach(planet => {
      planet.addEventListener("mouseenter", () => {
        isHovering = true; // Sinaliza que o mouse está sobre um planeta
        clearTimeout(messageLoopTimeoutId); // Para o loop automático

        hideTooltip(); // Esconde o tooltip atual com fade-out

        // Após a transição de fade-out, mostra o tooltip específico do planeta
        setTimeout(() => {
            const key = [...planet.classList].find(c => messages[c]) || "";
            if (messages[key]) {
                showTooltip(planet, messages[key]);
            }
        }, TOOLTIP_TRANSITION_DURATION);
      });

      planet.addEventListener("mouseleave", () => {
        hideTooltip(); // Esconde o tooltip com fade-out
        isHovering = false; // Sinaliza que o mouse saiu

        // Após a transição de fade-out, reinicia o loop automático
        setTimeout(() => {
          startMessageLoop();
        }, TOOLTIP_TRANSITION_DURATION); // Espera a transição de fade-out terminar
      });
    });
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

  updateMusicButtonState();
});
