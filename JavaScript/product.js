let currentImageIndex = 0;
const ImageTrackList = document.querySelectorAll(".product-images img"); // Select all images in the image track

function showImage(index) {
  ImageTrackList.forEach((image, i) => {
    image.style.display = i === index ? "block" : "none"; // Show the current image, hide others
  });
}

function slideImage(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) {
    currentImageIndex = ImageTrackList.length - 1;
  }
  if (currentImageIndex >= ImageTrackList.length) {
    currentImageIndex = 0;
  }
  showImage(currentImageIndex);
}

showImage(currentImageIndex); // Show the first image on page load

// ADD TO CART FUNCTIONALITY //

// Size Selection
const sizeButtons = document.querySelectorAll("#size-table .size-option"); // Select all size option buttons

sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sizeButtons.forEach((b) => b.classList.remove("active")); // Remove active class from all buttons
    btn.classList.add("active"); // Add active class to clicked button
  });
});

// Add to Cart Button
const addToCartBtn = document.querySelector(".add-to-cart-btn"); // Select the add to cart button
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    const name = document.querySelector(".product-name").textContent; // Get product name
    const priceText = document.querySelector(".product-price").textContent; // Get product price
    const price = parseFloat(priceText.replace("€", "").replace(",", ".")); // Convert price text to number

    const activeSizeBtn = document.querySelector(
      "#size-table .size-option.active",
    ); // Get the active size button
    if (!activeSizeBtn) {
      alert("Please select a size!"); // Alert if no size is selected
      return;
    }
    const size = activeSizeBtn.dataset.size; // Get selected size from data attribute

    const product = { id: Date.now(), name, price, size }; // Create product object with unique ID
    addToCart(product); // Add product to cart
    alert(`${name} (Size: ${size}) was added to cart!`); // Show confirmation message
  });
}
