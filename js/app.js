/* ========================================== */
/* CAR HOUSE - ADMIN PANEL APPLICATION */
/* Light Mode Version */
/* ========================================== */
console.log('js/app.js loading...');

/* ========================================== */
/* CONFIGURATION & DEFAULT VALUES */
/* ========================================== */

/**
 * Configuration object for the Car House admin panel
 */
const config = {
  app_title: "Car House",
  dashboard_title: "Dashboard Overview",
  products_title: "Product Management",
  categories_title: "Category Management",
  orders_title: "Orders",
  users_title: "Users",
  bookings_title: "Workshop Bookings",
  service_types_title: "Service Types",
  footer_text: "Car House · Admin Panel"
};

/* ========================================== */
/* UTILITY FUNCTIONS */
/* ========================================== */

/**
 * Formats a number as currency (EGP)
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
  return value.toFixed(2) + " EGP";
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Update rating display with stars
 * @param {number} rating - Rating value (0-5)
 */
function updateRatingDisplay(rating) {
  const display = document.getElementById('rating-display');
  if (!display) return;

  const fullStars = Math.floor(rating);
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  display.textContent = `${stars} (${rating.toFixed(1)})`;
}

/* ========================================== */
/* TAX CONFIGURATION */
/* ========================================== */

const TAX_RATE = 0.14; // 14% VAT

/**
 * Calculate tax amount
 * @param {number} subtotal - Subtotal before tax
 * @returns {number} Tax amount
 */
function calculateTax(subtotal) {
  return subtotal * TAX_RATE;
}

/**
 * Calculate subtotal from total (reverse calculation)
 * @param {number} total - Total including tax
 * @returns {number} Subtotal before tax
 */
function calculateSubtotal(total) {
  return total / (1 + TAX_RATE);
}

/**
 * Calculate total with tax
 * @param {number} subtotal - Subtotal before tax
 * @returns {number} Total including tax
 */
function calculateTotalWithTax(subtotal) {
  return subtotal * (1 + TAX_RATE);
}

/* ========================================== */
/* BASE LAYOUT CREATION */
/* ========================================== */

/**
 * Creates the main layout structure of the admin panel
 */
function createBaseLayout() {
  const root = document.getElementById("root");
  root.innerHTML = "";

  const appWrapper = document.createElement("div");
  appWrapper.id = "app-wrapper";
  appWrapper.className = "w-full h-full flex flex-col bg-slate-50 text-slate-800 font-sans";

  /* ====================================== */
  /* TOP HEADER BAR */
  /* ====================================== */

  const header = document.createElement("header");
  header.className = "w-full flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white shadow-sm";
  header.innerHTML = `
    <div class="flex items-center gap-3">
      <button id="mobile-menu-btn" class="md:hidden focus-outline p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Toggle menu">
        <svg id="menu-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <svg id="close-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-md overflow-hidden">
        <img src="Logo.png" alt="Car House" class="w-full h-full object-contain" />
      </div>
      <div class="flex flex-col">
        <h1 id="app-title" class="text-sm sm:text-base font-semibold tracking-tight text-slate-800">${config.app_title}</h1>
        <p class="text-[10px] sm:text-xs text-slate-500 hidden xs:block">Manage products, orders & customers</p>
      </div>
    </div>
    <div class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
      <span class="hidden sm:inline" id="user-name">Admin</span>
      <button id="logout-btn" class="focus-outline px-2 sm:px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] sm:text-xs text-slate-700 hover:border-orange-500 hover:text-orange-600 shadow-sm">
        Logout
      </button>
    </div>
  `;

  /* ====================================== */
  /* MAIN CONTENT AREA */
  /* ====================================== */

  const mainArea = document.createElement("div");
  mainArea.className = "flex-1 w-full flex overflow-hidden";

  /* ====================================== */
  /* SIDEBAR NAVIGATION */
  /* ====================================== */

  // Sidebar overlay for mobile
  const sidebarOverlay = document.createElement("div");
  sidebarOverlay.id = "sidebar-overlay";
  sidebarOverlay.className = "fixed inset-0 bg-black/40 z-30 hidden md:hidden";

  const sidebar = document.createElement("aside");
  sidebar.id = "sidebar";
  sidebar.className = "fixed md:relative inset-y-0 left-0 z-40 w-64 h-full bg-white border-r border-slate-200 flex flex-col shadow-lg md:shadow-sm transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out";
  sidebar.innerHTML = `
    <nav class="flex-1 overflow-y-auto app-scrollbar py-4">
      <ul class="space-y-1 px-3" aria-label="Main navigation">
        <li>
          <button data-page="dashboard" class="nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 focus-outline">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-orange-50 text-orange-500 text-sm">📊</span>
            <span>Dashboard</span>
          </button>
        </li>
        <li>
          <button data-page="products" class="nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 focus-outline">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-teal-50 text-teal-600 text-sm">🛠️</span>
            <span>Products</span>
          </button>
        </li>
        <li>
          <button data-page="categories" class="nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 focus-outline">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-orange-50 text-orange-500 text-sm">🏷️</span>
            <span>Categories</span>
          </button>
        </li>
        <li>
          <button data-page="orders" class="nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 focus-outline">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-teal-50 text-teal-600 text-sm">📦</span>
            <span>Orders</span>
          </button>
        </li>
        <li>
          <button data-page="bookings" class="nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 focus-outline">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-purple-50 text-purple-600 text-sm">🔧</span>
            <span>Bookings</span>
          </button>
        </li>
        <li>
          <button data-page="service-types" class="nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 focus-outline">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 text-sm">⚙️</span>
            <span>Services</span>
          </button>
        </li>
        <li>
          <button data-page="users" class="nav-link w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 focus-outline">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-orange-50 text-orange-500 text-sm">👥</span>
            <span>Users</span>
          </button>
        </li>
      </ul>
    </nav>
    <div class="px-3 py-3 border-t border-slate-200 text-[11px] text-slate-500">
      <p id="footer-text" class="truncate">${config.footer_text}</p>
    </div>
  `;

  const main = document.createElement("main");
  main.id = "main-content";
  main.className = "flex-1 h-full overflow-y-auto app-scrollbar bg-slate-50";
  main.setAttribute("role", "main");
  main.setAttribute("aria-live", "polite");

  mainArea.appendChild(sidebarOverlay);
  mainArea.appendChild(sidebar);
  mainArea.appendChild(main);
  appWrapper.appendChild(header);
  appWrapper.appendChild(mainArea);
  root.appendChild(appWrapper);

  // Attach logout handler
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await AuthService.logout();
    window.location.href = 'login.html';
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  function toggleMobileMenu() {
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    if (isOpen) {
      sidebar.classList.add('-translate-x-full');
      sidebarOverlay.classList.add('hidden');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    } else {
      sidebar.classList.remove('-translate-x-full');
      sidebarOverlay.classList.remove('hidden');
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    }
  }

  mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
  sidebarOverlay?.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a nav link is clicked
  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('button[data-page]') && window.innerWidth < 768) {
      toggleMobileMenu();
    }
  });
}

/* ========================================== */
/* DASHBOARD PAGE */
/* ========================================== */

