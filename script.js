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

  const titleText = "🌌 Assim estava o céu naquela noite em que o rumo das nossas vidas se encontraram... ";
  let titleIndex = 0;

  let messageLoopTimeoutId;
  let isHovering = false;

  setInterval(() => {
    document.title = titleText.slice(titleIndex) + titleText.slice(0, titleIndex);
    titleIndex = (titleIndex + 1) % titleText.length;
  }, 400);

  const messages = {
    sol: "☀️ Eu sou aquela luz que te ilumina de um jeitinho diferente, meio louco, meio sonhador e inesperado, que te faz sorrir sem saber por quê ☀️",
    lua: "🌙 E eu observo tudo de longe, como quem não se apega, mas sente. Sou o aconchego nas noites de silêncio, o sussurro doce que chega de mansinho 🌙",
    venus: "💖 Amor, pra mim, é liberdade de coexistir lado a lado, sem cobrar nada em troca. É toque que acontece até no silêncio entre dois olhares 💖",
    marte: "🔥 Sou o fogo que arde no peito, o chute que te empurra suavemente à frente, e o abraço quente de quem não tem intenção de te soltar 🔥",
    mercurio: "🧠 Falo baixinho, nas entrelinhas, com um toque de mistério e poesia que só quem sabe ouvir entende 🧠",
    jupiter: "🌱 Crescer não é pressa, é raiz. A fé é uma semente que escolhe seu tempo pra brotar 🌱",
    saturno: "⏳ O tempo me ensinou que o que é verdadeiro não se apressa. A maturidade é um gesto calmo de quem já esperou muito ⏳",
    urano: "⚡ Sou o estalo que tira o véu dos olhos, com leveza para não assustar e firmeza para permanecer ⚡",
    netuno: "🌊 Sou a névoa dos sonhos e das saudades que a gente não sabe de onde vêm, e sempre atende 🌊",
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

  function positionTooltip(planet, message) {
    tooltip.classList.remove("visible");
    tooltip.style.opacity = "0";
    tooltip.textContent = message;

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
    clearTimeout(messageLoopTimeoutId);
    if (isHovering) {
      return;
    }

    function showNextTooltip() {
      tooltip.classList.remove("visible");
      tooltip.style.opacity = "0";

      messageLoopTimeoutId = setTimeout(() => {
        if (!isHovering) {
          const planet = planets[currentPlanetIndex];
          const key = [...planet.classList].find(c => messages[c]) || "";

          if (messages[key]) {
            positionTooltip(planet, messages[key]);
          } else {
            currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
            showNextTooltip(); 
            return;
          }

          currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
          messageLoopTimeoutId = setTimeout(showNextTooltip, 8500);
        } else {
          clearTimeout(messageLoopTimeoutId);
        }
      }, 500);
    }

    showNextTooltip();
  }

  function addPlanetHoverListeners() {
    planets.forEach(planet => {
      planet.addEventListener("mouseenter", () => {
        isHovering = true;
        clearTimeout(messageLoopTimeoutId);
        tooltip.classList.remove("visible");
        tooltip.style.opacity = "0";

        const key = [...planet.classList].find(c => messages[c]) || "";
        if (messages[key]) {
          positionTooltip(planet, messages[key]);
        }
      });

      planet.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
        tooltip.style.opacity = "0";

        setTimeout(() => {
          isHovering = false;
          startMessageLoop();
        }, 500);
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
