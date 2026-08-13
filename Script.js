/* =========================================================
   STREAMFLIXOR — script.js
   Complete frontend interaction system
   ========================================================= */

"use strict";

/* ================= ELEMENTS ================= */

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchToggle = document.querySelector(".search-toggle");
const closeSearch = document.getElementById("closeSearch");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const navLinks = document.querySelectorAll(".nav-link");
const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

const movieCards = [...document.querySelectorAll(".movie-card")];
const categoryItems = document.querySelectorAll(".category-item");
const addButtons = document.querySelectorAll(".card-add, .add-btn");
const playButtons = document.querySelectorAll(".play-btn, .mini-play");

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

const mobileSearch = document.querySelector(".mobile-search");
const mobileProfile = document.querySelector(".mobile-profile");
const profileButton = document.querySelector(".profile-btn");


/* ================= APP STATE ================= */

const appState = {
  myList: JSON.parse(localStorage.getItem("streamflixorMyList") || "[]"),
  searchOpen: false,
  toastTimer: null
};


/* ================= CONTENT DATA ================= */

const catalog = [
  {
    title: "Beyond The Horizon",
    category: "Sci-Fi",
    year: "2026",
    rating: "8.7"
  },
  {
    title: "Neon District",
    category: "Action",
    year: "2026",
    rating: "8.5"
  },
  {
    title: "The Last Signal",
    category: "Sci-Fi",
    year: "2026",
    rating: "8.9"
  },
  {
    title: "Wild Tide",
    category: "Adventure",
    year: "2025",
    rating: "8.2"
  },
  {
    title: "After Midnight",
    category: "Drama",
    year: "2026",
    rating: "8.6"
  },
  {
    title: "Parallel",
    category: "Sci-Fi",
    year: "2025",
    rating: "9.0"
  },
  {
    title: "City of Echoes",
    category: "Drama",
    year: "2026",
    rating: "8.8"
  },
  {
    title: "Black Meridian",
    category: "Action",
    year: "2026",
    rating: "8.4"
  },
  {
    title: "Northbound",
    category: "Drama",
    year: "2026",
    rating: "9.1"
  },
  {
    title: "Frequency",
    category: "Sci-Fi",
    year: "2026",
    rating: "8.8"
  },
  {
    title: "Glass House",
    category: "Drama",
    year: "2025",
    rating: "8.9"
  }
];


/* ================= STORAGE ================= */

function saveMyList() {
  localStorage.setItem(
    "streamflixorMyList",
    JSON.stringify(appState.myList)
  );
}


/* ================= TOAST ================= */

function showToast(message) {
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;

  toast.classList.add("show");

  clearTimeout(appState.toastTimer);

  appState.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}


/* ================= SEARCH ================= */

function openSearch() {
  if (!searchPanel) return;

  appState.searchOpen = true;

  searchPanel.classList.add("open");
  document.body.classList.add("search-open");

  setTimeout(() => {
    searchInput?.focus();
  }, 100);

  renderSearchResults("");
}


function closeSearchPanel() {
  if (!searchPanel) return;

  appState.searchOpen = false;

  searchPanel.classList.remove("open");
  document.body.classList.remove("search-open");

  if (searchInput) {
    searchInput.value = "";
  }

  if (searchResults) {
    searchResults.innerHTML = "";
  }
}


function renderSearchResults(query) {
  if (!searchResults) return;

  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) {
    searchResults.innerHTML = `
      <div class="search-result">
        <div>
          <strong>Explore Streamflixor</strong>
          <small>Search movies, series and genres</small>
        </div>
        <span>⌕</span>
      </div>
    `;

    return;
  }

  const matches = catalog.filter(item => {
    return (
      item.title.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery)
    );
  });

  if (!matches.length) {
    searchResults.innerHTML = `
      <div class="search-result">
        <div>
          <strong>No results found</strong>
          <small>Try another movie, series or genre.</small>
        </div>
        <span>×</span>
      </div>
    `;

    return;
  }

  searchResults.innerHTML = matches
    .map(item => `
      <button
        class="search-result"
        type="button"
        data-search-title="${escapeHTML(item.title)}"
      >
        <div>
          <strong>${escapeHTML(item.title)}</strong>
          <small>
            ${escapeHTML(item.category)}
            · ${escapeHTML(item.year)}
          </small>
        </div>

        <span>★ ${escapeHTML(item.rating)}</span>
      </button>
    `)
    .join("");
}


function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


searchInput?.addEventListener("input", event => {
  renderSearchResults(event.target.value);
});


searchToggle?.addEventListener("click", openSearch);
mobileSearch?.addEventListener("click", openSearch);
closeSearch?.addEventListener("click", closeSearchPanel);


searchPanel?.addEventListener("click", event => {
  const result = event.target.closest("[data-search-title]");

  if (!result) return;

  const title = result.dataset.searchTitle;

  closeSearchPanel();

  showToast(`${title} selected`);
});


document.addEventListener("keydown", event => {
  if (event.key === "Escape" && appState.searchOpen) {
    closeSearchPanel();
  }

  if (
    event.key === "/" &&
    document.activeElement !== searchInput
  ) {
    event.preventDefault();
    openSearch();
  }
});


/* ================= MY LIST ================= */

function isInMyList(title) {
  return appState.myList.some(
    item => item.toLowerCase() === title.toLowerCase()
  );
}


