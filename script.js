document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const skyContainer = document.getElementById("sky-container");

  giftBox.addEventListener("click", () => {
  const kickImg = document.getElementById("kick-img");
  const boom = document.getElementById("boom");

  giftBox.classList.add("kick-animation");

  kickImg.style.display = "block";
  boom.style.display = "block";

  setTimeout(() => {
    kickImg.style.display = "none";
    boom.style.display = "none";
    giftBox.style.display = "none";
    skyContainer.style.display = "block";
    startMessageLoop();
  }, 2000);
});

  const messages = [
    "Sol: Eu brilho no meio da névoa pisciana.",
    "Lua: E eu observo tudo de longe, como quem não se apega, mas sente.",
    "Vênus: Prefiro o toque que vem do olhar.",
    "Marte: Mas às vezes o amor vem numa canelada.",
    "Saturno: As estruturas também sabem chorar.",
    "Netuno: Tudo isso talvez tenha sido só um sonho.",
    "Plutão: Mas sonhos mexem com o que há de mais real.",
  ];

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
