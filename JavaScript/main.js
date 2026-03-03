// MENU OVERLAY //
const overlay = document.getElementById("menuOverlay");
const dimLayer = document.querySelector(".menu-dim-layer");

function openNav() {
  overlay.classList.add("open");
  dimLayer.classList.add("active");
}
function closeNav() {
  overlay.classList.remove("open");
  dimLayer.classList.remove("active");
}

// Submenu //
const chevrons = document.querySelectorAll(".chevron-toggle");

chevrons.forEach((chevron) => {
  chevron.addEventListener("click", (e) => {
    e.preventDefault(); // prevents link navigation //

    const submenu = chevron.parentElement.nextElementSibling;
    submenu.classList.toggle("open");

    // chevron turn when, submenu opened //
    chevron.classList.toggle("chevron-up");
  });
});
