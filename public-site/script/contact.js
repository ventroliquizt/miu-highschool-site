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



async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
  }
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expected JSON but got ${ct}: ${text.slice(0, 120)}`);
  }
  return res.json();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function setHref(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.href = value;
}

async function loadContact() {
  try {
    console.log("✅ fetching contact...");
    const data = await fetchJson(`${API_BASE}/api/contact`);
    console.log("✅ contact data:", data);

    setText("contact-title", data.sectionTitle);
    setText("contact-subtitle", data.sectionSubtitle);

    setText("contact-org", data.address?.org);
    setText("contact-address-1", data.address?.line1);
    setText("contact-address-2", data.address?.line2);

    setText("contact-phone-main", data.phones?.mainOffice);
    setText("contact-phone-adm", data.phones?.admissions);

    setText("contact-email-general", data.emails?.general);
    setText("contact-email-adm", data.emails?.admissions);
    setText("contact-email-reg", data.emails?.registrar);

    // socials (only if you added IDs in HTML)
    setHref("social-facebook", data.socials?.facebook);
    setHref("social-instagram", data.socials?.instagram);
    setHref("social-email", data.socials?.email);
  } catch (e) {
    console.error("❌ contact fetch failed:", e);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // ✅ your existing menu code (keep it)
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 120,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // ✅ actually load contact content
  loadContact();
});


document.addEventListener("DOMContentLoaded", () => {
  loadBanner();
});
