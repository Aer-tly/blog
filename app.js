const content = window.blogContent;
document.documentElement.classList.add("js-ready");

const DEFAULT_COMMENT_AVATAR = "./default-avatar.svg";

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

  document.title = "Aertly";

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

  document.title = "Aertly";

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
  const replyPrefix = "[[AERTLY_REPLY]]";
  const replySuffix = "[[/AERTLY_REPLY]]";
  let replyTarget = null;
  let renderedComments = [];
  const submitButton = form.querySelector('button[type="submit"]');
  const bodyInput = byId("comment-body");
  const defaultBodyPlaceholder = bodyInput ? bodyInput.placeholder : "";

  const replyingBar = document.createElement("div");
  replyingBar.className = "comment-replying is-hidden";
  form.insertBefore(replyingBar, form.firstChild);

  function makeCommentId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function packCommentBody(rawBody, replyTo) {
    if (!replyTo) {
      return rawBody;
    }
    const payload = JSON.stringify({
      id: replyTo.id,
      name: replyTo.name
    });
    return `${replyPrefix}${payload}${replySuffix}${rawBody}`;
  }

  function unpackCommentBody(storedBody) {
    if (typeof storedBody !== "string") {
      return { body: "", replyTo: null };
    }
    if (!storedBody.startsWith(replyPrefix)) {
      return { body: storedBody, replyTo: null };
    }
    const suffixIndex = storedBody.indexOf(replySuffix);
    if (suffixIndex < 0) {
      return { body: storedBody, replyTo: null };
    }

    const metadataRaw = storedBody.slice(replyPrefix.length, suffixIndex);
    try {
      const metadata = JSON.parse(metadataRaw);
      return {
        body: storedBody.slice(suffixIndex + replySuffix.length),
        replyTo: metadata && metadata.id && metadata.name ? metadata : null
      };
    } catch {
      return { body: storedBody, replyTo: null };
    }
  }

  function setReplyTarget(comment) {
    replyTarget = comment;
    if (!comment) {
      replyingBar.classList.add("is-hidden");
      replyingBar.innerHTML = "";
      if (bodyInput) {
        bodyInput.placeholder = defaultBodyPlaceholder;
      }
      if (submitButton) {
        submitButton.textContent = "发布评论";
      }
      return;
    }
    replyingBar.classList.remove("is-hidden");
    replyingBar.innerHTML = `
      <span>正在回复 <strong>${comment.name}</strong></span>
      <button type="button" class="comment-reply-cancel">取消</button>
    `;
    if (bodyInput) {
      bodyInput.placeholder = `回复 ${comment.name}...`;
      bodyInput.focus();
    }
    if (submitButton) {
      submitButton.textContent = "发送回复";
    }
  }

  replyingBar.addEventListener("click", (event) => {
    const cancelBtn = event.target.closest(".comment-reply-cancel");
    if (!cancelBtn) {
      return;
    }
    setReplyTarget(null);
  });

  function readComments() {
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return raw.map((item) => {
        const parsed = unpackCommentBody(item.body || "");
        return {
          id: item.id || makeCommentId(),
          name: item.name,
          email: item.email,
          avatar: item.avatar || DEFAULT_COMMENT_AVATAR,
          body: parsed.replyTo && !item.replyTo ? parsed.body : (item.body || ""),
          replyTo: item.replyTo || parsed.replyTo || null,
          createdAt: item.createdAt || new Date().toLocaleString("zh-CN")
        };
      });
    } catch {
      return [];
    }
  }

  function writeComments(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  function createCommentMarkup(comment) {
    const replyRef = comment.replyTo
      ? `<p class="comment-reply-ref">回复 ${comment.replyTo.name}</p>`
      : "";
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
        ${replyRef}
        <p>${comment.body}</p>
        <div class="comment-actions">
          <button type="button" class="comment-reply-btn" data-reply-id="${comment.id}">回复</button>
        </div>
      </div>
    `;
  }

  function arrangeThread(comments) {
    const byId = new Map();
    const repliesByParent = new Map();
    const rootComments = [];

    comments.forEach((item) => {
      byId.set(item.id, item);
    });

    comments.forEach((item) => {
      const parentId = item.replyTo?.id;
      if (!parentId || !byId.has(parentId)) {
        rootComments.push(item);
        return;
      }
      const bucket = repliesByParent.get(parentId) || [];
      bucket.push(item);
      repliesByParent.set(parentId, bucket);
    });

    const threaded = [];
    rootComments.forEach((root) => {
      threaded.push({ ...root, depth: 0 });
      const replies = repliesByParent.get(root.id) || [];
      replies.forEach((reply) => {
        threaded.push({ ...reply, depth: 1 });
      });
    });

    return threaded;
  }

  function renderComments(comments) {
    list.innerHTML = "";
    renderedComments = comments;

    if (!comments.length) {
      list.innerHTML = '<p class="comment-empty">还没有评论，来留下第一条吧。</p>';
      return;
    }

    const threadedComments = arrangeThread(comments);
    threadedComments.forEach((comment) => {
      const article = document.createElement("article");
      article.className = comment.depth > 0 ? "comment-item is-reply" : "comment-item";
      article.innerHTML = createCommentMarkup(comment);
      list.appendChild(article);
    });
  }

  list.addEventListener("click", (event) => {
    const replyBtn = event.target.closest(".comment-reply-btn");
    if (!replyBtn) {
      return;
    }
    const targetId = replyBtn.dataset.replyId;
    const target = renderedComments.find((item) => item.id === targetId);
    if (!target) {
      return;
    }
    setReplyTarget(target);
  });

  async function loadComments() {
    if (!supabaseClient) {
      renderComments(readComments());
      return;
    }

    const { data, error } = await supabaseClient
      .from(tableName)
      .select("id,name,email,avatar,body,created_at")
      .eq("entity_type", page)
      .eq("entity_slug", slug)
      .order("created_at", { ascending: false });

    if (error) {
      renderComments(readComments());
      return;
    }

    const comments = (data || []).map((item) => {
      const parsed = unpackCommentBody(item.body);
      return {
        id: item.id || makeCommentId(),
        name: item.name,
        email: item.email,
        avatar: item.avatar || DEFAULT_COMMENT_AVATAR,
        body: parsed.body,
        replyTo: parsed.replyTo,
        createdAt: new Date(item.created_at).toLocaleString("zh-CN")
      };
    });
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
      id: makeCommentId(),
      name,
      email,
      avatar: avatarInput || DEFAULT_COMMENT_AVATAR,
      body,
      replyTo: replyTarget ? { id: replyTarget.id, name: replyTarget.name } : null,
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
          avatar: avatarInput || DEFAULT_COMMENT_AVATAR,
          body: packCommentBody(body, comment.replyTo)
        });

      if (!error) {
        form.reset();
        setReplyTarget(null);
        loadComments();
        return;
      }
    }

    const comments = readComments();
    comments.unshift(comment);
    writeComments(comments);
    form.reset();
    setReplyTarget(null);
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

  const hiddenStateKey = "aertly-live2d-hidden";
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
  shell.appendChild(toggle);

  const isHidden = localStorage.getItem(hiddenStateKey) === "true";
  if (isHidden) {
    shell.classList.add("is-hidden");
    toggle.textContent = "显示";
  }

  document.body.appendChild(shell);

  toggle.addEventListener("click", () => {
    const hidden = shell.classList.toggle("is-hidden");
    toggle.textContent = hidden ? "显示" : "隐藏";
    localStorage.setItem(hiddenStateKey, hidden ? "true" : "false");
  });

  try {
    await loadExternalScript("./vendor/pixi.min.js", "PIXI");
    await loadExternalScript("./vendor/live2dcubismcore.min.js", "Live2DCubismCore");
    await loadExternalScript("./vendor/pixi-live2d-cubism4.min.js");
  } catch (error) {
    status.textContent = "依赖加载失败";
    return;
  }

  if (!window.PIXI || !window.PIXI.live2d) {
    return;
  }

  const app = new PIXI.Application({
    width: 280,
    height: 420,
    transparent: true,
    antialias: true,
    autoStart: true
  });
  stage.appendChild(app.view);

  const modelConfigPath = "./shimakaze-model/shimakaze.model3.json";
  const modelBasePath = modelConfigPath.slice(0, modelConfigPath.lastIndexOf("/") + 1);
  const encodeAssetPath = (path) => path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const makeAssetUrl = (path) => `${modelBasePath}${encodeAssetPath(path)}`;
  let modelConfig;
  try {
    const response = await fetch(modelConfigPath);
    if (!response.ok) {
      throw new Error("failed to read model config");
    }
    modelConfig = await response.json();
  } catch (error) {
    status.textContent = "模型配置读取失败";
    return;
  }

  const { Live2DModel } = PIXI.live2d;
  let model;
  const motionGroups = modelConfig?.FileReferences?.Motions || {};
  const hitAreas = modelConfig?.HitAreas || [];
  const normalizedConfig = structuredClone(modelConfig);
  const refs = normalizedConfig?.FileReferences || {};
  const normalizedMotions = refs?.Motions || {};

  if (typeof refs.Moc === "string") {
    refs.Moc = makeAssetUrl(refs.Moc);
  }
  if (Array.isArray(refs.Textures)) {
    refs.Textures = refs.Textures.map((item) => (typeof item === "string" ? makeAssetUrl(item) : item));
  }
  if (typeof refs.Physics === "string") {
    refs.Physics = makeAssetUrl(refs.Physics);
  }
  if (refs.PhysicsV2 && typeof refs.PhysicsV2.File === "string") {
    refs.PhysicsV2.File = makeAssetUrl(refs.PhysicsV2.File);
  }
  Object.values(normalizedMotions).forEach((group) => {
    if (!Array.isArray(group)) {
      return;
    }
    group.forEach((motion) => {
      if (typeof motion?.File === "string") {
        motion.File = makeAssetUrl(motion.File);
      }
      if (typeof motion?.Sound === "string") {
        motion.Sound = makeAssetUrl(motion.Sound);
      }
    });
  });

  const normalizedConfigUrl = URL.createObjectURL(new Blob(
    [JSON.stringify(normalizedConfig)],
    { type: "application/json" }
  ));
  const preferredIdleGroup = ["Idle#1", "Idle"].find((name) => Array.isArray(motionGroups[name]) && motionGroups[name].length > 0);
  const fallbackIdleGroup = Object.keys(motionGroups).find((name) => {
    const group = motionGroups[name];
    return Array.isArray(group) && group.length > 0 && group.every((motion) => motion && motion.FileLoop === true);
  });
  const idleMotionGroup = preferredIdleGroup || fallbackIdleGroup;

  try {
    model = await Live2DModel.from(normalizedConfigUrl, {
      idleMotionGroup,
      autoInteract: hitAreas.some((area) => typeof area?.Motion === "string" && area.Motion.length > 0)
    });
  } catch (error) {
    URL.revokeObjectURL(normalizedConfigUrl);
    status.textContent = "模型加载失败";
    return;
  }
  URL.revokeObjectURL(normalizedConfigUrl);

  app.stage.addChild(model);
  status.style.display = "none";

  const updateLayout = () => {
    if (model.width > 0) {
      const scale = Math.min(app.view.width / model.width, app.view.height / model.height) * 0.95;
      model.scale.set(scale);
      model.anchor.set(0.5, 1);
      model.x = app.view.width / 2;
      model.y = app.view.height;
    }
  };
  
  updateLayout();
  model.on("load", updateLayout);

  app.view.addEventListener("click", (event) => {
    const rect = app.view.getBoundingClientRect();
    model.tap(event.clientX - rect.left, event.clientY - rect.top);
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
