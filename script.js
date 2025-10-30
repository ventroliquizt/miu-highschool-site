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
