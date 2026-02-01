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



const API_BASE = "http://localhost:3001";

  // Month state
  let current = new Date(2025, 8, 1); // Sep 2025
  let eventsByDate = {}; // { "YYYY-MM-DD": { type, title, fullDesc } }

  function pad2(n) { return String(n).padStart(2, "0"); }
  function isoDate(y, mIndex, d) {
    return `${y}-${pad2(mIndex + 1)}-${pad2(d)}`;
  }

  // Monday-first index (Mon=0 ... Sun=6)
  function mondayIndex(jsDay) { return (jsDay + 6) % 7; }

  async function loadCalendar() {
    try {
      const res = await fetch(`${API_BASE}/api/calendar`);
      const data = await res.json();
      eventsByDate = data?.events || {};
    } catch (e) {
      console.error("Failed to load calendar:", e);
      eventsByDate = {};
    }
  }

  function renderCalendar() {
    const year = current.getFullYear();
    const month = current.getMonth();

    const monthTitle = document.getElementById("current-month");
    const calendarDays = document.getElementById("calendar-days");
    const explanationTitle = document.getElementById("month-explanation-title");
    const explanationList = document.getElementById("explanation-list");

    const monthName = current.toLocaleString("en-US", { month: "long" });
    monthTitle.textContent = `${monthName} ${year}`;
    explanationTitle.textContent = `${monthName} Important Dates`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDow = mondayIndex(new Date(year, month, 1).getDay()); // 0..6 Monday-first

    let calendarHTML = "";

    // leading blanks
    for (let i = 0; i < firstDow; i++) calendarHTML += '<div class="day"></div>';

    // days
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = isoDate(year, month, day);
      const ev = eventsByDate[iso];

      let dayClass = "day";
      let dotHTML = "";

      if (ev) {
        dayClass += ` ${ev.type || "event"}`; // uses your CSS classes: .academic .holiday etc
        dotHTML = '<div class="event-dot"></div>';
      }

      calendarHTML += `
        <div class="${dayClass}" data-iso="${iso}">
          <span>${day}</span>
          ${dotHTML}
        </div>
      `;
    }

    calendarDays.innerHTML = calendarHTML;

    // Bottom list (events in this month)
    const monthKey = `${year}-${pad2(month + 1)}-`;
    const monthEvents = Object.entries(eventsByDate)
      .filter(([iso]) => iso.startsWith(monthKey))
      .sort(([a], [b]) => a.localeCompare(b));

    let explanationHTML = "";
    if (monthEvents.length === 0) {
      explanationHTML = '<li class="explanation-item"><div class="event-desc">No scheduled events for this month</div></li>';
    } else {
      for (const [iso, ev] of monthEvents) {
        const dayNum = Number(iso.slice(-2));
        explanationHTML += `
          <li class="explanation-item">
            <div class="event-date">${monthName} ${dayNum}</div>
            <div class="event-desc">${ev.fullDesc || ev.title || ""}</div>
          </li>
        `;
      }
    }
    explanationList.innerHTML = explanationHTML;

    // Optional: click a day to scroll-highlight its item
    document.querySelectorAll('.day[data-iso]').forEach(el => {
      el.addEventListener("click", () => {
        const iso = el.getAttribute("data-iso");
        const dayNum = Number(iso.slice(-2));
        highlightEventInList(monthName, dayNum);
      });
    });
  }

  function highlightEventInList(monthName, dayNum) {
    document.querySelectorAll(".explanation-item").forEach(item => {
      const dateEl = item.querySelector(".event-date");
      if (!dateEl) return;

      if (dateEl.textContent.trim() === `${monthName} ${dayNum}`) {
        item.style.backgroundColor = "#ffebee";
        item.style.padding = "15px";
        item.style.borderRadius = "5px";
        item.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(() => {
          item.style.backgroundColor = "";
          item.style.padding = "";
          item.style.borderRadius = "";
        }, 2000);
      }
    });
  }

  document.getElementById("prev-month").addEventListener("click", () => {
    current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    renderCalendar();
  });

  (async function init() {
    await loadCalendar();
    renderCalendar();
  })();
  
  
  

async function loadActivities() {
  const res = await fetch(`${API_BASE}/api/activities`);
  const data = await res.json();

  document.getElementById("activities-title").textContent = data.title;
  document.getElementById("activities-subtitle").textContent = data.subtitle;

  const grid = document.getElementById("activities-grid");
  grid.innerHTML = "";

  data.items.forEach(item => {
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <div class="activity-image" style="background-image:url('${item.imageUrl}')"></div>
      <div class="activity-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });
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

async function loadVolunteer() {
  const API = "http://localhost:3001"; // change later for Render

  const titleEl = document.getElementById("volunteer-title");
  const subtitleEl = document.getElementById("volunteer-subtitle");
  const gridEl = document.getElementById("volunteer-grid");
  if (!gridEl) return;

  const res = await fetch(`${API}/api/volunteer`);
  const data = await res.json();

  titleEl.textContent = data.title || "";
  subtitleEl.textContent = data.subtitle || "";

  gridEl.innerHTML = data.items.map(it => {
    const img = it.imageUrl.startsWith("http")
      ? it.imageUrl
      : `${API}${it.imageUrl}`;

    return `
      <div class="volunteer-card">
        <div class="volunteer-image" style="background-image:url('${img}')"></div>
        <div class="volunteer-content">
          <h3>${it.title}</h3>
          <p>${it.description}</p>
        </div>
      </div>
    `;
  }).join("");
}


document.addEventListener("DOMContentLoaded", () => {
  loadActivities();
  loadSpecialPrograms();
  loadVolunteer();
});

