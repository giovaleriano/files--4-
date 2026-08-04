/* =========================================================
   NORTEENS — Comunidade
   Feed com curtidas, comentários, composer e filtro por tópico.
   Persistência simples via localStorage (sem backend).
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  var feedEl = document.getElementById('feed');
  if (!feedEl) return;

  var STORAGE_KEY = 'norteens_community_posts';
  var NAME_KEY = 'norteens_community_name';

  /* -----------------------------------------------------
     Ícones
     ----------------------------------------------------- */
  var ICONS = {
    heartLine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.7-4.35-9.3-8.1C.8 9.9 1.7 6.2 5 5c2-.75 3.9.1 5 1.8 1.1-1.7 3-2.55 5-1.8 3.3 1.2 4.2 4.9 2.3 7.9C18.7 16.65 12 21 12 21z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12c0 4.4-4 8-9 8-1 0-2-.15-3-.4L3 21l1.3-4C3.5 15.7 3 13.9 3 12c0-4.4 4-8 9-8s9 3.6 9 8z"/><circle cx="8.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l18-8-8 18-2.5-7L3 11z"/></svg>',
    photoPlaceholder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="opacity:.85;width:44px;height:44px;"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-4 4 3 3-2 4 3"/></svg>'
  };

  /* -----------------------------------------------------
     Ilustrações reaproveitadas do resto do site
     ----------------------------------------------------- */
  var ILLUSTRATIONS = {
    laptop: '<svg viewBox="130 90 190 250" xmlns="http://www.w3.org/2000/svg"><path d="M148 312c-10-70 26-116 72-116s82 46 72 116z" fill="#f3ece0"/><circle cx="220" cy="176" r="42" fill="#e6b189"/><path d="M178 190c-8-46 22-80 42-80s50 34 42 80c-6-22-14-34-14-34s-6 10-28 10-28-10-28-10-8 12-14 34z" fill="#4a2f1e"/><rect x="176" y="252" width="88" height="58" rx="8" fill="#d99a35"/><rect x="184" y="240" width="72" height="40" rx="6" fill="#6b7c74"/><rect x="188" y="244" width="64" height="28" rx="3" fill="#173f35"/></svg>',
    hoodie: '<svg viewBox="4 104 190 446" xmlns="http://www.w3.org/2000/svg"><rect x="34" y="266" width="92" height="168" rx="26" fill="#14332a"/><rect x="52" y="432" width="34" height="104" rx="12" fill="#1c2b22"/><rect x="96" y="432" width="34" height="104" rx="12" fill="#1c2b22"/><rect x="46" y="520" width="46" height="20" rx="10" fill="#f3ede2"/><rect x="92" y="520" width="46" height="20" rx="10" fill="#f3ede2"/><rect x="30" y="232" width="132" height="212" rx="58" fill="#3a6b4d"/><rect x="14" y="256" width="34" height="110" rx="17" fill="#2f5d43"/><rect x="144" y="256" width="34" height="110" rx="17" fill="#2f5d43"/><circle cx="96" cy="182" r="46" fill="#d99a6c"/><path d="M50 178c-4-40 26-64 46-64s50 24 46 64c-6-14-18-8-18-24 0-14-10-20-28-20s-28 6-28 20c0 16-12 10-18 24z" fill="#241710"/><circle cx="82" cy="186" r="3.4" fill="#241710"/><circle cx="110" cy="186" r="3.4" fill="#241710"/><path d="M86 200q10 8 20 0" stroke="#241710" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
    headphones: '<svg viewBox="296 118 196 432" xmlns="http://www.w3.org/2000/svg"><rect x="356" y="276" width="86" height="158" rx="24" fill="#14332a"/><rect x="344" y="436" width="34" height="100" rx="12" fill="#241a10"/><rect x="388" y="436" width="34" height="100" rx="12" fill="#241a10"/><rect x="338" y="520" width="46" height="20" rx="10" fill="#f3ede2"/><rect x="384" y="520" width="46" height="20" rx="10" fill="#f3ede2"/><rect x="322" y="240" width="132" height="212" rx="58" fill="#b5502f"/><rect x="306" y="264" width="32" height="104" rx="16" fill="#a3462a"/><rect x="450" y="264" width="32" height="104" rx="16" fill="#a3462a"/><circle cx="388" cy="192" r="44" fill="#c98a5c"/><path d="M348 178c0-30 18-46 40-46s40 16 40 46c-4-10-10-16-10-16s-6 8-30 8-30-8-30-8-6 6-10 16z" fill="#1c130c"/><circle cx="360" cy="176" r="9" fill="#1c130c"/><path d="M348 168a44 44 0 0 1 80 0" stroke="#173226" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="376" cy="198" r="3.2" fill="#1c130c"/><circle cx="402" cy="198" r="3.2" fill="#1c130c"/><path d="M380 212q10 7 18 0" stroke="#1c130c" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>'
  };

  var TOPIC_LABELS = {
    vestibular: '🎓 Vestibular',
    tecnologia: '💻 Tecnologia',
    saude: '🩺 Saúde',
    criativos: '🎨 Criativos',
    transicao: '🔁 Transição de carreira',
    autoconhecimento: '🌱 Autoconhecimento'
  };

  var AVATAR_COLORS = ['var(--orange)', 'var(--green)', 'var(--terracotta)', 'var(--yellow)', 'var(--green-dark)'];

  function initials(name) {
    var parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'VC';
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  /* -----------------------------------------------------
     Seed (usado só na primeira visita — depois some fica salvo)
     ----------------------------------------------------- */
  var SEED_POSTS = [
    {
      id: 'seed-1', nome: 'Marina', color: 'var(--terracotta)', tempo: 'há 2 h',
      topico: 'vestibular', texto: 'Fiz o teste vocacional e descobri que sou perfil Conector! Alguém mais surtou com o resultado? 😅',
      media: null, likes: 34, liked: false, saved: false,
      comments: [
        { nome: 'Pedro', texto: 'Eu dei Estrategista, bem a cara mesmo 😂' },
        { nome: 'Ana', texto: 'Faz sentido pra você, sempre foi a pessoa que junta a galera!' }
      ]
    },
    {
      id: 'seed-2', nome: 'Rafael', color: 'var(--green)', tempo: 'há 5 h',
      topico: 'tecnologia', texto: 'Consegui meu primeiro estágio em desenvolvimento! Muito obrigado a quem me ajudou nessa jornada 🙌',
      media: { variant: 'media-green', svg: ILLUSTRATIONS.hoodie }, likes: 51, liked: false, saved: false,
      comments: [
        { nome: 'Marina', texto: 'Parabéns, Rafael! Merecido 👏' }
      ]
    },
    {
      id: 'seed-3', nome: 'Bruna', color: 'var(--yellow)', tempo: 'ontem',
      topico: 'autoconhecimento', texto: 'Meu mural de metas ficou lindo. Alguém mais gosta de planejar visualmente? ✨',
      media: { variant: 'media-yellow', svg: ILLUSTRATIONS.laptop }, likes: 78, liked: false, saved: false,
      comments: []
    },
    {
      id: 'seed-4', nome: 'Camila', color: 'var(--orange)', tempo: 'há 2 dias',
      topico: 'transicao', texto: 'Depois de 3 anos estudando Direito, decidi migrar pra UX Design. Dá medo, mas parece certo.',
      media: null, likes: 62, liked: false, saved: false,
      comments: [
        { nome: 'Lucas', texto: 'Corajosa! Migrar dá medo mesmo, mas vale muito a pena quando faz sentido.' }
      ]
    },
    {
      id: 'seed-5', nome: 'Lucas', color: 'var(--green-dark)', tempo: 'há 3 dias',
      topico: 'saude', texto: 'Semana de plantão puxada, mas ver os pacientes melhorando vale cada hora de sono perdida 💚',
      media: { variant: 'media-orange', svg: ILLUSTRATIONS.headphones }, likes: 45, liked: false, saved: false,
      comments: []
    },
    {
      id: 'seed-6', nome: 'Julia', color: 'var(--terracotta)', tempo: 'há 4 dias',
      topico: 'criativos', texto: 'Alguém aqui também tá na dúvida entre Arquitetura e Design Gráfico? Bora trocar ideia nos comentários.',
      media: null, likes: 29, liked: false, saved: false,
      comments: []
    }
  ];

  /* -----------------------------------------------------
     Estado + persistência
     ----------------------------------------------------- */
  function loadPosts() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* localStorage indisponível — segue com o seed */ }
    return SEED_POSTS.slice();
  }
  function savePosts() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(POSTS)); } catch (e) { /* silencioso */ }
  }

  var POSTS = loadPosts();
  var currentTopic = 'todos';

  /* -----------------------------------------------------
     Render de um post
     ----------------------------------------------------- */
  function renderPost(post) {
    var mediaHtml = post.media
      ? '<div class="post-media ' + post.media.variant + '">' + (post.media.svg || ICONS.photoPlaceholder) + '</div>'
      : '';

    var commentsHtml = post.comments.map(function (c) {
      return '<div class="comment-item">' +
        '<span class="comment-avatar" style="background:' + (c.color || 'var(--green)') + '">' + initials(c.nome) + '</span>' +
        '<div class="comment-bubble"><b>' + c.nome + '</b>' + c.texto + '</div>' +
      '</div>';
    }).join('');

    return (
      '<article class="post" data-id="' + post.id + '">' +
        '<header class="post-header">' +
          '<span class="post-avatar" style="background:' + post.color + '">' + initials(post.nome) + '</span>' +
          '<div class="post-meta">' +
            '<span class="post-name">' + post.nome + '</span>' +
            '<span class="post-sub">' + post.tempo + ' · <span class="topic-dot">' + (TOPIC_LABELS[post.topico] || '') + '</span></span>' +
          '</div>' +
        '</header>' +
        '<p class="post-caption">' + post.texto + '</p>' +
        mediaHtml +
        '<div class="post-actions">' +
          '<button class="post-action' + (post.liked ? ' is-liked' : '') + '" type="button" data-like>' + ICONS.heartLine + '<span>' + post.likes + '</span></button>' +
          '<button class="post-action" type="button" data-comment-toggle>' + ICONS.comment + '<span>' + post.comments.length + '</span></button>' +
          '<button class="post-action is-save' + (post.saved ? ' is-saved' : '') + '" type="button" data-save aria-label="Salvar">' + ICONS.bookmark + '</button>' +
        '</div>' +
        '<div class="post-comments" data-comments>' +
          '<div class="comment-list">' + commentsHtml + '</div>' +
          '<div class="comment-form">' +
            '<input type="text" class="comment-input" placeholder="Escreva um comentário..." data-comment-input maxlength="200">' +
            '<button class="comment-send" type="button" data-comment-send aria-label="Enviar comentário">' + ICONS.send + '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderFeed() {
    var list = currentTopic === 'todos' ? POSTS : POSTS.filter(function (p) { return p.topico === currentTopic; });
    feedEl.innerHTML = list.length
      ? list.map(renderPost).join('')
      : '<p class="feed-empty">Ainda não há posts nesse tópico. Que tal ser a primeira pessoa a publicar? 👀</p>';
  }

  /* -----------------------------------------------------
     Filtro por tópico
     ----------------------------------------------------- */
  var topicsRow = document.getElementById('topics-row');
  if (topicsRow) {
    topicsRow.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-topic]');
      if (!chip) return;
      currentTopic = chip.getAttribute('data-topic');
      topicsRow.querySelectorAll('.topic-chip').forEach(function (c) {
        c.classList.toggle('is-active', c === chip);
      });
      renderFeed();
    });
  }

  /* -----------------------------------------------------
     Curtir / salvar / comentar (delegação no feed)
     ----------------------------------------------------- */
  feedEl.addEventListener('click', function (e) {
    var article = e.target.closest('.post');
    if (!article) return;
    var post = POSTS.filter(function (p) { return p.id === article.getAttribute('data-id'); })[0];
    if (!post) return;

    if (e.target.closest('[data-like]')) {
      var likeBtn = e.target.closest('[data-like]');
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      likeBtn.classList.toggle('is-liked', post.liked);
      likeBtn.querySelector('span').textContent = post.likes;
      savePosts();
      return;
    }

    if (e.target.closest('[data-save]')) {
      var saveBtn = e.target.closest('[data-save]');
      post.saved = !post.saved;
      saveBtn.classList.toggle('is-saved', post.saved);
      savePosts();
      return;
    }

    if (e.target.closest('[data-comment-toggle]')) {
      var panel = article.querySelector('[data-comments]');
      if (panel) panel.classList.toggle('is-open');
      return;
    }

    if (e.target.closest('[data-comment-send]')) {
      var input = article.querySelector('[data-comment-input]');
      var text = (input.value || '').trim();
      if (!text) return;
      var authorName = (document.getElementById('composer-name').value || '').trim() || 'Você';
      var comment = { nome: authorName, texto: text, color: 'var(--orange)' };
      post.comments.push(comment);
      savePosts();

      var list = article.querySelector('.comment-list');
      var item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = '<span class="comment-avatar" style="background:' + comment.color + '">' + initials(comment.nome) + '</span>' +
        '<div class="comment-bubble"><b>' + comment.nome + '</b>' + comment.texto + '</div>';
      list.appendChild(item);

      var countEl = article.querySelector('[data-comment-toggle] span');
      if (countEl) countEl.textContent = post.comments.length;

      input.value = '';
      return;
    }
  });

  /* Enter no campo de comentário também envia */
  feedEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches('[data-comment-input]')) {
      e.preventDefault();
      var sendBtn = e.target.closest('.post-comments').querySelector('[data-comment-send]');
      if (sendBtn) sendBtn.click();
    }
  });

  /* -----------------------------------------------------
     Composer
     ----------------------------------------------------- */
  var nameInput = document.getElementById('composer-name');
  var textInput = document.getElementById('composer-text');
  var avatarEl = document.getElementById('composer-avatar');
  var topicSelect = document.getElementById('composer-topic');
  var publishBtn = document.getElementById('composer-publish');
  var photoBtn = document.getElementById('composer-photo-btn');
  var previewEl = document.getElementById('composer-preview');
  var previewRemoveBtn = document.getElementById('composer-preview-remove');

  var PHOTO_VARIANTS = ['media-yellow', 'media-green', 'media-orange', 'media-navy'];
  var selectedPhoto = null;
  var photoIndex = 0;

  try {
    var savedName = localStorage.getItem(NAME_KEY);
    if (savedName && nameInput) nameInput.value = savedName;
  } catch (e) { /* segue sem nome salvo */ }
  if (avatarEl && nameInput) avatarEl.textContent = initials(nameInput.value);

  function updatePublishState() {
    var hasContent = (textInput.value.trim().length > 0) || !!selectedPhoto;
    publishBtn.disabled = !hasContent;
  }

  if (nameInput) {
    nameInput.addEventListener('input', function () {
      if (avatarEl) avatarEl.textContent = initials(nameInput.value);
      try { localStorage.setItem(NAME_KEY, nameInput.value); } catch (e) { /* silencioso */ }
    });
  }
  if (textInput) textInput.addEventListener('input', updatePublishState);

  if (photoBtn && previewEl) {
    photoBtn.addEventListener('click', function () {
      selectedPhoto = PHOTO_VARIANTS[photoIndex % PHOTO_VARIANTS.length];
      photoIndex++;
      PHOTO_VARIANTS.forEach(function (v) { previewEl.classList.remove(v); });
      previewEl.classList.add(selectedPhoto, 'is-visible');
      updatePublishState();
    });
  }
  if (previewRemoveBtn) {
    previewRemoveBtn.addEventListener('click', function () {
      selectedPhoto = null;
      previewEl.classList.remove('is-visible');
      updatePublishState();
    });
  }

  if (publishBtn) {
    publishBtn.addEventListener('click', function () {
      var texto = textInput.value.trim();
      if (!texto && !selectedPhoto) return;

      var nome = (nameInput.value || '').trim() || 'Você';
      var newPost = {
        id: 'user-' + Date.now(),
        nome: nome,
        color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        tempo: 'agora',
        topico: (topicSelect && topicSelect.value) || 'autoconhecimento',
        texto: texto || 'Compartilhou uma novidade.',
        media: selectedPhoto ? { variant: selectedPhoto, svg: '' } : null,
        likes: 0,
        liked: false,
        saved: false,
        comments: []
      };

      POSTS.unshift(newPost);
      savePosts();

      textInput.value = '';
      selectedPhoto = null;
      previewEl.classList.remove('is-visible');
      updatePublishState();

      currentTopic = 'todos';
      if (topicsRow) {
        topicsRow.querySelectorAll('.topic-chip').forEach(function (c) {
          c.classList.toggle('is-active', c.getAttribute('data-topic') === 'todos');
        });
      }

      renderFeed();
      feedEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  updatePublishState();
  renderFeed();

});
