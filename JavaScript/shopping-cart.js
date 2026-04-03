// SHOPPING CART //

document.addEventListener("DOMContentLoaded", () => {
  // ensures that code runs only after the whole page is loaded
  let cartItems = window.cartItems || []; // retrieves cart from local storage or initializes empty array if no cart exists

  // Select DOM Elements //
  const cartSummary = document.getElementById("cart-summary"); // select cart summary section
  const cartTableBody = document.querySelector("#cart-items tbody"); // select part of table where products will be inserted
  const sizeOverlay = document.getElementById("size-overlay"); // select size overlay
  const sizeButtons = document.querySelectorAll("#size-overlay .size-option"); // select all size options
  const confirmSizeBtn = document.getElementById("confirm-size-btn"); // select confirm button in size overlay

  let selectedSize = null; // variable to store selected size
  let currentProduct = null; // variable to store current product being added to cart

  // Confirm Size //
  if (confirmSizeBtn) {
    confirmSizeBtn.addEventListener("click", () => {
      if (!selectedSize) {
        alert("Please select a size first!"); // show alert if no size is selected
        return;
      }
      if (!currentProduct) {
        alert("No product selected!"); // show alert if no product is selected (should not happen, but added as safety check)
        return;
      }
      const productWithSize = { ...currentProduct, size: selectedSize }; // create new product object with size
      window.addToCart(productWithSize); // add product with size to cart
      cartItems = window.cartItems; // update local cart items variable after adding to cart

      sizeOverlay.classList.add("hidden"); // hide size overlay
      alert(
        `${currentProduct.name} (Size: ${selectedSize}) was added to cart!`,
      ); // show confirmation message
      currentProduct = null; // reset current product
    });
  }

  // Add Product to Cart (with Size Selection) //
  document.querySelectorAll(".add-to-basket-icon").forEach((icon, index) => {
    // selects all basket icons on page; adding click event to every icon
    icon.addEventListener("click", () => {
      const productDiv = icon.closest(".product-display"); // find closest product container: https://www.w3schools.com/jsref/met_element_closest.asp
      const name = productDiv.querySelector(".product-name").textContent; // get product name from html
      const priceText = productDiv.querySelector(".product-price").textContent; // get price from html
      const price = parseFloat(priceText.replace("€", "").replace(",", ".")); // convert price text into number by removing €: https://www.w3schools.com/jsref/jsref_parsefloat.asp
      const id = index; // create product id using index of the icon

      currentProduct = { id, name, price }; // call function that adds product to cart

      // Show size selection overlay when add to cart is clicked
      sizeOverlay.classList.remove("hidden"); // show size overlay by removing hidden class
      selectedSize = null; // reset selected size
      sizeButtons.forEach((btn) => {
        btn.classList.remove("active"); // remove active class from all size buttons
      });
    });
  });

  // Size Selection //
  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("active")); // remove active class from all buttons
      btn.classList.add("active"); // add active class to clicked button
      selectedSize = btn.dataset.size; // store selected size in variable using data attribute: https://www.w3schools.com/jsref/prop_html_dataset.asp
    });
  });

  // Show Items in Shopping Cart & Sum Up //
  window.updateCartSummary = function () {
    cartItems = window.cartItems; // update cart items from local storage in case it was changed on another page
    if (!cartSummary) return; // if cart summary section is missing an page, function stops running (prevents that it runs on other pages)

    // if cart is empty, clear table and show message
    if (cartItems.length === 0) {
      cartTableBody.innerHTML = "";
      cartSummary.innerHTML = `<p>Your shopping cart is empty</p>`;
      return;
    }

    let subtotal = 0;
    const itemsHtml = cartItems // create html structure for every cart item
      // loops through each item in array + returns new array containing html for each product https://www.w3schools.com/jsref/jsref_map.asp
      .map((item) => {
        subtotal += item.price * item.quantity; // calculates subtotal
        return `
      <tr>
        <td>${item.name} ${item.size ? `(Size: ${item.size})` : ""} </td> 
        <td>
        <button class="quantity-btn" data-id="${item.id}" data-size="${item.size}" data-action="minus">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-btn" data-id="${item.id}" data-size="${item.size}" data-action="plus">+</button>
        </td>
        <td>${(item.price * item.quantity).toFixed(2)}€
        <button class="remove-item" data-id="${item.id}" data-size="${item.size}"
        style="background:none; border:none;"> <img src="icons /trashcan-icon.svg" alt="remove" class="remove-icon">
        </button>
      </td>
      </tr>
      `;
      })
      .join(""); // joins all rows together into one html string: https://www.w3schools.com/jsref/jsref_join.asp

    // Shipping Costs //
    const shipping = subtotal > 0 ? 5 : 0; // if cart is not empty, shipping is set to 5€

    // Total Price //
    const total = subtotal + shipping;

    cartTableBody.innerHTML = itemsHtml; // fills table with all items

    // Cart Summary //
    cartSummary.innerHTML = `
  <p>Subtotal: ${subtotal.toFixed(2)}€</p>
  <p>Shipping: ${shipping.toFixed(2)}€</p>
  <p>Total: ${total.toFixed(2)}€</p>
  <button id="checkout-button">CHECKOUT</button>`;

    // Remove Products //
    cartTableBody.querySelectorAll(".remove-item").forEach((btn) => {
      // selects all trashcan-icons in cart
      btn.addEventListener("click", () => {
        removeFromCart(btn.dataset.id, btn.dataset.size); // calls removeFromCart function with product id and size from button data attributes
        window.updateCartSummary(); // updates cart summary after removing item
      });
    });

    // Quantity Changes //
    cartTableBody.querySelectorAll(".quantity-btn").forEach((btn) => {
      // selects all + and - buttons in cart
      btn.addEventListener("click", () => {
        changeQuantity(btn.dataset.id, btn.dataset.size, btn.dataset.action); // calls changeQuantity function with id, size and action
        cartItems = window.cartItems; // update local cart items variable after changing quantity
        window.updateCartSummary(); // updates cart summary after changing quantity
      });
    });

    // Checkout Button //
    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", handleCheckout);
    }
  };

  // Checkout //
  function handleCheckout() {
    // function is called when checkout button is clicked
    if (cartItems.length === 0) {
      alert("Your shoping cart is empty!"); // show alert when cart is empty
      return;
    }
    alert("Thank you for your purchase!"); // when cart is filled, thank customer for purchase
    window.cartItems = []; // clear cart items in global variable
    cartItems = []; // update local cart items variable
    localStorage.removeItem("cart"); // removes cart from local storage
    window.updateCartSummary();
  }

  window.updateCartSummary(); // updates summary when reloading page
});
