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

// Add to Cart Functionality
document.querySelector(".add-to-cart-btn").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const productDiv = btn.closest(".product-info"); // Find the closest product container
    const name = productDiv.querySelector(".product-name").textContent;
    const priceText = productDiv.querySelector(".product-price").textContent;
    const price = parseFloat(priceText.replace("€", "").replace(",", "."));

    const sizeSelect = productDiv.querySelector("#size-select");
    const selectedSize = sizeSelect.value;
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const id = `${index}-${selectedSize}`; // Create a unique product ID using index and selected size

    addToCart({ id, name: `${name} (Size: ${selectedSize})`, price }); // Add product to cart with size info
    alert(`${name} was added to cart!`);
  });
});
