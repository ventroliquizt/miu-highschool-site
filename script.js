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