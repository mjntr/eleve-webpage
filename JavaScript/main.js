// MENU OVERLAY //
// selecting menu overlay & background layer behind menu
const overlay = document.getElementById("menuOverlay");
const dimLayer = document.querySelector(".menu-dim-layer");

// functions to open/close navigation menu + activate/remove dimlayer
function openNav() {
  overlay.classList.add("open");
  dimLayer.classList.add("active");
}
function closeNav() {
  overlay.classList.remove("open");
  dimLayer.classList.remove("active");
}

// Submenu Functionality //

// selcting all chevron toggle buttons
const chevrons = document.querySelectorAll(".chevron-toggle");

// loop through every chevron element
chevrons.forEach((chevron) => {
  // add click event to every chevron, e= event object created when user clicks
  chevron.addEventListener("click", (e) => {
    e.preventDefault(); // prevents default behaviour of element: https://www.w3schools.com/jsref/event_preventdefault.asp

    const submenu = chevron.parentElement.nextElementSibling; // parentElement=chevron container, sibling= submenu
    submenu.classList.toggle("open"); // toggle visibility of submenu:https://www.w3schools.com/howto/howto_js_toggle_class.asp

    // chevron turns when submenu open
    chevron.classList.toggle("chevron-up");
  });
});
