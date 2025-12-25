const cartContainer = document.getElementById("cart-container");

// Get cart items from localStorage or use empty array
const cartData = JSON.parse(localStorage.getItem("cart")) || [];

// Function to update cart UI
function updateCartDisplay() {
  cartContainer.innerHTML = "";

  if (cartData.length === 0) {
    cartContainer.innerHTML = "<h2 style='text-align:center;'>Cart is empty 😢</h2>";
    return;
  }

  let total = 0;

  cartData.forEach((product, index) => {
    total += product.price;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Price:</strong> ₹${product.price}</p>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;

    // Remove item from cart on button click
    card.querySelector(".remove-btn").addEventListener("click", () => {
      cartData.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cartData));
      updateCartDisplay();
    });

    cartContainer.appendChild(card);
  });

  // Cart total and buttons
  const totalDiv = document.createElement("div");
  totalDiv.style.textAlign = "center";
  totalDiv.style.marginTop = "20px";
  totalDiv.innerHTML = `
    <h3>Total: ₹${total}</h3>
    <button id="clear-btn">Clear Cart</button>
    <button id="order-btn">Place Order</button>
  `;

  cartContainer.appendChild(totalDiv);

  // Clear cart button
  document.getElementById("clear-btn").addEventListener("click", () => {
    localStorage.removeItem("cart");
    updateCartDisplay();
  });

  // Place order button
  document.getElementById("order-btn").addEventListener("click", () => {
    alert("🎉 Order Placed Successfully!");
    localStorage.removeItem("cart");
    updateCartDisplay();
  });
}

// Initial display
updateCartDisplay();
