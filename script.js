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
  const katTooltip = document.getElementById('kat-tooltip');
  const bgMusic = document.getElementById('bg-music');
  const bgMusicB = new Audio();
  bgMusicB.preload = 'auto';
  let activeAudio = bgMusic;
  let inactiveAudio = bgMusicB;
  let userVolume = 0.5;
  let isCrossfading = false;
  let crossfadeRafId = null;
  const CROSSFADE_DURATION = 1.5;
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
  const skyTitle = document.getElementById('sky-title');
  const mapaTitle = document.getElementById('mapa-title');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnCinema = document.getElementById('btn-cinema');
  const fsExpand = document.getElementById('fs-expand');
  const fsCompress = document.getElementById('fs-compress');

  function formatTime(s) {
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  const playlist = [
    { src: 'assets/ruelle-war-of-hearts.mp3',                name: 'Ruelle - War of Hearts' },
    { src: 'assets/billie-eilish-chihiro.mp3',               name: 'Billie Eilish - CHIHIRO' },
    { src: 'assets/billie-eilish-wildflower-guitar.mp3',     name: 'Billie Eilish - Wildflower' },
    { src: 'assets/billie-eilish-bellyache.mp3',             name: 'Billie Eilish - Bellyache' },
    { src: 'assets/billie-eilish-the-greatest.mp3',          name: 'Billie Eilish - The Greatest' },
    { src: 'assets/labrinth-mount-everest.mp3',              name: 'Labrinth - Mount Everest' },
    { src: 'assets/labrinth-zendaya-all-for-us.mp3',         name: 'Labrinth & Zendaya - All for Us' },
    { src: 'assets/the-weeknd-die-for-you.mp3',              name: 'The Weeknd - Die for You' },
    { src: 'assets/the-weeknd-the-hills.mp3',                name: 'The Weeknd - The Hills' },
    { src: 'assets/two-feet-love-is-a-bitch.mp3',            name: 'Two Feet - Love Is a Bitch' },
    { src: 'assets/two-feet-i-feel-like-im-drowning.mp3',    name: 'Two Feet - I Feel Like I\'m Drowning' },
    { src: 'assets/madonna-sicksick-frozen.mp3',             name: 'Madonna & SickSick - Frozen' },
  ];

  for (let i = playlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
  }

  let currentTrackIndex = 0;

  function loadTrack(index, autoplay) {
    const newIndex = (index + playlist.length) % playlist.length;

    if (autoplay && !activeAudio.paused) {
      doCrossfade(newIndex);
      return;
    }

    if (isCrossfading) {
      clearTimeout(crossfadeRafId);
      isCrossfading = false;
      inactiveAudio.pause();
      inactiveAudio.currentTime = 0;
      inactiveAudio.volume = 0;
    }

    currentTrackIndex = newIndex;
    activeAudio.src = playlist[currentTrackIndex].src;
    activeAudio.volume = userVolume;
    activeAudio.load();
    trackNameEl.textContent = playlist[currentTrackIndex].name;
    progressFill.style.width = '0%';
    if (autoplay) activeAudio.play().then(updateMusicButtonState).catch(() => {});
    else updateMusicButtonState();
  }

  function doCrossfade(newIndex) {
    if (isCrossfading) {
      clearTimeout(crossfadeRafId);
      isCrossfading = false;
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.volume = userVolume;
      inactiveAudio.volume = userVolume;
      [activeAudio, inactiveAudio] = [inactiveAudio, activeAudio];
    }

    currentTrackIndex = newIndex;
    inactiveAudio.src = playlist[currentTrackIndex].src;
    inactiveAudio.volume = 0;
    inactiveAudio.load();
    trackNameEl.textContent = playlist[currentTrackIndex].name;
    progressFill.style.width = '0%';

    inactiveAudio.play().then(() => {
      isCrossfading = true;
      const fadingOut = activeAudio;
      const fadingIn = inactiveAudio;
      const fadeFromVol = fadingOut.volume;
      const startTime = performance.now();
      const durationMs = CROSSFADE_DURATION * 1000;

      function step() {
        const now = performance.now();
        const progress = Math.min((now - startTime) / durationMs, 1);
        fadingOut.volume = fadeFromVol * (1 - progress);
        fadingIn.volume = userVolume * progress;

        if (progress < 1) {
          crossfadeRafId = setTimeout(step, 50);
        } else {
          fadingOut.pause();
          fadingOut.currentTime = 0;
          fadingOut.volume = userVolume;
          [activeAudio, inactiveAudio] = [fadingIn, fadingOut];
          isCrossfading = false;
          updateMusicButtonState();
        }
      }
      crossfadeRafId = setTimeout(step, 50);
      updateMusicButtonState();
    }).catch(() => {});
  }

  activeAudio.volume = userVolume;
  loadTrack(0, false);

  const planets = [...document.querySelectorAll('#sky-container .planet')];
  const mapaPlanets = [...document.querySelectorAll('#mapa-container .planet')];

  randomizePlanetPositions(skyContainer);
  randomizePlanetPositions(mapaContainer);

  const titleText =
    ' É um privilégio poder dividir o mesmo espaço-tempo que você... O aqui, o agora... 💜 ';
  let titleIndex = 0;

  let messageLoopTimeoutId;
  let messageLoopGeneration = 0;
  let messageLoopCurrentIndex = 0;
  let isHovering = false;
  const TOOLTIP_TRANSITION_DURATION = 500;
  const AUTO_MESSAGE_DELAY = 9800;
  let hideTooltipTimeoutId = null;
  let tooltipIsVisible = false;

  const STAR_CREATE_INTERVAL = 25;
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
    sol: 'O Sol em Peixes banhou aquela noite com uma energia de puro <span class="destaque-neon">SONHO</span>. Peixes é o signo que sente o que não é dito e foi exatamente isso, algo se acertou sem precisar de palavras, como se o universo já soubesse antes da gente...',
    mercurio: 'Com Mercúrio em Peixes, a comunicação naquele dia era feita de camadas, o que se fala, do que se cala e do que os olhos entregam. Nossas primeiras risadas, as histórias maluquinhas, os silêncios que não precisavam ser preenchidos... tudo fluiu com uma <span class="destaque-neon">CUMPLICIDADE</span> de quem já se conhece há muito tempo...',
    venus: 'Vênus em Aquário diz que o amor verdadeiro nasce da <span class="destaque-neon">AMIZADE</span>, da liberdade de ser quem se é, do respeito que vem antes de tudo. Foi exatamente assim, sem pressão, sem performance, só a autenticidade de dois que puderam ser completamente eles mesmos juntos...',
    marte: 'Marte em Aquário age com <span class="destaque-neon">SURPRESA</span>, e foi assim que aconteceu. Aquele frio na barriga que chegou sem avisar, o cheiro que ficou na memória, a química que nos empurrou um em direção ao outro de um jeito que nenhum dos dois esperava (e nem recomenda kkk)...',
    jupiter: 'Júpiter em Touro planta sementes de <span class="destaque-neon">CRESCIMENTO</span> real, sólido e duradouro. Aquele encontro não foi só um momento bonito, foi o início de algo que cresceu a cada conversa, a cada noite acordados até tarde, a cada vez que a vida ficou mais leve por causa da presença um do outro...',
    saturno: 'Saturno em Peixes é o universo dizendo que alguns encontros não são acidente, são puro <span class="destaque-neon">DESTINO</span>. Dentre todos os 8 bilhões de pessoas nesse planeta, nossas histórias se cruzaram no momento exato. Isso não foi coincidência. Foi o universo ajustando as peças no lugar certo...',
    urano: 'Urano em Touro traz <span class="destaque-neon">REVOLUÇÃO</span> onde menos se espera, transformações que chegam quietas mas mudam tudo. Sem planejamento, sem roteiro, aquela noite de março virou um dos antes e depois mais marcantes e inexplicáveis da nossa história...',
    netuno: 'Netuno em Peixes, o planeta no seu próprio lar, a energia mais espiritual de toda a carta do céu. Uma <span class="destaque-neon">SINTONIA</span> que vai além do que a lógica explica: a sensação de que aquilo era real, era especial, era exatamente onde deveríamos estar...',
    plutao: 'Plutão em Aquário marca <span class="destaque-neon">TRANSFORMAÇÃO</span> que não tem volta. Um encontro que mudou a forma de ver o outro, de sentir a amizade, de entender o que é ter alguém de verdade ao lado. Para sempre e para muito melhor...',
    lua: 'A Lua em Aquário naquele dia pedia <span class="destaque-neon">LEVEZA</span> e conexão genuína, sem dramatismo, sem cobranças, só o prazer de estar junto. Aquele frio na barriga não foi só atração, foi o reconhecimento de que algo especial estava começando...',
  };
 
  const mapaMessages = {
    sol: 'Seu Sol em Aquário faz de você alguém original, livre e à frente do seu tempo. Você pensa diferente, sente diferente, existe diferente. Tem uma mente que não para e um coração que, quando escolhe, escolhe com toda a <span class="destaque-dourado">VERDADE</span>...',
    ascendente: 'Seu Ascendente em Leão é o que o mundo vê primeiro e não consegue ignorar. Você chega num lugar e a energia muda, é <span class="destaque-dourado">PRESENÇA</span> magnética, calorosa e genuína. Impossível não notar, impossível não querer perto...',
    mercurio: 'Com Mercúrio em Capricórnio, você não fala à toa, quando fala, tem peso. Seus conselhos ficam, suas palavras marcam. Você tem uma <span class="destaque-dourado">CLAREZA</span> de pensamento que é ao mesmo tempo afiada e cuidadosa...',
    venus: 'Vênus em Peixes é a posição mais bonita do zodíaco, Vênus exaltada, no auge do seu poder. Seu <span class="destaque-dourado">AMOR</span> é profundo e sem medida. Você não ama pela metade, você se entrega de verdade, com magia, com cuidado, com uma generosidade de coração que é rara demais nesse mundo...',
    marte: 'Seu Marte em Áries é puro fogo, <span class="destaque-dourado">CORAGEM</span>, determinação e uma energia de vida que contagia quem está ao redor. Você vai atrás do que quer com uma intensidade que inspira. Tem uma paixão pela vida que pouquíssimas pessoas carregam dessa forma...',
    jupiter: 'Júpiter em Virgem traz <span class="destaque-dourado">CRESCIMENTO</span> através da atenção e do cuidado com os detalhes. Você cresce ajudando, aprendendo, observando o que ninguém mais vê. Tem um dom especial de tornar tudo ao seu redor mais bonito só por existir...',
    saturno: 'Com Saturno em Câncer, você constrói laços com uma <span class="destaque-dourado">LEALDADE</span> e uma profundidade que assustam quem não tá acostumado. Cuida das pessoas que ama de um jeito inabalável, e quando alguém entra de verdade na sua vida, entra pra ficar...',
    urano: 'Urano em Peixes traz uma <span class="destaque-dourado">INTUIÇÃO</span> que vai além do que a razão alcança. Você sente o que ainda não aconteceu, percebe o que não é dito, enxerga o mundo com uma sensibilidade que é sua, completamente sua, e que faz você ser inesquecível...',
    netuno: 'Seu Netuno em Aquário conecta seus <span class="destaque-dourado">SONHOS</span> às pessoas ao redor. Você inspira sem perceber com o seu jeito de existir, de questionar, de imaginar mundos melhores. Tem um idealismo bonito que não é ingenuidade: é fé genuína no que pode ser...',
    plutao: 'Plutão em Sagitário marca uma geração que busca <span class="destaque-dourado">SIGNIFICADO</span>, verdade e transformação. Em você isso se manifesta com uma coragem de viver linda de ver, a disposição de crescer, de se reinventar, de buscar o que faz sentido mesmo quando é difícil...',
    lua: 'Sua Lua em Peixes é um oceano de <span class="destaque-dourado">TERNURA</span>, empatia e sensibilidade. Você sente tudo, às vezes até o que os outros ainda não perceberam que sentem. Tem sonhos que carregam pressentimentos, uma intuição que raramente erra, e um coração que abraça o mundo de um jeito impossível não amar...',
  };

  let animationStarted = false;
  let isNavigating = false;
  let listenersAdded = false;
  let tooltipRafGen = 0;

  function isAudioPlaying() {
    return !activeAudio.paused || isCrossfading;
  }

  function updateMusicButtonState() {
    playPauseBtn.textContent = isAudioPlaying() ? '⏸️' : '▶️';
  }

  function randomizePlanetPositions(container) {
    const els = [...container.querySelectorAll('.planet')];
    const placed = [];

    const W = window.innerWidth;
    const H = window.innerHeight;

    const PLANET_W = 560;
    const PLANET_H = 64;

    const topMin  = 95;                      
    const topMax  = H - 155 - PLANET_H;     
    const leftMin = 115;                     
    const leftMax = W - 115 - PLANET_W;      

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
      await activeAudio.play();
      updateMusicButtonState();
    } catch (e) {}

    giftBox.classList.add('kick-animation');
    kickElementsWrapper.style.opacity = '1';
    allStar.style.animation = 'allstarAnimation 1.8s forwards';

    setTimeout(() => {
      explosion.style.animation = 'explosionAnimation 0.5s forwards';
    }, 900);

    setTimeout(() => {
      transitionOverlay.classList.add('dark');

      planets.forEach(p => {
        p.classList.remove('fade-in', 'planet-active-message');
        p.classList.add('fade-out');
      });

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
      skyContainer.style.opacity = '1';
      skyTitle.classList.add('title-out');
      btnVerMapa.classList.add('btn-nav-out');
      btnVoltarInicio.classList.add('btn-nav-out');
      musicControls.style.opacity = '1';
      musicControls.style.visibility = 'visible';
      musicControls.style.pointerEvents = 'auto';

      if (!listenersAdded) { addPlanetHoverListeners(); listenersAdded = true; }
    }, 1800);

    setTimeout(() => {
      transitionOverlay.classList.remove('dark');
      requestAnimationFrame(() => {
        skyTitle.classList.remove('title-out');
        btnVerMapa.classList.remove('btn-nav-out');
        btnVoltarInicio.classList.remove('btn-nav-out');
      });
      setTimeout(() => {
        fadeInPlanets(planets);
        startMessageLoop();
      }, 400);
    }, 2350);
  });

  playPauseBtn.addEventListener('click', () => {
    if (isCrossfading) {
      clearTimeout(crossfadeRafId);
      isCrossfading = false;
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.volume = userVolume;
      inactiveAudio.volume = userVolume;
      [activeAudio, inactiveAudio] = [inactiveAudio, activeAudio];
      activeAudio.pause();
    } else if (activeAudio.paused) {
      activeAudio.play();
    } else {
      activeAudio.pause();
    }
    updateMusicButtonState();
  });

  [bgMusic, bgMusicB].forEach(audio => {
    audio.addEventListener('play', function () { if (this === activeAudio) updateMusicButtonState(); });
    audio.addEventListener('pause', function () { if (this === activeAudio) updateMusicButtonState(); });
    audio.addEventListener('ended', function () {
      if (this === activeAudio && !isCrossfading) doCrossfade((currentTrackIndex + 1) % playlist.length);
    });
  });

  prevBtn.addEventListener('click', () => loadTrack(currentTrackIndex - 1, isAudioPlaying()));
  nextBtn.addEventListener('click', () => loadTrack(currentTrackIndex + 1, isAudioPlaying()));

  document.getElementById('vol-down').addEventListener('click', () => {
    userVolume = Math.max(0, Math.round((userVolume - 0.1) * 10) / 10);
    if (!isCrossfading) activeAudio.volume = userVolume;
    volumeSlider.value = Math.round(userVolume * 100);
  });
  document.getElementById('vol-up').addEventListener('click', () => {
    userVolume = Math.min(1, Math.round((userVolume + 0.1) * 10) / 10);
    if (!isCrossfading) activeAudio.volume = userVolume;
    volumeSlider.value = Math.round(userVolume * 100);
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

  btnVoltarInicio.addEventListener('click', async () => {
    if (isNavigating) return;
    isNavigating = true;
    isHovering = false;
    messageLoopGeneration++;
    clearTimeout(messageLoopTimeoutId);
    if (autoHighlightedPlanet) {
      autoHighlightedPlanet.classList.remove('planet-active-message');
      autoHighlightedPlanet = null;
    }
    resetTooltipImmediate();

    transitionOverlay.classList.add('dark');
    await fadeOutPlanets(planets);

    btnVoltarInicio.classList.add('btn-nav-out');
    btnVerMapa.classList.add('btn-nav-out');
    skyTitle.classList.add('title-out');

    animationStarted = false;

    skyContainer.style.opacity = '0';
    skyContainer.style.visibility = 'hidden';
    skyContainer.style.display = 'none';
    mapaContainer.style.display = 'none';
    [...planets, ...mapaPlanets].forEach(p => {
      p.classList.remove('fade-in', 'fade-out', 'planet-active-message');
    });

    giftBox.classList.remove('kick-animation', 'hidden');
    allStar.style.opacity = '';
    allStar.style.animation = 'none';
    explosion.style.opacity = '';
    explosion.style.animation = 'none';
    kickElementsWrapper.style.opacity = '0';

    transitionOverlay.classList.remove('dark');
    setTimeout(() => {
      mainContainer.classList.remove('hidden');
      isNavigating = false;
    }, 400);
  });

  [bgMusic, bgMusicB].forEach(audio => {
    audio.addEventListener('timeupdate', function () {
      if (this !== activeAudio) return;
      if (activeAudio.duration) {
        progressFill.style.width = `${(activeAudio.currentTime / activeAudio.duration) * 100}%`;
        timeDisplay.textContent = `${formatTime(activeAudio.currentTime)} / ${formatTime(activeAudio.duration)}`;
        if (!isCrossfading && activeAudio.currentTime >= activeAudio.duration - CROSSFADE_DURATION) {
          doCrossfade((currentTrackIndex + 1) % playlist.length);
        }
      }
    });
    audio.addEventListener('loadedmetadata', function () {
      if (this === activeAudio) timeDisplay.textContent = `00:00 / ${formatTime(activeAudio.duration)}`;
    });
  });

  progressContainer.addEventListener('click', (e) => {
    if (!activeAudio.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    activeAudio.currentTime = ((e.clientX - rect.left) / rect.width) * activeAudio.duration;
  });

  volumeSlider.addEventListener('input', () => {
    userVolume = volumeSlider.value / 100;
    if (!isCrossfading) activeAudio.volume = userVolume;
  });

  btnVerMapa.addEventListener('click', async () => {
    if (isNavigating) return;
    isNavigating = true;
    messageLoopGeneration++;

    mapaPlanets.forEach(p => {
      p.classList.remove('fade-in', 'planet-active-message');
      p.classList.add('fade-out');
    });

    transitionOverlay.classList.add('dark');
    await fadeOutPlanets(planets);

    btnVerMapa.classList.add('btn-nav-out');
    btnVoltarInicio.classList.add('btn-nav-out');
    skyTitle.classList.add('title-out');

    if (autoHighlightedPlanet) {
      autoHighlightedPlanet.classList.remove('planet-active-message');
      autoHighlightedPlanet = null;
    }

    skyContainer.style.display = 'none';
    mapaContainer.style.display = 'block';
    mapaTitle.classList.add('title-out');
    resetTooltipImmediate();
    planets.forEach(p => p.classList.remove('fade-in', 'fade-out', 'planet-active-message'));

    transitionOverlay.classList.remove('dark');
    requestAnimationFrame(() => {
      mapaTitle.classList.remove('title-out');
      btnVoltarSky.classList.remove('btn-nav-out');
    });
    setTimeout(() => {
      fadeInPlanets(mapaPlanets);
    }, 400);
    setTimeout(() => {
      isNavigating = false;
      startMessageLoop();
    }, 950);
  });

  btnVoltarSky.addEventListener('click', async () => {
    if (isNavigating) return;
    isNavigating = true;
    messageLoopGeneration++;
    btnVoltarSky.classList.add('btn-nav-out');

    planets.forEach(p => {
      p.classList.remove('fade-in', 'planet-active-message');
      p.classList.add('fade-out');
    });

    transitionOverlay.classList.add('dark');
    await fadeOutPlanets(mapaPlanets);

    if (autoHighlightedPlanet) {
      autoHighlightedPlanet.classList.remove('planet-active-message');
      autoHighlightedPlanet = null;
    }
    resetTooltipImmediate();
    shufflePositions(skyContainer);

    mapaContainer.style.display = 'none';
    skyContainer.style.display = 'block';
    skyTitle.classList.add('title-out');
    mapaPlanets.forEach(p => p.classList.remove('fade-in', 'fade-out', 'planet-active-message'));

    transitionOverlay.classList.remove('dark');
    requestAnimationFrame(() => {
      skyTitle.classList.remove('title-out');
      btnVerMapa.classList.remove('btn-nav-out');
      btnVoltarInicio.classList.remove('btn-nav-out');
    });
    setTimeout(() => {
      fadeInPlanets(planets);
    }, 400);
    setTimeout(() => {
      isNavigating = false;
      startMessageLoop();
    }, 950);
  });

  function showTooltip(planet, message) {
    if (hideTooltipTimeoutId !== null) {
      clearTimeout(hideTooltipTimeoutId);
      hideTooltipTimeoutId = null;
    }
    const myGen = ++tooltipRafGen;
    tooltip.innerHTML = message;
    if (!tooltipIsVisible) tooltip.style.opacity = '0';
    tooltip.classList.add('visible');
    tooltipIsVisible = true;

    requestAnimationFrame(() => {
      if (tooltipRafGen !== myGen) return;

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
    });
  }

  function hideTooltip() {
    tooltip.style.opacity = '0';
    tooltipIsVisible = false;
    if (hideTooltipTimeoutId !== null) clearTimeout(hideTooltipTimeoutId);
    hideTooltipTimeoutId = setTimeout(() => {
      hideTooltipTimeoutId = null;
      tooltip.classList.remove('visible');
    }, TOOLTIP_TRANSITION_DURATION);
  }

  function showKatTooltip(element, message) {
    katTooltip.innerHTML = message;
    katTooltip.classList.add('visible');
    requestAnimationFrame(() => {
      const tipRect = katTooltip.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      let top = window.scrollY + rect.top - tipRect.height - 12;
      let left = window.scrollX + rect.left + rect.width / 2 - tipRect.width / 2;
      left = Math.min(Math.max(left, 8), window.innerWidth - tipRect.width - 8);
      if (top < window.scrollY + 8) top = window.scrollY + rect.bottom + 12;
      katTooltip.style.top = `${top}px`;
      katTooltip.style.left = `${left}px`;
    });
  }

  function hideKatTooltip() {
    katTooltip.classList.remove('visible');
  }

  let autoHighlightedPlanet = null;

  function startMessageLoop(reset = true) {
    if (isNavigating) return;
    clearTimeout(messageLoopTimeoutId);
    const gen = ++messageLoopGeneration;

    if (autoHighlightedPlanet) {
      autoHighlightedPlanet.classList.remove('planet-active-message');
      autoHighlightedPlanet = null;
    }

    if (isHovering) return;

    if (reset) messageLoopCurrentIndex = 0;

    hideTooltip();

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

        const key =
          [...planet.classList].find((c) => messages[c] || mapaMessages[c]) || '';
        if (skyContainer.style.display !== 'none' && messages[key]) {
          showTooltip(planet, messages[key]);
        } else if (mapaContainer.style.display !== 'none' && mapaMessages[key]) {
          showTooltip(planet, mapaMessages[key]);
        }
      });

      planet.addEventListener('mouseleave', () => {
        isHovering = false;
        hideTooltip();

        setTimeout(() => {
          if (!isHovering && !isNavigating) startMessageLoop(false);
        }, TOOLTIP_TRANSITION_DURATION);
      });
    });

    const mapaKatIcon = document.querySelector('#mapa-container .kat-icon');
    if (mapaKatIcon) {
      mapaKatIcon.addEventListener('mouseenter', () => {
        showKatTooltip(mapaKatIcon, 'Quando eu tô com vc minha vontade é essa ❤️');
      });
      mapaKatIcon.addEventListener('mouseleave', hideKatTooltip);
    }

    const skyKatIcon = document.querySelector('#sky-container .kat-icon');
    if (skyKatIcon) {
      skyKatIcon.addEventListener('mouseenter', () => {
        showKatTooltip(skyKatIcon, 'Eu fico assim quando olho pra você ❤️');
      });
      skyKatIcon.addEventListener('mouseleave', hideKatTooltip);
    }

  }

  const kat1Icon = document.querySelector('.kat-wrapper .kat-icon');
  if (kat1Icon) {
    kat1Icon.addEventListener('mouseenter', () => {
      showKatTooltip(kat1Icon, 'Uma flor para a mais cheirosa e esbelta de todos os jardins ❤️');
    });
    kat1Icon.addEventListener('mouseleave', hideKatTooltip);
  }

  function fadeOutPlanets(planets) {
    return new Promise((resolve) => {
      planets.forEach((planet) => {
        planet.classList.remove('fade-in');
        planet.classList.add('fade-out');
      });
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
    tooltipRafGen++;
    if (hideTooltipTimeoutId !== null) {
      clearTimeout(hideTooltipTimeoutId);
      hideTooltipTimeoutId = null;
    }
    tooltipIsVisible = false;
    tooltip.style.transition = 'none';
    tooltip.style.opacity = '0';
    void tooltip.offsetHeight;
    tooltip.style.transition = '';
    tooltip.classList.remove('visible');
    tooltip.textContent = '';
  }

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    const isFs = !!document.fullscreenElement;
    fsExpand.style.display = isFs ? 'none' : '';
    fsCompress.style.display = isFs ? '' : 'none';
    btnFullscreen.title = isFs ? 'Sair da tela cheia' : 'Tela cheia';
    btnFullscreen.setAttribute('aria-label', isFs ? 'Sair da tela cheia' : 'Tela cheia');
  });

  let cinemaMode = false;
  btnCinema.addEventListener('click', () => {
    cinemaMode = !cinemaMode;
    document.body.classList.toggle('cinema-mode', cinemaMode);
    btnCinema.textContent = cinemaMode ? '🌝' : '🌚';
    btnCinema.title = cinemaMode ? 'Trazer planetas de volta' : 'Esconder os planetas';
    btnCinema.setAttribute('aria-label', cinemaMode ? 'Trazer planetas de volta' : 'Esconder os planetas');
  });

  updateMusicButtonState();
});