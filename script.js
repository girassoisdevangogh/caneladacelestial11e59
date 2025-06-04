document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const skyContainer = document.getElementById("sky-container");
  const allStar = document.getElementById("allstar");
  const explosion = document.getElementById("explosion");

  giftBox.addEventListener("click", () => {
    giftBox.classList.add("kick-animation");
    allStar.classList.add("animate");

    setTimeout(() => {
      explosion.classList.add("animate");
    }, 500);

    setTimeout(() => {
      giftBox.style.display = "none";
      skyContainer.style.display = "block";
      startMessageLoop();
    }, 2000);
  });

  const tooltip = document.getElementById("tooltip");

const messages = {
  sol: "Sol: Eu brilho no meio da névoa pisciana.",
  lua: "Lua: E eu observo tudo de longe, como quem não se apega, mas sente.",
  venus: "Vênus: Prefiro o toque que vem do olhar.",
  marte: "Marte: Mas às vezes o amor vem numa canelada.",
  saturno: "Saturno: As estruturas também sabem chorar.",
  netuno: "Netuno: Tudo isso talvez tenha sido só um sonho.",
  plutao: "Plutão: Mas sonhos mexem com o que há de mais real.",
  mercurio: "Mercúrio: Silêncio também comunica.",
  jupiter: "Júpiter: Crescer é sair da zona de conforto.",
  urano: "Urano: A mudança é inevitável."
};

document.querySelectorAll(".planet").forEach(planet => {
  planet.addEventListener("mouseover", (e) => {
    for (const key in messages) {
      if (planet.classList.contains(key)) {
        tooltip.textContent = messages[key];
        tooltip.classList.add("visible");
        break;
      }
    }
  });

  planet.addEventListener("mousemove", (e) => {
    tooltip.style.top = (e.pageY + 15) + "px";
    tooltip.style.left = (e.pageX + 15) + "px";
  });

  planet.addEventListener("mouseout", () => {
    tooltip.classList.remove("visible");
  });
});

  let currentMessage = 0;

  function startMessageLoop() {
    const messageEl = document.createElement("div");
    messageEl.id = "message";
    document.body.appendChild(messageEl);

    function showNextMessage() {
      messageEl.textContent = messages[currentMessage];
      messageEl.style.opacity = 1;

      setTimeout(() => {
        messageEl.style.opacity = 0;
        currentMessage = (currentMessage + 1) % messages.length;
        setTimeout(showNextMessage, 1000);
      }, 4000);
    }

    showNextMessage();
  }
});
