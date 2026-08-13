/* =========================================================
   STREAMFLIXOR — FINAL SCRIPT
   Search • Navigation • My List • Demo Player • Mobile Menu
   Categories • Toasts • Profile • Smooth interactions
   ========================================================= */

"use strict";

/* =========================================================
   DATA
   ========================================================= */

const movies = [
  {
    title: "Neon District",
    genre: "Sci-Fi",
    year: "2026",
    rating: "8.7"
  },
  {
    title: "The Last Signal",
    genre: "Sci-Fi",
    year: "2025",
    rating: "8.4"
  },
  {
    title: "Wild Tide",
    genre: "Adventure",
    year: "2025",
    rating: "8.1"
  },
  {
    title: "After Midnight",
    genre: "Drama",
    year: "2026",
    rating: "8.6"
  },
  {
    title: "Parallel",
    genre: "Sci-Fi",
    year: "2025",
    rating: "9.0"
  }
];

const demoVideo =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

function showToast(message, icon = "✓") {
  let toast = $(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";

    toast.innerHTML = `
      <span class="toast-icon"></span>
      <span class="toast-message"></span>
    `;

    document.body.appendChild(toast);
  }

  const iconElement = $(".toast-icon", toast);
  const messageElement = $(".toast-message", toast);

  iconElement.textContent = icon;
  messageElement.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}


/* =========================================================
   VIDEO PLAYER
   ========================================================= */

let videoModal = null;
let videoElement = null;
let videoTitle = null;

function createVideoModal() {
  if ($(".video-modal")) {
    videoModal = $(".video-modal");
    videoElement = $("video", videoModal);
    videoTitle = $(".video-title", videoModal);
    return;
  }

  videoModal = document.createElement("div");

  videoModal.className = "video-modal";

  videoModal.innerHTML = `
    <div class="video-container">

      <button
        class="video-close"
        type="button"
        aria-label="Close video"
      >
        ×
      </button>

      <video
        controls
        playsinline
        preload="metadata"
      ></video>

      <div class="video-title">
        Streamflixor Demo
      </div>

    </div>
  `;

  document.body.appendChild(videoModal);

  videoElement = $("video", videoModal);
  videoTitle = $(".video-title", videoModal);

  $(".video-close", videoModal).addEventListener(
    "click",
    closeVideo
  );

  videoModal.addEventListener("click", event => {
    if (event.target === videoModal) {
      closeVideo();
    }
  });
}

function openVideo(title = "Streamflixor Demo") {
  createVideoModal();

  videoTitle.textContent = title;

  videoElement.src = demoVideo;

  videoModal.classList.add("open");

  document.body.classList.add("modal-open");

  videoElement.play().catch(() => {
    showToast("Tap the play button to start the demo", "▶");
  });
}

function closeVideo() {
  if (!videoModal) return;

  if (videoElement) {
    videoElement.pause();
    videoElement.removeAttribute("src");
    videoElement.load();
  }

  videoModal.classList.remove("open");

  document.body.classList.remove("modal-open");
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeVideo();
    closeSearch();
    closeMobileMenu();
  }
});


/* =========================================================
   PLAY BUTTONS
   ========================================================= */

function setupPlayButtons() {
  const selectors = [
    ".btn-primary",
    ".mini-play",
    "[data-play]",
    ".play-btn"
  ];

  selectors.forEach(selector => {
    $$(selector).forEach(button => {
      if (button.dataset.streamflixBound) return;

      button.dataset.streamflixBound = "true";

      button.addEventListener("click", event => {
        event.preventDefault();

        let title = "Streamflixor Demo";

        const card =
          button.closest(
            ".movie-card, .continue-card, .series-card"
          );

        if (card) {
          const titleElement =
            $("h3", card);

          if (titleElement) {
            title = titleElement.textContent.trim();
          }
        }

        openVideo(title);
      });
    });
  });
}


/* =========================================================
   MY LIST
   ========================================================= */

const LIST_KEY = "streamflixor_my_list";

function getMyList() {
  try {
    return JSON.parse(
      localStorage.getItem(LIST_KEY)
    ) || [];
  } catch {
    return [];
  }
}