async function renderDashboard() {
  const main = document.getElementById("main-content");
  if (!main) return;

  // Show loading
  main.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center gap-3">
      <div class="spinner"></div>
      <p class="text-xs text-slate-500 font-medium">Loading Dashboard...</p>
    </div>`;

  // Fetch statistics
  const stats = await DatabaseService.getStatistics();

  main.innerHTML = `
    <section class="w-full h-full px-4 sm:px-6 py-4 flex flex-col gap-4 fade-in">
      <header class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-semibold tracking-tight text-slate-800">${config.dashboard_title}</h2>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Quick overview of your car spare parts store.</p>
        </div>
      </header>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
        <article class="card-elevated rounded-xl bg-white border border-slate-200 px-3 py-3 flex flex-col gap-2 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] text-slate-500 font-medium">Total Products</h3>
            <span class="text-xs px-2 py-[1px] rounded-full bg-orange-50 text-orange-600 border border-orange-200">Inventory</span>
          </div>
          <p class="text-lg font-semibold text-slate-800">${stats.totalProducts}</p>
          <p class="text-[11px] text-slate-500">Active spare parts in catalog</p>
        </article>

        <article class="card-elevated rounded-xl bg-white border border-slate-200 px-3 py-3 flex flex-col gap-2 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] text-slate-500 font-medium">Categories</h3>
            <span class="text-xs px-2 py-[1px] rounded-full bg-teal-50 text-teal-600 border border-teal-200">Structure</span>
          </div>
          <p class="text-lg font-semibold text-slate-800">${stats.totalCategories}</p>
          <p class="text-[11px] text-slate-500">Groups for easy browsing</p>
        </article>

        <article class="card-elevated rounded-xl bg-white border border-slate-200 px-3 py-3 flex flex-col gap-2 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] text-slate-500 font-medium">Orders</h3>
            <span class="text-xs px-2 py-[1px] rounded-full bg-orange-50 text-orange-600 border border-orange-200">Activity</span>
          </div>
          <p class="text-lg font-semibold text-slate-800">${stats.totalOrders}</p>
          <p class="text-[11px] text-slate-500">Customer purchases</p>
        </article>

        <article class="card-elevated rounded-xl bg-white border border-slate-200 px-3 py-3 flex flex-col gap-2 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] text-slate-500 font-medium">Revenue</h3>
            <span class="text-xs px-2 py-[1px] rounded-full bg-teal-50 text-teal-600 border border-teal-200">Total</span>
          </div>
          <p class="text-lg font-semibold text-slate-800">${formatCurrency(stats.totalRevenue)}</p>
          <p class="text-[11px] text-slate-500">Total sales revenue</p>
        </article>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
        <article class="card-elevated rounded-xl bg-white border border-slate-200 px-3 py-3 flex flex-col gap-2 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] text-slate-500 font-medium">Workshop Bookings</h3>
            <span class="text-xs px-2 py-[1px] rounded-full bg-purple-50 text-purple-600 border border-purple-200">Service</span>
          </div>
          <p class="text-lg font-semibold text-slate-800">${stats.totalBookings || 0}</p>
          <p class="text-[11px] text-slate-500">${stats.pendingBookings || 0} pending appointments</p>
        </article>

        <article class="card-elevated rounded-xl bg-white border border-slate-200 px-3 py-3 flex flex-col gap-2 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] text-slate-500 font-medium">Total Users</h3>
            <span class="text-xs px-2 py-[1px] rounded-full bg-slate-100 text-slate-600 border border-slate-200">Accounts</span>
          </div>
          <p class="text-lg font-semibold text-slate-800">${stats.totalUsers || 0}</p>
          <p class="text-[11px] text-slate-500">Registered customers</p>
        </article>

        <article class="card-elevated rounded-xl bg-white border border-slate-200 px-3 py-3 flex flex-col gap-2 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] text-slate-500 font-medium">Reviews</h3>
            <span class="text-xs px-2 py-[1px] rounded-full bg-amber-50 text-amber-600 border border-amber-200">Feedback</span>
          </div>
          <p class="text-lg font-semibold text-slate-800">${stats.totalReviews || 0}</p>
          <p class="text-[11px] text-slate-500">Avg rating: ${stats.averageRating || '0.0'} ★</p>
        </article>

        <article class="card-elevated rounded-xl bg-white border border-slate-200 px-3 py-3 flex flex-col gap-2 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[11px] text-slate-500 font-medium">Pending Orders</h3>
            <span class="text-xs px-2 py-[1px] rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">Action</span>
          </div>
          <p class="text-lg font-semibold text-slate-800">${stats.pendingOrders || 0}</p>
          <p class="text-[11px] text-slate-500">Awaiting processing</p>
        </article>
      </div>

      <!-- Quick Actions -->
      <div class="mt-4">
        <h3 class="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <button data-quick-action="products" data-target-btn="btn-add-product" class="focus-outline flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-orange-400 hover:shadow-md transition-all group text-slate-600 hover:text-orange-600">
            <div class="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">＋</div>
            <span class="text-xs font-medium">Add Product</span>
          </button>

          <button data-quick-action="categories" data-target-btn="btn-add-category" class="focus-outline flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-teal-400 hover:shadow-md transition-all group text-slate-600 hover:text-teal-600">
            <div class="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">＋</div>
            <span class="text-xs font-medium">Add Category</span>
          </button>

          <button data-quick-action="service-types" data-target-btn="btn-add-service" class="focus-outline flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group text-slate-600 hover:text-indigo-600">
            <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">＋</div>
            <span class="text-xs font-medium">Add Service</span>
          </button>

          <button data-quick-action="bookings" data-target-btn="btn-add-booking" class="focus-outline flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-purple-400 hover:shadow-md transition-all group text-slate-600 hover:text-purple-600">
            <div class="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">＋</div>
            <span class="text-xs font-medium">Add Booking</span>
          </button>

          <button data-quick-action="users" data-target-btn="btn-add-user" class="focus-outline flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all group text-slate-600 hover:text-blue-600">
            <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">＋</div>
            <span class="text-xs font-medium">Add User</span>
          </button>

          <button data-quick-action="users" data-action-type="delete" class="focus-outline flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-red-400 hover:shadow-md transition-all group text-slate-600 hover:text-red-600">
            <div class="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🗑️</div>
            <span class="text-xs font-medium">Delete User</span>
          </button>
        </div>
      </div>
    </section>
  `;

  attachDashboardHandlers();
}

function attachDashboardHandlers() {
  document.querySelectorAll('button[data-quick-action]').forEach(btn => {
    btn.addEventListener('click', async () => {
      // Navigate to the target page
      await setActivePage(btn.dataset.quickAction);

      // If a target button is defined (e.g., 'btn-add-product'), click it
      if (btn.dataset.targetBtn) {
        // Wait briefly for DOM info if needed, though await setActivePage() should be enough
        setTimeout(() => {
          const target = document.getElementById(btn.dataset.targetBtn);
          if (target) {
            target.click();
          } else {
            console.warn('Target button not found:', btn.dataset.targetBtn);
          }
        }, 100);
      }

      // Handle special cases without specific buttons if needed
      if (btn.dataset.actionType === 'delete') {
        // Current implementation just goes to the users page
        // Could assume the user will simply click 'Block' or 'Delete' (if implemented) there.
      }
    });
  });
}

/* ========================================== */
/* PRODUCTS PAGE */
/* ========================================== */

async function renderProductsPage() {
  const main = document.getElementById("main-content");
  if (!main) return;

  // Show loading
  main.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center gap-3">
      <div class="spinner"></div>
      <p class="text-xs text-slate-500 font-medium">Loading Products...</p>
    </div>`;

  // Fetch products and categories
  const [products, categories] = await Promise.all([
    DatabaseService.getProducts(),
    DatabaseService.getCategories()
  ]);

  const rowsHtml = products.map(p => {
    const rating = p.rating || 0;
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

    // Handle Image Display
    // 1. Check for product image
    const hasProductImage = p.images && p.images.length > 0 && p.images[0].url;
    let imageHtml = '';

    // 2. Check for category icon (as fallback or overlay)
    const catIcon = p.category?.icon || '🛠️';
    const isCatIconUrl = catIcon && (catIcon.startsWith('http') || catIcon.startsWith('data:') || catIcon.endsWith('.svg') || catIcon.endsWith('.png') || catIcon.endsWith('.jpg') || catIcon.endsWith('.webp'));

    const catIconDisplay = isCatIconUrl
      ? `<img src="${catIcon}" alt="${p.category?.name || 'Category'}" class="w-full h-full object-contain p-1" />`
      : catIcon;

    if (hasProductImage) {
      // If product has image, show it. If it fails, fallback to category icon logic via hidden div
      imageHtml = `
            <img src="${p.images[0].url}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');" />
            <div class="hidden w-full h-full flex items-center justify-center text-lg bg-slate-100">${catIconDisplay}</div>
        `;
    } else {
      // No product image, show category icon directly
      imageHtml = `<div class="w-full h-full flex items-center justify-center text-lg bg-slate-100">${catIconDisplay}</div>`;
    }

    return `
    <tr class="border-b border-slate-200 hover:bg-slate-50">
      <td class="px-3 py-2">
        <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden relative border border-slate-200">
            ${imageHtml}
        </div>
      </td>
      <td class="px-3 py-2 text-xs sm:text-sm">
        <div class="font-medium text-slate-800">${p.name}</div>
        <div class="text-[10px] text-slate-400 font-mono">${p.sku || 'NO-SKU'}</div>
        <div class="text-[11px] text-slate-500">${p.car_model || 'Universal'}</div>
      </td>
      <td class="px-3 py-2 text-[11px] sm:text-xs text-slate-600">
        <div>${p.category?.name || 'N/A'}</div>
        <div class="text-[10px] text-slate-400">${p.brand || 'No Brand'}</div>
      </td>
      <td class="px-3 py-2 text-[11px] sm:text-xs">
        <div class="text-orange-600 font-medium">${formatCurrency(p.price)}</div>
      </td>
      <td class="px-3 py-2 text-[11px] sm:text-xs">
        <div class="flex items-center gap-1">
          <span class="text-amber-500 text-sm">${stars}</span>
          <span class="text-slate-500">(${rating.toFixed(1)})</span>
        </div>
      </td>
      <td class="px-3 py-2 text-[11px] sm:text-xs">
        <span class="inline-flex items-center rounded-full px-2 py-[1px] border border-slate-300 text-slate-700 bg-slate-50">
          ${p.stock} in stock
        </span>
        ${p.is_featured ? '<div class="text-[10px] text-orange-500 font-medium mt-1">★ Featured</div>' : ''}
      </td>
      <td class="px-3 py-2">
        <div class="flex flex-wrap gap-1.5">
          <button data-action="edit-product" data-id="${p.id}" class="focus-outline text-[11px] px-2 py-[2px] rounded-full bg-white text-slate-700 border border-slate-300 hover:border-teal-500 hover:text-teal-600">Edit</button>
          <button data-action="delete-product" data-id="${p.id}" class="focus-outline text-[11px] px-2 py-[2px] rounded-full bg-white text-slate-600 border border-slate-300 hover:border-red-500 hover:text-red-600">Delete</button>
        </div>
      </td>
    </tr>
  `;
  }).join("");

  const categoriesOptions = categories.map(c => `
    <option value="${c.id}">${c.name}</option>
  `).join("");

  main.innerHTML = `
    <section class="w-full h-full px-4 sm:px-6 py-4 flex flex-col gap-4 fade-in">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-semibold tracking-tight text-slate-800">${config.products_title}</h2>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Manage car spare parts inventory, prices and compatibility.</p>
        </div>
        <button id="btn-add-product" class="focus-outline inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-orange-600">
          <span class="text-sm">＋</span>
          <span>Add product</span>
        </button>
      </header>

      <div class="flex-1 min-h-0 rounded-xl bg-white border border-slate-200 overflow-hidden flex flex-col shadow-sm">
        <div class="px-3 sm:px-4 py-2 border-b border-slate-200 bg-slate-50">
          <p class="text-[11px] sm:text-xs text-slate-500">Showing ${products.length} products</p>
        </div>

        <div class="flex-1 overflow-auto app-scrollbar">
          <table class="min-w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-50 sticky top-0 z-10">
              <tr class="text-[11px] sm:text-xs text-slate-500 border-b border-slate-200">
                <th scope="col" class="px-3 py-2 font-medium">Image</th>
                <th scope="col" class="px-3 py-2 font-medium">Name & Model</th>
                <th scope="col" class="px-3 py-2 font-medium">Category</th>
                <th scope="col" class="px-3 py-2 font-medium">Price</th>
                <th scope="col" class="px-3 py-2 font-medium">Rating</th>
                <th scope="col" class="px-3 py-2 font-medium">Stock</th>
                <th scope="col" class="px-3 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="products-tbody">
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <div id="product-modal" class="hidden fixed inset-0 flex items-center justify-center z-50">
      <div class="modal-backdrop absolute inset-0 bg-black/40 backdrop-blur-sm" id="modal-backdrop"></div>
      <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl mx-4 app-scrollbar">
        <form id="product-form" class="flex flex-col gap-4 px-4 sm:px-6 py-5">
          <div class="flex items-start justify-between gap-3 sticky top-0 bg-white z-10 pb-2 border-b border-slate-100">
            <div>
              <h3 id="product-modal-title" class="text-base sm:text-lg font-bold text-slate-800">New product</h3>
              <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5">Add or update car spare part details.</p>
            </div>
            <button type="button" id="btn-close-product-modal" class="focus-outline text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
          </div>

          <input type="hidden" id="product-id" />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Left Column -->
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1">
                <label for="product-name" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Product Display Name</label>
                <input id="product-name" type="text" required class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-orange-500 transition-all" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1">
                  <label for="product-sku" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">SKU Code</label>
                  <input id="product-sku" type="text" placeholder="CH-001" class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono" />
                </div>
                <div class="flex flex-col gap-1">
                  <label for="product-brand" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Manufacturer/Brand</label>
                  <input id="product-brand" type="text" required class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3">
                <div class="flex flex-col gap-1">
                  <label for="product-category" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Category</label>
                  <select id="product-category" required class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                    <option value="">Select category</option>
                    ${categoriesOptions}
                  </select>
                </div>
                <div class="flex flex-col gap-1">
                  <label for="product-car-model" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Car Compatibility</label>
                  <input id="product-car-model" type="text" placeholder="e.g. BMW X5 2020+" class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800" />
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1">
                <label for="product-image" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Product Main Image</label>
                <input id="product-image" type="file" accept="image/*" class="focus-outline text-[10px] px-2 py-1.5 rounded-lg bg-slate-100 border border-dashed border-slate-300 text-slate-700 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer" />
              </div>

              <div class="grid grid-cols-1 gap-3">
                <div class="flex flex-col gap-1">
                  <label for="product-price" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Selling Price (EGP)</label>
                  <input id="product-price" type="number" step="0.01" min="0" required class="focus-outline text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3">
                <div class="flex flex-col gap-1">
                  <label for="product-stock" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Current Inventory Level</label>
                  <input id="product-stock" type="number" min="0" required class="focus-outline text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold" />
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Product Visibility</label>
                <label class="flex items-center gap-2 cursor-pointer mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <input id="product-featured" type="checkbox" class="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-300" />
                  <span class="text-xs text-slate-700">Display in Featured Products Section</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="product-rating" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Customer Rating (Simulated)</label>
            <div class="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <input id="product-rating" type="range" min="0" max="5" step="0.1" value="0" class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              <span id="rating-display" class="text-amber-500 text-sm font-bold min-w-[90px] text-center">☆☆☆☆☆ (0.0)</span>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="product-description" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Full Technical Description</label>
            <textarea id="product-description" rows="3" class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-orange-500 transition-all"></textarea>
          </div>

          <div class="flex items-center justify-between gap-3 mt-2 pt-4 border-t border-slate-100">
            <p id="product-form-message" class="text-[11px] font-medium"></p>
            <div class="flex items-center gap-3">
              <button type="button" id="btn-cancel-product" class="focus-outline px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Discard</button>
              <button type="submit" id="btn-save-product" class="focus-outline px-6 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all">Publish Product</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  attachProductHandlers();
}

function attachProductHandlers() {
  const modal = document.getElementById("product-modal");
  const tbody = document.getElementById("products-tbody");

  // Close modal handlers
  document.getElementById('btn-close-product-modal')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('btn-cancel-product')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('modal-backdrop')?.addEventListener('click', () => modal.classList.add('hidden'));

  // Add product
  document.getElementById('btn-add-product')?.addEventListener('click', () => {
    document.getElementById('product-modal-title').textContent = 'New product';
    document.getElementById('product-id').value = '';
    document.getElementById('product-image').value = ''; // Reset file input
    document.getElementById('product-form').reset();
    document.getElementById('product-form-message').textContent = '';
    document.getElementById('product-rating').value = 0;
    updateRatingDisplay(0);
    modal.classList.remove('hidden');
  });

  // Rating slider live update
  document.getElementById('product-rating')?.addEventListener('input', (e) => {
    updateRatingDisplay(parseFloat(e.target.value));
  });

  // Edit/Delete handlers
  tbody?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'delete-product') {
      if (confirm('Are you sure you want to delete this product?')) {
        const result = await DatabaseService.deleteProduct(id);
        if (result.success) {
          renderProductsPage();
        } else {
          alert('Failed to delete product: ' + result.error);
        }
      }
    } else if (action === 'edit-product') {
      const products = await DatabaseService.getProducts();
      const product = products.find(p => p.id === id);
      if (!product) return;

      document.getElementById('product-modal-title').textContent = 'Edit product';
      document.getElementById('product-id').value = product.id;
      document.getElementById('product-image').value = ''; // Reset file input
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-sku').value = product.sku || '';
      document.getElementById('product-brand').value = product.brand || '';
      document.getElementById('product-category').value = product.category_id || '';
      document.getElementById('product-car-model').value = product.car_model || '';

      document.getElementById('product-price').value = product.price;
      document.getElementById('product-stock').value = product.stock;
      document.getElementById('product-featured').checked = product.is_featured || false;

      document.getElementById('product-description').value = product.description || '';

      // Set rating
      const rating = product.rating || 0;
      document.getElementById('product-rating').value = rating;
      updateRatingDisplay(rating);

      modal.classList.remove('hidden');
    }
  });

  // Form submission
  document.getElementById('product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const msg = document.getElementById('product-form-message');
    const btn = document.getElementById('btn-save-product');
    const id = document.getElementById('product-id').value;

    const data = {
      name: document.getElementById('product-name').value,
      sku: document.getElementById('product-sku').value,
      brand: document.getElementById('product-brand').value,
      category_id: document.getElementById('product-category').value || null,
      car_model: document.getElementById('product-car-model').value,
      price: parseFloat(document.getElementById('product-price').value),
      stock: parseInt(document.getElementById('product-stock').value),
      is_featured: document.getElementById('product-featured').checked,
      rating: parseFloat(document.getElementById('product-rating').value) || 0,
      description: document.getElementById('product-description').value
    };

    btn.disabled = true;
    btn.textContent = 'Saving...';

    // 1. Save Product Data
    const result = id
      ? await DatabaseService.updateProduct(id, data)
      : await DatabaseService.createProduct(data);

    if (result.success) {
      // 2. Handle Image Upload if selected
      const imageFile = document.getElementById('product-image').files[0];
      if (imageFile) {
        try {
          const productId = result.data.id;
          const imageUrl = await DatabaseService.uploadFile(imageFile, 'products');

          if (imageUrl) {
            await DatabaseService.addProductImage(productId, {
              url: imageUrl,
              alt: data.title,
              position: 0
            });
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Don't fail the whole operation, just warn
          alert('Product saved, but image upload failed: ' + uploadError.message);
        }
      }

      msg.textContent = 'Saved successfully!';
      msg.className = 'text-[11px] text-teal-600';
      setTimeout(() => {
        modal.classList.add('hidden');
        renderProductsPage();
      }, 500);
    } else {
      msg.textContent = result.error;
      msg.className = 'text-[11px] text-red-600';
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  });
}

/* ========================================== */
/* CATEGORIES PAGE */
/* ========================================== */

async function renderCategoriesPage() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center gap-3">
      <div class="spinner"></div>
      <p class="text-xs text-slate-500 font-medium">Loading Categories...</p>
    </div>`;

  const categories = await DatabaseService.getCategories();

  const listHtml = categories.map(c => {
    // Check if icon is a URL (image) or an emoji
    const isImageUrl = c.icon && (c.icon.startsWith('http') || c.icon.startsWith('data:') || c.icon.endsWith('.svg') || c.icon.endsWith('.png') || c.icon.endsWith('.jpg') || c.icon.endsWith('.webp'));
    const iconDisplay = isImageUrl
      ? `<img src="${c.icon}" alt="${c.name}" class="w-full h-full object-contain" onerror="this.parentElement.innerHTML='🏷️'" />`
      : (c.icon || '🏷️');

    return `
    <li class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-teal-400 card-elevated shadow-sm ${!c.is_active ? 'opacity-60 bg-slate-50' : ''}">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg overflow-hidden border border-slate-100">${iconDisplay}</div>
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="text-xs sm:text-sm font-bold text-slate-800">${c.name}</span>
            ${!c.is_active ? '<span class="text-[9px] px-1.5 py-[1px] rounded bg-slate-200 text-slate-500 uppercase font-bold">Hidden</span>' : ''}
          </div>
          <span class="text-[10px] text-slate-400 font-mono">/${c.slug || ''}</span>
        </div>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-[10px] text-slate-400 mr-2">Pos: ${c.position || 0}</span>
        <button data-action="edit-category" data-id="${c.id}" class="focus-outline text-[10px] px-2 py-[2px] rounded-full bg-white text-slate-700 border border-slate-300 hover:border-teal-500 hover:text-teal-600">Edit</button>
        <button data-action="delete-category" data-id="${c.id}" class="focus-outline text-[10px] px-2 py-[2px] rounded-full bg-white text-slate-600 border border-slate-300 hover:border-red-500 hover:text-red-600">Delete</button>
      </div>
    </li>
    `;
  }).join("");

  main.innerHTML = `
    <section class="w-full h-full px-4 sm:px-6 py-4 flex flex-col gap-4 fade-in">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-semibold tracking-tight text-slate-800">${config.categories_title}</h2>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Organize spare parts into clear, searchable groups.</p>
        </div>
        <button id="btn-add-category" class="focus-outline inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500 text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-teal-600">
          <span class="text-sm">＋</span>
          <span>Add category</span>
        </button>
      </header>

      <div class="flex-1 min-h-0 rounded-xl bg-slate-50 border border-slate-200 p-3 sm:p-4 flex flex-col gap-3">
        <p class="text-[11px] sm:text-xs text-slate-500">You have ${categories.length} categories.</p>
        <ul id="categories-list" class="space-y-2 overflow-auto app-scrollbar">
          ${listHtml}
        </ul>
      </div>

      <div id="category-modal" class="hidden fixed inset-0 flex items-center justify-center z-50">
        <div class="modal-backdrop absolute inset-0" id="cat-modal-backdrop"></div>
        <div class="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-2xl mx-4">
          <form id="category-form" class="flex flex-col gap-3 px-4 sm:px-5 py-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 id="category-modal-title" class="text-sm sm:text-base font-semibold text-slate-800">New category</h3>
                <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Create or rename a category.</p>
              </div>
              <button type="button" id="btn-close-category-modal" class="focus-outline text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
            </div>

            <input type="hidden" id="category-id" />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div class="flex flex-col gap-1">
                <label for="category-name" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Category Display Name</label>
                <input id="category-name" type="text" required class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800" />
              </div>

              <div class="flex flex-col gap-1">
                <label for="category-slug" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">URL Slug (e.g. engine-parts)</label>
                <input id="category-slug" type="text" required class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono" />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label for="category-icon" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Icon or Image</label>
              <input id="category-icon" type="file" accept="image/*" class="focus-outline text-[10px] px-2 py-1.5 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-slate-700 file:mr-3 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-teal-500 file:text-white" />
              <input type="hidden" id="category-icon-url" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label for="category-position" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Display Order</label>
                <input id="category-position" type="number" value="0" class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">visibility</label>
                <label class="flex items-center gap-2 cursor-pointer mt-1">
                  <input id="category-is-active" type="checkbox" checked class="w-4 h-4 rounded text-teal-500 border-slate-300" />
                  <span class="text-xs text-slate-700">Active and Visible</span>
                </label>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label for="category-description" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Brief Description</label>
              <input id="category-description" type="text" class="focus-outline text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800" />
            </div>

            <div class="flex items-center justify-between gap-3 mt-1">
              <p id="category-form-message" class="text-[11px] text-slate-500"></p>
              <div class="flex items-center gap-2">
                <button type="button" id="btn-cancel-category" class="focus-outline px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] sm:text-xs text-slate-700 hover:border-slate-400">Cancel</button>
                <button type="submit" id="btn-save-category" class="focus-outline px-3 py-1.5 rounded-lg bg-teal-500 text-white text-[11px] sm:text-xs font-semibold hover:bg-teal-600">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
    `;

  attachCategoryHandlers();
}

