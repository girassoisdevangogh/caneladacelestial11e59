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
  const mainContainer = document.querySelector('.container');

  const planets = [...document.querySelectorAll('#sky-container .planet')];
  const mapaPlanets = [...document.querySelectorAll('#mapa-container .planet')];
  let currentPlanetIndex = planets.findIndex((p) =>
    p.classList.contains('sol')
  );
  if (currentPlanetIndex === -1) {
    currentPlanetIndex = 0;
  }

  const titleText =
    ' Assim estava o céu quando os rumos de nossas vidas se encontraram 💜';
  let titleIndex = 0;

  let messageLoopTimeoutId;
  let isHovering = false;
  let pausedPlanetIndex = currentPlanetIndex;
  const TOOLTIP_TRANSITION_DURATION = 500;
  const AUTO_MESSAGE_DELAY = 8500;

  const STAR_CREATE_INTERVAL = 30;
  let lastStarCreationTime = 0;

  const customCursor = document.createElement('div');
  customCursor.className = 'custom-star-cursor';
  customCursor.style.position = 'fixed';
  customCursor.style.pointerEvents = 'none';
  customCursor.style.zIndex = '9999';
  document.body.appendChild(customCursor);
  document.body.style.cursor = 'none';

  document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;

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
    sol: 'Sou aquele raio de luz meio torto que invade seu oceano, agita as águas calmas do seu mundo e mostra que sonhar também pode ser leve e risonho. Te provoco com carinho, como quem dança em volta do que é sagrado.',

    mercurio:
      'Falo pouco, mas com peso. Cada palavra que te mando carrega silêncio onde tua poesia se espraia. Eu penso reto, você sente profundo — e mesmo assim nos entendemos nas entrelinhas.',

    venus:
      'Eu amo com presença invisível, mas você ama com distância que envolve. Somos o toque que respeita o espaço. Liberdade em sintonia é quando dois mundos dançam sem se prender.',

    marte:
      'Minha vontade queima, impulsiva e clara. A sua é rebelde, silenciosa, mas não menos corajosa. Nos movemos em ritmos diferentes, mas ambos lutamos por verdade.',

    jupiter:
      'Eu acredito nos detalhes. Você acredita na paz. Eu busco sentido no que é simples. Você floresce devagar, onde há segurança. Juntos, somos um jardim que cresce com propósito.',

    saturno:
      'Eu ensino cuidando. Você aprende sentindo. Meu tempo é casa, o seu é oceano. Mas ambos sabemos que o que é real não tem pressa — só profundidade.',

    urano:
      'Sou o estalo que te emociona antes de fazer sentido. Você é a mudança que chega de mansinho e transforma tudo por dentro. Revolução também pode ser doce.',

    netuno:
      'Sonho com ideias que ninguém vê. Você sente o que ninguém diz. Se o mundo é barulho, nós somos o sussurro que entende sem explicar.',

    plutao:
      'Mudo de pele buscando sentido. Você muda de alma buscando liberdade. No fim, os dois querem o mesmo: renascer com verdade.',

    lua: 'Eu sinto demais e escondo pouco. Você sente no silêncio e se protege no alto. Mas quando me aproximo devagar, você permite que eu veja seu céu por dentro.',
  };

  const mapaMessages = {
    sol: 'Você brilha sem avisar. Mas quando eu chego perto, seu brilho hesita. Talvez porque eu enxergo o que tem por trás: a luz que cansa de iluminar os outros sem ser vista de volta.',

    mercurio:
      'Sua mente sonha em silêncio, mas às vezes tropeça nas palavras. Eu ouço o que você não diz. E nos seus devaneios, encontro respostas que o mundo apressado nunca teria paciência de esperar.',

    venus:
      'Você ama à sua maneira: livre, meio avessa a promessas. Mas eu nunca quis te prender — só dançar ao seu lado, no seu tempo, sem pressa, sem moldes. Amar você é entender que beleza é o que fica depois que a expectativa vai embora.',

    marte:
      'Você resiste com leveza. Mas eu vi sua força real: o tipo que não grita, só insiste. Quando todo mundo acha que você desiste fácil, é aí que você mostra que permanece — mesmo se não diz nada.',

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
      playPauseBtn.style.display = 'inline-block';
      btnVerMapa.style.display = 'inline-block';

      currentPlanetIndex = planets.findIndex((p) =>
        p.classList.contains('sol')
      );
      if (currentPlanetIndex === -1) {
        currentPlanetIndex = 0;
      }
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
    updateMusicButtonState();
  });

  bgMusic.addEventListener('play', updateMusicButtonState);
  bgMusic.addEventListener('pause', updateMusicButtonState);
  bgMusic.addEventListener('ended', updateMusicButtonState);

  btnVerMapa.addEventListener('click', async () => {
    await fadeOutPlanets(planets);

    skyContainer.style.display = 'none';
    mapaContainer.style.display = 'block';
    btnVerMapa.style.display = 'none';
    btnVoltarSky.style.display = 'inline-block';

    copiarPosicoesDoCeuParaMapa();
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

  function startMessageLoop() {
    clearTimeout(messageLoopTimeoutId);

    if (autoHighlightedPlanet) {
      autoHighlightedPlanet.classList.remove('planet-active-message');
      autoHighlightedPlanet = null;
    }

    if (isHovering) return;

    tooltip.style.opacity = '0';
    setTimeout(() => {
      tooltip.classList.remove('visible');
    }, TOOLTIP_TRANSITION_DURATION);

    const isMapaAtivo = mapaContainer.style.display !== 'none';
    const planetasAtuais = isMapaAtivo ? mapaPlanets : planets;
    const mensagensAtuais = isMapaAtivo ? mapaMessages : messages;

    let index = 0;

    function mostrarProximo() {
      if (isHovering) return;

      if (autoHighlightedPlanet) {
        autoHighlightedPlanet.classList.remove('planet-active-message');
        autoHighlightedPlanet = null;
      }

      const planeta = planetasAtuais[index];
      const chave =
        [...planeta.classList].find((c) => mensagensAtuais[c]) || '';

      if (mensagensAtuais[chave]) {
        planeta.classList.add('planet-active-message');
        autoHighlightedPlanet = planeta;
        showTooltip(planeta, mensagensAtuais[chave]);
      }

      index = (index + 1) % planetasAtuais.length;
      messageLoopTimeoutId = setTimeout(mostrarProximo, AUTO_MESSAGE_DELAY);
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

        pausedPlanetIndex = currentPlanetIndex;

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
          currentPlanetIndex = pausedPlanetIndex;
          startMessageLoop();
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
