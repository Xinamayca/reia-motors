/* =========================
   browse.js (FULL)
   Navbar toggle + filter + render
   CMS: loads from /data/cars.json
   ========================= */

const WHATSAPP_NUMBER = "2970000000";

/* Mobile nav toggle (same behavior as home) */
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

navToggle?.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

function waLink(msg){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function formatMoney(currency, amount){
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${currency} ${amount}`;
  return `${currency} ${n.toLocaleString("en-US")}`;
}

function formatKm(km){
  const n = Number(km);
  if (!Number.isFinite(n)) return `${km}`;
  return `${n.toLocaleString("en-US")} km`;
}

/* ✅ CMS fetch (ONE FILE) */
async function fetchCars(){
  const res = await fetch("/data/cars.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load /data/cars.json");
  const data = await res.json();
  return Array.isArray(data.cars) ? data.cars : [];
}

function toNum(v){
  const n = Number(String(v ?? "").replace(/[^\d]/g,""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function readFilters(){
  const f = new FormData(document.getElementById("filtersForm"));
  return {
    q: String(f.get("q") || "").trim().toLowerCase(),
    body: String(f.get("body") || ""),
    fuel: String(f.get("fuel") || ""),
    trans: String(f.get("trans") || ""),
    minPrice: toNum(f.get("minPrice")),
    maxPrice: toNum(f.get("maxPrice")),
    minYear: toNum(f.get("minYear")),
    maxYear: toNum(f.get("maxYear")),
  };
}

function applyFilters(cars, filters){
  return cars.filter(c => {
    const hay = `${c.title} ${c.body} ${c.fuel} ${c.trans} ${c.year}`.toLowerCase();

    if (filters.q && !hay.includes(filters.q)) return false;
    if (filters.body && c.body !== filters.body) return false;
    if (filters.fuel && c.fuel !== filters.fuel) return false;
    if (filters.trans && c.trans !== filters.trans) return false;

    if (filters.minPrice != null && Number(c.price) < filters.minPrice) return false;
    if (filters.maxPrice != null && Number(c.price) > filters.maxPrice) return false;

    if (filters.minYear != null && Number(c.year) < filters.minYear) return false;
    if (filters.maxYear != null && Number(c.year) > filters.maxYear) return false;

    return true;
  });
}

function render(cars){
  const grid = document.getElementById("resultsGrid");
  const countText = document.getElementById("countText");
  if (!grid || !countText) return;

  countText.textContent = String(cars.length);

  grid.innerHTML = cars.map(c => `
    <article class="result-card">
      <div class="result-img">
        <img src="${c.image || 'img/placeholder.jpg'}" alt="${c.title || 'Vehicle'}">
      </div>

      <div class="result-body">
        <div class="result-top">
          <h3 class="result-title">${c.title || ""}</h3>
          <div class="result-price">${formatMoney(c.currency || "AWG", c.price ?? "")}</div>
        </div>

        <div class="result-meta">${c.body || ""} • ${c.fuel || ""}</div>
        <div class="result-meta">${formatKm(c.km ?? "")} • ${c.trans || ""}</div>

        <div class="result-actions">
          <a class="btn btn-secondary btn-sm" href="car.html?id=${c.id || ""}">View Details</a>
          <a class="btn btn-primary btn-sm" target="_blank" rel="noreferrer"
             href="${waLink(`Hi REIA Motors, I'm interested in the ${c.title || "car"}. Is it still available?`)}">
            Whatsapp
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

let ALL = [];

async function init(){
  try {
    ALL = await fetchCars();
    render(ALL);

    const form = document.getElementById("filtersForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const filtered = applyFilters(ALL, readFilters());
      render(filtered);
    });
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("resultsGrid");
    if (grid) grid.innerHTML = `<p class="muted">Could not load cars right now.</p>`;
  }
}

init();