function saveMyList(list) {
  localStorage.setItem(
    LIST_KEY,
    JSON.stringify(list)
  );
}

function setupMyList() {
  $$(".card-add").forEach(button => {

    if (button.dataset.listBound) return;

    button.dataset.listBound = "true";

    const card =
      button.closest(".movie-card");

    if (!card) return;

    const titleElement =
      $("h3", card);

    if (!titleElement) return;

    const title =
      titleElement.textContent.trim();

    updateListButton(button, title);

    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      let list = getMyList();

      const exists =
        list.includes(title);

      if (exists) {
        list = list.filter(
          item => item !== title
        );

        showToast(
          `${title} removed from My List`,
          "−"
        );
      } else {
        list.push(title);

        showToast(
          `${title} added to My List`,
          "+"
        );
      }

      saveMyList(list);

      updateListButton(button, title);
    });
  });
}

function updateListButton(button, title) {
  const list = getMyList();

  const saved =
    list.includes(title);

  button.classList.toggle(
    "saved",
    saved
  );

  button.textContent =
    saved ? "✓" : "+";

  button.setAttribute(
    "aria-label",
    saved
      ? `Remove ${title} from My List`
      : `Add ${title} to My List`
  );
}


/* =========================================================
   SEARCH
   ========================================================= */

let searchPanel = null;
let searchInput = null;
let searchResults = null;

function createSearchPanel() {
  if ($(".search-panel")) {
    searchPanel = $(".search-panel");
    searchInput = $("input", searchPanel);
    searchResults = $(".search-results", searchPanel);
    return;
  }

  searchPanel = document.createElement("div");

  searchPanel.className = "search-panel";

  searchPanel.innerHTML = `
    <div class="search-box">

      <span>⌕</span>

      <input
        type="search"
        placeholder="Search movies, series..."
        autocomplete="off"
      >

      <button
        type="button"
        class="search-close"
        aria-label="Close search"
      >
        ×
      </button>

    </div>

    <div class="search-results"></div>
  `;

  document.body.appendChild(searchPanel);

  searchInput =
    $("input", searchPanel);

  searchResults =
    $(".search-results", searchPanel);

  $(".search-close", searchPanel)
    .addEventListener(
      "click",
      closeSearch
    );

  searchInput.addEventListener(
    "input",
    handleSearch
  );

  searchPanel.addEventListener(
    "click",
    event => {
      if (event.target === searchPanel) {
        closeSearch();
      }
    }
  );
}

function openSearch() {
  createSearchPanel();

  searchPanel.classList.add("open");

  document.body.classList.add(
    "search-open"
  );

  setTimeout(() => {
    searchInput.focus();
  }, 100);
}

function closeSearch() {
  if (!searchPanel) return;

  searchPanel.classList.remove("open");

  document.body.classList.remove(
    "search-open"
  );
}

function handleSearch() {
  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  if (!query) {
    searchResults.innerHTML = `
      <div class="search-result">
        <div>
          <strong>Discover something new</strong>
          <small>Try searching for a movie or genre</small>
        </div>
      </div>
    `;

    return;
  }

  const results =
    movies.filter(movie =>
      `${movie.title} ${movie.genre}`
        .toLowerCase()
        .includes(query)
    );

  if (!results.length) {
    searchResults.innerHTML = `
      <div class="search-result">
        <div>
          <strong>No results found</strong>
          <small>Try another title or genre</small>
        </div>
      </div>
    `;

    return;
  }

  searchResults.innerHTML =
    results.map(movie => `
      <button
        class="search-result"
        type="button"
        data-search-title="${movie.title}"
      >
        <div>
          <strong>${movie.title}</strong>
          <small>
            ${movie.genre} • ${movie.year} • ★ ${movie.rating}
          </small>
        </div>

        <span>▶</span>
      </button>
    `).join("");

  $$(".search-result[data-search-title]")
    .forEach(result => {
      result.addEventListener(
        "click",
        () => {
          const title =
            result.dataset.searchTitle;

          closeSearch();

          openVideo(title);
        }
      );
    });
}

