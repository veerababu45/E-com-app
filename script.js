
// ✅ Get elements
const container = document.getElementById("product-container");
const cartCountElement = document.getElementById("cart-count");
const wishCountElement = document.getElementById("wish-count");

// ✅ Load cart and wishlist from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

cartCountElement.textContent = cart.length;
cartCountElement.style.display = cart.length > 0 ? "inline-block" : "none";

wishCountElement.textContent = wishlist.length;
wishCountElement.style.display = wishlist.length > 0 ? "inline-block" : "none";

// ✅ Generate star HTML
function getStarHTML(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) starsHTML += '<span class="material-icons">star</span>';
  if (halfStar) starsHTML += '<span class="material-icons">star_half</span>';
  for (let i = 0; i < emptyStars; i++) starsHTML += '<span class="material-icons">star_border</span>';

  return starsHTML;
}

// ✅ Display products
function dispalyproducts(productList) {
  container.innerHTML = "";

  if (productList.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  productList.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Price:</strong> ₹${product.price} <del>₹${product.oldPrice}</del></p>
      <p><strong>Discount:</strong> ${product.discount}% OFF</p>
      <p><strong>Rating:</strong> ${product.rating}</p>
      <div class="rating">${getStarHTML(product.rating)}</div>
      <div class="product-actions">
        <button class="add-to-cart-button">Add to Cart</button>
        <button class="wishlist-icon-button" title="Add to Wishlist">
          <span class="material-icons">favorite_border</span>
        </button>
      </div>
    `;

    // Add to cart
    const addToCartButton = card.querySelector(".add-to-cart-button");
    addToCartButton.addEventListener("click", () => {
      addToCart(product);
    });

    // Add to wishlist
    const wishlistIconBtn = card.querySelector(".wishlist-icon-button");
    wishlistIconBtn.addEventListener("click", () => {
      addToWishlist(product);
    });

    container.appendChild(card);
  });
}

// ✅ Add to Cart
function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCountElement.textContent = cart.length;
  cartCountElement.style.display = "inline-block";
}

// ✅ Add to Wishlist
function addToWishlist(product) {
  const exists = wishlist.find(item => item.id === product.id);
  if (!exists) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    wishCountElement.textContent = wishlist.length;
    wishCountElement.style.display = "inline-block";
  }
}

// ✅ Apply filters
function applyFilters() {
  let filtered = [...products];

  const selectedBrands = Array.from(document.querySelectorAll(".brand-filter:checked")).map(input => input.value);
  if (selectedBrands.length > 0) {
    filtered = filtered.filter(p => selectedBrands.includes(p.brand));
  }

  const selectedRatings = Array.from(document.querySelectorAll(".rating-filter:checked")).map(input => parseFloat(input.value));
  if (selectedRatings.length > 0) {
    filtered = filtered.filter(p => selectedRatings.some(r => p.rating >= r));
  }

  const selectedPrice = document.querySelector(".price-filter:checked");
  if (selectedPrice) {
    const [min, max] = selectedPrice.value.split("-").map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }

  const searchTerm = document.getElementById("search-input")?.value.toLowerCase().trim();
  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    );
  }

  dispalyproducts(filtered);
}

// ✅ Setup brand filter options
function populateBrandFilters() {
  const brands = [...new Set(products.map(p => p.brand))];
  const container = document.getElementById("brand-filters");

  brands.forEach(brand => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" class="brand-filter" value="${brand}"> ${brand}
    `;
    container.appendChild(label);
  });
}

// ✅ Setup filter event listeners
function setupFilterListeners() {
  document.querySelectorAll(".brand-filter, .rating-filter, .price-filter").forEach(input => {
    input.addEventListener("change", applyFilters);
  });

  document.getElementById("search-input")?.addEventListener("input", applyFilters);

  document.getElementById("clear-filters")?.addEventListener("click", () => {
    document.querySelectorAll(".brand-filter, .rating-filter, .price-filter").forEach(input => input.checked = false);
    document.getElementById("search-input").value = "";
    dispalyproducts(products);
  });
}

// ✅ Initialize
populateBrandFilters();
setupFilterListeners();
dispalyproducts(products);
