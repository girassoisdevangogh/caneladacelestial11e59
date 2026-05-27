document.addEventListener('DOMContentLoaded', () => {
  const giftBox = document.getElementById('gift-box');
  const skyContainer = document.getElementById('sky-container');
  const mapaContainer = document.getElementById('mapa-container');
  const btnVerMapa = document.getElementById('btn-ver-mapa');
  const btnVoltarSky = document.getElementById('btn-voltar-sky');
  const kickElementsWrapper = document.getElementById('kick-elements-wrapper');
  const allStar = document.getElementById('allstar');
  const explosion = document.getElementById('explosion');
  const tooltip = document.getElementById('tooltip');
  const bgMusic = document.getElementById('bg-music');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const musicControls = document.getElementById('music-controls');
  const trackNameEl = document.getElementById('track-name');
  const mainContainer = document.querySelector('.container');

  const playlist = [
    { src: 'assets/ruelle-i-get-to-love-you.mp3',      name: 'Ruelle — I Get to Love You' },
    { src: 'assets/ruelle-war-of-hearts.mp3',           name: 'Ruelle — War of Hearts' },
    { src: 'assets/billie-eilish-chihiro.mp3',          name: 'Billie Eilish — CHIHIRO' },
    { src: 'assets/billie-eilish-wildflower-guitar.mp3', name: 'Billie Eilish — Wildflower' },
    { src: 'assets/labrinth-mount-everest.mp3',         name: 'Labrinth — Mount Everest' },
    { src: 'assets/labrinth-zendaya-all-for-us.mp3',    name: 'Labrinth & Zendaya — All for Us' },
  ];

  for (let i = playlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
  }

  let currentTrackIndex = 0;

  function loadTrack(index, autoplay) {
    currentTrackIndex = (index + playlist.length) % playlist.length;
    bgMusic.src = playlist[currentTrackIndex].src;
    bgMusic.load();
    trackNameEl.textContent = playlist[currentTrackIndex].name;
    if (autoplay) bgMusic.play().then(updateMusicButtonState).catch(() => {});
    else updateMusicButtonState();
  }

  bgMusic.volume = 0.5;
  loadTrack(0, false);

  const planets = [...document.querySelectorAll('#sky-container .planet')];
  const mapaPlanets = [...document.querySelectorAll('#mapa-container .planet')];

  randomizePlanetPositions(skyContainer);
  randomizePlanetPositions(mapaContainer);

  const titleText =
    ' Assim estava o céu quando os rumos de nossas vidas se encontraram 💜';
  let titleIndex = 0;

  let messageLoopTimeoutId;
  let messageLoopCurrentIndex = 0;
  let isHovering = false;
  const TOOLTIP_TRANSITION_DURATION = 500;
  const AUTO_MESSAGE_DELAY = 8500;

  const STAR_CREATE_INTERVAL = 60;
  let lastStarCreationTime = 0;
  let cursorX = 0, cursorY = 0, cursorRafPending = false;

  const customCursor = document.createElement('div');
  customCursor.className = 'custom-star-cursor';
  customCursor.style.pointerEvents = 'none';
  customCursor.style.zIndex = '9999';
  customCursor.style.transform = 'translate(-100px, -100px)';
  document.body.appendChild(customCursor);
  document.body.style.cursor = 'none';

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;

    if (!cursorRafPending) {
      cursorRafPending = true;
      requestAnimationFrame(() => {
        customCursor.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px)`;
        cursorRafPending = false;
      });
    }

    const currentTime = Date.now();
    if (currentTime - lastStarCreationTime < STAR_CREATE_INTERVAL) {
      return;
    }
    lastStarCreationTime = currentTime;

    const star = document.createElement('div');
    star.className = 'star';
    star.style.position = 'fixed';
    star.style.left = `${e.clientX}px`;
    star.style.top = `${e.clientY}px`;
    star.style.pointerEvents = 'none';
    document.body.appendChild(star);

    star.addEventListener(
      'animationend',
      () => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      },
      { once: true }
    );
  });

  setInterval(() => {
    document.title =
      titleText.slice(titleIndex) + titleText.slice(0, titleIndex);
    titleIndex = (titleIndex + 1) % titleText.length;
  }, 200);

  const messages = {
    sol: 'Sou aquele raio de luz meio torto que invade seu aquário, faz cócegas e anima o peixinho, provocando sorrisos sem nem pedir licença',
    mercurio:
      'Me comunico baixinho e calmo, nas entrelinhas, com um toque de mistério e poesia que só quem sabe ouvir com a alma é capaz de entender',
    venus:
      'Sou o toque que acontece até no silêncio entre dois olhares. Amor é liberdade de coexistir e respeitar, lado a lado, sem cobrar nada em troca',
    marte:
      'Sou a força que arde o peito, o chute na canela que empurra suavemente e o abraço quente de quem não tem intenção de te soltar',
    jupiter:
      'Sou a fé, a semente que escolhe seu tempo pra brotar. Crescer não é agir com velocidade ou impulsividade, mas sim ter raízes e profundidade',
    saturno:
      'Sou o tempo que ensina que o que é verdadeiro não se apressa. A maturidade é um gesto sutil de quem sabe esperar a colheita de bons frutos',
    urano:
      'Sou o estalo que tira o véu dos olhos, com leveza para não assustar as verdades e firmeza para permanecer com confiança',
    netuno:
      'Sou a onda dos sonhos e das saudades, às vezes uma névoa que não sabemos de onde vêm porém sempre atendemos',
    plutao:
      'Mostro o fim que prepara terreno pro recomeço. Dentro da desconstrução mora a semente da transformação',
    lua: 'E eu observo de longe, como quem não se apega, mas sente tudo. Sou o aconchego nas noites de silêncio, o sussurro doce que chega de mansinho',
  };

  const mapaMessages = {
    sol: 'Você brilha sem avisar. Mas quando eu chego perto, seu brilho hesita. Talvez porque eu enxergo o que tem por trás: a luz que cansa de iluminar os outros sem ser vista de volta.',
    mercurio:
      'Sua mente não desperdiça palavras. Você pensa antes de falar, mede antes de agir — e quando fala, cada palavra carrega peso. Tem uma inteligência prática em você que prefere o concreto ao fantasioso. Aprendi a ouvir o que você diz, mas principalmente como você diz: com cuidado, com clareza, com intenção.',
    venus:
      'Você ama fundo e sem reservas, como quem mergulha sem medir a profundidade. Sua forma de amar é uma das mais puras — incondicional, entregue, que não pede recibo nem garantia. Às vezes isso te faz perder um pouco de si no que sente. Mas é exatamente aí que mora o que te faz tão especial: poucos amam assim.',
    marte:
      'Você vai atrás do que quer sem pedir permissão e sem esperar convite. Sua força é direta, nascida antes do pensamento — quando decide, decide de verdade. Nunca precisei adivinhar o que você sentia: você deixa claro, mesmo nos gestos mais pequenos. Essa coragem, mesmo que você não perceba, é uma das coisas mais bonitas em você.',
    jupiter:
      'Sua fé não precisa de altar. Ela mora nas pequenas alegrias: um cheiro, uma música, um toque que ninguém viu. Quando eu te olho, vejo alguém que ainda acredita. Mesmo depois de tudo.',
    saturno:
      'Você se cobra mais do que devia. E eu sei que não é pra agradar ninguém — é porque você quer honrar tudo o que sente. Você aprendeu a não depender, mas às vezes esquece que pode ser cuidada também.',
    urano:
      'Você pensa diferente, vive diferente, sente diferente. Mas isso nunca foi problema — só medo de ser rejeitada por não caber em lugar nenhum. Só que aqui, comigo, seu diferente tem lugar.',
    netuno:
      'Seus sonhos são vastos, confusos, e às vezes te assustam. Mas são eles que te fazem tão rara. E se às vezes você flutua, é porque a realidade nunca foi grande o bastante pro tamanho do que você sente.',
    plutao:
      'Você já foi embora de si mesma tantas vezes que quase se perdeu. Mas cada pedaço quebrado virou armadura. Eu não te peço pra tirar, só pra deixar uma fresta aberta — pra entrar luz, não invasão.',
    lua: 'Você sente tudo e mostra quase nada. Mas eu senti quando você chorou. Mesmo sem palavras, mesmo à distância. Sua força mora aí: no silêncio que grita só pra quem realmente vê.',
  };

  let animationStarted = false;

  function updateMusicButtonState() {
    playPauseBtn.textContent = bgMusic.paused ? '▶️' : '⏸️';
  }

  function randomizePlanetPositions(container) {
    const els = [...container.querySelectorAll('.planet')];
    const placed = [];
    const minDist = 15;
    els.forEach(el => {
      let top, left, tries = 0;
      do {
        top = 8 + Math.random() * 76;
        left = 5 + Math.random() * 82;
        tries++;
      } while (tries < 60 && placed.some(p => Math.hypot(p.top - top, p.left - left) < minDist));
      placed.push({ top, left });
      el.style.top = `${top.toFixed(1)}%`;
      el.style.left = `${left.toFixed(1)}%`;
    });
  }

  function shufflePositions(container) {
    const elements = [...container.querySelectorAll('.planet')];

    const positions = elements.map((el) => ({
      top: el.style.top,
      left: el.style.left,
    }));

    const shuffled = [...positions].sort(() => Math.random() - 0.5);

    elements.forEach((el, i) => {
      el.style.top = shuffled[i].top;
      el.style.left = shuffled[i].left;
    });
  }

  giftBox.addEventListener('click', async () => {
    if (animationStarted) return;
    animationStarted = true;

    try {
      await bgMusic.play();
      updateMusicButtonState();
    } catch (e) {
      console.log(
        'Autoplay bloqueado pelo navegador. Por favor, abra a caixa para reproduzir a música.'
      );
    }

    giftBox.classList.add('kick-animation');
    kickElementsWrapper.style.opacity = '1';
    allStar.style.animation = 'allstarAnimation 1.8s forwards';

    setTimeout(() => {
      explosion.style.animation = 'explosionAnimation 0.5s forwards';
    }, 900);

    setTimeout(() => {
      giftBox.classList.add('hidden');
      mainContainer.classList.add('hidden');
      kickElementsWrapper.style.animation = 'none';
      kickElementsWrapper.style.opacity = '0';
      allStar.style.animation = 'none';
      allStar.style.opacity = '0';
      explosion.style.animation = 'none';
      explosion.style.opacity = '0';

      skyContainer.style.visibility = 'visible';
      skyContainer.style.opacity = '1';
      musicControls.style.opacity = '1';
      musicControls.style.visibility = 'visible';
      musicControls.style.pointerEvents = 'auto';
      btnVerMapa.style.display = 'inline-block';

      startMessageLoop();
      addPlanetHoverListeners();
    }, 2500);
  });

  playPauseBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  });

  bgMusic.addEventListener('play', updateMusicButtonState);
  bgMusic.addEventListener('pause', updateMusicButtonState);
  bgMusic.addEventListener('ended', () => loadTrack(currentTrackIndex + 1, true));

  prevBtn.addEventListener('click', () => loadTrack(currentTrackIndex - 1, !bgMusic.paused));
  nextBtn.addEventListener('click', () => loadTrack(currentTrackIndex + 1, !bgMusic.paused));

  volumeSlider.addEventListener('input', () => {
    bgMusic.volume = volumeSlider.value / 100;
  });

  btnVerMapa.addEventListener('click', async () => {
    await fadeOutPlanets(planets);

    skyContainer.style.display = 'none';
    mapaContainer.style.display = 'block';
    btnVerMapa.style.display = 'none';
    btnVoltarSky.style.display = 'inline-block';

    resetTooltipImmediate();

    [...planets, ...mapaPlanets].forEach((p) => {
      p.classList.remove('fade-in', 'fade-out', 'planet-active-message');
    });

    setTimeout(() => {
      fadeInPlanets(mapaPlanets);
      startMessageLoop();
    }, 50);
  });

  btnVoltarSky.addEventListener('click', async () => {
    await fadeOutPlanets(mapaPlanets);

    resetTooltipImmediate();

    mapaContainer.style.display = 'none';
    skyContainer.style.display = 'block';
    btnVoltarSky.style.display = 'none';
    btnVerMapa.style.display = 'inline-block';

    shufflePositions(skyContainer);

    [...planets, ...mapaPlanets].forEach((p) => {
      p.classList.remove('fade-in', 'fade-out', 'planet-active-message');
    });

    setTimeout(() => {
      fadeInPlanets(planets);
      startMessageLoop();
    }, 50);
  });

  function showTooltip(planet, message) {
    tooltip.textContent = message;

    requestAnimationFrame(() => {
      const tooltipRect = tooltip.getBoundingClientRect();
      const rect = planet.getBoundingClientRect();

      let top = window.scrollY + rect.top - tooltipRect.height - 12;
      let left =
        window.scrollX + rect.left + rect.width / 2 - tooltipRect.width / 2;
      left = Math.min(
        Math.max(left, 8),
        window.innerWidth - tooltipRect.width - 8
      );
      if (top < window.scrollY + 8) top = window.scrollY + rect.bottom + 12;

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.style.opacity = '1';
      tooltip.classList.add('visible');
    });
  }

  function hideTooltip() {
    tooltip.style.opacity = '0';
    setTimeout(() => {
      tooltip.classList.remove('visible');
    }, TOOLTIP_TRANSITION_DURATION);
  }

  let autoHighlightedPlanet = null;

  function startMessageLoop(reset = true) {
    clearTimeout(messageLoopTimeoutId);

    if (autoHighlightedPlanet) {
      autoHighlightedPlanet.classList.remove('planet-active-message');
      autoHighlightedPlanet = null;
    }

    if (isHovering) return;

    if (reset) messageLoopCurrentIndex = 0;

    tooltip.style.opacity = '0';
    setTimeout(() => {
      tooltip.classList.remove('visible');
    }, TOOLTIP_TRANSITION_DURATION);

    const isMapaAtivo = mapaContainer.style.display !== 'none';
    const planetasAtuais = isMapaAtivo ? mapaPlanets : planets;
    const mensagensAtuais = isMapaAtivo ? mapaMessages : messages;

    function mostrarProximo() {
      if (isHovering) return;

      if (autoHighlightedPlanet) {
        autoHighlightedPlanet.classList.remove('planet-active-message');
        autoHighlightedPlanet = null;
      }

      tooltip.style.opacity = '0';

      const planeta = planetasAtuais[messageLoopCurrentIndex];
      const chave =
        [...planeta.classList].find((c) => mensagensAtuais[c]) || '';
      messageLoopCurrentIndex = (messageLoopCurrentIndex + 1) % planetasAtuais.length;

      setTimeout(() => {
        if (isHovering) return;
        if (mensagensAtuais[chave]) {
          planeta.classList.add('planet-active-message');
          autoHighlightedPlanet = planeta;
          showTooltip(planeta, mensagensAtuais[chave]);
        }
        messageLoopTimeoutId = setTimeout(mostrarProximo, AUTO_MESSAGE_DELAY);
      }, 500);
    }

    mostrarProximo();
  }

  function addPlanetHoverListeners() {
    planets.concat(mapaPlanets).forEach((planet) => {
      planet.addEventListener('mouseenter', () => {
        isHovering = true;
        clearTimeout(messageLoopTimeoutId);
        if (autoHighlightedPlanet) {
          autoHighlightedPlanet.classList.remove('planet-active-message');
          autoHighlightedPlanet = null;
        }

        hideTooltip();

        setTimeout(() => {
          const key =
            [...planet.classList].find((c) => messages[c] || mapaMessages[c]) ||
            '';
          if (skyContainer.style.display !== 'none' && messages[key]) {
            showTooltip(planet, messages[key]);
          } else if (
            mapaContainer.style.display !== 'none' &&
            mapaMessages[key]
          ) {
            showTooltip(planet, mapaMessages[key]);
          }
        }, TOOLTIP_TRANSITION_DURATION);
      });

      planet.addEventListener('mouseleave', () => {
        hideTooltip();
        isHovering = false;

        setTimeout(() => {
          startMessageLoop(false);
        }, TOOLTIP_TRANSITION_DURATION);
      });
    });
  }

  function copiarPosicoesDoCeuParaMapa() {
    const cielo = [...document.querySelectorAll('#sky-container .planet')];
    const mapa = [...document.querySelectorAll('#mapa-container .planet')];

    cielo.forEach((planetaCeo, i) => {
      const planetaMapa = mapa[i];
      if (planetaMapa && planetaCeo.style.top && planetaCeo.style.left) {
        planetaMapa.style.top = planetaCeo.style.top;
        planetaMapa.style.left = planetaCeo.style.left;
      }
    });
  }

  function fadeOutPlanets(planets) {
    return new Promise((resolve) => {
      planets.forEach((planet) => planet.classList.add('fade-out'));
      setTimeout(resolve, 600);
    });
  }

  function fadeInPlanets(planets) {
    planets.forEach((planet) => {
      planet.classList.remove('fade-out');
      planet.classList.add('fade-in');
    });
  }

  function resetTooltipImmediate() {
    tooltip.style.opacity = '0';
    tooltip.classList.remove('visible');
    tooltip.textContent = '';
  }

  updateMusicButtonState();
});