function attachCategoryHandlers() {
  const modal = document.getElementById("category-modal");
  const list = document.getElementById("categories-list");

  document.getElementById('btn-close-category-modal')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('btn-cancel-category')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('cat-modal-backdrop')?.addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('btn-add-category')?.addEventListener('click', () => {
    document.getElementById('category-modal-title').textContent = 'New category';
    document.getElementById('category-id').value = '';
    document.getElementById('category-form').reset();
    document.getElementById('category-form-message').textContent = '';
    modal.classList.remove('hidden');
  });

  list?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'delete-category') {
      if (confirm('Delete this category? Products will be uncategorized.')) {
        const result = await DatabaseService.deleteCategory(id);
        if (result.success) {
          renderCategoriesPage();
        } else {
          alert('Failed to delete: ' + result.error);
        }
      }
    } else if (action === 'edit-category') {
      const categories = await DatabaseService.getCategories();
      const category = categories.find(c => c.id === id);
      if (!category) return;

      document.getElementById('category-modal-title').textContent = 'Edit category';
      document.getElementById('category-id').value = category.id;
      document.getElementById('category-name').value = category.name;
      document.getElementById('category-slug').value = category.slug || '';
      document.getElementById('category-position').value = category.position || 0;
      document.getElementById('category-is-active').checked = category.is_active !== false;
      document.getElementById('category-icon-url').value = category.icon || '';
      // Reset file input
      document.getElementById('category-icon').value = '';
      document.getElementById('category-description').value = category.description || '';
      modal.classList.remove('hidden');
    }
  });

  document.getElementById('category-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const msg = document.getElementById('category-form-message');
    const btn = document.getElementById('btn-save-category');
    const id = document.getElementById('category-id').value;

    btn.disabled = true;
    btn.textContent = 'Saving...';

    let iconUrl = document.getElementById('category-icon-url').value;
    const iconFile = document.getElementById('category-icon').files[0];

    if (iconFile) {
      try {
        const uploadedUrl = await DatabaseService.uploadFile(iconFile, 'categories');
        if (uploadedUrl) iconUrl = uploadedUrl;
      } catch (error) {
        console.error('Upload failed:', error);
        msg.textContent = 'Image upload failed: ' + error.message;
        btn.disabled = false;
        btn.textContent = 'Save';
        return;
      }
    }

    const categoryData = {
      name: document.getElementById('category-name').value,
      slug: document.getElementById('category-slug').value,
      position: parseInt(document.getElementById('category-position').value) || 0,
      is_active: document.getElementById('category-is-active').checked,
      description: document.getElementById('category-description').value,
      icon: iconUrl || '🏷️'
    };

    const result = id
      ? await DatabaseService.updateCategory(id, categoryData)
      : await DatabaseService.createCategory(categoryData);

    if (result.success) {
      msg.textContent = 'Saved!';
      msg.className = 'text-[11px] text-teal-600';
      setTimeout(() => {
        modal.classList.add('hidden');
        renderCategoriesPage();
      }, 500);
    } else {
      msg.textContent = result.error;
      msg.className = 'text-[11px] text-red-600';
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  });
}