function setupSearchButton() {
  const buttons = [
    ".search-btn",
    "[data-search]",
    ".icon-btn"
  ];

  let found = false;

  buttons.forEach(selector => {
    $$(selector).forEach(button => {

      if (
        button.dataset.searchBound ||
        found && selector === ".icon-btn"
      ) {
        return;
      }

      const label =
        (
          button.getAttribute("aria-label") ||
          button.title ||
          button.textContent
        ).toLowerCase();

      const looksLikeSearch =
        label.includes("search") ||
        button.innerHTML.includes("⌕") ||
        button.innerHTML.includes("🔍");

      if (!looksLikeSearch) return;

      button.dataset.searchBound = "true";

      button.addEventListener(
        "click",
        event => {
          event.preventDefault();
          openSearch();
        }
      );

      found = true;
    });
  });
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {
  const toggle =
    $(".menu-toggle");

  const nav =
    $(".main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener(
    "click",
    event => {
      event.preventDefault();

      nav.classList.toggle(
        "mobile-open"
      );
    }
  );

  $$(".nav-link", nav)
    .forEach(link => {
      link.addEventListener(
        "click",
        () => {
          closeMobileMenu();
        }
      );
    });
}

function closeMobileMenu() {
  const nav =
    $(".main-nav");

  if (nav) {
    nav.classList.remove(
      "mobile-open"
    );
  }
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {
  $$(".nav-link").forEach(link => {

    if (link.dataset.navBound) return;

    link.dataset.navBound = "true";

    link.addEventListener(
      "click",
      event => {

        const href =
          link.getAttribute("href");

        if (
          !href ||
          href === "#" ||
          href.startsWith("javascript:")
        ) {
          event.preventDefault();

          const text =
            link.textContent
              .trim()
              .toLowerCase();

          handleNavigation(text);

          return;
        }

        if (href.startsWith("#")) {
          const target =
            $(href);

          if (target) {
            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth"
            });
          }
        }
      }
    );
  });
}

function handleNavigation(text) {

  const sections = {
    home: ".hero",
    movies: ".movie-grid",
    series: ".series-grid",
    categories: ".category-section"
  };

  const target =
    sections[text];

  if (target && $(target)) {
    $(target).scrollIntoView({
      behavior: "smooth"
    });

    return;
  }

  showToast(
    `${text.charAt(0).toUpperCase() + text.slice(1)} section`,
    "→"
  );
}


/* =========================================================
   MOBILE BOTTOM NAV
   ========================================================= */

function setupMobileNav() {
  $$(".mobile-nav-item")
    .forEach(item => {

      item.addEventListener(
        "click",
        event => {

          event.preventDefault();

          $$(".mobile-nav-item")
            .forEach(navItem => {
              navItem.classList.remove(
                "active"
              );
            });

          item.classList.add("active");

          const action =
            (
              item.dataset.action ||
              item.textContent
            )
              .trim()
              .toLowerCase();

          if (
            action.includes("home")
          ) {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }

          else if (
            action.includes("search")
          ) {
            openSearch();
          }

          else if (
            action.includes("list")
          ) {
            showMyList();
          }

          else if (
            action.includes("profile")
          ) {
            showProfile();
          }

          else {
            showToast(
              "Section selected",
              "✓"
            );
          }
        }
      );
    });
}


/* =========================================================
   MY LIST VIEW
   ========================================================= */

function showMyList() {
  const list = getMyList();

  if (!list.length) {
    showToast(
      "Your My List is empty",
      "+"
    );

    return;
  }

  showToast(
    `${list.length} title${list.length > 1 ? "s" : ""} in My List`,
    "✓"
  );
}


/* =========================================================
   PROFILE
   ========================================================= */

function showProfile() {
  showToast(
    "Profile: Adan",
    "A"
  );
}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategories() {
  $$(".category-item")
    .forEach(item => {

      if (item.dataset.categoryBound) {
        return;
      }

      item.dataset.categoryBound = "true";

      item.addEventListener(
        "click",
        event => {

          event.preventDefault();

          const category =
            item.textContent
              .trim()
              .replace(/→/g, "")
              .trim();

          showToast(
            `${category} selected`,
            "◆"
          );

          filterMovies(category);
        }
      );
    });
}

