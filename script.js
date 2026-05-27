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
  const progressFill = document.getElementById('progress-bar-fill');
  const progressContainer = document.getElementById('progress-bar-container');
  const timeDisplay = document.getElementById('time-display');
  const btnVoltarInicio = document.getElementById('btn-voltar-inicio');
  const transitionOverlay = document.getElementById('transition-overlay');

  function formatTime(s) {
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  const playlist = [
    { src: 'assets/ruelle-i-get-to-love-you.mp3',            name: 'Ruelle — I Get to Love You' },
    { src: 'assets/ruelle-war-of-hearts.mp3',                name: 'Ruelle — War of Hearts' },
    { src: 'assets/billie-eilish-chihiro.mp3',               name: 'Billie Eilish — CHIHIRO' },
    { src: 'assets/billie-eilish-wildflower-guitar.mp3',     name: 'Billie Eilish — Wildflower' },
    { src: 'assets/billie-eilish-bellyache.mp3',             name: 'Billie Eilish — Bellyache' },
    { src: 'assets/billie-eilish-the-greatest.mp3',          name: 'Billie Eilish — The Greatest' },
    { src: 'assets/labrinth-mount-everest.mp3',              name: 'Labrinth — Mount Everest' },
    { src: 'assets/labrinth-zendaya-all-for-us.mp3',         name: 'Labrinth & Zendaya — All for Us' },
    { src: 'assets/the-weeknd-die-for-you.mp3',              name: 'The Weeknd — Die for You' },
    { src: 'assets/the-weeknd-the-hills.mp3',                name: 'The Weeknd — The Hills' },
    { src: 'assets/two-feet-love-is-a-bitch.mp3',            name: 'Two Feet — Love Is a Bitch' },
    { src: 'assets/two-feet-i-feel-like-im-drowning.mp3',    name: 'Two Feet — I Feel Like I\'m Drowning' },
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
    progressFill.style.width = '0%';
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
  let messageLoopGeneration = 0;
  let messageLoopCurrentIndex = 0;
  let isHovering = false;
  const TOOLTIP_TRANSITION_DURATION = 500;
  const AUTO_MESSAGE_DELAY = 11000;

  const STAR_CREATE_INTERVAL = 28;
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
    sol: 'O <span class="destaque-dourado">ILUMINAR</span> da constelação de Peixes refletiu como um caleidoscópio o dia do nosso encontro com uma energia de sonho e sensibilidade, trazendo a sensação de que nossos caminhos já estavam destinados a se cruzar...',
    mercurio: 'A <span class="destaque-dourado">COMUNICAÇÃO</span> esguia da constelação de Peixes permitiu que nossas primeiras conversas fluíssem e com o tempo fomos criando uma conexão inexplicável. Dentre os silêncios e as risadas, os olhares disseram tudo o que precisa ser dito...',
    venus: 'Já com o <span class="destaque-dourado">AMOR</span> da constelação de Aquário, o nosso íntimo nasceu com leveza e amizade. Uma atração imediata pela nossa autenticidade e por podermos ser totalmente nós mesmos juntos...',
    marte: 'Aquele frio na barriga veio junto das <span class="destaque-dourado">ESTRATÉGIAS</span> da constelação de Aquário e junto da coragem de cada um com sua faca. Foi surpreendente para os dois (Não recomendo). Uma química forte, de cheiro hipnotizante e que nos empurrou um para o outro...',
    jupiter: 'A promessa velada de algo grandioso, um <span class="destaque-dourado">CRESCIMENTO</span> pessoal, coletivo e com a energia da constelação de Touro. Um encontro que plantou a semente de um afeto seguro, próspero e feito para durar e crescer a cada dia...',
    saturno: 'A confirmação do universo de que sonhos podem, sim, ganhar estrutura e virar <span class="destaque-dourado">EXCELÊNCIA</span> em realidade. O universo nos guiou como uma correnteza, dentre 8 bilhões de pessoas. Um encontro da constelação de Peixes no momento exato e certo de nossas vidas...',
    urano: 'Sem avisar, com a força de um Touro, aquela surpresa e a <span class="destaque-dourado">LIBERDADE</span> que vira a nossa rotina de cabeça para baixo de um jeito incrível e absolutamente inesquecível...',
    netuno: 'Uma sintonia profunda e espiritual, com a <span class="destaque-dourado">PROFUNDIDADE</span> de Peixes. Parecia que o universo estava conspirando com um toque de magia para que estivéssemos ali, naquele exato momento...',
    plutao: 'O início de uma transformação linda em nossas vidas, marcada pela <span class="destaque-dourado">OBSTINAÇÃO</span> de Sagitário. Um marco poderoso que mudou a nossa história para sempre, e para muito melhor...',
    lua: 'Nossos corações bateram em um ritmo alegre, leve e cheio de <span class="destaque-dourado">CUMPLICIDADE</span>, como demanda a constelação de Aquário. A alegria genuína daquele frio na barriga tão bom de sentir.',
  };

  const mapaMessages = {
    sol: 'Sua luz é única, criativa e brilhante, você tem uma mente visionária e um coração que sabe o significado da palavra valor. É admirante a sua essência autêntica e livre...',
    ascendente: 'O seu brilho pessoal é inconfundível! Você tem uma presença magnética e calorosa que ilumina qualquer lugar. É impossível não notar o seu carisma e a forma radiante como você se apresenta para o mundo...',
    mercurio: 'Sua inteligência é afiada e precisa. Adoro como você pensa com clareza, sempre tem os melhores conselhos e traz segurança em tudo o que faz...',
    venus: 'A sua forma de amar é mágica, doce e infinitamente empática. Você tem o dom lindo de cuidar e de fazer quem está ao seu redor se sentir muito especial...',
    marte: 'Vejo em você pura força e coragem. Em ti há uma determinação inspiradora para ir atrás do que quer e uma paixão pela vida que contagia...',
    jupiter: 'Seu dom para enxergar a beleza nos pequenos detalhes é lindo. Você tem uma forma generosa de fazer a vida de todos ao seu redor muito mais próspera e feliz...',
    saturno: 'Você tem uma alma protetora e extremamente leal. Valoriza as raízes, cuida de quem ama com dedicação e constrói laços profundos e indestrutíveis...',
    urano: 'Você traz inspiração e inovação através da sua intuição. Seu jeito singular de ver e sentir as coisas revoluciona o mundo com amor e leveza...',
    netuno: 'Seus sonhos e ideais são maravilhosos. Você inspira esperança por onde passa, buscando sempre um amanhã mais bonito para tudo e todos...',
    plutao: 'Uma alma aventureira, que busca o significado da vida com resiliência. Sua capacidade de se reinventar e crescer a cada nova experiência é fascinante...',
    lua: 'Um coração de oceano: poético, imenso e sensível. Sua empatia e a forma linda como você sente e abraça o mundo são, de longe, coisas que eu mais amo em você...',
  };

  let animationStarted = false;
  let listenersAdded = false;

  function updateMusicButtonState() {
    playPauseBtn.textContent = bgMusic.paused ? '▶️' : '⏸️';
  }

  function randomizePlanetPositions(container) {
    const els = [...container.querySelectorAll('.planet')];
    const placed = [];

    const W = window.innerWidth;
    const H = window.innerHeight;

    const PLANET_W = 460; // px — largura máxima estimada do label mais longo
    const PLANET_H = 52;  // px — altura do elemento planet (fonte 2rem + padding)

    const topMin  = 95;                      // abaixo do título
    const topMax  = H - 155 - PLANET_H;      // acima dos controles de música
    const leftMin = 115;                     // à direita do botão nav esquerdo
    const leftMax = W - 115 - PLANET_W;      // à esquerda do botão nav direito

    els.forEach(el => {
      let top, left, tries = 0;
      do {
        top  = topMin  + Math.random() * Math.max(0, topMax  - topMin);
        left = leftMin + Math.random() * Math.max(0, leftMax - leftMin);
        tries++;
      } while (tries < 200 && placed.some(p =>
        Math.abs(p.top - top)   < PLANET_H + 14 &&
        Math.abs(p.left - left) < PLANET_W + 24
      ));
      placed.push({ top, left });
      el.style.top  = `${Math.round(top)}px`;
      el.style.left = `${Math.round(left)}px`;
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

    const boxRect = giftBox.getBoundingClientRect();
    kickElementsWrapper.style.top = `${boxRect.top + boxRect.height / 2}px`;
    kickElementsWrapper.style.left = `${boxRect.left + boxRect.width / 2}px`;

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

    // allstar termina → overlay escurece, landing some por baixo
    setTimeout(() => {
      transitionOverlay.classList.add('dark');

      giftBox.classList.add('hidden');
      mainContainer.classList.add('hidden');
      kickElementsWrapper.style.animation = 'none';
      kickElementsWrapper.style.opacity = '0';
      allStar.style.animation = 'none';
      allStar.style.opacity = '0';
      explosion.style.animation = 'none';
      explosion.style.opacity = '0';

      skyContainer.style.display = 'block';
      skyContainer.style.visibility = 'visible';
      skyContainer.style.opacity = '0';
      void skyContainer.offsetHeight;
    }, 1800);

    // overlay totalmente preto → prepara tudo por baixo
    setTimeout(() => {
      skyContainer.style.opacity = '1';
      musicControls.style.opacity = '1';
      musicControls.style.visibility = 'visible';
      musicControls.style.pointerEvents = 'auto';
      btnVerMapa.style.display = 'inline-block';
      btnVoltarInicio.style.display = 'inline-block';

      startMessageLoop();
      if (!listenersAdded) { addPlanetHoverListeners(); listenersAdded = true; }
    }, 2800);

    // overlay some → universo reaparece junto com o sky
    setTimeout(() => {
      transitionOverlay.classList.remove('dark');
    }, 2900);
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

  document.getElementById('vol-down').addEventListener('click', () => {
    bgMusic.volume = Math.max(0, Math.round((bgMusic.volume - 0.1) * 10) / 10);
    volumeSlider.value = Math.round(bgMusic.volume * 100);
  });
  document.getElementById('vol-up').addEventListener('click', () => {
    bgMusic.volume = Math.min(1, Math.round((bgMusic.volume + 0.1) * 10) / 10);
    volumeSlider.value = Math.round(bgMusic.volume * 100);
  });

  const playlistBtn = document.getElementById('playlist-btn');
  const playlistMenu = document.getElementById('playlist-menu');

  function buildPlaylistMenu() {
    playlistMenu.innerHTML = '';
    const sorted = playlist
      .map((track, i) => ({ ...track, playIndex: i }))
      .sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach(track => {
      const item = document.createElement('div');
      item.className = 'playlist-item' + (track.playIndex === currentTrackIndex ? ' active' : '');
      item.textContent = track.name;
      item.addEventListener('click', () => {
        loadTrack(track.playIndex, true);
        playlistMenu.classList.remove('open');
      });
      playlistMenu.appendChild(item);
    });
  }

  playlistBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    buildPlaylistMenu();
    playlistMenu.classList.toggle('open');
  });

  document.addEventListener('click', () => playlistMenu.classList.remove('open'));

  btnVoltarInicio.addEventListener('click', () => {
    animationStarted = false;
    isHovering = false;
    messageLoopGeneration++;
    clearTimeout(messageLoopTimeoutId);
    if (autoHighlightedPlanet) {
      autoHighlightedPlanet.classList.remove('planet-active-message');
      autoHighlightedPlanet = null;
    }
    resetTooltipImmediate();

    skyContainer.style.opacity = '0';
    skyContainer.style.visibility = 'hidden';
    skyContainer.style.display = 'none';
    mapaContainer.style.display = 'none';
    [...planets, ...mapaPlanets].forEach(p => {
      p.classList.remove('fade-in', 'fade-out', 'planet-active-message');
    });

    giftBox.classList.remove('kick-animation', 'hidden');
    mainContainer.classList.remove('hidden');
    allStar.style.opacity = '';
    allStar.style.animation = 'none';
    explosion.style.opacity = '';
    explosion.style.animation = 'none';
    kickElementsWrapper.style.opacity = '0';

    btnVoltarInicio.style.display = 'none';
    btnVerMapa.style.display = 'none';
  });

  bgMusic.addEventListener('timeupdate', () => {
    if (bgMusic.duration) {
      progressFill.style.width = `${(bgMusic.currentTime / bgMusic.duration) * 100}%`;
      timeDisplay.textContent = `${formatTime(bgMusic.currentTime)} / ${formatTime(bgMusic.duration)}`;
    }
  });

  bgMusic.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `00:00 / ${formatTime(bgMusic.duration)}`;
  });

  progressContainer.addEventListener('click', (e) => {
    if (!bgMusic.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    bgMusic.currentTime = ((e.clientX - rect.left) / rect.width) * bgMusic.duration;
  });

  volumeSlider.addEventListener('input', () => {
    bgMusic.volume = volumeSlider.value / 100;
  });

  btnVerMapa.addEventListener('click', async () => {
    messageLoopGeneration++;
    await fadeOutPlanets(planets);

    skyContainer.style.display = 'none';
    mapaContainer.style.display = 'block';
    btnVerMapa.style.display = 'none';
    btnVoltarInicio.style.display = 'none';
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
    messageLoopGeneration++;
    await fadeOutPlanets(mapaPlanets);

    resetTooltipImmediate();

    mapaContainer.style.display = 'none';
    skyContainer.style.display = 'block';
    btnVoltarSky.style.display = 'none';
    btnVerMapa.style.display = 'inline-block';
    btnVoltarInicio.style.display = 'inline-block';

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
    tooltip.innerHTML = message;

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
    const gen = ++messageLoopGeneration;

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
      if (isHovering || messageLoopGeneration !== gen) return;

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
        if (isHovering || messageLoopGeneration !== gen) return;
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
