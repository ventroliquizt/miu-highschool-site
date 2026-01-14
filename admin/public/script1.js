// script.js
// Use as a module on your pages: <script type="module" src="script.js"></script>

// OPTIONAL: Supabase client (you can use this later for admin / dynamic content)
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://gqijcqlcbxjdomnxdgqo.supabase.co";
const supabaseAnonKey = "sb_publishable_De6Dm-ymyjooI42AxTrkzA_XpujVxrn";

document.addEventListener("DOMContentLoaded", () => {
  loadHomeBanner();
});

async function loadHomeBanner() {
  try {
    const res = await fetch("http://localhost:3001/api/banner/home");
    const data = await res.json();

    console.log("Banner data:", data); // debug (important)

    const titleEl = document.getElementById("banner-title");
    const subtitleEl = document.getElementById("banner-subtitle");
    const imageEl = document.getElementById("banner-image");

    if (!titleEl || !subtitleEl || !imageEl) {
      console.error("Banner DOM elements missing");
      return;
    }

    titleEl.textContent = data.title;
    subtitleEl.textContent = data.content;
    imageEl.src = "http://localhost:3001" + data.imageUrl;
  } catch (err) {
    console.error("Failed to load home banner:", err);
  }
}



// Rotating hero text values
const heroMessages = [
  "academic excellence is just the start.",
  "Empowering Students Every Day",
  "Learn, Grow, Succeed",
  "Join Our Amazing Community"
];

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarToggle();
  setupHeroRotatingText();
  setupGlanceSlider();
  setupInfoSectionObserver();
  // OPTIONAL: load dynamic text from Supabase
  // loadHeroTextFromSupabase();
});

/* ============ Navbar Toggle (Mobile) ============ */
function setupNavbarToggle() {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.querySelector(".navbar");
  if (!menuToggle || !navbar) return;

  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
}

/* ============ Hero Rotating Text ============ */
function setupHeroRotatingText() {
  const heroTextEl = document.getElementById("hero-text");
  if (!heroTextEl) return;

  let index = 0;
  heroTextEl.textContent = heroMessages[index];

  setInterval(() => {
    heroTextEl.style.opacity = 0;

    setTimeout(() => {
      index = (index + 1) % heroMessages.length;
      heroTextEl.textContent = heroMessages[index];
      heroTextEl.style.opacity = 1;
    }, 400);
  }, 2500);
}

/* ============ "MIS at a Glance" Slider ============ */
function setupGlanceSlider() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let idx = 0;

  slides.forEach((s) => s.classList.remove("active"));
  slides[idx].classList.add("active");

  setInterval(() => {
    slides[idx].classList.remove("active");
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add("active");
  }, 3000);
}

/* ============ Info Section Fade-In on Scroll ============ */
function setupInfoSectionObserver() {
  const infoSections = document.querySelectorAll(".info-section");
  if (!infoSections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );

  infoSections.forEach((section) => {
    section.classList.add("hidden");
    observer.observe(section);
  });
}

/* ============ OPTIONAL: Supabase Example ============ */
// Example: load hero content from Supabase table "MIS-school-website" where section='hero'
async function loadHeroTextFromSupabase() {
  const heroTextEl = document.getElementById("hero-text");
  if (!heroTextEl) return;

  const { data, error } = await supabase
    .from("MIS-school-website")
    .select("*")
    .eq("section", "hero")
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  if (data && data.content) {
    heroTextEl.textContent = data.content;
  }
}
async function loadArticles(page, containerId) {
  const res = await fetch(`http://localhost:3001/articles/${page}`);
  const articles = await res.json();

  let html = "";
  for (let a of articles) {
    html += `
      <div class="article-box">
        <h3>${a.title}</h3>
        <p>${a.content}</p>
        ${a.image ? `<img src="http://localhost:3001/uploads/${a.image}" />` : ""}
      </div>
    `;
  }

  document.getElementById(containerId).innerHTML = html;
}

/* ================================
   HOME PAGE BANNER (CMS CONTROLLED)
================================ */

let bannerData = null;

// =======================
// CONFIG
// =======================
const API_BASE = "http://localhost:3001";

// =======================
// HOME BANNER
// =======================
 async function loadHomeBanner() {
  try {
    const res = await fetch(`${API_BASE}/api/banner/home`);
    const banner = await res.json();

    if (!banner) return;

    document.getElementById("banner-image").src =
      `${API_BASE}${banner.imageUrl}`;

    document.getElementById("banner-title").textContent =
      banner.title || "";

    document.getElementById("banner-subtitle").textContent =
      banner.content || "";

  } catch (err) {
    console.error("Failed to load home banner:", err);
  }
}

// =======================
// ARTICLES
// =======================
 async function loadArticles(section, containerId) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;

    const res = await fetch(`${API_BASE}/api/articles?section=${section}`);
    const articles = await res.json();

    container.innerHTML = articles
      .map(
        a => `
        <article>
          <h3>${a.title}</h3>
          <p>${a.content}</p>
        </article>
      `
      )
      .join("");

  } catch (err) {
    console.error("Failed to load articles:", err);
  }
}


// =======================
// HOME BANNER
// =======================
 async function loadHomeBanner() {
  try {
    const res = await fetch("http://localhost:3001/api/banner/home");
    const banner = await res.json();

    const img = document.getElementById("banner-image");
    const title = document.getElementById("banner-title");
    const subtitle = document.getElementById("banner-subtitle");

    if (!img || !title || !subtitle) {
      console.error("Banner elements missing");
      return;
    }

    title.textContent = banner.title || "";
    subtitle.textContent = banner.content || "";

    if (banner.imageUrl) {
      img.src = "http://localhost:3001" + banner.imageUrl;
    }
  } catch (err) {
    console.error("Failed to load banner", err);
  }
}


// =======================
// ARTICLES
// =======================
 async function loadArticles(section, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const res = await fetch(`${API_BASE}/api/banner/home`);
  const articles = await res.json();

  container.innerHTML = articles
    .map(a => `<h3>${a.title}</h3><p>${a.content}</p>`)
    .join("");
}

console.log("script loaded");


document.addEventListener("DOMContentLoaded", () => {
  loadHomeBanner();
});

async function loadHomeBanner() {
  const res = await fetch(`${API_BASE}/api/banner/home`);
  const banner = await res.json();

  document.getElementById("banner-image").src =
    API_BASE + banner.imageUrl;

  document.getElementById("banner-title").textContent =
    banner.title;

  document.getElementById("banner-subtitle").textContent =
    banner.content;
}