function filterMovies(category) {
  const cards =
    $$(".movie-card");

  if (!cards.length) return;

  let visible = 0;

  cards.forEach(card => {

    const text =
      card.textContent.toLowerCase();

    const match =
      category.toLowerCase() === "all" ||
      text.includes(
        category.toLowerCase()
      );

    card.style.display =
      match ? "" : "none";

    if (match) visible++;
  });

  if (!visible) {
    cards.forEach(card => {
      card.style.display = "";
    });

    showToast(
      `Showing titles for ${category}`,
      "◆"
    );
  }
}


/* =========================================================
   VIEW ALL BUTTONS
   ========================================================= */

function setupViewAll() {
  $$(".view-all").forEach(button => {

    if (button.dataset.viewBound) return;

    button.dataset.viewBound = "true";

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        const section =
          button.closest(
            ".content-section"
          );

        if (section) {
          const cards =
            $$(".movie-card, .series-card", section);

          cards.forEach(card => {
            card.style.display = "";
          });
        }

        showToast(
          "More titles loaded",
          "＋"
        );
      }
    );
  });
}


/* =========================================================
   PROFILE BUTTON
   ========================================================= */

function setupProfile() {
  $$(".profile-btn").forEach(button => {

    button.addEventListener(
      "click",
      event => {
        event.preventDefault();

        showProfile();
      }
    );
  });
}


/* =========================================================
   CARD CLICK
   ========================================================= */

function setupMovieCards() {
  $$(".movie-card, .series-card")
    .forEach(card => {

      if (card.dataset.cardBound) return;

      card.dataset.cardBound = "true";

      card.addEventListener(
        "click",
        event => {

          if (
            event.target.closest(
              ".card-add, button, a"
            )
          ) {
            return;
          }

          const titleElement =
            $("h3", card);

          const title =
            titleElement
              ? titleElement.textContent.trim()
              : "Streamflixor Demo";

          openVideo(title);
        }
      );
    });
}


/* =========================================================
   HEADER SCROLL EFFECT
   ========================================================= */

function setupHeaderScroll() {
  const header =
    $(".site-header");

  if (!header) return;

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {

      if (ticking) return;

      window.requestAnimationFrame(
        () => {

          if (window.scrollY > 35) {
            header.style.background =
              "rgba(7, 26, 31, 0.94)";
          } else {
            header.style.background =
              "rgba(7, 26, 31, 0.78)";
          }

          ticking = false;
        }
      );

      ticking = true;
    },
    { passive: true }
  );
}


/* =========================================================
   ACTIVE NAV ON SCROLL
   ========================================================= */

function setupScrollSpy() {
  const sections = [
    {
      selector: ".hero",
      name: "Home"
    },
    {
      selector: ".movie-grid",
      name: "Movies"
    },
    {
      selector: ".series-grid",
      name: "Series"
    },
    {
      selector: ".category-section",
      name: "Categories"
    }
  ];

  window.addEventListener(
    "scroll",
    () => {

      let current = null;

      sections.forEach(section => {

        const element =
          $(section.selector);

        if (!element) return;

        const rect =
          element.getBoundingClientRect();

        if (
          rect.top <= 180 &&
          rect.bottom >= 180
        ) {
          current = section.name;
        }
      });

      if (!current) return;

      $$(".nav-link").forEach(link => {

        link.classList.toggle(
          "active",
          link.textContent
            .trim()
            .toLowerCase() ===
            current.toLowerCase()
        );
      });
    },
    { passive: true }
  );
}


/* =========================================================
   IMAGE ERROR FALLBACK
   ===================================================== */

function setupImageFallbacks() {
  $$("img").forEach(image => {

    image.addEventListener(
      "error",
      () => {
        image.style.display = "none";
      },
      { once: true }
    );
  });
}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeStreamflixor() {

  createVideoModal();

  setupPlayButtons();

  setupMyList();

  setupSearchButton();

  setupMobileMenu();

  setupNavigation();

  setupMobileNav();

  setupCategories();

  setupViewAll();

  setupProfile();

  setupMovieCards();

  setupHeaderScroll();

  setupScrollSpy();

  setupImageFallbacks();

  console.log(
    "Streamflixor initialized successfully."
  );
}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeStreamflixor
  );
} else {
  initializeStreamflixor();
           }
