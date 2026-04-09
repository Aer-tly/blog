const content = window.blogContent;
document.documentElement.classList.add("js-ready");

function byId(id) {
  return document.getElementById(id);
}

function renderTags(items) {
  return items.map((item) => `<span>${item}</span>`).join("");
}

function createPostCard(post, compact = false) {
  const article = document.createElement("article");
  article.className = compact ? "post-card compact" : "post-card";
  article.setAttribute("data-reveal", "");
  article.innerHTML = `
    <a class="card-link" href="./post.html?slug=${post.slug}">
      <div class="post-card__meta">
        <span>${post.category}</span>
        <span>${post.date}</span>
        <span>${post.readTime}</span>
      </div>
      <h3>${post.title}</h3>
      <p>${post.summary}</p>
      <div class="post-tags">
        ${renderTags(post.tags)}
      </div>
    </a>
  `;
  return article;
}

function createProjectCard(project) {
  const wrapper = document.createElement("article");
  wrapper.className = "project-item";
  wrapper.setAttribute("data-reveal", "");
  wrapper.innerHTML = `
    <a class="card-link" href="./note.html?slug=${project.slug}">
      <div class="project-item__meta">
        <span>${project.status}</span>
        <span>${project.year}</span>
      </div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <small>${project.detail}</small>
    </a>
  `;
  return wrapper;
}

function renderHome() {
  setupHomeStats();
}

function renderEssays() {
  const list = byId("essays-grid");
  if (!list) {
    return;
  }

  content.posts.forEach((post) => list.appendChild(createPostCard(post)));
}

function renderProjects() {
  const list = byId("projects-grid");
  if (!list) {
    return;
  }

  content.projects.forEach((project) => list.appendChild(createProjectCard(project)));
}

function renderAbout() {
  const motto = byId("about-motto");
  const nickname = byId("about-nickname");
  const friendLinks = byId("about-friend-links");
  const introTitle = byId("about-intro-title");
  const introBlock = byId("about-intro-block");
  const basicTitle = byId("about-basic-title");
  const basicBlock = byId("about-basic-block");
  const hobbiesTitle = byId("about-hobbies-title");
  const favorites = byId("favorite-list");

  if (motto) {
    motto.textContent = content.about.motto;
  }
  if (nickname) {
    nickname.textContent = content.about.nickname;
  }
  if (friendLinks) {
    content.about.friendLinks.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.label;
      link.className = "about-link-chip";
      friendLinks.appendChild(link);
    });
  }
  if (introTitle) {
    introTitle.textContent = content.about.introTitle;
  }
  if (introBlock) {
    content.about.introParagraphs.forEach((item) => {
      const p = document.createElement("p");
      p.textContent = item;
      introBlock.appendChild(p);
    });
  }
  if (basicTitle) {
    basicTitle.textContent = content.about.basicTitle;
  }
  if (basicBlock) {
    content.about.basicParagraphs.forEach((item) => {
      const p = document.createElement("p");
      p.textContent = item;
      basicBlock.appendChild(p);
    });
  }
  if (hobbiesTitle) {
    hobbiesTitle.textContent = content.about.hobbiesTitle;
  }
  if (favorites) {
    content.about.favorites.forEach((item) => {
      const span = document.createElement("span");
      span.textContent = item;
      favorites.appendChild(span);
    });
  }
}

function renderPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || content.posts[0].slug;
  const post = content.posts.find((item) => item.slug === slug) || content.posts[0];
  const related = content.posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  document.title = `${post.title} | ${content.site.title}`;

  byId("post-kicker").textContent = post.kicker;
  byId("post-title").textContent = post.title;
  byId("post-meta").innerHTML = `<span>${post.category}</span><span>${post.date}</span><span>${post.readTime}</span>`;
  byId("post-intro").textContent = post.intro;
  byId("post-tags").innerHTML = renderTags(post.tags);

  const postContent = byId("post-content");
  post.sections.forEach((section) => {
    const article = document.createElement("section");
    article.className = "reading-section";
    article.setAttribute("data-reveal", "");
    article.innerHTML = `
      <h2>${section.heading}</h2>
      ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    `;
    postContent.appendChild(article);
  });

  const relatedList = byId("related-posts");
  related.forEach((item) => relatedList.appendChild(createPostCard(item, true)));
}