/* ========================================== */
/* ORDERS PAGE */
/* ========================================== */

async function renderOrdersPage() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center gap-3">
      <div class="spinner"></div>
      <p class="text-xs text-slate-500 font-medium">Loading Orders...</p>
    </div>`;

  const orders = await DatabaseService.getOrders();

  const rowsHtml = orders.map(o => {
    let badgeClass = "inline-flex items-center px-2 py-[1px] rounded-full border text-[10px]";
    if (o.status === "pending") badgeClass += " border-orange-300 text-orange-700 bg-orange-50";
    else if (o.status === "shipped") badgeClass += " border-teal-300 text-teal-700 bg-teal-50";
    else if (o.status === "delivered") badgeClass += " border-green-300 text-green-700 bg-green-50";
    else badgeClass += " border-slate-300 text-slate-600 bg-slate-50";

    const itemCount = o.items?.length || 0;
    const total = o.total || o.total_amount || 0;
    const subtotal = calculateSubtotal(total);
    const tax = calculateTax(subtotal);

    return `
    <tr class="border-b border-slate-200 hover:bg-slate-50 transition-colors">
        <td class="px-3 py-3 text-[11px] sm:text-xs font-bold text-slate-800 font-mono">#${o.id.substring(0, 8).toUpperCase()}</td>
        <td class="px-3 py-3 text-xs sm:text-sm">
          <div class="font-bold text-slate-800">${o.profile?.full_name || o.user?.full_name || 'Anonymous'}</div>
          <div class="text-[10px] text-slate-400 flex items-center gap-1">
            <span>📅</span> ${formatDate(o.created_at)}
          </div>
        </td>
        <td class="px-3 py-3 text-[11px] sm:text-xs">
          <div class="flex flex-col">
            <span class="text-slate-700 font-medium">${itemCount} Items</span>
            <span class="text-[10px] text-slate-400">${o.payment_method || 'No Payment info'}</span>
          </div>
        </td>
        <td class="px-3 py-3 text-[11px] sm:text-xs">
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-2">
              <span class="text-orange-600 font-bold">${formatCurrency(total)}</span>
              <span class="text-[10px] px-1 rounded bg-slate-100 text-slate-500 font-bold">INCL. TAX</span>
            </div>
            <span class="text-[10px] text-slate-400">Net: ${formatCurrency(subtotal)}</span>
          </div>
        </td>
        <td class="px-3 py-3 text-[11px] sm:text-xs">
          <span class="${badgeClass} font-bold uppercase tracking-tighter">${o.status}</span>
        </td>
        <td class="px-3 py-3 text-right">
          <select data-order-id="${o.id}" class="focus-outline bg-white border border-slate-300 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm cursor-pointer hover:border-orange-500">
            <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="processing" ${o.status === "processing" ? "selected" : ""}>Processing</option>
            <option value="shipped" ${o.status === "shipped" ? "selected" : ""}>Shipped</option>
            <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
            <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>Cancelled</option>
            <option value="refunded" ${o.status === "refunded" ? "selected" : ""}>Refunded</option>
          </select>
        </td>
        <td class="px-3 py-3 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button data-action="view-order" data-id="${o.id}" class="focus-outline w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all" title="View Details">👁️</button>
            <button data-action="delete-order" data-id="${o.id}" class="focus-outline w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all" title="Delete Order">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  main.innerHTML = `
    <section class="w-full h-full px-4 sm:px-6 py-4 flex flex-col gap-4 fade-in">
      <header>
        <h2 class="text-base sm:text-lg font-semibold tracking-tight text-slate-800">${config.orders_title}</h2>
        <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Track order status from pending to delivered.</p>
      </header>

      <div class="flex-1 min-h-0 rounded-xl bg-white border border-slate-200 overflow-hidden flex flex-col shadow-sm">
        <div class="px-3 sm:px-4 py-2 border-b border-slate-200 bg-slate-50">
          <p class="text-[11px] sm:text-xs text-slate-500">Total ${orders.length} orders</p>
        </div>

        <div class="flex-1 overflow-auto app-scrollbar">
          <table class="min-w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-50 sticky top-0 z-10">
              <tr class="text-[11px] sm:text-xs text-slate-500 border-b border-slate-200">
                <th scope="col" class="px-3 py-2 font-medium">Order ID</th>
                <th scope="col" class="px-3 py-2 font-medium">Customer</th>
                <th scope="col" class="px-3 py-2 font-medium">Items</th>
                <th scope="col" class="px-3 py-2 font-medium">Amount (14% Tax)</th>
                <th scope="col" class="px-3 py-2 font-medium">Status</th>
                <th scope="col" class="px-3 py-2 font-medium">Update</th>
                <th scope="col" class="px-3 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="orders-tbody">
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Order Details Modal -->
    <div id="order-details-modal" class="hidden fixed inset-0 flex items-center justify-center z-50">
      <div class="modal-backdrop absolute inset-0 bg-black/30 backdrop-blur-sm" id="order-modal-backdrop"></div>
      <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl mx-4 flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 class="text-base sm:text-lg font-semibold text-slate-800">Order Details</h3>
              <p class="text-[11px] sm:text-xs text-slate-500" id="order-modal-id">ID: ...</p>
            </div>
            <button type="button" id="btn-close-order-modal" class="focus-outline text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-5 flex flex-col gap-5" id="order-modal-content">
            <!-- Content will be injected here -->
        </div>
        <div class="flex justify-end px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button type="button" id="btn-done-order" class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-200">Close</button>
        </div>
      </div>
    </div>
    `;

  document.getElementById('orders-tbody')?.addEventListener('change', async (e) => {
    const select = e.target.closest('select[data-order-id]');
    if (!select) return;

    const result = await DatabaseService.updateOrderStatus(select.dataset.orderId, select.value);
    if (!result.success) {
      alert('Failed to update: ' + result.error);
      renderOrdersPage();
    }
  });

  document.getElementById('orders-tbody')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'view-order') {
      const order = orders.find(o => o.id === id);
      if (!order) return;

      const modal = document.getElementById('order-details-modal');
      const modalId = document.getElementById('order-modal-id');
      const modalContent = document.getElementById('order-modal-content');

      // Handlers
      const closeModal = () => modal.classList.add('hidden');
      document.getElementById('btn-close-order-modal').onclick = closeModal;
      document.getElementById('btn-done-order').onclick = closeModal;
      document.getElementById('order-modal-backdrop').onclick = closeModal;

      modalId.textContent = `Order #${order.id.substring(0, 8)}`;

      const itemsHtml = (order.items || []).map(item => `
          <div class="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
              <div class="flex-1">
                  <p class="text-sm font-medium text-slate-800">${item.title || 'Product'}</p>
                  <p class="text-xs text-slate-500">Qty: ${item.quantity} × ${formatCurrency(item.unit_price)}</p>
              </div>
              <div class="text-sm font-medium text-slate-800">${formatCurrency(item.subtotal)}</div>
          </div>
      `).join('');

      const subtotal = calculateSubtotal(order.total_amount);
      const tax = calculateTax(subtotal);

      modalContent.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Customer Info</h4>
                  <div class="flex flex-col gap-1">
                    <p class="text-sm font-bold text-slate-800">${order.profile?.full_name || 'Guest User'}</p>
                    <p class="text-xs text-slate-600 flex items-center gap-2"><span>✉️</span> ${order.profile?.email || 'N/A'}</p>
                    <p class="text-xs text-slate-600 flex items-center gap-2"><span>📞</span> ${order.profile?.phone || 'N/A'}</p>
                  </div>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Shipping Details</h4>
                  <div class="flex flex-col gap-1">
                    <p class="text-xs font-bold text-slate-800">${order.shipping_address?.full_name || order.profile?.full_name || 'Recipient'}</p>
                    <p class="text-xs text-slate-700 leading-relaxed">${order.shipping_address?.address || 'Street address not provided'}</p>
                    <p class="text-[11px] text-slate-500">${order.shipping_address?.city || ''}${order.shipping_address?.state ? ', ' + order.shipping_address.state : ''} ${order.shipping_address?.zip || ''}</p>
                    <p class="text-[10px] text-slate-400 font-bold mt-1 uppercase">${order.shipping_address?.country || 'Egypt'}</p>
                  </div>
              </div>
              <div class="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <h4 class="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-3">Payment info</h4>
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] text-orange-700 font-medium">Method</span>
                      <span class="text-[11px] font-bold text-orange-900">${order.payment_method?.toUpperCase() || 'CASH'}</span>
                    </div>
                    <div class="flex items-center justify-between border-t border-orange-200 pt-2 mt-1">
                      <span class="text-[11px] text-orange-700 font-medium">Status</span>
                      <span class="text-[11px] font-bold text-orange-900">${order.status?.toUpperCase()}</span>
                    </div>
                  </div>
              </div>
          </div>
          
          ${order.notes ? `
          <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <h4 class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Order Notes</h4>
            <p class="text-xs text-blue-800 italic leading-relaxed">"${order.notes}"</p>
          </div>
          ` : ''}

          <div class="border rounded-2xl border-slate-200 overflow-hidden shadow-sm">
              <div class="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <h4 class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Order Items Invoices</h4>
              </div>
              <div class="px-5 max-h-[300px] overflow-y-auto divide-y divide-slate-100">
                  ${itemsHtml}
              </div>
              <div class="bg-slate-50 px-5 py-4 border-t border-slate-200 flex flex-col gap-2">
                  <div class="flex justify-between text-xs text-slate-500">
                      <span>Subtotal (Net)</span>
                      <span>${formatCurrency(subtotal)}</span>
                  </div>
                  <div class="flex justify-between text-xs text-slate-500">
                      <span>Value Added Tax (14%)</span>
                      <span>${formatCurrency(tax)}</span>
                  </div>
                  <div class="flex justify-between text-base font-black text-slate-900 mt-2 pt-3 border-t-2 border-dashed border-slate-200">
                      <span>Total Amount Paid</span>
                      <span class="text-orange-600">${formatCurrency(order.total_amount)}</span>
                  </div>
              </div>
          </div>
      `;

      modal.classList.remove('hidden');

    } else if (action === 'delete-order') {
      if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        const result = await DatabaseService.deleteOrder(id);
        if (result.success) {
          renderOrdersPage();
        } else {
          alert('Failed to delete order: ' + result.error);
        }
      }
    }
  });
}

/* ========================================== */
/* USERS PAGE */
/* ========================================== */

async function renderUsersPage() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center gap-3">
      <div class="spinner"></div>
      <p class="text-xs text-slate-500 font-medium">Loading Users...</p>
    </div>`;

  const users = await DatabaseService.getUsers();

  const rowsHtml = users.map(u => {
    const statusClass = u.blocked
      ? "bg-red-50 text-red-600 border border-red-200"
      : "bg-green-50 text-green-600 border border-green-200";
    const statusLabel = u.blocked ? "Blocked" : "Active";
    const isAdmin = u.role === 'admin' || u.role === 'superadmin' || u.isAdmin;
    const roleClass = isAdmin
      ? "bg-orange-50 text-orange-600 border border-orange-200"
      : "bg-slate-50 text-slate-600 border border-slate-200";

    return `
    <tr class="border-b border-slate-200 hover:bg-slate-50">
        <td class="px-3 py-2 text-xs sm:text-sm">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[11px] text-slate-700 font-medium">
              ${u.full_name?.charAt(0) || 'U'}
            </div>
            <div class="flex flex-col">
              <span class="font-medium text-slate-800">${u.full_name || 'N/A'}</span>
              <span class="text-[10px] text-slate-500">${u.email}</span>
            </div>
          </div>
        </td>
        <td class="px-3 py-2 text-[11px] sm:text-xs">
          <span class="inline-flex items-center px-2 py-[1px] rounded-full ${roleClass} text-[10px]">
            ${u.role || 'customer'}
          </span>
        </td>
        <td class="px-3 py-2 text-[11px] sm:text-xs">
          <span class="inline-flex items-center px-2 py-[1px] rounded-full ${statusClass} text-[10px]">
            ${statusLabel}
          </span>
        </td>
        <td class="px-3 py-2">
          <div class="flex flex-wrap gap-1 justify-end">
            <select data-user-id="${u.id}" data-action="change-role" class="focus-outline bg-white border border-slate-300 rounded-full px-2 py-[2px] text-[10px] text-slate-700">
              <option value="customer" ${u.role === 'customer' ? 'selected' : ''}>Customer</option>
              <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
              <option value="superadmin" ${u.role === 'superadmin' ? 'selected' : ''}>Super Admin</option>
            </select>
            <button data-user-id="${u.id}" data-blocked="${u.blocked}" data-action="toggle-block" class="focus-outline text-[10px] px-2 py-[2px] rounded-full ${u.blocked ? 'bg-green-50 text-green-700 border-green-300' : 'bg-red-50 text-red-700 border-red-300'} border">
              ${u.blocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  main.innerHTML = `
    <section class="w-full h-full px-4 sm:px-6 py-4 flex flex-col gap-4 fade-in">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-semibold tracking-tight text-slate-800">${config.users_title}</h2>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Manage users, roles and access permissions.</p>
        </div>
        <button id="btn-add-user" class="focus-outline inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-orange-600">
          <span class="text-sm">＋</span>
          <span>Add User</span>
        </button>
      </header>

      <div class="flex-1 min-h-0 rounded-xl bg-white border border-slate-200 overflow-hidden flex flex-col shadow-sm">
        <div class="px-3 sm:px-4 py-2 border-b border-slate-200 bg-slate-50">
          <p class="text-[11px] sm:text-xs text-slate-500">Total ${users.length} users</p>
        </div>

        <div class="flex-1 overflow-auto app-scrollbar">
          <table class="min-w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-50 sticky top-0 z-10">
              <tr class="text-[11px] sm:text-xs text-slate-500 border-b border-slate-200">
                <th scope="col" class="px-3 py-2 font-medium">User</th>
                <th scope="col" class="px-3 py-2 font-medium">Role</th>
                <th scope="col" class="px-3 py-2 font-medium">Status</th>
                <th scope="col" class="px-3 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="users-tbody">
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add User Modal -->
    <div id="user-modal" class="hidden fixed inset-0 flex items-center justify-center z-50">
      <div class="modal-backdrop absolute inset-0" id="user-modal-backdrop"></div>
      <div class="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl mx-4">
        <form id="user-form" class="flex flex-col gap-3 px-4 sm:px-5 py-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 id="user-modal-title" class="text-sm sm:text-base font-semibold text-slate-800">Create New User</h3>
              <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Add a new user to the system.</p>
            </div>
            <button type="button" id="btn-close-user-modal" class="focus-outline text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div class="flex flex-col gap-1 sm:col-span-2">
              <label for="user-fullname" class="text-[11px] text-slate-600 font-medium">Full Name</label>
              <input id="user-fullname" type="text" required placeholder="John Doe" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
            </div>
            <div class="flex flex-col gap-1 sm:col-span-2">
              <label for="user-email" class="text-[11px] text-slate-600 font-medium">Email Address</label>
              <input id="user-email" type="email" required placeholder="user@example.com" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="user-password" class="text-[11px] text-slate-600 font-medium">Password</label>
              <input id="user-password" type="password" required minlength="6" placeholder="••••••••" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="user-role" class="text-[11px] text-slate-600 font-medium">Role</label>
              <select id="user-role" required class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800">
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <div class="flex flex-col gap-1 sm:col-span-2">
              <label for="user-phone" class="text-[11px] text-slate-600 font-medium">Phone (Optional)</label>
              <input id="user-phone" type="tel" placeholder="+20 123 456 7890" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 mt-2">
            <p id="user-form-message" class="text-[11px] text-slate-500"></p>
            <div class="flex items-center gap-2">
              <button type="button" id="btn-cancel-user" class="focus-outline px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] sm:text-xs text-slate-700 hover:border-slate-400">Cancel</button>
              <button type="submit" id="btn-save-user" class="focus-outline px-3 py-1.5 rounded-lg bg-orange-500 text-white text-[11px] sm:text-xs font-semibold hover:bg-orange-600">Create User</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </section>
    `;

  attachUserHandlers();
}

function attachUserHandlers() {
  const modal = document.getElementById("user-modal");
  const tbody = document.getElementById("users-tbody");

  // Close modal handlers
  document.getElementById('btn-close-user-modal')?.addEventListener('click', () => modal?.classList.add('hidden'));
  document.getElementById('btn-cancel-user')?.addEventListener('click', () => modal?.classList.add('hidden'));
  document.getElementById('user-modal-backdrop')?.addEventListener('click', () => modal?.classList.add('hidden'));

  // Add user button
  document.getElementById('btn-add-user')?.addEventListener('click', () => {
    const userForm = document.getElementById('user-form');
    const userFormMessage = document.getElementById('user-form-message');

    if (!userForm) {
      if (userFormMessage) userFormMessage.textContent = 'Form not available.';
      return;
    }

    userForm.reset?.();
    if (userFormMessage) userFormMessage.textContent = '';
    modal?.classList.remove('hidden');
  });

  // Handle role change
  tbody?.addEventListener('change', async (e) => {
    const select = e.target.closest('select[data-action="change-role"]');
    if (!select) return;

    const userId = select.dataset.userId;
    const newRole = select.value;

    const result = await DatabaseService.updateUser(userId, { role: newRole });

    if (result.success) {
      // If making admin, also add to admins table
      if (newRole === 'admin' || newRole === 'superadmin') {
        await DatabaseService.addAdmin(userId, newRole, { permissions: ['all'] });
      } else {
        // If removing admin, remove from admins table
        await DatabaseService.removeAdmin(userId);
      }
      renderUsersPage();
    } else {
      alert('Failed to update role: ' + result.error);
      renderUsersPage();
    }
  });

  // Handle block/unblock
  tbody?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action="toggle-block"]');
    if (!btn) return;

    const isBlocked = btn.dataset.blocked === 'true';
    const result = await DatabaseService.updateUser(btn.dataset.userId, { blocked: !isBlocked });

    if (result.success) {
      renderUsersPage();
    } else {
      alert('Failed to update user: ' + result.error);
    }
  });

  // Form submission - create new user
  document.getElementById('user-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const msg = document.getElementById('user-form-message');
    const btn = document.getElementById('btn-save-user');

    const fullName = document.getElementById('user-fullname').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    const phone = document.getElementById('user-phone').value.trim();

    btn.disabled = true;
    btn.textContent = 'Creating...';

    try {
      // Register the user
      const result = await AuthService.register(email, password, fullName, phone, role);

      if (result.success) {
        // If admin role, add to admins table
        if (role === 'admin' || role === 'superadmin') {
          await DatabaseService.addAdmin(result.user.id, role, { permissions: ['all'] });
        }

        msg.textContent = 'User created successfully!';
        msg.className = 'text-[11px] text-green-600';

        setTimeout(() => {
          modal.classList.add('hidden');
          renderUsersPage();
        }, 1000);
      } else {
        msg.textContent = result.error || 'Failed to create user';
        msg.className = 'text-[11px] text-red-600';
        btn.disabled = false;
        btn.textContent = 'Create User';
      }
    } catch (error) {
      msg.textContent = error.message || 'An error occurred';
      msg.className = 'text-[11px] text-red-600';
      btn.disabled = false;
      btn.textContent = 'Create User';
    }
  });
}

/* ========================================== */
/* WORKSHOP BOOKINGS PAGE */
/* ========================================== */

async function renderBookingsPage() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center gap-3">
      <div class="spinner"></div>
      <p class="text-xs text-slate-500 font-medium">Loading Bookings...</p>
    </div>`;

  const [bookings, users, serviceTypes] = await Promise.all([
    DatabaseService.getBookings(),
    DatabaseService.getUsers(),
    DatabaseService.getServiceTypes(true) // Only active service types
  ]);

  const rowsHtml = bookings.map(b => {
    let badgeClass = "inline-flex items-center px-2 py-[1px] rounded-full border text-[10px]";
    if (b.status === "scheduled") badgeClass += " border-blue-300 text-blue-700 bg-blue-50";
    else if (b.status === "pending") badgeClass += " border-orange-300 text-orange-700 bg-orange-50";
    else if (b.status === "in_progress") badgeClass += " border-purple-300 text-purple-700 bg-purple-50";
    else if (b.status === "completed") badgeClass += " border-green-300 text-green-700 bg-green-50";
    else if (b.status === "cancelled") badgeClass += " border-red-300 text-red-700 bg-red-50";
    else badgeClass += " border-slate-300 text-slate-600 bg-slate-50";

    const vehicleInfo = b.vehicle_info || {};
    const vehicleDisplay = vehicleInfo.make
      ? `${vehicleInfo.make} ${vehicleInfo.model || ''} ${vehicleInfo.year || ''}`.trim()
      : vehicleInfo.description || 'N/A';

    const scheduledDate = new Date(b.scheduled_date);
    const dateFormatted = scheduledDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeFormatted = scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return `
    <tr class="border-b border-slate-200 hover:bg-slate-50 transition-colors">
      <td class="px-3 py-3 text-[11px] sm:text-xs font-bold text-slate-800 font-mono">#${b.id.substring(0, 8).toUpperCase()}</td>
      <td class="px-3 py-3 text-xs sm:text-sm">
        <div class="font-bold text-slate-800">${b.profile?.full_name || 'Walk-in Customer'}</div>
        <div class="text-[10px] text-slate-400 flex items-center gap-1">
          <span>📞</span> ${b.profile?.phone || 'No phone'}
        </div>
      </td>
      <td class="px-3 py-3 text-[11px] sm:text-xs">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs border border-indigo-100">${b.service_type_details?.icon || '🔧'}</div>
          <div class="flex flex-col">
            <span class="text-slate-800 font-bold">${b.service_type}</span>
            <span class="text-[10px] text-slate-500 font-medium">${vehicleDisplay}</span>
          </div>
        </div>
      </td>
      <td class="px-3 py-3 text-[11px] sm:text-xs">
        <div class="flex flex-col">
          <span class="text-slate-800 font-bold">${dateFormatted}</span>
          <span class="text-[10px] text-orange-500 font-medium">${timeFormatted}</span>
        </div>
      </td>
      <td class="px-3 py-3"><span class="${badgeClass} font-bold uppercase tracking-tighter">${b.status}</span></td>
      <td class="px-3 py-3">
        <div class="flex flex-wrap gap-1.5 justify-end">
          <select data-booking-id="${b.id}" data-action="change-status" class="focus-outline bg-white border border-slate-300 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-700 hover:border-purple-500 shadow-sm cursor-pointer">
            <option value="scheduled" ${b.status === "scheduled" ? "selected" : ""}>Scheduled</option>
            <option value="pending" ${b.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="arrived" ${b.status === "arrived" ? "selected" : ""}>Arrived</option>
            <option value="in-progress" ${b.status === "in-progress" ? "selected" : ""}>In Progress</option>
            <option value="completed" ${b.status === "completed" ? "selected" : ""}>Completed</option>
            <option value="cancelled" ${b.status === "cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
          <button data-action="view-booking" data-id="${b.id}" class="focus-outline w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-purple-500 hover:text-white transition-all">👁️</button>
          <button data-action="edit-booking" data-id="${b.id}" class="focus-outline w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-teal-500 hover:text-white transition-all">✏️</button>
          <button data-action="delete-booking" data-id="${b.id}" class="focus-outline w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-red-500 hover:text-white transition-all">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join("");

  const userOptions = users.map(u => `<option value="${u.id}">${u.full_name || u.email}</option>`).join("");
  const serviceOptions = serviceTypes.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("");

  main.innerHTML = `
    <section class="w-full h-full px-4 sm:px-6 py-4 flex flex-col gap-4 fade-in">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-semibold tracking-tight text-slate-800">${config.bookings_title}</h2>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Manage workshop appointments and service bookings.</p>
        </div>
        <button id="btn-add-booking" class="focus-outline inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-purple-600">
          <span class="text-sm">＋</span><span>Add Booking</span>
        </button>
      </header>
      <div class="flex-1 min-h-0 rounded-xl bg-white border border-slate-200 overflow-hidden flex flex-col shadow-sm">
        <div class="px-3 sm:px-4 py-2 border-b border-slate-200 bg-slate-50">
          <p class="text-[11px] sm:text-xs text-slate-500">Total ${bookings.length} bookings</p>
        </div>
        <div class="flex-1 overflow-auto app-scrollbar">
          <table class="min-w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-50 sticky top-0 z-10">
              <tr class="text-[11px] sm:text-xs text-slate-500 border-b border-slate-200">
                <th scope="col" class="px-3 py-2 font-medium">ID</th>
                <th scope="col" class="px-3 py-2 font-medium">Customer</th>
                <th scope="col" class="px-3 py-2 font-medium">Service & Vehicle</th>
                <th scope="col" class="px-3 py-2 font-medium">Scheduled</th>
                <th scope="col" class="px-3 py-2 font-medium">Status</th>
                <th scope="col" class="px-3 py-2 font-medium">Notes</th>
                <th scope="col" class="px-3 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="bookings-tbody">${rowsHtml}</tbody>
          </table>
        </div>
      </div>
      <!--Booking Details Modal-- >
      <div id="booking-details-modal" class="hidden fixed inset-0 flex items-center justify-center z-50">
        <div class="modal-backdrop absolute inset-0 bg-black/30 backdrop-blur-sm" id="booking-details-backdrop"></div>
        <div class="relative w-full max-w-lg max-h-[90vh] rounded-2xl bg-white border border-slate-200 shadow-2xl mx-4 flex flex-col">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
            <div>
              <h3 class="text-base sm:text-lg font-semibold text-slate-800">Booking Details</h3>
              <p class="text-[11px] sm:text-xs text-slate-500" id="booking-details-id">ID: ...</p>
            </div>
            <button type="button" id="btn-close-booking-details" class="focus-outline text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="p-5 flex-1 overflow-y-auto flex flex-col gap-4" id="booking-details-content">
            <!-- Content will be injected here -->
          </div>
          <div class="flex justify-end px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex-shrink-0">
            <button type="button" id="btn-done-booking-details" class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-200">Close</button>
          </div>
        </div>
      </div>
      
      <div id="booking-modal" class="hidden fixed inset-0 flex items-center justify-center z-50">
        <div class="modal-backdrop absolute inset-0" id="booking-modal-backdrop"></div>
        <div class="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl mx-4">
          <form id="booking-form" class="flex flex-col gap-3 px-4 sm:px-5 py-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 id="booking-modal-title" class="text-sm sm:text-base font-semibold text-slate-800">New Booking</h3>
                <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Schedule a workshop appointment.</p>
              </div>
              <button type="button" id="btn-close-booking-modal" class="focus-outline text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
            </div>
            <input type="hidden" id="booking-id" />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label for="booking-user" class="text-[11px] text-slate-600 font-medium">Customer</label>
                <select id="booking-user" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800">
                  <option value="">Select customer (optional)</option>${userOptions}
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label for="booking-service" class="text-[11px] text-slate-600 font-medium">Service Type</label>
                <select id="booking-service" required class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800">
                  <option value="">Select service</option>
                  ${serviceOptions}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label for="booking-date" class="text-[11px] text-slate-600 font-medium">Scheduled Date & Time</label>
                <input id="booking-date" type="datetime-local" required class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="booking-vehicle-make" class="text-[11px] text-slate-600 font-medium">Vehicle Make</label>
                <input id="booking-vehicle-make" type="text" placeholder="e.g., Toyota" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="booking-vehicle-model" class="text-[11px] text-slate-600 font-medium">Vehicle Model</label>
                <input id="booking-vehicle-model" type="text" placeholder="e.g., Camry" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="booking-vehicle-year" class="text-[11px] text-slate-600 font-medium">Vehicle Year</label>
                <input id="booking-vehicle-year" type="number" min="1900" max="2030" placeholder="e.g., 2020" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="booking-status" class="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Appointment Status</label>
                <select id="booking-status" class="focus-outline text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800">
                  <option value="scheduled">Scheduled</option>
                  <option value="pending">Pending</option>
                  <option value="arrived">Arrived</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label for="booking-notes" class="text-[11px] text-slate-600 font-medium">Notes</label>
                <textarea id="booking-notes" rows="2" placeholder="Additional details..." class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"></textarea>
              </div>
            </div>
            <div class="flex items-center justify-between gap-3 mt-1">
              <p id="booking-form-message" class="text-[11px] text-slate-500"></p>
              <div class="flex items-center gap-2">
                <button type="button" id="btn-cancel-booking" class="focus-outline px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] sm:text-xs text-slate-700 hover:border-slate-400">Cancel</button>
                <button type="submit" id="btn-save-booking" class="focus-outline px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[11px] sm:text-xs font-semibold hover:bg-purple-600">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section > `;

  attachBookingHandlers();
}

function attachBookingHandlers() {
  const modal = document.getElementById("booking-modal");
  const tbody = document.getElementById("bookings-tbody");

  document.getElementById('btn-close-booking-modal')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('btn-cancel-booking')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('booking-modal-backdrop')?.addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('btn-add-booking')?.addEventListener('click', () => {
    document.getElementById('booking-modal-title').textContent = 'New Booking';
    document.getElementById('booking-id').value = '';
    document.getElementById('booking-form').reset();
    document.getElementById('booking-form-message').textContent = '';
    modal.classList.remove('hidden');
  });

  tbody?.addEventListener('change', async (e) => {
    const select = e.target.closest('select[data-action="change-status"]');
    if (!select) return;
    const result = await DatabaseService.updateBookingStatus(select.dataset.bookingId, select.value);
    if (!result.success) {
      alert('Failed to update status: ' + result.error);
      renderBookingsPage();
    }
  });

  tbody?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'view-booking') {
      const bookings = await DatabaseService.getBookings();
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;

      const modal = document.getElementById('booking-details-modal');
      const modalId = document.getElementById('booking-details-id');
      const modalContent = document.getElementById('booking-details-content');

      // Handlers
      const closeModal = () => modal.classList.add('hidden');
      document.getElementById('btn-close-booking-details').onclick = closeModal;
      document.getElementById('btn-done-booking-details').onclick = closeModal;
      document.getElementById('booking-details-backdrop').onclick = closeModal;

      modalId.textContent = `Booking #${booking.id.substring(0, 8)} `;

      const vehicleInfo = booking.vehicle_info || {};
      const vehicleString = `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''} `.trim() || 'N/A';

      // 1. Fetch Included Parts if service_type_id exists
      let partsHtml = '';
      let partsTotal = 0;

      if (booking.service_type_id) {
        const serviceProducts = await DatabaseService.getServiceTypeProducts(booking.service_type_id);

        if (serviceProducts.length > 0) {
          const partsList = serviceProducts.map(sp => {
            const prodName = sp.product?.name || 'Unknown Part';
            const price = parseFloat(sp.product?.price || 0);
            const lineTotal = price * sp.quantity;
            partsTotal += lineTotal;

            return `
            <div class="flex items-center justify-between py-1 border-b border-slate-50 last:border-0 text-xs">
                          <span class="text-slate-700 font-medium">${prodName}</span>
                          <div class="text-right">
                            <span class="text-slate-500 text-[10px] mr-1">${sp.quantity} x ${formatCurrency(price)}</span>
                            <span class="text-slate-700 font-medium">${formatCurrency(lineTotal)}</span>
                          </div>
                      </div>
    `;
          }).join('');

          partsHtml = `
          <div class="mt-3 bg-slate-50 rounded-lg border border-slate-100 p-3">
                      <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Included Parts</span>
                      <div class="flex flex-col gap-1">
                          ${partsList}
                      </div>
                  </div>
    `;
        }
      }

      // 2. Calculate Totals
      const basePrice = parseFloat(booking.service_type_details?.base_price || 0);
      const subtotal = basePrice + partsTotal;
      const tax = calculateTax(subtotal);
      const total = calculateTotalWithTax(subtotal);

      const summaryHtml = `
          <div class="mt-4 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200 flex flex-col gap-1">
              <div class="flex justify-between text-xs text-slate-500">
                  <span>Service Base Price</span>
                  <span>${formatCurrency(basePrice)}</span>
              </div>
              <div class="flex justify-between text-xs text-slate-500">
                  <span>Parts Total</span>
                  <span>${formatCurrency(partsTotal)}</span>
              </div>
              <div class="hidden sm:block my-1 border-t border-slate-200"></div>
              <div class="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>${formatCurrency(subtotal)}</span>
              </div>
              <div class="flex justify-between text-xs text-slate-500">
                  <span>Tax (14%)</span>
                  <span>${formatCurrency(tax)}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-slate-800 mt-1 pt-1 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span>${formatCurrency(total)}</span>
              </div>
          </div>
    `;

      modalContent.innerHTML = `
    <div class="p-3 bg-purple-50 rounded-xl border border-purple-100 mb-2">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-purple-100">
          ${booking.service_type === 'Oil Change' ? '🛢️' : '🔧'}
        </div>
        <div>
          <p class="text-sm font-bold text-slate-800">${booking.service_type}</p>
          <p class="text-xs text-slate-500">${new Date(booking.scheduled_date).toLocaleString()}</p>
        </div>
      </div>
          </div>

    <div class="space-y-3">
      <div class="flex justify-between items-start border-b border-slate-100 pb-2">
        <span class="text-xs font-medium text-slate-500">Customer</span>
        <div class="text-right">
          <p class="text-sm font-medium text-slate-800">${booking.profile?.full_name || 'Guest'}</p>
          <p class="text-xs text-slate-500">${booking.profile?.phone || booking.profile?.email || 'N/A'}</p>
        </div>
      </div>

      <div class="flex justify-between items-start border-b border-slate-100 pb-2">
        <span class="text-xs font-medium text-slate-500">Vehicle</span>
        <span class="text-sm font-medium text-slate-800">${vehicleString}</span>
      </div>

      <div class="flex justify-between items-start border-b border-slate-100 pb-2">
        <span class="text-xs font-medium text-slate-500">Status</span>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
          ${booking.status}
        </span>
      </div>

      ${partsHtml}
      ${summaryHtml}

      <div>
        <span class="text-xs font-medium text-slate-500 block mb-1">Notes</span>
        <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 min-h-[60px]">
          ${booking.notes || 'No significant notes.'}
        </div>
      </div>
    </div>
  `;

      modal.classList.remove('hidden');

    } else if (action === 'delete-booking') {
      if (confirm('Are you sure you want to delete this booking?')) {
        const result = await DatabaseService.deleteBooking(id);
        if (result.success) renderBookingsPage();
        else alert('Failed to delete booking: ' + result.error);
      }
    } else if (action === 'edit-booking') {
      const bookings = await DatabaseService.getBookings();
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;

      document.getElementById('booking-modal-title').textContent = 'Edit Booking';
      document.getElementById('booking-id').value = booking.id;
      document.getElementById('booking-user').value = booking.user_id || '';
      document.getElementById('booking-service').value = booking.service_type || '';

      if (booking.scheduled_date) {
        const date = new Date(booking.scheduled_date);
        document.getElementById('booking-date').value = date.toISOString().slice(0, 16);
      }

      const vehicleInfo = booking.vehicle_info || {};
      document.getElementById('booking-vehicle-make').value = vehicleInfo.make || '';
      document.getElementById('booking-vehicle-model').value = vehicleInfo.model || '';
      document.getElementById('booking-vehicle-year').value = vehicleInfo.year || '';
      document.getElementById('booking-status').value = booking.status || 'scheduled';
      document.getElementById('booking-notes').value = booking.notes || '';
      modal.classList.remove('hidden');
    }
  });

  document.getElementById('booking-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('booking-form-message');
    const btn = document.getElementById('btn-save-booking');
    const id = document.getElementById('booking-id').value;

    const vehicleInfo = {
      make: document.getElementById('booking-vehicle-make').value.trim(),
      model: document.getElementById('booking-vehicle-model').value.trim(),
      year: document.getElementById('booking-vehicle-year').value ? parseInt(document.getElementById('booking-vehicle-year').value) : null
    };

    const data = {
      user_id: document.getElementById('booking-user').value || null,
      service_type: document.getElementById('booking-service').value,
      scheduled_date: document.getElementById('booking-date').value,
      vehicle_info: vehicleInfo,
      status: document.getElementById('booking-status').value,
      notes: document.getElementById('booking-notes').value.trim()
    };

    btn.disabled = true;
    btn.textContent = 'Saving...';

    const result = id ? await DatabaseService.updateBooking(id, data) : await DatabaseService.createBooking(data);

    if (result.success) {
      msg.textContent = 'Saved successfully!';
      msg.className = 'text-[11px] text-green-600';
      setTimeout(() => { modal.classList.add('hidden'); renderBookingsPage(); }, 500);
    } else {
      msg.textContent = result.error;
      msg.className = 'text-[11px] text-red-600';
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  });
}

