// SHOPPING CART //
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const cartSummary = document.getElementById("cart-summary");

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
    cartSummary.innerHTML = `<p>Your shopping cart is empty</p>`;
    return;
  }

  let subtotal = 0;
  const itemsHtml = cartItems
    .map((item) => {
      subtotal += item.price * item.quantity;
      return `
    <div class="cart-item">
        <span>
          ${item.name} x ${item.quantity}
        </span>
        <span>€${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-item" data-id="${item.id}">
          remove
        </button>
      </div>`;
    })
    .join("");

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  cartSummary.innerHTML = `${itemsHtml}
  <p>Subtotal: €${subtotal.toFixed(2)}</p><p>Shipping: €${shipping.toFixed(2)}</p><p>Total: €${total.toFixed(2)}</p><button id="checkout-button">CHECKOUT</button>`;
}
// add remove buttons //
cartSummary.querySelectorAll(".remove-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    removeFromCart(parseInt(btn.dataset.id));
  });
});

// Checkout //
const checkoutBtn = document.getElementById("checkout-button");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", handleCheckout);
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
