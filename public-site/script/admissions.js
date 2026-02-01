const API_BASE = "http://localhost:3001";


document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 120,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  updateBreadcrumb();
  
  function updateBreadcrumb() {
    const breadcrumbLinks = document.querySelector('.breadcrumb-links');
    if (!breadcrumbLinks) return;
    
    const currentPage = window.location.pathname.split('/').pop();
    let pageName = 'Home';
    
    switch(currentPage) {
      case 'programs.html':
        pageName = 'Programs';
        break;
      case 'admissions.html':
        pageName = 'Admissions';
        break;
      case 'information.html':
        pageName = 'Information';
        break;
      case 'contact.html':
        pageName = 'Contact';
        break;
      default:
        pageName = 'Home';
    }
    
    breadcrumbLinks.innerHTML = `
      <a href="index.html">Home</a>
      ${currentPage !== 'index.html' ? '<span>›</span>' : ''}
      ${currentPage !== 'index.html' ? `<span>${pageName}</span>` : ''}
    `;
  }
  
  document.querySelectorAll('.news-toggle').forEach(button => {
    button.addEventListener('click', function() {
      const newsCard = this.closest('.news-card');
      newsCard.classList.toggle('expanded');
      this.textContent = newsCard.classList.contains('expanded') ? 
        'Show Less' : 'Learn More';
    });
  });
});

async function loadBanner() {
  try {
    const API_BASE = "http://localhost:3001";

    const res = await fetch(`${API_BASE}/api/banner`);
    const data = await res.json();

    const header = document.querySelector(".page-header");
    if (!header || !data.imageUrl) return;

    // If backend returns "/uploads/xxx.jpg", make it absolute
    const imgUrl = data.imageUrl.startsWith("http")
      ? data.imageUrl
      : `${API_BASE}${data.imageUrl}`;

    // Cache-bust so replacing the same filename updates immediately
    header.style.backgroundImage = `url("${imgUrl}?v=${Date.now()}")`;
  } catch (err) {
    console.error("Banner failed to load", err);
  }
}


const API = "http://localhost:3001"; // change to Render URL when deployed

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadAdmissionsProcess() {
  const titleEl = document.getElementById("process-title");
  const subEl = document.getElementById("process-subtitle");
  const stepsEl = document.getElementById("process-steps");
  if (!stepsEl) return;

  try {
    const res = await fetch(`${API}/api/process`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (titleEl) titleEl.textContent = data.title || "";
    if (subEl) subEl.textContent = data.subtitle || "";

    const steps = Array.isArray(data.steps) ? data.steps : [];

    stepsEl.innerHTML = steps
      .map((st, idx) => {
        const bullets = Array.isArray(st.bullets) ? st.bullets : [];
        return `
          <div class="process-step">
            <div class="step-number">${idx + 1}</div>
            <div class="step-content">
              <h3>${esc(st.title)}</h3>
              <p>${esc(st.description)}</p>
              <ul class="step-details">
                ${bullets.map(b => `<li>${esc(b)}</li>`).join("")}
              </ul>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Admissions process load failed:", err);
  }
}

// public/script/admissions.js

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Expected JSON but got: ${text.slice(0, 120)}`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
  return json;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function setLink(id, href, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = href || "#";
  el.textContent = text || "";
}

function renderList(id, items) {
  const ul = document.getElementById(id);
  if (!ul) return;
  ul.innerHTML = "";
  (items || []).forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
}

async function loadOnlineAdmissions() {
  const data = await fetchJson(`${API_BASE}/api/application`);

  setText("online-title", data?.sectionTitle);
  setText("online-subtitle", data?.sectionSubtitle);

  setText("online-left-title", data?.leftTitle);
  setText("online-left-text", data?.leftText);

  setText("online-req-title", data?.requirementsTitle);
  renderList("online-req-list", data?.requirementsItems);

  setText("online-card-title", data?.cardTitle);
  setText("online-card-text", data?.cardText);

  setLink("online-btn", data?.buttonUrl, data?.buttonText);
  setText("online-help", data?.helpText);
}


function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


async function loadTuition() {
  try {
    const data = await fetchJson(`${API_BASE}/api/tuition`);
    

    const titleEl = document.getElementById("tuition-title");
    const subEl = document.getElementById("tuition-subtitle");
    const grid = document.getElementById("tuition-grid");

    if (titleEl) titleEl.textContent = data?.sectionTitle || "";
    if (subEl) subEl.textContent = data?.sectionSubtitle || "";
    if (!grid) return;

    const cards = Array.isArray(data?.cards) ? data.cards : [];
grid.innerHTML = cards
  .map((card) => {
    const items = Array.isArray(card?.items) ? card.items : [];

    return `
      <div class="tuition-card">
        <div class="tuition-header">
          <h3>${escapeHtml(card?.title)}</h3>
          <p>${escapeHtml(card?.subtitle)}</p>
        </div>

        <div class="tuition-content">
          ${items
            .map(
              (it) => `
                <div class="fee-item">
                  <span class="fee-name">${escapeHtml(it?.label)}</span>
                  <span class="fee-amount">${escapeHtml(it?.amount)}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  })
  .join("");

  } catch (e) {
    console.error("Tuition load failed:", e);
  }
}



document.addEventListener("DOMContentLoaded", () => {
  loadBanner();
  loadAdmissionsProcess();
  loadOnlineAdmissions();
  loadTuition();
});


