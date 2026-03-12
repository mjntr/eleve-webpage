// SHOPPING CART //
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const cartSummary = document.getElementById("cart-summary");
const cartTableBody = document.querySelector("#cart-items tbody");

// add products by clicking add-to-basket-icon //
document.querySelectorAll(".add-to-basket-icon").forEach((icon, index) => {
  icon.addEventListener("click", () => {
    const productDiv = icon.closest(".product-display");
    const name = productDiv.querySelector(".product-name").textContent;
    const priceText = productDiv.querySelector(".product-price").textContent;
    const price = parseFloat(priceText.replace("€", "").replace(",", "."));
    const id = index;

    addToCart({ id, name, price });
    console.log(`Added to cart:${name}`);
  });
});

// add product to local storage //
function addToCart(product) {
  const existing = cartItems.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartSummary();
}

// show items in shopping cart & sum up //
function updateCartSummary() {
  if (!cartSummary) return; //if cart summary is missing//

  if (cartItems.length === 0) {
    cartTableBody.innerHTML = "";
    cartSummary.innerHTML = `<p>Your shopping cart is empty</p>`;
    return;
  }

  let subtotal = 0;
  const itemsHtml = cartItems
    .map((item) => {
      subtotal += item.price * item.quantity;
      return `
      <tr>
        <td>${item.name} </td> 
        <td>
        <button class="quantity-btn" data-id="${item.id}" data-action="minus">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-btn" data-id="${item.id}" data-action="plus">+</button>
        </td>
        <td>€${(item.price * item.quantity).toFixed(2)}
        <button class="remove-item" data-id="${item.id}"
        style="background:none; border:none;"> <img src="icons /trashcan-icon.svg" alt="remove" class="remove-icon">
        </button>
      </td>
      </tr>
      `;
    })
    .join("");

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  cartTableBody.innerHTML = itemsHtml;

  cartSummary.innerHTML = `
  <p>Subtotal: €${subtotal.toFixed(2)}</p><p>Shipping: €${shipping.toFixed(2)}</p><p>Total: €${total.toFixed(2)}</p><button id="checkout-button">CHECKOUT</button>`;

  // Remove Product Button //
  cartTableBody.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(parseInt(btn.dataset.id));
    });
  });

  // Quantity Button //
  cartTableBody.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      const product = cartItems.find((item) => item.id === id);
      if (!product) return;

      if (action === "plus") product.quantity += 1;
      if (action === "minus") {
        product.quantity -= 1;
        if (product.quantity <= 0) removeFromCart(id);
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      updateCartSummary();
    });
  });

  // Checkout //
  const checkoutBtn = document.getElementById("checkout-button");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout);
  }
}
// remove product //
function removeFromCart(id) {
  cartItems = cartItems.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartSummary();
}

// Checkout //
function handleCheckout() {
  if (cartItems.length === 0) {
    alert("Your shoping cart is empty!");
    return;
  }
  alert("Thank you for your purchase!");
  cartItems = [];
  localStorage.removeItem("cart");
  updateCartSummary();
}

updateCartSummary(); // updates summary when reloading page //