/* ========================================== */
/* SERVICE TYPES PAGE */
/* ========================================== */

async function renderServiceTypesPage() {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center gap-3">
      <div class="spinner"></div>
      <p class="text-xs text-slate-500 font-medium">Loading Service Types...</p>
    </div>`;

  const [serviceTypes, products] = await Promise.all([
    DatabaseService.getServiceTypes(),
    DatabaseService.getProducts() // For adding parts
  ]);

  const listHtml = serviceTypes.map(s => {
    const statusClass = s.is_active
      ? "bg-green-50 text-green-600 border border-green-200"
      : "bg-slate-100 text-slate-500 border border-slate-200";
    const statusLabel = s.is_active ? "Active" : "Inactive";
    const durationDisplay = s.estimated_duration ? `${s.estimated_duration} min` : '-';
    const priceDisplay = s.base_price ? `${parseFloat(s.base_price).toFixed(2)} EGP` : '-';

    return `
    <li class="flex items-center justify-between gap-3 px-3 py-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 card-elevated shadow-sm">
      <div class="flex items-center gap-3 flex-1">
        <div class="flex flex-col flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-800">${s.name}</span>
            <span class="inline-flex items-center px-2 py-[1px] rounded-full ${statusClass} text-[10px]">${statusLabel}</span>
          </div>
          <span class="text-[11px] text-slate-500 truncate">${s.description || 'No description'}</span>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-[10px] text-slate-400">⏱️ ${durationDisplay}</span>
            <span class="text-[10px] text-slate-400">💰 ${priceDisplay}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1.5">
        <button data-action="toggle-active" data-id="${s.id}" data-active="${s.is_active}" class="focus-outline text-[10px] px-2 py-[2px] rounded-full ${s.is_active ? 'bg-orange-50 text-orange-700 border-orange-300' : 'bg-green-50 text-green-700 border-green-300'} border">
          ${s.is_active ? 'Disable' : 'Enable'}
        </button>
        <button data-action="edit-service" data-id="${s.id}" class="focus-outline text-[10px] px-2 py-[2px] rounded-full bg-white text-slate-700 border border-slate-300 hover:border-teal-500 hover:text-teal-600">Edit</button>
        <button data-action="delete-service" data-id="${s.id}" class="focus-outline text-[10px] px-2 py-[2px] rounded-full bg-white text-slate-600 border border-slate-300 hover:border-red-500 hover:text-red-600">Delete</button>
      </div>
    </li>`;
  }).join("");

  const productOptions = products.map(p => `<option value="${p.id}">${p.name} (${formatCurrency(p.price)})</option>`).join("");

  main.innerHTML = `
    <section class="w-full h-full px-4 sm:px-6 py-4 flex flex-col gap-4 fade-in">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-base sm:text-lg font-semibold tracking-tight text-slate-800">${config.service_types_title}</h2>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Manage workshop service offerings and pricing.</p>
        </div>
        <button id="btn-add-service" class="focus-outline inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-indigo-600">
          <span class="text-sm">＋</span><span>Add Service</span>
        </button>
      </header>
      <div class="flex-1 min-h-0 rounded-xl bg-slate-50 border border-slate-200 p-3 sm:p-4 flex flex-col gap-3">
        <p class="text-[11px] sm:text-xs text-slate-500">You have ${serviceTypes.length} service types. ${serviceTypes.filter(s => s.is_active).length} active.</p>
        <ul id="services-list" class="space-y-2 overflow-auto app-scrollbar">
          ${listHtml || '<li class="text-center text-slate-400 py-8">No service types yet. Add your first service!</li>'}
        </ul>
      </div>
      <div id="service-modal" class="hidden fixed inset-0 flex items-center justify-center z-50">
        <div class="modal-backdrop absolute inset-0" id="service-modal-backdrop"></div>
        <div class="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl mx-4 max-h-[90vh] flex flex-col">
          <form id="service-form" class="flex flex-col gap-3 px-4 sm:px-5 py-4 flex-1 overflow-y-auto app-scrollbar">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 id="service-modal-title" class="text-sm sm:text-base font-semibold text-slate-800">New Service Type</h3>
                <p class="text-[11px] sm:text-xs text-slate-500 mt-1">Create or edit a workshop service.</p>
              </div>
              <button type="button" id="btn-close-service-modal" class="focus-outline text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
            </div>
            <input type="hidden" id="service-id" />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label for="service-name" class="text-[11px] text-slate-600 font-medium">Service Name</label>
                <input id="service-name" type="text" required placeholder="e.g., Oil Change" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
              </div>
              <div class="flex flex-col gap-1 sm:col-span-2">
                <label for="service-description" class="text-[11px] text-slate-600 font-medium">Description</label>
                <textarea id="service-description" rows="2" placeholder="Brief description..." class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800"></textarea>
              </div>
              <div class="flex flex-col gap-1">
                <label for="service-duration" class="text-[11px] text-slate-600 font-medium">Duration (minutes)</label>
                <input id="service-duration" type="number" min="0" placeholder="60" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="service-price" class="text-[11px] text-slate-600 font-medium">Base Price (EGP)</label>
                <input id="service-price" type="number" min="0" step="0.01" placeholder="150.00" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
              </div>
              <div class="flex flex-col gap-1">
                <label for="service-position" class="text-[11px] text-slate-600 font-medium">Display Order</label>
                <input id="service-position" type="number" min="0" placeholder="1" class="focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800" />
              </div>
              <div class="flex items-center gap-2 sm:col-span-2">
                <input id="service-active" type="checkbox" checked class="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500" />
                <label for="service-active" class="text-[11px] text-slate-600 font-medium">Active (visible to customers)</label>
              </div>
            </div>
            
            <!-- Spare Parts Section -->
            <div class="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-100">
               <label class="text-[11px] text-slate-600 font-medium">Spare Parts (Products Included)</label>
               <div class="flex gap-2">
                  <select id="service-part-select" class="flex-1 focus-outline text-xs px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800">
                    <option value="">Select a product...</option>
                    ${productOptions}
                  </select>
                  <button type="button" id="btn-add-part" class="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-200">Add</button>
               </div>
               <div id="service-parts-list" class="flex flex-col gap-2 mt-1 max-h-[120px] overflow-y-auto app-scrollbar p-1">
                 <!-- Parts will be added here dynamically -->
                 <p id="no-parts-msg" class="text-[10px] text-slate-400 text-center py-2">No spare parts added yet.</p>
               </div>
            </div>

            <div class="flex items-center justify-between gap-3 mt-1 pt-2 border-t border-slate-100">
              <p id="service-form-message" class="text-[11px] text-slate-500"></p>
              <div class="flex items-center gap-2">
                <button type="button" id="btn-cancel-service" class="focus-outline px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px] sm:text-xs text-slate-700 hover:border-slate-400">Cancel</button>
                <button type="submit" id="btn-save-service" class="focus-outline px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-[11px] sm:text-xs font-semibold hover:bg-indigo-600">Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section > `;

  attachServiceTypeHandlers();
}

function attachServiceTypeHandlers() {
  const modal = document.getElementById("service-modal");
  const list = document.getElementById("services-list");
  let currentParts = []; // Local state for parts in modal

  function renderPartsList() {
    const container = document.getElementById('service-parts-list');
    const noPartsMsg = document.getElementById('no-parts-msg');

    // Clear current list except msg
    Array.from(container.children).forEach(child => {
      if (child.id !== 'no-parts-msg') container.removeChild(child);
    });

    if (currentParts.length === 0) {
      noPartsMsg.classList.remove('hidden');
    } else {
      noPartsMsg.classList.add('hidden');
      currentParts.forEach((part, index) => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200";
        div.innerHTML = `
    <span class="text-xs text-slate-700 truncate flex-1">${part.name}</span>
      <div class="flex items-center gap-2">
        <input type="number" min="1" value="${part.quantity || 1}" class="w-12 text-center text-xs p-1 rounded border border-slate-300" onchange="window.updatePartQuantity(${index}, this.value)">
          <button type="button" onclick="window.removeServicePart(${index})" class="text-red-500 hover:text-red-700 text-lg leading-none">×</button>
      </div>
  `;
        container.appendChild(div);
      });
    }
  }

  // Global helpers for inline onclicks
  window.removeServicePart = (index) => {
    currentParts.splice(index, 1);
    renderPartsList();
  };
  window.updatePartQuantity = (index, qty) => {
    if (currentParts[index]) currentParts[index].quantity = parseInt(qty);
  };

  document.getElementById('btn-add-part')?.addEventListener('click', () => {
    const select = document.getElementById('service-part-select');
    const productId = select.value;
    if (!productId) return;

    // Get product name from select option text
    const productName = select.options[select.selectedIndex].text.split(' (')[0];

    // Check if already exists
    if (!currentParts.find(p => p.product_id === productId)) {
      currentParts.push({ product_id: productId, name: productName, quantity: 1 });
      renderPartsList();
    }
    select.value = "";
  });

  document.getElementById('btn-close-service-modal')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('btn-cancel-service')?.addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('service-modal-backdrop')?.addEventListener('click', () => modal.classList.add('hidden'));

  document.getElementById('btn-add-service')?.addEventListener('click', () => {
    document.getElementById('service-modal-title').textContent = 'New Service Type';
    document.getElementById('service-id').value = '';
    document.getElementById('service-form').reset();
    document.getElementById('service-active').checked = true;
    document.getElementById('service-form-message').textContent = '';
    currentParts = [];
    renderPartsList();
    modal.classList.remove('hidden');
  });

  list?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'delete-service') {
      if (confirm('Delete this service type?')) {
        const result = await DatabaseService.deleteServiceType(id);
        if (result.success) renderServiceTypesPage();
        else alert('Failed to delete: ' + result.error);
      }
    } else if (action === 'toggle-active') {
      const isActive = btn.dataset.active === 'true';
      const result = await DatabaseService.toggleServiceTypeActive(id, !isActive);
      if (result.success) renderServiceTypesPage();
      else alert('Failed to update: ' + result.error);
    } else if (action === 'edit-service') {
      const services = await DatabaseService.getServiceTypes();
      const service = services.find(s => s.id === id);
      if (!service) return;

      document.getElementById('service-modal-title').textContent = 'Edit Service Type';
      document.getElementById('service-id').value = service.id;
      document.getElementById('service-name').value = service.name || '';
      document.getElementById('service-description').value = service.description || '';
      document.getElementById('service-duration').value = service.estimated_duration || '';
      document.getElementById('service-price').value = service.base_price || '';
      document.getElementById('service-position').value = service.position || '';
      document.getElementById('service-active').checked = service.is_active !== false;

      // Load parts
      currentParts = [];
      const parts = await DatabaseService.getServiceTypeProducts(id);
      currentParts = parts.map(p => ({
        product_id: p.product_id,
        name: p.product?.name || 'Unknown Item',
        quantity: p.quantity
      }));
      renderPartsList();

      modal.classList.remove('hidden');
    }
  });

  document.getElementById('service-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('service-form-message');
    const btn = document.getElementById('btn-save-service');
    const id = document.getElementById('service-id').value;

    const data = {
      name: document.getElementById('service-name').value.trim(),
      description: document.getElementById('service-description').value.trim(),
      estimated_duration: document.getElementById('service-duration').value ? parseInt(document.getElementById('service-duration').value) : null,
      base_price: document.getElementById('service-price').value ? parseFloat(document.getElementById('service-price').value) : null,
      icon: '🔧', // Default icon for backward compatibility
      position: document.getElementById('service-position').value ? parseInt(document.getElementById('service-position').value) : 0,
      is_active: document.getElementById('service-active').checked
    };

    btn.disabled = true;
    btn.textContent = 'Saving...';

    const result = id ? await DatabaseService.updateServiceType(id, data) : await DatabaseService.createServiceType(data);

    if (result.success) {
      // Handle Parts Sync
      const serviceId = result.data.id;

      // This is a naive sync (delete all, add all) or diffing. 
      // For simplicity, we can fetch existing, find diffs, but since we have a direct table, 
      // we can iterate through currentParts and upsert/delete.
      // EASIER STRATEGY: Get existing DB parts, delete ones not in currentParts, Upsert ones in currentParts.

      try {
        const existingParts = await DatabaseService.getServiceTypeProducts(serviceId);

        // 1. Delete removed parts
        for (const ep of existingParts) {
          if (!currentParts.find(p => p.product_id === ep.product_id)) {
            await DatabaseService.removeServiceTypeProduct(serviceId, ep.product_id);
          }
        }

        // 2. Upsert current parts
        for (const p of currentParts) {
          await DatabaseService.addServiceTypeProduct(serviceId, p.product_id, p.quantity);
        }

        msg.textContent = 'Saved!';
        msg.className = 'text-[11px] text-green-600';
        setTimeout(() => { modal.classList.add('hidden'); renderServiceTypesPage(); }, 500);
      } catch (partsErr) {
        console.error(partsErr);
        msg.textContent = 'Service saved but parts failed update.';
        msg.className = 'text-[11px] text-orange-600';
        btn.disabled = false;
      }

    } else {
      msg.textContent = result.error;
      msg.className = 'text-[11px] text-red-600';
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  });
}


/* ========================================== */
/* NAVIGATION */
/* ========================================== */

async function setActivePage(pageKey) {
  document.querySelectorAll(".nav-link").forEach(btn => {
    if (btn.dataset.page === pageKey) {
      btn.classList.add("bg-orange-50", "text-orange-600", "border-l-4", "border-orange-500", "pl-2");
      btn.classList.remove("text-slate-600", "px-3");
    } else {
      btn.classList.remove("bg-orange-50", "text-orange-600", "border-l-4", "border-orange-500", "pl-2");
      btn.classList.add("text-slate-600", "px-3");
    }
  });

  const pages = {
    dashboard: renderDashboard,
    products: renderProductsPage,
    categories: renderCategoriesPage,
    orders: renderOrdersPage,
    bookings: renderBookingsPage,
    "service-types": renderServiceTypesPage,
    users: renderUsersPage
  };

  await pages[pageKey]?.();
  window.scrollTo(0, 0);
}

function attachSidebarNav() {
  document.getElementById("sidebar")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-page]");
    if (btn) setActivePage(btn.dataset.page);
  });
}

/* ========================================== */
/* INITIALIZATION */
/* ========================================== */

document.addEventListener('DOMContentLoaded', async function init() {
  console.log('init() started');
  try {
    // Initialize Supabase
    if (!await initializeSupabase()) {
      alert('Failed to initialize Supabase. Please check your configuration in js/config.js');
      return;
    }

    // Check authentication
    console.log('Checking session...');
    const user = await AuthService.getSession();
    console.log('User session:', user);

    if (!user) {
      console.log('No user, redirecting to login.html');
      window.location.href = 'login.html';
      return;
    }

    // Check if admin - use isAdmin property set by auth.js
    if (!user.isAdmin) {
      console.error('Access denied. User:', user);
      console.error('isAdmin:', user.isAdmin, 'adminRole:', user.adminRole);
      alert('Access denied. Admin privileges required.');
      await AuthService.logout();
      window.location.href = 'login.html';
      return;
    }

    // Log successful admin access
    console.log('✅ Admin access granted:', user.email, '- Role:', user.adminRole);

    // Create UI
    console.log('Creating base layout...');
    createBaseLayout();

    // Update user name in header
    if (user.full_name) {
      const userNameElem = document.getElementById('user-name');
      if (userNameElem) userNameElem.textContent = user.full_name;
    }

    // Attach navigation
    console.log('Attaching sidebar nav...');
    attachSidebarNav();

    // Show dashboard
    console.log('Setting active page to dashboard...');
    await setActivePage("dashboard");

  } catch (error) {
    console.error('CRITICAL INITIALIZATION ERROR:', error);
    if (document.getElementById('debug-error-container')) {
      document.getElementById('debug-error-container').innerHTML += `<div class="m-2 p-3 bg-red-800 text-white">Critical Init Error: ${error.message}</div>`;
    } else {
      alert('Critical error during initialization: ' + error.message);
    }
  }
});
