// ===== Config =====
const WHATSAPP_NUMBER = "2970000000";

// Footer year (only if #year exists)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle (only if exists)
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile nav after clicking a link
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== Helpers =====
function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatMoney(value) {
  // Supports: 122494 OR "AWG 122,494"
  if (typeof value === "number") return `AWG ${value.toLocaleString("en-US")}`;
  if (typeof value === "string") return value;
  return "";
}

function formatKm(value) {
  // Supports: 20000 OR "20,000 km"
  if (typeof value === "number") return `${value.toLocaleString("en-US")} km`;
  if (typeof value === "string") return value;
  return "";
}

// ===== CMS: fetch cars from /data/cars.json =====
async function fetchCars() {
  try {
    const res = await fetch("/data/cars.json", { cache: "no-store" });
    if (!res.ok) throw new Error("cars.json not found");
    const data = await res.json();

    // Expecting: { "cars": [ ... ] }
    const cars = Array.isArray(data.cars) ? data.cars : [];

    // Normalize fields so your rendering never breaks
    return cars.map(c => ({
      id: c.id || "",
      title: c.title || "",
      price: c.price, // number or string
      currency: c.currency || "AWG",
      body: c.body || "",
      fuel: c.fuel || "",
      km: c.km, // number or string
      trans: c.trans || "",
      year: c.year || "",
      image: c.image || "",
      featured: Boolean(c.featured) // if missing -> false
    }));
  } catch (err) {
    console.warn("Failed to load cars from CMS:", err);
    return [];
  }
}

// ===== Render Featured Cars on Home =====
function renderFeatured(cars) {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;

  const featured = cars.filter(c => c.featured);

  // Optional: if none featured, show placeholders / message
  if (featured.length === 0) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = featured.map(car => `
    <article class="car-card" style="position:relative;">
      <a href="car.html?id=${car.id}" style="position:absolute;inset:0;z-index:1;"></a>
      <div class="car-img">
        <img src="${car.image}" alt="${car.title}">
      </div>
      <div class="car-info">
        <div class="car-top">
          <span class="car-name">${toTitleCase(car.title)}</span>
          <span class="car-price">${formatMoney(car.price)}</span>
        </div>
        <div class="car-meta">${car.body} · ${car.fuel} · ${formatKm(car.km)}</div>
        <div class="car-actions" style="position:relative;z-index:2;">
          <a class="btn-outline-sm" href="car.html?id=${car.id}">View Details</a>
          <a class="btn-gradient-sm" target="_blank" rel="noreferrer"
             href="${waLink(`Hi REIA Motors, I'm interested in the ${toTitleCase(car.title)}. Is it still available?`)}">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

// ===== Boot =====
(async function init() {
  const cars = await fetchCars();
  renderFeatured(cars);
})();