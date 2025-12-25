const container = document.getElementById("wishlist-container");
const wishCountElement = document.getElementById("wish-count");
const cartCountElement = document.getElementById("cart-count");

// Load data
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const cart = JSON.parse(localStorage.getItem("cart")) || [];

wishCountElement.textContent = wishlist.length;
wishCountElement.style.display = wishlist.length > 0 ? "inline-block" : "none";

cartCountElement.textContent = cart.length;
cartCountElement.style.display = cart.length > 0 ? "inline-block" : "none";

// Show products
function showWishlist() {
  container.innerHTML = "";

  if (wishlist.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  wishlist.forEach((product, index) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Price:</strong> ₹${product.price} <del>₹${product.oldPrice}</del></p>
      <p><strong>Discount:</strong> ${product.discount}% OFF</p>
      <p><strong>Rating:</strong> ${product.rating}</p>
      <div class="product-actions">
        <button class="add-to-cart-button">Add to Cart</button>
        <button class="remove-btn">Remove</button>
      </div>
    `;

    // Add to cart
    card.querySelector(".add-to-cart-button").addEventListener("click", () => {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      cartCountElement.textContent = cart.length;
      cartCountElement.style.display = "inline-block";
    });

    // Remove from wishlist
    card.querySelector(".remove-btn").addEventListener("click", () => {
      wishlist.splice(index, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      wishCountElement.textContent = wishlist.length;
      wishCountElement.style.display = wishlist.length > 0 ? "inline-block" : "none";
      showWishlist(); // Refresh
    });

    container.appendChild(card);
  });
}

showWishlist();
