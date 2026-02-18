// ===== Config =====
const WHATSAPP_NUMBER = "2970000000";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

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

// ===== CMS-ready: swap this function later =====
async function fetchCars() {
  // Later: return fetch("YOUR_CMS_ENDPOINT").then(r => r.json());
  // For now: local demo data
  return [
    {
      id: "rogue-2020",
      title: "2020 Nissan Rogue",
      price: "AWG 67,500",
      body: "SUV",
      fuel: "Gasoline",
      km: "42,000 km",
      trans: "Automatic",
      image: "img/car-blue.jpg",
      featured: true
    },
    {
      id: "rav4-2021",
      title: "2021 Toyota RAV4",
      price: "AWG 72,500",
      body: "SUV",
      fuel: "Gasoline",
      km: "38,000 km",
      trans: "Automatic",
      image: "img/car-white.jpg",
      featured: true
    },
    {
      id: "wrangler-2022",
      title: "2022 Jeep Wrangler",
      price: "AWG 122,494",
      body: "SUV",
      fuel: "Gasoline",
      km: "20,000 km",
      trans: "Automatic",
      image: "img/car-jeep.jpg",
      featured: true
    }
  ];
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderFeatured(cars) {
  const grid = document.getElementById("featuredGrid");
  const featured = cars.filter(c => c.featured);

  grid.innerHTML = featured.map(car => `
    <article class="card">
      <div class="card-img">
        <img src="${car.image}" alt="${car.title}">
      </div>

      <div class="card-body">
        <div class="card-top">
          <h3 class="card-title">${car.title}</h3>
          <div class="card-price">${car.price}</div>
        </div>

        <div class="card-meta">${car.body} • ${car.fuel}</div>
        <div class="card-meta">${car.km} • ${car.trans}</div>

        <div class="card-actions">
          <a class="btn btn-secondary btn-sm" href="#featured">View Details</a>
          <a class="btn btn-primary btn-sm" target="_blank" rel="noreferrer"
             href="${waLink(`Hi REIA Motors, I'm interested in the ${car.title}. Is it still available?`)}">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  `).join("");
}

// Boot
(async function init(){
  const cars = await fetchCars();
  renderFeatured(cars);
})();