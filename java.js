// Menu data
const menuItems = [
  { id: 1, name: "Pancake Stack", desc: "Fluffy pancakes with maple syrup and berries.", price: 8.99, emoji: "🥞", category: "breakfast" },
  { id: 2, name: "Avocado Toast", desc: "Sourdough, smashed avocado and poached egg.", price: 9.49, emoji: "🥑", category: "breakfast" },
  { id: 3, name: "Classic Omelette", desc: "Three eggs, cheese, peppers and herbs.", price: 7.99, emoji: "🍳", category: "breakfast" },
  { id: 4, name: "Cheese Burger", desc: "Beef patty, cheddar, lettuce and house sauce.", price: 12.99, emoji: "🍔", category: "lunch" },
  { id: 5, name: "Garden Salad", desc: "Fresh greens, cherry tomatoes and vinaigrette.", price: 8.49, emoji: "🥗", category: "lunch" },
  { id: 6, name: "Chicken Wrap", desc: "Grilled chicken, veggies and garlic mayo.", price: 10.49, emoji: "🌯", category: "lunch" },
  { id: 7, name: "Spaghetti Bolognese", desc: "Slow-cooked beef ragù over fresh pasta.", price: 15.99, emoji: "🍝", category: "dinner" },
  { id: 8, name: "Margherita Pizza", desc: "Tomato, mozzarella and fresh basil.", price: 13.99, emoji: "🍕", category: "dinner" },
  { id: 9, name: "Grilled Steak", desc: "Ribeye with roasted potatoes and greens.", price: 24.99, emoji: "🥩", category: "dinner" },
  { id: 10, name: "Sushi Platter", desc: "Chef's selection of 12 fresh pieces.", price: 21.99, emoji: "🍣", category: "dinner" },
  { id: 11, name: "Chocolate Lava Cake", desc: "Warm chocolate cake with a molten center.", price: 6.99, emoji: "🍫", category: "dessert" },
  { id: 12, name: "Ice Cream Sundae", desc: "Vanilla, chocolate sauce and sprinkles.", price: 5.49, emoji: "🍨", category: "dessert" },
];

const menuGrid = document.getElementById("menu-grid");
const cartEl = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const toast = document.getElementById("toast");

let cart = [];

// Render menu cards
function renderMenu(filter = "all") {
  const items = filter === "all" ? menuItems : menuItems.filter(i => i.category === filter);
  menuGrid.innerHTML = items.map(item => `
    <div class="card">
      <div class="card-img">${item.emoji}</div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="card-footer">
          <span class="price">$${item.price.toFixed(2)}</span>
          <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to cart">+</button>
        </div>
      </div>
    </div>
  `).join("");
}

// Menu filters
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    renderMenu(btn.dataset.filter);
  });
});

// Add to cart
menuGrid.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const item = menuItems.find(i => i.id === Number(btn.dataset.id));
  const existing = cart.find(c => c.id === item.id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCart();
  showToast(`${item.emoji} ${item.name} added to cart`);
});

// Change quantity
cartItemsEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const item = cart.find(c => c.id === Number(btn.dataset.id));
  if (btn.dataset.action === "plus") item.qty++;
  else item.qty--;
  cart = cart.filter(c => c.qty > 0);
  updateCart();
});

function updateCart() {
  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  const total = cart.reduce((sum, c) => sum + c.qty * c.price, 0);
  cartCount.textContent = count;
  cartTotal.textContent = `$${total.toFixed(2)}`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty">Your cart is empty 🍽️</p>`;
    return;
  }
  cartItemsEl.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="emoji">${c.emoji}</div>
      <div class="info">
        <h4>${c.name}</h4>
        <span>$${(c.price * c.qty).toFixed(2)}</span>
      </div>
      <div class="qty">
        <button data-action="minus" data-id="${c.id}">−</button>
        <span>${c.qty}</span>
        <button data-action="plus" data-id="${c.id}">+</button>
      </div>
    </div>
  `).join("");
}

// Open / close cart
function toggleCart(open) {
  cartEl.classList.toggle("open", open);
  overlay.classList.toggle("show", open);
}
document.getElementById("cart-btn").addEventListener("click", () => toggleCart(true));
document.getElementById("cart-close").addEventListener("click", () => toggleCart(false));
overlay.addEventListener("click", () => toggleCart(false));

// Checkout
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  cart = [];
  updateCart();
  toggleCart(false);
  showToast("🎉 Order placed! Thank you.");
});

// Toast message
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// Mobile menu
const navLinks = document.getElementById("nav-links");
document.getElementById("menu-toggle").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 20);
});

// Reservation form
document.getElementById("reserve-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("r-name").value;
  const date = document.getElementById("r-date").value;
  const time = document.getElementById("r-time").value;
  const guests = document.getElementById("r-guests").value;
  const msg = document.getElementById("reserve-msg");
  msg.textContent = `Thanks ${name}! Your table for ${guests} on ${date} at ${time} is reserved. ✅`;
  e.target.reset();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

renderMenu();
updateCart();
