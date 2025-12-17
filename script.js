const texts = [
  "academic excellence is just the start.",
  "Empowering Students Every Day",
  "Learn, Grow, Succeed",
  "Join Our Amazing Community"
];

let index = 0;
const heroText = document.getElementById("hero-text");

setInterval(() => {
  // fade out
  heroText.style.opacity = 0;

  setTimeout(() => {
    // change text
    index = (index + 1) % texts.length;
    heroText.textContent = texts[index];

    // fade in
    heroText.style.opacity = 1;
  }, 400); // fade duration in ms
}, 2500); // change text every 2.5s









document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) {
    console.warn('No slides found. Check that .slide elements exist in the HTML.');
    return;
  }

  let index = 0;

  // Ensure exactly one slide is active at start
  slides.forEach(s => s.classList.remove('active'));
  slides[index].classList.add('active');

  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, 3000); // 3000 ms = 3 s
});





















// Navbar Toggle (mobile)
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.querySelector(".navbar");
    menuToggle.addEventListener("click", () => navbar.classList.toggle("active"));

    // Hero Section Text Animation
    
    const heroSection= document.querySelectorAll(".hero-section h1.hidden");
    const sectionObserver1 = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle("visible", entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    

    // Info Sections Fade-In
    const infoSections = document.querySelectorAll(".info-section");
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle("visible", entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    infoSections.forEach(section => sectionObserver.observe(section));

// testing
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  "https://gqijcqlcbxjdomnxdgqo.supabase.co",
  "sb_publishable_De6Dm-ymyjooI42AxTrkzA_XpujVxrn"
);

async function loadText() {
  const { data, error } = await supabase
    .from('MIS-school-website')
    .select('*')
    .eq('section', 'hero')
    .single();
  
  console.log("Data:", data);
  console.log("Error:", error);

  if(data) document.getElementById('heroText').innerText = data.content;
}


loadText();










    // Calendar Navigation
document.addEventListener('DOMContentLoaded', function() {
  const months = document.querySelectorAll('.month-calendar');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const currentMonth = document.querySelector('.current-month');
  let currentIndex = 0;

  // Month names for display
  const monthNames = {
    'september-2025': 'September 2025',
    'october-2025': 'October 2025',
    'november-2025': 'November 2025',
    'december-2025': 'December 2025',
    'january-2026': 'January 2026',
    'february-2026': 'February 2026',
    'march-2026': 'March 2026',
    'april-2026': 'April 2026',
    'may-2026': 'May 2026',
    'june-2026': 'June 2026'
  };

  function showMonth(index) {
    months.forEach(month => month.classList.remove('active'));
    months[index].classList.add('active');
    
    const monthKey = months[index].getAttribute('data-month');
    currentMonth.textContent = monthNames[monthKey] || monthKey.replace('-', ' ');
  }

  prevBtn.addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + months.length) % months.length;
    showMonth(currentIndex);
  });

  nextBtn.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % months.length;
    showMonth(currentIndex);
  });

  const days = document.querySelectorAll('.day:not(.empty)');
  days.forEach(day => {
    day.addEventListener('click', function() {
      const date = this.textContent;
      const month = document.querySelector('.month-calendar.active').getAttribute('data-month');
      const eventType = Array.from(this.classList).find(cls => 
        ['holiday', 'academic', 'event', 'orientation', 'conference'].includes(cls)
      );
      
      console.log(`Clicked on ${date} ${month} - ${eventType || 'Regular Day'}`);
    });
  });

  showMonth(currentIndex);
});
