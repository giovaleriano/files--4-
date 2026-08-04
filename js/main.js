/* =========================================================
   NORTEENS — Interações
   Vanilla JS, sem dependências externas.
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     1. HEADER: estado "scrolled" (sombra + blur ao rolar)
     --------------------------------------------------------- */
  (function headerScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    function update() {
      if (window.scrollY > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  })();

  /* ---------------------------------------------------------
     2. NAV ATIVO (scroll-spy)
     --------------------------------------------------------- */
  (function navScrollSpy() {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
    if (!navLinks.length) return;

    var sections = navLinks
      .map(function (link) {
        var id = link.getAttribute('href');
        if (!id || id.charAt(0) !== '#') return null;
        var el = document.querySelector(id);
        return el ? { link: link, el: el } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function setActive(link) {
      navLinks.forEach(function (l) { l.classList.remove('is-active'); });
      if (link) link.classList.add('is-active');
    }

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (match) setActive(match.link);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spyObserver.observe(s.el); });
  })();

  /* ---------------------------------------------------------
     3. SCROLL REVEAL (fade/slide-in ao entrar na tela)
     --------------------------------------------------------- */
  (function scrollReveal() {
    var targets = document.querySelectorAll('.reveal, .reveal-stagger, .journey-cards');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (el) { revealObserver.observe(el); });
  })();

  /* ---------------------------------------------------------
     4. CONTADORES ANIMADOS (seção de números)
     --------------------------------------------------------- */
  (function statCounters() {
    var counters = document.querySelectorAll('.stat-number .count[data-count]');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var duration = 1600;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
        var current = Math.floor(eased * target);
        el.textContent = current.toLocaleString('pt-BR');
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString('pt-BR');
        }
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  })();

  /* ---------------------------------------------------------
     5. COMUNIDADE — pilha de posts arrastável
     --------------------------------------------------------- */
  (function communityStack() {
    var stack = document.getElementById('community-stack');
    if (!stack) return;

    var cards = Array.prototype.slice.call(stack.querySelectorAll('.community-card'));
    if (!cards.length) return;

    var order = cards.map(function (_, i) { return i; });
    var dragging = false;
    var startY = 0;
    var deltaY = 0;

    function layout() {
      order.forEach(function (cardIndex, pos) {
        var card = cards[cardIndex];
        card.style.setProperty('--stack-pos', pos);
        card.classList.toggle('is-active', pos === 0);
        if (pos === 0) {
          card.style.transform = '';
          card.style.opacity = '';
        }
      });
    }

    function advance() {
      var first = order.shift();
      order.push(first);
      var card = cards[first];

      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '0';
      layout();

      void card.offsetWidth; /* força reflow antes de reativar a transição */
      card.style.transition = '';
      window.requestAnimationFrame(function () {
        card.style.opacity = '';
      });
    }

    function flyAway(card) {
      card.style.transition = 'transform .45s cubic-bezier(.4,0,.2,1), opacity .45s ease';
      card.style.transform = 'translateY(560px) rotate(10deg)';
      card.style.opacity = '0';
      window.setTimeout(advance, 380);
    }

    cards.forEach(function (card) {
      card.addEventListener('pointerdown', function (e) {
        if (!card.classList.contains('is-active')) return;
        if (e.target.closest('.community-icon-btn')) return;
        dragging = true;
        startY = e.clientY;
        deltaY = 0;
        card.style.transition = 'none';
        card.classList.add('is-dragging');
        card.setPointerCapture(e.pointerId);
      });

      card.addEventListener('pointermove', function (e) {
        if (!dragging || !card.classList.contains('is-active')) return;
        var raw = e.clientY - startY;
        deltaY = raw < 0 ? raw * 0.25 : raw;
        var rotate = deltaY * 0.05;
        card.style.transform = 'translateY(' + deltaY + 'px) rotate(' + rotate + 'deg)';
        card.style.opacity = String(Math.max(0.35, 1 - deltaY / 260));
      });

      function endDrag() {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('is-dragging');
        if (deltaY > 90) {
          flyAway(card);
        } else {
          card.style.transition = 'transform .35s cubic-bezier(.16,.8,.24,1), opacity .35s ease';
          card.style.transform = '';
          card.style.opacity = '';
        }
        deltaY = 0;
      }
      card.addEventListener('pointerup', endDrag);
      card.addEventListener('pointercancel', endDrag);
    });

    /* Botão alternativo (acessível, sem precisar arrastar) */
    var nextBtn = document.querySelector('[data-community-next]');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        flyAway(cards[order[0]]);
      });
    }

    /* Curtir / salvar */
    stack.addEventListener('click', function (e) {
      var likeBtn = e.target.closest('[data-like-btn]');
      if (likeBtn) { likeBtn.classList.toggle('is-liked'); return; }
      var saveBtn = e.target.closest('[data-bookmark-btn]');
      if (saveBtn) { saveBtn.classList.toggle('is-saved'); }
    });

    /* Dica visual: um leve balanço no card da frente, uma vez, ao entrar na tela */
    function playHint() {
      var frontCard = cards[order[0]];
      if (!frontCard) return;
      frontCard.style.transition = 'transform .5s ease';
      frontCard.style.transform = 'translateY(16px) rotate(2deg)';
      window.setTimeout(function () {
        frontCard.style.transform = '';
        window.setTimeout(function () { frontCard.style.transition = ''; }, 500);
      }, 500);
    }
    if ('IntersectionObserver' in window) {
      var hinted = false;
      var hintObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !hinted) {
            hinted = true;
            window.setTimeout(playHint, 700);
            hintObserver.disconnect();
          }
        });
      }, { threshold: 0.5 });
      hintObserver.observe(stack);
    }

    layout();
  })();

  /* ---------------------------------------------------------
     6. GUIA DE CARREIRAS (filtro)
     --------------------------------------------------------- */
  (function careerFilter() {
    var filters = document.querySelectorAll('.career-filter');
    var cards = document.querySelectorAll('.career-card');
    if (!filters.length || !cards.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var value = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          var show = value === 'todas' || category === value || category === 'outros';
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  })();

  /* ---------------------------------------------------------
     7. CARROSSEL DE DEPOIMENTOS
     --------------------------------------------------------- */
  (function testimonialCarousel() {
    var track = document.querySelector('[data-carousel-slides]');
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.querySelector('[data-carousel-dots]');
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];
    var prevBtn = document.querySelector('[data-carousel-prev]');
    var nextBtn = document.querySelector('[data-carousel-next]');
    var section = document.querySelector('.testimonials');
    var index = 0;
    var autoplayId = null;

    function goTo(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = window.setInterval(next, 6500);
    }
    function stopAutoplay() {
      if (autoplayId) window.clearInterval(autoplayId);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
    });

    if (section) {
      section.addEventListener('mouseenter', stopAutoplay);
      section.addEventListener('mouseleave', startAutoplay);
    }

    goTo(0);
    startAutoplay();
  })();

  /* ---------------------------------------------------------
     8. PLANOS: alternância mensal / anual
     --------------------------------------------------------- */
  (function pricingToggle() {
    var toggle = document.querySelector('[data-pricing-toggle]');
    if (!toggle) return;

    var labels = document.querySelectorAll('[data-toggle-label]');
    var amounts = document.querySelectorAll('.pricing-price .amount[data-monthly]');
    var isAnnual = false;

    function render() {
      toggle.classList.toggle('is-annual', isAnnual);
      labels.forEach(function (label) {
        var key = label.getAttribute('data-toggle-label');
        var active = (key === 'annual' && isAnnual) || (key === 'monthly' && !isAnnual);
        label.classList.toggle('is-active', active);
      });
      amounts.forEach(function (el) {
        var value = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
        el.textContent = value;
      });
    }

    toggle.addEventListener('click', function () {
      isAnnual = !isAnnual;
      render();
    });

    render();
  })();

  /* ---------------------------------------------------------
     9. FAQ (accordion)
     --------------------------------------------------------- */
  (function faqAccordion() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('[data-faq-toggle]');
      var answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.setAttribute('aria-expanded', 'false');

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          other.classList.remove('is-open');
          var otherAnswer = other.querySelector('.faq-answer');
          var otherQuestion = other.querySelector('[data-faq-toggle]');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  /* ---------------------------------------------------------
     10. NEWSLETTER (envio simulado, sem back-end)
     --------------------------------------------------------- */
  (function newsletterForm() {
    var form = document.querySelector('[data-newsletter-form]');
    if (!form) return;

    var note = form.querySelector('[data-newsletter-note]');
    var input = form.querySelector('input[type="email"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input || !input.value) return;

      if (note) {
        note.textContent = 'Prontinho! Você vai receber nossos próximos conteúdos em ' + input.value + '.';
        note.classList.add('is-success');
      }
      form.reset();
    });
  })();

  /* ---------------------------------------------------------
     11. BOTÃO VOLTAR AO TOPO
     --------------------------------------------------------- */
  (function backToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    function update() {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

});