function renderNote() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || content.projects[0].slug;
  const note = content.projects.find((item) => item.slug === slug) || content.projects[0];
  const related = content.projects.filter((item) => item.slug !== note.slug).slice(0, 3);

  document.title = `${note.title} | ${content.site.title}`;

  byId("note-kicker").textContent = note.kicker;
  byId("note-title").textContent = note.title;
  byId("note-meta").innerHTML = `<span>${note.status}</span><span>${note.year}</span>`;
  byId("note-intro").textContent = note.intro;

  const noteContent = byId("note-content");
  note.sections.forEach((section) => {
    const article = document.createElement("section");
    article.className = "reading-section";
    article.setAttribute("data-reveal", "");
    article.innerHTML = `
      <h2>${section.heading}</h2>
      ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    `;
    noteContent.appendChild(article);
  });

  const relatedList = byId("related-notes");
  related.forEach((item) => relatedList.appendChild(createProjectCard(item)));
}

function formatSiteUptime(startDateValue) {
  const startDate = new Date(startDateValue);
  if (Number.isNaN(startDate.getTime())) {
    return "--";
  }

  const now = new Date();
  const diffMs = Math.max(now.getTime() - startDate.getTime(), 0);
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (totalDays < 1) {
    return "1 天";
  }

  return `${totalDays + 1} 天`;
}

async function setupHomeStats() {
  const viewsEl = byId("site-views");
  const uptimeEl = byId("site-uptime");
  if (!viewsEl && !uptimeEl) {
    return;
  }

  const startDateValue = document.body.dataset.siteStart || "2026-04-05";
  if (uptimeEl) {
    uptimeEl.textContent = formatSiteUptime(startDateValue);
  }

  if (!viewsEl) {
    return;
  }

  const storageCountKey = "aertly-home-views-count";
  const sessionMarkKey = "aertly-home-viewed";
  const supabaseConfig = window.AERTLY_SUPABASE || {};
  const hasSupabaseConfig = Boolean(supabaseConfig.url && supabaseConfig.anonKey && window.supabase);
  const pageViewsTable = supabaseConfig.pageViewsTable || "page_views";
  const supabaseClient = hasSupabaseConfig
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

  function readLocalViews() {
    return Number(localStorage.getItem(storageCountKey) || "0");
  }

  function writeLocalViews(value) {
    localStorage.setItem(storageCountKey, String(value));
  }

  function ensureLocalView() {
    let count = readLocalViews();
    if (sessionStorage.getItem(sessionMarkKey) !== "true") {
      count += 1;
      writeLocalViews(count);
      sessionStorage.setItem(sessionMarkKey, "true");
    }
    return count;
  }

  async function syncRemoteViews() {
    if (!supabaseClient) {
      return null;
    }

    if (sessionStorage.getItem(sessionMarkKey) !== "true") {
      const { error: insertError } = await supabaseClient
        .from(pageViewsTable)
        .insert({ page_key: "home" });

      if (insertError) {
        return null;
      }

      sessionStorage.setItem(sessionMarkKey, "true");
    }

    const { count, error: countError } = await supabaseClient
      .from(pageViewsTable)
      .select("*", { count: "exact", head: true })
      .eq("page_key", "home");

    if (countError) {
      return null;
    }

    return count ?? 0;
  }

  const remoteViews = await syncRemoteViews();
  if (remoteViews !== null) {
    viewsEl.textContent = String(remoteViews);
    return;
  }

  viewsEl.textContent = String(ensureLocalView());
}

function setupComments() {
  const form = byId("comment-form");
  const list = byId("comment-list");
  if (!form || !list) {
    return;
  }

  const page = document.body.dataset.page;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "default";
  const storageKey = `aertly-comments-${page}-${slug}`;
  const supabaseConfig = window.AERTLY_SUPABASE || {};
  const hasSupabaseConfig = Boolean(supabaseConfig.url && supabaseConfig.anonKey && window.supabase);
  const tableName = supabaseConfig.table || "comments";
  const supabaseClient = hasSupabaseConfig
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

  function readComments() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  }

  function writeComments(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  function createCommentMarkup(comment) {
    return `
      <div class="comment-avatar-wrap">
        <img class="comment-avatar" src="${comment.avatar}" alt="${comment.name}">
      </div>
      <div class="comment-body">
        <div class="comment-head">
          <strong>${comment.name}</strong>
          <span>${comment.email}</span>
          <time>${comment.createdAt}</time>
        </div>
        <p>${comment.body}</p>
      </div>
    `;
  }

  function renderComments(comments) {
    list.innerHTML = "";

    if (!comments.length) {
      list.innerHTML = '<p class="comment-empty">还没有评论，来留下第一条吧。</p>';
      return;
    }

    comments.forEach((comment) => {
      const article = document.createElement("article");
      article.className = "comment-item";
      article.innerHTML = createCommentMarkup(comment);
      list.appendChild(article);
    });
  }

  async function loadComments() {
    if (!supabaseClient) {
      renderComments(readComments());
      return;
    }

    const { data, error } = await supabaseClient
      .from(tableName)
      .select("name,email,avatar,body,created_at")
      .eq("entity_type", page)
      .eq("entity_slug", slug)
      .order("created_at", { ascending: false });

    if (error) {
      renderComments(readComments());
      return;
    }

    const comments = (data || []).map((item) => ({
      name: item.name,
      email: item.email,
      avatar: item.avatar || "./person.jpg",
      body: item.body,
      createdAt: new Date(item.created_at).toLocaleString("zh-CN")
    }));
    renderComments(comments);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = byId("comment-name").value.trim();
    const email = byId("comment-email").value.trim();
    const avatarInput = byId("comment-avatar").value.trim();
    const body = byId("comment-body").value.trim();

    if (!name || !email || !body) {
      return;
    }

    const comment = {
      name,
      email,
      avatar: avatarInput || "./person.jpg",
      body,
      createdAt: new Date().toLocaleString("zh-CN")
    };

    if (supabaseClient) {
      const { error } = await supabaseClient
        .from(tableName)
        .insert({
          entity_type: page,
          entity_slug: slug,
          name,
          email,
          avatar: avatarInput || "./person.jpg",
          body
        });

      if (!error) {
        form.reset();
        loadComments();
        return;
      }
    }

    const comments = readComments();
    comments.unshift(comment);
    writeComments(comments);
    form.reset();
    renderComments(comments);
  });

  loadComments();
}

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add("is-active");
    }
  });
}

function setupReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  elements.forEach((element, index) => {
    element.classList.add("reveal-init");
    element.style.transitionDelay = `${index * 70}ms`;
    observer.observe(element);
  });
}

function setupPetals() {
  const field = document.querySelector(".petal-field");
  if (!field) {
    return;
  }

  Array.from({ length: 20 }).forEach((_, index) => {
    const petal = document.createElement("span");
    petal.className = "floating-petal";
    petal.style.left = `${(index * 5.3) % 100}%`;
    petal.style.animationDelay = `${index * 0.8}s`;
    petal.style.animationDuration = `${11 + (index % 6) * 1.8}s`;
    petal.style.opacity = `${0.42 + (index % 4) * 0.09}`;
    field.appendChild(petal);
  });
}

function setupBgm() {
  const audio = document.getElementById("bgm");
  const toggle = document.getElementById("music-toggle");
  if (!audio || !toggle) {
    return;
  }

  const enabledKey = "aertly-bgm-enabled";
  const timeKey = "aertly-bgm-current-time";

  function syncButton(isPlaying) {
    toggle.textContent = isPlaying ? "BGM On" : "BGM Off";
    toggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    toggle.classList.toggle("is-playing", isPlaying);
  }

  async function playAudio() {
    try {
      await audio.play();
      sessionStorage.setItem(enabledKey, "true");
      syncButton(true);
    } catch {
      sessionStorage.setItem(enabledKey, "false");
      syncButton(false);
    }
  }

  function pauseAudio() {
    audio.pause();
    sessionStorage.setItem(enabledKey, "false");
    syncButton(false);
  }

  function persistTime() {
    if (!Number.isNaN(audio.currentTime)) {
      sessionStorage.setItem(timeKey, String(audio.currentTime));
    }
  }

  const savedTime = Number(sessionStorage.getItem(timeKey));
  if (!Number.isNaN(savedTime) && savedTime > 0) {
    audio.currentTime = savedTime;
  }

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  });

  audio.volume = 0.45;
  syncButton(false);
  audio.addEventListener("timeupdate", persistTime);
  window.addEventListener("pagehide", persistTime);

  if (sessionStorage.getItem(enabledKey) === "true") {
    playAudio();
  }
}

