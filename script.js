document.addEventListener("DOMContentLoaded", () => {
    const giftBox = document.getElementById("gift-box");
    const skyContainer = document.getElementById("sky-container");
    const birthContainer = document.getElementById("birth-container");
    const birthSkyContainer = document.getElementById("birth-sky-container");
    const kickElementsWrapper = document.getElementById("kick-elements-wrapper");
    const allStar = document.getElementById("allstar");
    const explosion = document.getElementById("explosion");
    const tooltip = document.getElementById("tooltip");
    const bgMusic = document.getElementById("bg-music");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const nextPageBtn = document.getElementById("next-page-btn");
    const mainContainer = document.querySelector(".container");

    let planets = [];
    let currentPlanetIndex = 0;

    const titleText = " Assim estava o céu quando os rumos de nossas vidas se encontraram 💜";
    let titleIndex = 0;

    let messageLoopTimeoutId;
    let isHovering = false;
    let pausedPlanetIndex = currentPlanetIndex;
    const TOOLTIP_TRANSITION_DURATION = 500;
    const AUTO_MESSAGE_DELAY = 8500;

    const STAR_CREATE_INTERVAL = 30;
    let lastStarCreationTime = 0;

    const customCursor = document.createElement("div");
    customCursor.className = "custom-star-cursor";
    customCursor.style.position = "fixed";
    customCursor.style.pointerEvents = "none";
    customCursor.style.zIndex = "9999";
    document.body.appendChild(customCursor);
    document.body.style.cursor = 'none';

    document.addEventListener("mousemove", (e) => {
        const currentTime = Date.now();
        if (currentTime - lastStarCreationTime < STAR_CREATE_INTERVAL) {
            return;
        }
        lastStarCreationTime = currentTime;

        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;

        const star = document.createElement("div");
        star.className = "star";
        star.style.position = "fixed";
        star.style.left = `${e.clientX}px`;
        star.style.top = `${e.clientY}px`;
        star.style.pointerEvents = "none";
        document.body.appendChild(star);
        
        star.addEventListener('animationend', () => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, { once: true });
    });

    setInterval(() => {
        document.title = titleText.slice(titleIndex) + titleText.slice(0, titleIndex);
        titleIndex = (titleIndex + 1) % titleText.length;
    }, 200);

    const messages = {
        sol: "Sou aquele raio de luz meio torto que invade seu aquário, faz cócegas e anima o peixinho, provocando sorrisos sem nem pedir licença",
        mercurio: "Me comunico baixinho e calmo, nas entrelinhas, com um toque de mistério e poesia que só quem sabe ouvir com a alma é capaz de entender",
        venus: "Sou o toque que acontece até no silêncio entre dois olhares. Amor é liberdade de coexistir e respeitar, lado a lado, sem cobrar nada em troca",
        marte: "Sou a força que arde o peito, o chute na canela que empurra suavemente e o abraço quente de quem não tem intenção de te soltar",
        jupiter: "Sou a fé, a semente que escolhe seu tempo pra brotar. Crescer não é agir com velocidade ou impulsividade, mas sim ter raízes e profundidade",
        saturno: "Sou o tempo que ensina que o que é verdadeiro não se apressa. A maturidade é um gesto sutil de quem sabe esperar a colheita de bons frutos",
        urano: "Sou o estalo que tira o véu dos olhos, com leveza para não assustar as verdades e firmeza para permanecer com confiança",
        netuno: "Sou a onda dos sonhos e das saudades, às vezes uma névoa que não sabemos de onde vêm porém sempre atendemos",
        plutao: "Mostro o fim que prepara terreno pro recomeço. Dentro da desconstrução mora a semente da transformação",
        lua: "E eu observo de longe, como quem não se apega, mas sente tudo. Sou o aconchego nas noites de silêncio, o sussurro doce que chega de mansinho",
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
            console.log("Autoplay bloqueado pelo navegador. Por favor, abra a caixa para reproduzir a música.");
        }

        giftBox.classList.add("kick-animation");

        kickElementsWrapper.style.opacity = "1";

        allStar.style.animation = "allstarAnimation 1.8s forwards";

        setTimeout(() => {
            explosion.style.animation = "explosionAnimation 0.5s forwards";
        }, 900);
        
        setTimeout(() => {
            giftBox.classList.add("hidden"); 
            mainContainer.classList.add("hidden");

            kickElementsWrapper.style.animation = "none";
            kickElementsWrapper.style.opacity = "0";
            allStar.style.animation = "none";
            allStar.style.opacity = "0";
            explosion.style.animation = "none";
            explosion.style.opacity = "0";

            skyContainer.style.visibility = "visible";
            skyContainer.style.opacity = "1";
            playPauseBtn.style.display = "inline-block";
            nextPageBtn.style.display = "inline-block";
            planets = [...skyContainer.querySelectorAll('.planet')];
            currentPlanetIndex = planets.findIndex(p => p.classList.contains('sol'));


            currentPlanetIndex = planets.findIndex(p => p.classList.contains("sol"));

            if (currentPlanetIndex === -1) {
                currentPlanetIndex = 0;
            }
            startMessageLoop();
            addPlanetHoverListeners();
        }, 2500);
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

    function showTooltip(planet, message) {
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

    function hideTooltip() {
        tooltip.style.opacity = "0";
        tooltip.classList.remove("visible");
    }

    let autoHighlightedPlanet = null;

    function startMessageLoop() {
        clearTimeout(messageLoopTimeoutId);

        if (autoHighlightedPlanet) {
            autoHighlightedPlanet.classList.remove("planet-active-message");
            autoHighlightedPlanet = null;
        }

        if (isHovering) {
            return;
        }

        hideTooltip();

        messageLoopTimeoutId = setTimeout(() => {
            if (isHovering) {
                clearTimeout(messageLoopTimeoutId);
                return;
            }

            const planetToDisplay = planets[currentPlanetIndex];
            const keyToDisplay = [...planetToDisplay.classList].find(c => messages[c]) || "";

            if (messages[keyToDisplay]) {
                planetToDisplay.classList.add("planet-active-message");
                autoHighlightedPlanet = planetToDisplay;
                showTooltip(planetToDisplay, messages[keyToDisplay]);
            }

            currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
            messageLoopTimeoutId = setTimeout(startMessageLoop, AUTO_MESSAGE_DELAY);
        }, TOOLTIP_TRANSITION_DURATION);
    }

    function addPlanetHoverListeners() {
        planets.forEach(planet => {
            planet.addEventListener("mouseenter", () => {
                isHovering = true;
                clearTimeout(messageLoopTimeoutId);
                if (autoHighlightedPlanet) {
                    autoHighlightedPlanet.classList.remove("planet-active-message");
                    autoHighlightedPlanet = null;
                }

                pausedPlanetIndex = currentPlanetIndex;

                hideTooltip();

                setTimeout(() => {
                    const key = [...planet.classList].find(c => messages[c]) || "";
                    if (messages[key]) {
                        showTooltip(planet, messages[key]);
                    }
                }, TOOLTIP_TRANSITION_DURATION);
            });

            planet.addEventListener("mouseleave", () => {
                hideTooltip();
                isHovering = false;

                setTimeout(() => {
                    currentPlanetIndex = pausedPlanetIndex;
                    startMessageLoop();
                }, TOOLTIP_TRANSITION_DURATION);
            });
        });
    }

    function showBirthChart() {
        skyContainer.style.opacity = '0';
        skyContainer.style.visibility = 'hidden';

        birthContainer.classList.remove('hidden');
        birthSkyContainer.style.visibility = 'visible';
        birthSkyContainer.style.opacity = '1';
        nextPageBtn.style.display = 'none';

        planets = [...birthSkyContainer.querySelectorAll('.planet')];
        currentPlanetIndex = planets.findIndex(p => p.classList.contains('sol'));
        if (currentPlanetIndex === -1) {
            currentPlanetIndex = 0;
        }
        startMessageLoop();
        addPlanetHoverListeners();
    }

    nextPageBtn.addEventListener('click', showBirthChart);

    nextPageBtn.addEventListener('wheel', showBirthChart);

    nextPageBtn.addEventListener('click', () => {
        window.location.href = 'mapa.html';
    });

    nextPageBtn.addEventListener('wheel', () => {
        window.location.href = 'mapa.html';
    });

    updateMusicButtonState();
});
