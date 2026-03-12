// SHOPPING CART //

// Load Cart Items From Local Storage //
let cartItems = JSON.parse(localStorage.getItem("cart")) || []; // JSON.parse converts data to string; if no cart exists yet, use empty array
const cartSummary = document.getElementById("cart-summary"); // select cart summary section
const cartTableBody = document.querySelector("#cart-items tbody"); // select part of table where products will be inserted

// Add Product to Cart //
document.querySelectorAll(".add-to-basket-icon").forEach((icon, index) => {
  // selects all basket icons on page; adding click event to every icon
  icon.addEventListener("click", () => {
    const productDiv = icon.closest(".product-display"); // find closest product container: https://www.w3schools.com/jsref/met_element_closest.asp
    const name = productDiv.querySelector(".product-name").textContent; // get product name from html
    const priceText = productDiv.querySelector(".product-price").textContent; // get price from html
    const price = parseFloat(priceText.replace("€", "").replace(",", ".")); // convert price text into number by removing €: https://www.w3schools.com/jsref/jsref_parsefloat.asp
    const id = index; // create product id using index of the icon

    addToCart({ id, name, price }); // call function that adds product to cart
    console.log(`Added to cart:${name}`);
  });
});

// Add Product to Local Storage //
function addToCart(product) {
  // check if product exists in cart //
  const existing = cartItems.find((item) => item.id === product.id); //.find() searches cartItems array for an item with same id: https://www.w3schools.com/jsref/jsref_find.asp
  if (existing) {
    existing.quantity += 1; //increase quantity instead of adding new item
  } else {
    cartItems.push({ ...product, quantity: 1 }); // add product to array if not in cart yet; ...product copies item properties
  }
  localStorage.setItem("cart", JSON.stringify(cartItems)); // save updated cart arry to localStorage
  updateCartSummary(); // updates cart display and price summary
}

// Show Items in Shopping Cart & Sum Up //
function updateCartSummary() {
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
        <td>${item.name} </td> 
        <td>
        <button class="quantity-btn" data-id="${item.id}" data-action="minus">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-btn" data-id="${item.id}" data-action="plus">+</button>
        </td>
        <td>${(item.price * item.quantity).toFixed(2)}€
        <button class="remove-item" data-id="${item.id}" 
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

  // Activate Remove Product Button //
  cartTableBody.querySelectorAll(".remove-item").forEach((btn) => {
    // selects all trashcan-icons in cart
    btn.addEventListener("click", () => {
      // remove item from cart when clicked
      removeFromCart(parseInt(btn.dataset.id)); // parseInt: converts string into number
    });
  });

  // Quantity Button //
  // update product quantity when + or - is clicked
  cartTableBody.querySelectorAll(".quantity-btn").forEach((btn) => {
    // selects all + and - buttons in cart table
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id); // gets product id from buttons data attribute + coverts into number
      const action = btn.dataset.action; // gets action from button
      const product = cartItems.find((item) => item.id === id); // find product in cart by its ID
      if (!product) return; // stops running if product not found

      if (action === "plus") product.quantity += 1; // depending on action increase/decrease quantity by 1
      if (action === "minus") {
        product.quantity -= 1;
        if (product.quantity <= 0) removeFromCart(id); // item is removed from cart if quantity is 0 or less
      }

      localStorage.setItem("cart", JSON.stringify(cartItems)); // saves updated cart to localStorage
      updateCartSummary(); // update cart table
    });
  });

  // Checkout Button //
  const checkoutBtn = document.getElementById("checkout-button");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout);
  }
}

// Remove Product //
function removeFromCart(id) {
  cartItems = cartItems.filter((item) => item.id !== id); // filters out product with given id from cart items
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartSummary(); // updates cart display
}

// Checkout //
function handleCheckout() {
  // function is called when checkout button is clicked
  if (cartItems.length === 0) {
    alert("Your shoping cart is empty!"); // show alert when cart is empty
    return;
  }
  alert("Thank you for your purchase!"); // when cart is filled, thank customer for purchase
  cartItems = []; // empties cart
  localStorage.removeItem("cart"); // removes cart from local storage
  updateCartSummary();
}

updateCartSummary(); // updates summary when reloading page