function loadExternalScript(src, marker) {
  if (marker && window[marker]) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function setupLive2D() {
  if (window.matchMedia("(max-width: 900px)").matches) {
    return;
  }

  const shell = document.createElement("div");
  shell.className = "live2d-shell";
  shell.setAttribute("aria-hidden", "true");

  const stage = document.createElement("div");
  stage.className = "live2d-stage";
  shell.appendChild(stage);

  const status = document.createElement("div");
  status.className = "live2d-status";
  status.textContent = "看板娘加载中";
  stage.appendChild(status);

  const toggle = document.createElement("button");
  toggle.className = "live2d-toggle";
  toggle.type = "button";
  toggle.textContent = "隐藏";
  toggle.setAttribute("aria-pressed", "false");
  shell.appendChild(toggle);

  document.body.appendChild(shell);

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("mousemove", (event) => {
    const xRatio = event.clientX / window.innerWidth;
    const yRatio = event.clientY / window.innerHeight;
    targetX = (xRatio - 0.5) * 2;
    targetY = (yRatio - 0.5) * 2;
  });

  function animateShell() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    requestAnimationFrame(animateShell);
  }

  requestAnimationFrame(animateShell);

  toggle.addEventListener("click", () => {
    const hidden = shell.classList.toggle("is-hidden");
    toggle.textContent = hidden ? "显示" : "隐藏";
    toggle.setAttribute("aria-pressed", hidden ? "true" : "false");
  });

  try {
    await loadExternalScript("./vendor/pixi.min.js", "PIXI");
    await loadExternalScript("./vendor/live2dcubismcore.min.js", "Live2DCubismCore");
    await loadExternalScript("./vendor/pixi-live2d-cubism4.min.js");
  } catch (error) {
    status.textContent = "看板娘依赖错误";
    status.title = error?.message || "";
    return;
  }

  if (!window.PIXI || !window.PIXI.live2d || window.__AERTLY_LIVE2D_READY) {
    status.textContent = "看板娘运行库未就绪";
    return;
  }

  window.__AERTLY_LIVE2D_READY = true;

  const app = new window.PIXI.Application({
    width: 280,
    height: 420,
    transparent: true,
    antialias: true,
    autoStart: true
  });

  stage.appendChild(app.view);

  const { Live2DModel } = window.PIXI.live2d;
  let model;
  try {
    model = await Live2DModel.from("./lian-model/lian0.model3.json");
  } catch (error) {
    status.textContent = "看板娘模型错误";
    status.title = error?.message || "";
    return;
  }
  app.stage.addChild(model);
  status.style.display = "none";

  const scaleX = app.view.width / model.width;
  const scaleY = app.view.height / model.height;
  const scale = Math.min(scaleX, scaleY) * 0.9;
  model.scale.set(scale);
  model.x = app.view.width * 0.5;
  model.y = app.view.height * 0.98;
  model.anchor.set(0.5, 1);

  const coreModel = model.internalModel?.coreModel;
  const eyeBallXIndex = coreModel?.getParameterIndex?.("ParamEyeBallX");
  const eyeBallYIndex = coreModel?.getParameterIndex?.("ParamEyeBallY");
  const eyeLOpenIndex = coreModel?.getParameterIndex?.("ParamEyeLOpen");
  const eyeROpenIndex = coreModel?.getParameterIndex?.("ParamEyeROpen");
  const mouthOpenIndex = coreModel?.getParameterIndex?.("ParamMouthOpenY");
  const mouthFormIndex = coreModel?.getParameterIndex?.("ParamMouthForm");
  const blinkState = {
    timer: 0,
    nextBlinkAt: performance.now() + 1800 + Math.random() * 2200,
    progress: 1
  };

  app.ticker.add(() => {
    const now = performance.now();
    const deltaMs = app.ticker.deltaMS || 16.67;

    if (now >= blinkState.nextBlinkAt) {
      blinkState.timer += deltaMs;
      const cycle = 220;
      const t = Math.min(blinkState.timer / cycle, 1);
      blinkState.progress = t < 0.5 ? 1 - t * 2 : (t - 0.5) * 2;

      if (t >= 1) {
        blinkState.timer = 0;
        blinkState.progress = 1;
        blinkState.nextBlinkAt = now + 1800 + Math.random() * 2600;
      }
    } else {
      blinkState.progress = 1;
    }

    const mouthIdle = 0.08 + (Math.sin(now / 380) + 1) * 0.035;
    const mouthForm = Math.sin(now / 900) * 0.12;

    if (coreModel && eyeBallXIndex >= 0 && eyeBallYIndex >= 0) {
      coreModel.setParameterValueByIndex(eyeBallXIndex, currentX * 0.9);
      coreModel.setParameterValueByIndex(eyeBallYIndex, currentY * -0.9);
    } else if (typeof model.focus === "function") {
      model.focus(currentX * 0.35, -currentY * 0.35);
    }

    if (coreModel && eyeLOpenIndex >= 0) {
      coreModel.setParameterValueByIndex(eyeLOpenIndex, blinkState.progress);
    }

    if (coreModel && eyeROpenIndex >= 0) {
      coreModel.setParameterValueByIndex(eyeROpenIndex, blinkState.progress);
    }

    if (coreModel && mouthOpenIndex >= 0) {
      coreModel.setParameterValueByIndex(mouthOpenIndex, mouthIdle);
    }

    if (coreModel && mouthFormIndex >= 0) {
      coreModel.setParameterValueByIndex(mouthFormIndex, mouthForm);
    }
  });
}

function initPage() {
  const page = document.body.dataset.page;

  if (page === "home") {
    renderHome();
  }
  if (page === "essays") {
    renderEssays();
  }
  if (page === "projects") {
    renderProjects();
  }
  if (page === "about") {
    renderAbout();
  }
  if (page === "post") {
    renderPost();
  }
  if (page === "note") {
    renderNote();
  }

  setActiveNav();
  setupPetals();
  setupBgm();
  setupComments();
  setupReveal();
  setupLive2D();
}

initPage();
