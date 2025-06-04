document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const skyContainer = document.getElementById("sky-container");
  const allStar = document.getElementById("allstar");
  const explosion = document.getElementById("explosion");

  giftBox.addEventListener("click", () => {
    giftBox.classList.add("kick-animation");
    allStar.classList.add("animate");

  allStar.addEventListener("animationend", () => {
    allStar.classList.remove("animate");
  }, { once: true });
    setTimeout(() => {
      explosion.classList.add("animate");
    }, 500);

    setTimeout(() => {
      giftBox.style.display = "none";
      skyContainer.style.display = "block";
      startMessageLoop();
    }, 2000);
  });

  // Criar tooltip no JS caso não exista no HTML
  let tooltip = document.getElementById("tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.pointerEvents = "none";
    tooltip.style.padding = "6px 10px";
    tooltip.style.backgroundColor = "rgba(0,0,0,0.7)";
    tooltip.style.color = "#fff";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "14px";
    tooltip.style.fontFamily = "'Comic Sans MS', cursive";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "9999";
    document.body.appendChild(tooltip);
  }

  const messages = [
    "Sol: Eu brilho no meio da névoa pisciana.",
    "Lua: E eu observo tudo de longe, como quem não se apega, mas sente.",
    "Vênus: Prefiro o toque que vem do olhar.",
    "Marte: Mas às vezes o amor vem numa canelada.",
    "Saturno: As estruturas também sabem chorar.",
    "Netuno: Tudo isso talvez tenha sido só um sonho.",
    "Plutão: Mas sonhos mexem com o que há de mais real.",
    "Mercúrio: Silêncio também comunica.",
    "Júpiter: Crescer é sair da zona de conforto.",
    "Urano: A mudança é inevitável."
  ];

  // Para mapear o planeta para o texto da tooltip:
  const planetMap = {
    sol: 0,
    lua: 1,
    venus: 2,
    marte: 3,
    saturno: 4,
    netuno: 5,
    plutao: 6,
    mercurio: 7,
    jupiter: 8,
    urano: 9
  };

  document.querySelectorAll(".planet").forEach(planet => {
    planet.addEventListener("mouseover", (e) => {
      for (const key in planetMap) {
        if (planet.classList.contains(key)) {
          tooltip.textContent = messages[planetMap[key]];
          tooltip.style.display = "block";
          break;
        }
      }
    });

    planet.addEventListener("mousemove", (e) => {
      tooltip.style.top = (e.pageY + 15) + "px";
      tooltip.style.left = (e.pageX + 15) + "px";
    });

    planet.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });
  });

  let currentMessage = 0;

  function startMessageLoop() {
    const messageEl = document.createElement("div");
    messageEl.id = "message";
    messageEl.style.position = "fixed";
    messageEl.style.bottom = "20px";
    messageEl.style.left = "50%";
    messageEl.style.transform = "translateX(-50%)";
    messageEl.style.background = "rgba(0,0,0,0.7)";
    messageEl.style.color = "white";
    messageEl.style.padding = "10px 20px";
    messageEl.style.borderRadius = "8px";
    messageEl.style.fontFamily = "'Comic Sans MS', cursive";
    messageEl.style.fontSize = "16px";
    messageEl.style.opacity = "0";
    messageEl.style.transition = "opacity 1s ease";
    document.body.appendChild(messageEl);

    function showNextMessage() {
      messageEl.textContent = messages[currentMessage];
      messageEl.style.opacity = "1";

      setTimeout(() => {
        messageEl.style.opacity = "0";
        currentMessage = (currentMessage + 1) % messages.length;
        setTimeout(showNextMessage, 1000);
      }, 4000);
    }

    showNextMessage();
  }
});
