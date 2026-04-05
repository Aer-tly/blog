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

function createTopicCard(topic) {
  const wrapper = document.createElement("article");
  wrapper.className = "topic-item";
  wrapper.setAttribute("data-reveal", "");
  wrapper.innerHTML = `
    <h3>${topic.name}</h3>
    <p>${topic.description}</p>
    <div class="topic-badges">
      ${renderTags(topic.badges)}
    </div>
  `;
  return wrapper;
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
  return;
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
  setupReveal();
}

initPage();
