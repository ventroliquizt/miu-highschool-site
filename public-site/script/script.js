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

document.addEventListener("DOMContentLoaded", loadBanner);

async function loadVice() {
  try {
    const API = "http://localhost:3001";

    const res = await fetch(`${API}/api/vice`);
    const data = await res.json();

    if (!data) return;

    const img = document.getElementById("vice-img");
    const title = document.getElementById("vice-title");
    const p1 = document.getElementById("vice-p1");
    const p2 = document.getElementById("vice-p2");
    const sign = document.getElementById("vice-sign");

    if (img && data.imageUrl) {
      const src = data.imageUrl.startsWith("http")
        ? data.imageUrl
        : `${API}${data.imageUrl}`;

      // cache bust
      img.src = `${src}?v=${Date.now()}`;
    }

    if (title) title.textContent = data.title || "";
    if (p1) p1.textContent = data.p1 || "";
    if (p2) p2.textContent = data.p2 || "";
    if (sign) sign.innerHTML = data.signatureHtml || "";

  } catch (err) {
    console.error("Failed to load vice greeting:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadVice);

async function loadMissionVision() {
  try {
    const res = await fetch("http://localhost:3001/api/mission-vision");
    if (!res.ok) throw new Error("Failed to fetch mission/vision");

    const data = await res.json();

    const missionEl = document.getElementById("mission-text");
    const visionEl = document.getElementById("vision-text");

    if (missionEl) missionEl.textContent = data.mission || "";
    if (visionEl) visionEl.textContent = data.vision || "";
  } catch (e) {
    console.error("Mission/Vision load failed:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadVice();           // your existing one
  loadMissionVision();  // new one
});

async function loadSuccess() {
  try {
    const res = await fetch("http://localhost:3001/api/success");
    const data = await res.json();

    document.getElementById("success-subtitle").textContent = data.subtitle || "";
    document.getElementById("success-graduates").textContent = data.graduates || "";
    document.getElementById("success-awards").textContent = data.awards || "";
    document.getElementById("success-community").textContent = data.community || "";
  } catch (e) {
    console.error("Failed to load success section:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadVice();
  loadMissionVision();
  loadSuccess();
});


async function loadCafeteria() {
  try {
    const res = await fetch("http://localhost:3001/api/cafeteria");
    if (!res.ok) throw new Error("Failed to fetch cafeteria");
    const data = await res.json();

    document.getElementById("cafeteria-title").textContent = data.title || "";
    document.getElementById("cafeteria-subtitle").textContent = data.subtitle || "";
    document.getElementById("cafeteria-heading").textContent = data.heading || "";
    document.getElementById("cafeteria-text").textContent = data.text || "";

    const img = document.getElementById("cafeteria-img");
    const placeholder = document.getElementById("cafeteria-placeholder");

    if (data.imageUrl) {
      img.src = data.imageUrl.startsWith("http")
        ? data.imageUrl
        : `http://localhost:3001${data.imageUrl}`;

      img.style.display = "block";
      placeholder.style.display = "none";
    } else {
      img.style.display = "none";
      placeholder.style.display = "flex";
    }
  } catch (e) {
    console.error("Cafeteria load failed:", e);
  }
}




async function loadActivities() {
  const API = "http://localhost:3001";

  const titleEl = document.getElementById("activities-title");
  const subtitleEl = document.getElementById("activities-subtitle");
  const gridEl = document.getElementById("activities-grid");

  // Only run on pages that actually have the section
  if (!titleEl || !subtitleEl || !gridEl) return;

  try {
    const res = await fetch(`${API}/api/activities`);
    if (!res.ok) throw new Error(`Activities fetch failed (${res.status})`);
    const data = await res.json();

    // Support BOTH key styles (your admin uses heading/subheading right now)
    const title = data.title ?? data.heading ?? "";
    const subtitle = data.subtitle ?? data.subheading ?? "";
    const items = Array.isArray(data.items) ? data.items : [];

    titleEl.textContent = title;
    subtitleEl.textContent = subtitle;

    if (items.length === 0) {
      gridEl.innerHTML = "<p style='text-align:center;color:#666'>No activities yet.</p>";
      return;
    }

    gridEl.innerHTML = items
      .map((it) => {
        const img = it.imageUrl
          ? (it.imageUrl.startsWith("http") ? it.imageUrl : `${API}${it.imageUrl}`)
          : "";

        return `
          <div class="activity-card">
            <div class="activity-image" style="background-image:url('${img}')"></div>
            <div class="activity-content">
              <h3>${it.title || ""}</h3>
              <p>${it.description || ""}</p>
              <div class="activity-details">
                <span><i class="fas fa-clock"></i> ${it.time || ""}</span>
                <span><i class="fas fa-users"></i> ${it.grades || ""}</span>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (e) {
    console.error("Failed to load activities:", e);
  }
}

async function loadSpecialPrograms() {
  const API = "http://localhost:3001";

  const titleEl = document.getElementById("special-programs-title");
  const subtitleEl = document.getElementById("special-programs-subtitle");
  const gridEl = document.getElementById("special-programs-grid");

  if (!titleEl || !subtitleEl || !gridEl) return;

  try {
    const res = await fetch(`${API}/api/special-programs`);
    if (!res.ok) throw new Error(`Special Programs fetch failed (${res.status})`);
    const data = await res.json();

    titleEl.textContent = data.title || "";
    subtitleEl.textContent = data.subtitle || "";

    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) {
      gridEl.innerHTML = "<p style='text-align:center;color:#fff'>No special programs yet.</p>";
      return;
    }

    gridEl.innerHTML = items.map((it) => `
      <div class="program-card">
        <div class="program-icon">
          <i class="${it.icon || "fas fa-star"}"></i>
        </div>
        <h3 style="color:#0f2d56;">${it.title || ""}</h3>
        <p>${it.description || ""}</p>
      </div>
    `).join("");
  } catch (e) {
    console.error("Failed to load special programs:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSpecialPrograms();
});



document.addEventListener("DOMContentLoaded", () => {
  loadVice();
  loadMissionVision();
  loadSuccess();
  loadCafeteria();
  loadActivities();
  loadSpecialPrograms();
});