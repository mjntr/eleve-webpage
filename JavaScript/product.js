document.addEventListener("DOMContentLoaded", () => {
  // IMAGE SLIDER FUNCTIONALITY //

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

  window.slideImage = slideImage; // Make slideImage function accessible globally for onclick in HTML

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
      const nameElement = document.querySelector(".product-name"); // Get product name
      const priceElement = document.querySelector(".product-price"); // Get product price

      const activeSizeBtn = document.querySelector(
        "#size-table .size-option.active",
      ); // Get the active size button
      if (!activeSizeBtn) {
        alert("Please select a size!"); // Alert if no size is selected
        return;
      }

      if (!nameElement || !priceElement) {
        alert("Product information is missing!");
        return;
      }

      const name = nameElement.textContent.trim(); // Get product name text
      const price = parseFloat(
        priceElement.textContent.replace("€", "").replace(",", "."),
      ); // Convert price text to number

      const size = activeSizeBtn.dataset.size; // Get selected size from data attribute

      const product = {
        name,
        price,
        size,
      };
      addToCart(product); // Add product to cart
      alert(`${name} (Size: ${size}) was added to cart!`); // Show confirmation message
    });
  }

  // Remove function
  function removeFromCart(name, size) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems = cartItems.filter(
      (item) => !(item.name === name && item.size === size),
    ); // Remove item from cart based on name and size
    localStorage.setItem("cart", JSON.stringify(cartItems)); // Save updated cart to localStorage
  }

  // Add to Cart function
  function addToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cartItems.find(
      (item) => item.name === product.name && item.size === product.size,
    );
    if (existing) {
      existing.quantity += 1; // Increase quantity if product already in cart
      if (existing.quantity <= 0) {
        removeFromCart(existing.name, existing.size); // Remove item if quantity is 0 or less
      }
    } else {
      cartItems.push({ ...product, quantity: 1 }); // Add new product to cart
    }
    localStorage.setItem("cart", JSON.stringify(cartItems)); // Save cart to localStorage
  }

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name; // Get product name from data attribute
      const size = btn.dataset.size; // Get product size from data attribute
      removeFromCart(name, size); // Remove product from cart
      alert(`${name} (Size: ${size}) was removed from cart!`); // Show confirmation message
    });
  });
});
