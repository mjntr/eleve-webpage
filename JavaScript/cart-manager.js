window.cartItems = JSON.parse(localStorage.getItem("cart")) || []; // JSON.parse converts data to string; if no cart exists yet, use empty array

// Add Product to Cart //
window.addToCart = function (product) {
  // check if product exists in cart //
  const existing = window.cartItems.find(
    (item) => item.id === product.id && item.size === product.size,
  ); //.find() searches cartItems array for an item with same id: https://www.w3schools.com/jsref/jsref_find.asp
  if (existing) {
    existing.quantity += 1; //increase quantity instead of adding new item
  } else {
    window.cartItems.push({ ...product, quantity: 1 }); // add product to array if not in cart yet; ...product copies item properties
  }
  localStorage.setItem("cart", JSON.stringify(window.cartItems)); // save updated cart arry to localStorage
  window.updateCartSummary?.(); // updates cart display and price summary
};

// Remove Product from Cart //
window.removeFromCart = function (id, size) {
  window.cartItems = window.cartItems.filter(
    (item) => item.id !== id || item.size !== size,
  ); // filters out product with given id and size from cart items: https://www.w3schools.com/jsref/jsref_filter.asp
  localStorage.setItem("cart", JSON.stringify(window.cartItems));
  window.updateCartSummary(); // updates cart display
};

// Change Product Quantity in Cart //
window.changeQuantity = function (id, size, action) {
  const item = window.cartItems.find(
    (item) => item.id === id && item.size === size,
  );
  if (!item) return; // if item is not found, function stops running

  if (action === "plus") {
    item.quantity += 1; // increase quantity if + is clicked
  } else if (action === "minus" && item.quantity > 1) {
    item.quantity -= 1; // decrease quantity if - is clicked and quantity is greater than 1
  } else if (action === "minus" && item.quantity === 1) {
    removeFromCart(id, size); // if quantity is 1 and - is clicked, product is removed from cart
  }
  localStorage.setItem("cart", JSON.stringify(window.cartItems)); // save updated cart to localStorage
  window.updateCartSummary?.(); // updates cart display
};