function toggleMyList(title) {
  const existingIndex = appState.myList.findIndex(
    item => item.toLowerCase() === title.toLowerCase()
  );

  if (existingIndex === -1) {
    appState.myList.push(title);
    showToast(`${title} added to your list`);
  } else {
    appState.myList.splice(existingIndex, 1);
    showToast(`${title} removed from your list`);
  }

  saveMyList();
  updateListButtons();
}


function updateListButtons() {
  addButtons.forEach(button => {
    const title = button.dataset.title;

    if (!title) return;

    const saved = isInMyList(title);

    button.classList.toggle("saved", saved);

    if (button.classList.contains("add-btn")) {
      button.innerHTML = saved
        ? "<span>✓</span> In My List"
        : "<span>＋</span> My List";
    } else {
      button.textContent = saved ? "✓" : "+";
      button.setAttribute(
        "aria-label",
        saved
          ? `Remove ${title} from list`
          : `Add ${title} to list`
      );
    }
  });
}


addButtons.forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation();

    const title = button.dataset.title;

    if (title) {
      toggleMyList(title);
    }
  });
});


/* ================= PLAY ACTION ================= */

playButtons.forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();

    const title =
      button.dataset.title ||
      button.closest(".continue-card")?.querySelector("h3")?.textContent ||
      "Selected title";

    showToast(`Playing ${title}`);
  });
});


/* ================= MOVIE CARD ================= */

movieCards.forEach(card => {
  card.addEventListener("click", event => {
    if (event.target.closest(".card-add")) return;

    const title = card.dataset.title || "Movie";

    showToast(`${title} selected`);
  });
});


/* ================= CATEGORY FILTER ================= */

categoryItems.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    if (!category) return;

    const matchingCards = movieCards.filter(card => {
      return card.dataset.category === category;
    });

    movieCards.forEach(card => {
      card.style.display = "none";
    });

    matchingCards.forEach(card => {
      card.style.display = "";
    });

    document.getElementById("movies")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    showToast(
      matchingCards.length
        ? `${category} titles displayed`
        : `No ${category} titles available`
    );
  });
});


/* ================= VIEW ALL ================= */

document.querySelectorAll(".view-all").forEach(button => {
  button.addEventListener("click", () => {
    movieCards.forEach(card => {
      card.style.display = "";
    });

    document.getElementById("movies")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    showToast("Showing all available titles");
  });
});


/* ================= DESKTOP NAV ================= */

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(item => {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});


/* ================= MOBILE NAV ================= */

mobileNavItems.forEach(item => {
  item.addEventListener("click", () => {
    mobileNavItems.forEach(navItem => {
      navItem.classList.remove("active");
    });

    item.classList.add("active");
  });
});


/* ================= MOBILE MENU ================= */

menuToggle?.addEventListener("click", () => {
  mainNav?.classList.toggle("mobile-open");

  const opened = mainNav?.classList.contains("mobile-open");

  menuToggle.setAttribute(
    "aria-expanded",
    opened ? "true" : "false"
  );
});


/* ================= PROFILE ================= */

function openProfile() {
  showToast("Profile section coming up");
}

profileButton?.addEventListener("click", openProfile);
mobileProfile?.addEventListener("click", openProfile);


/* ================= ACTIVE SECTION ================= */

const sections = document.querySelectorAll(
  "main section[id]"
);

const sectionObserver = new IntersectionObserver(
  entries => {
    const visibleSections = entries
      .filter(entry => entry.isIntersecting)
      .sort(
        (a, b) =>
          b.intersectionRatio - a.intersectionRatio
      );

    if (!visibleSections.length) return;

    const currentId = visibleSections[0].target.id;

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`
      );
    });

    mobileNavItems.forEach(item => {
      const href = item.getAttribute("href");

      if (!href) return;

      item.classList.toggle(
        "active",
        href === `#${currentId}`
      );
    });
  },
  {
    threshold: [0.2, 0.5],
    rootMargin: "-15% 0px -55% 0px"
  }
);


sections.forEach(section => {
  sectionObserver.observe(section);
});


/* ================= HEADER SCROLL ================= */

const header = document.querySelector(".site-header");

let lastScroll = 0;

window.addEventListener(
  "scroll",
  () => {
    const currentScroll = window.scrollY;

    if (!header) return;

    if (currentScroll > 50) {
      header.style.background =
        "rgba(7, 26, 31, 0.88)";
      header.style.borderColor =
        "rgba(237, 247, 243, 0.12)";
    } else {
      header.style.background =
        "rgba(7, 26, 31, 0.65)";
      header.style.borderColor =
        "rgba(237, 247, 243, 0.08)";
    }

    lastScroll = currentScroll;
  },
  { passive: true }
);


/* ================= HERO INDICATORS ================= */

const indicators = document.querySelectorAll(
  ".indicator-line"
);

indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    indicators.forEach(item => {
      item.classList.remove("active");
    });

    indicator.classList.add("active");

    const messages = [
      "Beyond The Horizon",
      "Discover something new",
      "Trending stories",
      "Your next adventure"
    ];

    showToast(messages[index] || "Featured selection");
  });
});


/* ================= INITIALIZATION ================= */

updateListButtons();

console.log(
  "%cStreamflixor initialized successfully.",
  "font-weight:700;"
);