/* NORTEENS — Globo interativo de carreiras
   Cole este bloco dentro do DOMContentLoaded já existente em js/main.js. */
(function careerGlobe() {
  var canvas = document.getElementById('career-globe-canvas');
  if (!canvas || !canvas.getContext) return;

  var context = canvas.getContext('2d');
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-globe-career]'));
  var label = document.getElementById('globe-card-label');
  var title = document.getElementById('globe-card-title');
  var copy = document.getElementById('globe-card-copy');
  var value = document.getElementById('globe-card-value');
  var caption = document.getElementById('globe-card-caption');

  /* Troque este objeto pelos dados vindos da sua API quando a fonte estiver definida. */
  var globeInsights = {
    tecnologia: {
      label: 'Tecnologia', color: '#e6bf55',
      title: 'Polos de inovação em destaque',
      copy: 'Passe pelos pontos do globo para conhecer cidades que concentram oportunidades e comunidades da área.',
      spots: [
        { city: 'São Paulo, Brasil', lat: -23.55, lon: -46.63, metric: '92/100', detail: 'Ecossistema diverso de startups, produtos digitais e tecnologia corporativa.' },
        { city: 'São Francisco, EUA', lat: 37.77, lon: -122.42, metric: '94/100', detail: 'Referência global em inovação, empreendedorismo e empresas de tecnologia.' },
        { city: 'Berlim, Alemanha', lat: 52.52, lon: 13.40, metric: '81/100', detail: 'Hub europeu com vagas internacionais e forte cena de startups.' },
        { city: 'Bengaluru, Índia', lat: 12.97, lon: 77.59, metric: '96/100', detail: 'Um dos maiores centros de serviços, engenharia e talentos de tecnologia.' },
        { city: 'Seul, Coreia do Sul', lat: 37.57, lon: 126.98, metric: '85/100', detail: 'Polo de inovação em eletrônicos, games e produtos conectados.' }
      ]
    },
    saude: {
      label: 'Saúde', color: '#ef9b78',
      title: 'Cidades que impulsionam a saúde',
      copy: 'Conheça ecossistemas em que pesquisa, cuidado e inovação em saúde se encontram.',
      spots: [
        { city: 'São Paulo, Brasil', lat: -23.55, lon: -46.63, metric: '88/100', detail: 'Grande rede hospitalar, centros universitários e oportunidades multidisciplinares.' },
        { city: 'Boston, EUA', lat: 42.36, lon: -71.06, metric: '93/100', detail: 'Reconhecida pela conexão entre pesquisa, biotecnologia e medicina.' },
        { city: 'Londres, Reino Unido', lat: 51.51, lon: -0.13, metric: '79/100', detail: 'Polo internacional de pesquisa clínica, saúde pública e cuidado especializado.' },
        { city: 'Nairóbi, Quênia', lat: -1.29, lon: 36.82, metric: '83/100', detail: 'Centro regional de saúde global e soluções para ampliar o acesso ao cuidado.' }
      ]
    },
    humanas: {
      label: 'Humanas', color: '#f1c96a',
      title: 'Ideias, pessoas e impacto social',
      copy: 'Explore cidades com redes fortes de educação, políticas públicas, cultura e bem-estar.',
      spots: [
        { city: 'Brasília, Brasil', lat: -15.79, lon: -47.88, metric: '84/100', detail: 'Concentra oportunidades ligadas a políticas públicas, pesquisa e impacto social.' },
        { city: 'Cidade do México, México', lat: 19.43, lon: -99.13, metric: '78/100', detail: 'Cena plural para comunicação, pesquisa, cultura e projetos comunitários.' },
        { city: 'Paris, França', lat: 48.86, lon: 2.35, metric: '76/100', detail: 'Referência em ciências humanas, educação, arte e instituições culturais.' },
        { city: 'Melbourne, Austrália', lat: -37.81, lon: 144.96, metric: '82/100', detail: 'Destaque em educação, psicologia, qualidade de vida e inovação social.' }
      ]
    },
    criativas: {
      label: 'Criativas', color: '#f39c60',
      title: 'Onde as indústrias criativas florescem',
      copy: 'Descubra cenários em que design, audiovisual, moda, música e tecnologia criativa se cruzam.',
      spots: [
        { city: 'São Paulo, Brasil', lat: -23.55, lon: -46.63, metric: '90/100', detail: 'Mercado diverso para design, conteúdo, publicidade, moda e cultura.' },
        { city: 'Londres, Reino Unido', lat: 51.51, lon: -0.13, metric: '91/100', detail: 'Centro global de design, comunicação, moda e produção cultural.' },
        { city: 'Tóquio, Japão', lat: 35.68, lon: 139.65, metric: '89/100', detail: 'Referência em animação, jogos, experiências digitais e cultura visual.' },
        { city: 'Cidade do Cabo, África do Sul', lat: -33.92, lon: 18.42, metric: '74/100', detail: 'Ecossistema criativo em expansão, conectado a audiovisual e tecnologia.' }
      ]
    }
  };

  var continents = [
    [[-168,71],[-150,69],[-140,60],[-128,55],[-125,47],[-120,39],[-115,32],[-104,26],[-98,19],[-86,18],[-79,26],[-74,41],[-64,48],[-58,57],[-67,66],[-90,72],[-125,74]],
    [[-81,12],[-76,4],[-79,-8],[-74,-18],[-71,-32],[-65,-48],[-53,-55],[-42,-35],[-35,-15],[-45,2],[-58,8],[-71,11]],
    [[-10,36],[-5,43],[8,45],[18,42],[28,39],[38,35],[42,29],[35,21],[31,13],[25,4],[20,-9],[12,-18],[5,-32],[-4,-35],[-12,-22],[-16,0],[-13,18]],
    [[-10,36],[-7,51],[5,57],[20,60],[35,65],[58,69],[90,71],[121,63],[140,54],[148,44],[139,34],[122,27],[107,20],[91,22],[76,28],[61,30],[49,37],[36,39],[25,44],[15,43],[4,45]],
    [[112,-11],[114,-25],[124,-34],[139,-39],[151,-33],[154,-22],[146,-13],[132,-11]],
    [[48,-13],[50,-25],[46,-25],[43,-16]],
    [[-74,60],[-45,60],[-28,73],[-40,83],[-62,80]]
  ];
  var landDots = [];
  var state = { yaw: -25, pitch: -12, activeCareer: 'tecnologia', activeSpot: null, dragging: false, startX: 0, startY: 0, yawStart: 0, pitchStart: 0 };
  var width = 0;
  var height = 0;
  var radius = 0;
  var spotsOnScreen = [];

  function pointInPolygon(lon, lat, polygon) {
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var a = polygon[i], b = polygon[j];
      var crosses = ((a[1] > lat) !== (b[1] > lat)) && (lon < (b[0] - a[0]) * (lat - a[1]) / (b[1] - a[1]) + a[0]);
      if (crosses) inside = !inside;
    }
    return inside;
  }
  function isLand(lon, lat) {
    return continents.some(function (polygon) { return pointInPolygon(lon, lat, polygon); });
  }
  function buildLandDots() {
    for (var lat = -55; lat <= 78; lat += 3.2) {
      for (var lon = -178; lon <= 178; lon += 3.5) {
        var offset = Math.sin((lat + lon) * 1.71) * 1.25;
        if (isLand(lon + offset, lat)) landDots.push({ lat: lat, lon: lon + offset });
      }
    }
  }
  function project(lat, lon) {
    var phi = lat * Math.PI / 180;
    var lambda = lon * Math.PI / 180;
    var yaw = state.yaw * Math.PI / 180;
    var pitch = state.pitch * Math.PI / 180;
    var x = Math.cos(phi) * Math.sin(lambda);
    var y = Math.sin(phi);
    var z = Math.cos(phi) * Math.cos(lambda);
    var x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
    var z1 = x * Math.sin(yaw) + z * Math.cos(yaw);
    var y1 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
    var z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);
    return { x: width / 2 + x1 * radius, y: height / 2 - y1 * radius, z: z2 };
  }
  function line(points, color, alpha) {
    context.beginPath();
    var drawing = false;
    points.forEach(function (point) {
      if (point.z > .02) {
        if (!drawing) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
        drawing = true;
      } else drawing = false;
    });
    context.strokeStyle = color;
    context.globalAlpha = alpha;
    context.lineWidth = 1;
    context.stroke();
    context.globalAlpha = 1;
  }
  function drawGrid() {
    context.save();
    context.beginPath();
    context.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    context.clip();
    for (var lat = -60; lat <= 60; lat += 30) {
      var latitude = [];
      for (var lon = -180; lon <= 180; lon += 4) latitude.push(project(lat, lon));
      line(latitude, '#b5d9ce', .18);
    }
    for (var longitude = -150; longitude <= 180; longitude += 30) {
      var meridian = [];
      for (var degree = -88; degree <= 88; degree += 3) meridian.push(project(degree, longitude));
      line(meridian, '#b5d9ce', .18);
    }
    context.fillStyle = 'rgba(152, 209, 178, .82)';
    landDots.forEach(function (dot) {
      var p = project(dot.lat, dot.lon);
      if (p.z > 0) {
        context.globalAlpha = .32 + p.z * .5;
        context.beginPath();
        context.arc(p.x, p.y, 1.15, 0, Math.PI * 2);
        context.fill();
      }
    });
    context.globalAlpha = 1;
    context.restore();
  }
  function drawSpots() {
    var career = globeInsights[state.activeCareer];
    spotsOnScreen = [];
    career.spots.forEach(function (spot) {
      var p = project(spot.lat, spot.lon);
      if (p.z <= .03) return;
      var selected = state.activeSpot === spot;
      var dotRadius = 4.6 + p.z * 2.1;
      context.beginPath();
      context.arc(p.x, p.y, dotRadius + 6 + (selected ? 3 : 0), 0, Math.PI * 2);
      context.fillStyle = selected ? 'rgba(255,255,255,.28)' : 'rgba(230,191,85,.17)';
      context.fill();
      context.beginPath();
      context.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
      context.fillStyle = career.color;
      context.shadowColor = career.color;
      context.shadowBlur = 13;
      context.fill();
      context.shadowBlur = 0;
      spotsOnScreen.push({ spot: spot, x: p.x, y: p.y, radius: dotRadius });
    });
  }
  function draw() {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    var cx = width / 2, cy = height / 2;
    var ocean = context.createRadialGradient(cx - radius * .32, cy - radius * .37, radius * .08, cx, cy, radius * 1.08);
    ocean.addColorStop(0, '#2f8069');
    ocean.addColorStop(.56, '#17604f');
    ocean.addColorStop(1, '#0d3a32');
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.fillStyle = ocean;
    context.shadowColor = 'rgba(108, 226, 188, .34)';
    context.shadowBlur = 22;
    context.fill();
    context.shadowBlur = 0;
    drawGrid();
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(222, 255, 242, .3)';
    context.lineWidth = 1.3;
    context.stroke();
    drawSpots();
  }
  function resize() {
    var rect = canvas.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(260, rect.width);
    height = Math.max(260, rect.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    radius = Math.min(width, height) * .405;
    draw();
  }
  function setOverview() {
    var career = globeInsights[state.activeCareer];
    label.textContent = career.label;
    title.textContent = career.title;
    copy.textContent = career.copy;
    value.textContent = career.spots.length + ' polos';
    caption.textContent = 'para explorar nesta área';
  }
  function setSpot(spot) {
    var career = globeInsights[state.activeCareer];
    label.textContent = career.label + ' · ' + spot.city;
    title.textContent = spot.city;
    copy.textContent = spot.detail;
    value.textContent = spot.metric;
    caption.textContent = 'índice demonstrativo de oportunidade';
  }
  function localPoint(event) {
    var rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  function selectSpotAt(point) {
    var hit = spotsOnScreen.find(function (candidate) {
      return Math.hypot(candidate.x - point.x, candidate.y - point.y) < candidate.radius + 11;
    });
    if (!hit) return false;
    state.activeSpot = hit.spot;
    setSpot(hit.spot);
    draw();
    return true;
  }
  function updateCursor(point) {
    var closeToSpot = spotsOnScreen.some(function (candidate) {
      return Math.hypot(candidate.x - point.x, candidate.y - point.y) < candidate.radius + 11;
    });
    canvas.style.cursor = closeToSpot ? 'pointer' : (state.dragging ? 'grabbing' : 'grab');
  }

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      state.activeCareer = button.getAttribute('data-globe-career');
      state.activeSpot = null;
      filters.forEach(function (item) { item.classList.toggle('is-active', item === button); });
      setOverview();
      draw();
    });
  });
  canvas.addEventListener('pointerdown', function (event) {
    state.dragging = true;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.yawStart = state.yaw;
    state.pitchStart = state.pitch;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('pointermove', function (event) {
    if (!state.dragging) { updateCursor(localPoint(event)); return; }
    state.yaw = state.yawStart - (event.clientX - state.startX) * .42;
    state.pitch = Math.max(-62, Math.min(62, state.pitchStart + (event.clientY - state.startY) * .32));
    draw();
  });
  function releasePointer(event) {
    if (!state.dragging) return;
    var moved = Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
    state.dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (moved < 8) selectSpotAt(localPoint(event));
    updateCursor(localPoint(event));
  }
  canvas.addEventListener('pointerup', releasePointer);
  canvas.addEventListener('pointercancel', releasePointer);
  canvas.addEventListener('keydown', function (event) {
    var step = 10;
    if (event.key === 'ArrowLeft') state.yaw += step;
    else if (event.key === 'ArrowRight') state.yaw -= step;
    else if (event.key === 'ArrowUp') state.pitch = Math.max(-62, state.pitch - step);
    else if (event.key === 'ArrowDown') state.pitch = Math.min(62, state.pitch + step);
    else return;
    event.preventDefault();
    draw();
  });

  buildLandDots();
  setOverview();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  resize();
})();
