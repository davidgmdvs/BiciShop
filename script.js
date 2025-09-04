const products = [
  { id: 1, name: "Bicicleta de Ruta", price: 1200, category: "Ruta", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
  { id: 2, name: "Bicicleta de Montaña", price: 1500, category: "Montaña", img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
  { id: 3, name: "Bicicleta Urbana", price: 900, category: "Urbana", img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
  { id: 4, name: "BMX", price: 800, category: "BMX", img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
  { id: 5, name: "Bicicleta de Ruta Profesional", price: 2500, category: "Ruta", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
  { id: 6, name: "Bicicleta de Montaña Suspensión Completa", price: 1800, category: "Montaña", img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const categoryFilter = document.getElementById("categoryFilter");
const overlay = document.getElementById("overlay");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");

// Función para mostrar notificación
function showNotification(message) {
  notificationText.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Filtrado en tiempo real
[searchInput, sortSelect, minPrice, maxPrice, categoryFilter].forEach(element => {
  element.addEventListener('input', applyFilters);
  element.addEventListener('change', applyFilters);
});

function renderProducts(list) {
  productContainer.innerHTML = "";
  
  if (list.length === 0) {
    productContainer.innerHTML = `s seguro de que quieres vaciar el carrito?")) {
      cart = [];
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <i class="fas fa-search" style="font-size: 3rem; color: #e9ecef; margin-bottom: 1rem;"></i>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustando los filtros de búsqueda</p>
      </div>
    `;
    return;
  }
  
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" />
      </div>
      <div class="card-content">
        <span class="category">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="price">$${p.price}</div>
        <button class="btn" onclick="addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Añadir al carrito
        </button>
      </div>
    `;
    productContainer.appendChild(card);
  });
}

function applyFilters() {
  let list = [...products];

  // Filtro por texto
  const term = searchInput.value.toLowerCase();
  if (term) list = list.filter(p => p.name.toLowerCase().includes(term));

  // Filtro por categoría
  const category = categoryFilter.value;
  if (category) list = list.filter(p => p.category === category);

  // Filtro por precio mínimo
  if (minPrice.value) list = list.filter(p => p.price >= parseInt(minPrice.value));
  
  // Filtro por precio máximo
  if (maxPrice.value) list = list.filter(p => p.price <= parseInt(maxPrice.value));

  // Ordenamiento
  if (sortSelect.value === "asc") list.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "desc") list.sort((a, b) => b.price - a.price);

  renderProducts(list);
}

// Inicializar productos
renderProducts(products);

// Elementos del carrito
const cartBtn = document.getElementById("openCart");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartBtn = document.getElementById("closeCart");
const cartList = document.getElementById("cartList");
const emptyMsg = document.getElementById("emptyMsg");
const cartCount = document.getElementById("cartCount");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const clearCartBtn = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutForm = document.getElementById("checkoutForm");
const form = document.getElementById("form");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    cartCount.textContent = "0";
  } else {
    emptyMsg.style.display = "none";
    cart.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.img}" alt="${item.name}" />
        </div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <div class="cart-item-price">$${item.price} x ${item.qty}</div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      cartList.appendChild(div);
    });
  }
  
  cartCount.textContent = cart.reduce((total, item) => total + item.qty, 0);
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;
  
  subtotalEl.textContent = `$${subtotal}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
  saveCart();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  
  updateCart();
  showNotification(`${product.name} añadido al carrito`);
}

function changeQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    updateCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
  showNotification("Producto eliminado del carrito");
}

// Abrir y cerrar carrito
cartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
  checkoutForm.style.display = "none";
}

closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Vaciar carrito
clearCartBtn.addEventListener("click", () => {
  if (cart.length > 0) {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      cart = [];
      updateCart();
      showNotification("Carrito vaciado");
    }
  }
});

// Checkout
checkoutBtn.addEventListener("click", () => {
  checkoutForm.style.display = "block";
  checkoutForm.scrollIntoView({ behavior: 'smooth' });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("¡Compra confirmada! Gracias por tu pedido.");
  cart = [];
  updateCart();
  checkoutForm.style.display = "none";
  closeCart();
});

// Inicializar carrito
updateCart();