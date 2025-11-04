    document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.querySelector(".navbar");

  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
});
const currentPage = window.location.pathname.split("/").pop();
const links = document.querySelectorAll(".navbar a");

links.forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.style.color = "#4B3EAC"; // highlight color
  }
});

const texts = [
  "Welcome to Mongolian International School",
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
  }, 400); // fade duration in ms (matches CSS transition)
}, 1500);


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


