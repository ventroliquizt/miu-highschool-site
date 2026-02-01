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

// public-site/script/information.js
// Requires script.js loaded first

async function loadNews() {
  try {
    const data = await fetchJson(`${API_BASE}/api/news`);

    const titleEl = document.getElementById("news-title");
    const subEl = document.getElementById("news-subtitle");
    const grid = document.getElementById("news-grid");

    if (titleEl) titleEl.textContent = data?.sectionTitle || "School News";
    if (subEl) subEl.textContent = data?.sectionSubtitle || "";
    if (!grid) return;

    const items = Array.isArray(data?.items) ? data.items : [];

    grid.innerHTML = items
      .map(
        (n) => `
        <div class="news-card">
          <div class="news-image">
            <img src="${escapeHtml(n?.imageUrl)}" alt="${escapeHtml(n?.title)}">
          </div>
          <div class="news-content">
            <h3>${escapeHtml(n?.title)}</h3>
            <div class="news-date">
              <i class="far fa-calendar"></i> ${escapeHtml(n?.date)}
            </div>
            <p class="news-excerpt">${escapeHtml(n?.excerpt)}</p>
            <button class="news-toggle">Learn More</button>
            <div class="news-more">
              <p>${escapeHtml(n?.moreText)}</p>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    // Re-attach toggle behavior for dynamically created cards
    grid.querySelectorAll(".news-toggle").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const newsCard = this.closest(".news-card");
        if (newsCard.classList.contains("expanded")) {
          newsCard.classList.remove("expanded");
          this.textContent = "Learn More";
        } else {
          newsCard.classList.add("expanded");
          this.textContent = "Show Less";
        }
      });
    });
  } catch (e) {
    console.error("News load failed:", e);
  }
}

document.addEventListener("DOMContentLoaded", loadNews);


document.addEventListener("DOMContentLoaded", loadBanner);
