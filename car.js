// car.js
const WHATSAPP_NUMBER = "2975927663";

// Mobile nav toggle
const navToggle = document.getElementById("navBurger");
const mobileNav = document.getElementById("navMobile");
navToggle?.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

function waLink(msg){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function getParam(name){
  return new URLSearchParams(window.location.search).get(name);
}

function toNumberFromAny(v){
  if (typeof v === "number") return v;
  if (typeof v !== "string") return null;
  const cleaned = v.replace(/[^\d]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function formatMoney(currency, price){
  // supports either (currency + number) OR a price string like "AWG 122,490"
  if (typeof price === "string" && price.toUpperCase().includes("AWG")) return price;
  const n = toNumberFromAny(price);
  if (n == null) return String(price ?? "");
  const cur = currency || "AWG";
  return `${cur} ${n.toLocaleString("en-US")}`;
}

function formatKm(km){
  const n = toNumberFromAny(km);
  if (n == null) return String(km ?? "");
  return `${n.toLocaleString("en-US")} km`;
}

async function fetchCars(){
  const res = await fetch("data/cars.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load cars.json");
  return res.json();
}

function normalizeCars(data){
  // supports {cars:[...]} or [...]
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.cars)) return data.cars;
  return [];
}

function findCar(cars, id){
  // most common: car.id from your CMS
  let car = cars.find(c => String(c.id) === String(id));
  if (car) return car;

  // fallback: slug-like based on title
  const idLower = String(id || "").toLowerCase();
  car = cars.find(c => String(c.title || "").toLowerCase().replace(/\s+/g, "-") === idLower);
  return car || null;
}

function specItem(k, v){
  return `
    <div class="spec">
      <div class="k">${k}</div>
      <div class="v">${v || "—"}</div>
    </div>
  `;
}

function renderCar(car){
  document.title = `${car.title || "Car"} — REIA Motors`;

  const img = document.getElementById("carImage");
  const title = document.getElementById("carTitle");
  const price = document.getElementById("carPrice");
  const specs = document.getElementById("carSpecs");
  const btnWhatsapp = document.getElementById("btnWhatsapp");

  // Support new `images` array or old `image` field
  const allImages = (car.images && car.images.length)
    ? car.images.map(i => i.image || i)
    : [car.image || car.photo || car.cover || ""].filter(Boolean);

  img.src = allImages[0] || "";
  img.alt = car.title || "Vehicle";

  // Render thumbnail strip if more than 1 image
  const thumbsContainer = document.getElementById("carThumbs");
  if (thumbsContainer) {
    if (allImages.length > 1) {
      thumbsContainer.innerHTML = allImages.map((src, i) => `
        <div class="car-thumb${i === 0 ? ' active' : ''}" data-src="${src}">
          <img src="${src}" alt="${car.title} photo ${i + 1}" loading="lazy">
        </div>
      `).join('');
      thumbsContainer.hidden = false;
      thumbsContainer.querySelectorAll('.car-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          img.src = thumb.dataset.src;
          thumbsContainer.querySelectorAll('.car-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    }
  }

  title.textContent = car.title || "Vehicle";
  price.textContent = formatMoney(car.currency, car.price);

  specs.innerHTML = [
    specItem("Body", car.body),
    specItem("Fuel", car.fuel),
    specItem("Transmission", car.trans),
    specItem("KM", formatKm(car.km)),
    specItem("Year", car.year),
    specItem("ID", car.id),
  ].join("");

  btnWhatsapp.href = waLink(`Hi REIA Motors, I'm interested in the ${car.title}. Is it still available?`);
}

async function init(){
  const state = document.getElementById("state");
  const wrap = document.getElementById("carWrap");

  const id = getParam("id");
  if (!id){
    state.textContent = "No car selected. Go back to Browse and open a car.";
    return;
  }

  try{
    const data = await fetchCars();
    const cars = normalizeCars(data);
    const car = findCar(cars, id);

    if (!car){
      state.textContent = "Car not found. It may have been removed.";
      return;
    }

    state.hidden = true;
    wrap.hidden = false;
    renderCar(car);

    const others = cars.filter(c => String(c.id) !== String(id)).slice(0, 3);
    if (others.length) {
      const section = document.getElementById("otherCars");
      const grid = document.getElementById("otherGrid");
      grid.innerHTML = others.map(c => `
        <a href="car.html?id=${c.id}" class="other-card">
          <div class="other-img"><img src="${c.image}" alt="${c.year} ${c.title}" loading="lazy"></div>
          <div class="other-info">
            <span class="other-name">${c.year} ${c.title.trim()}</span>
            <span class="other-price">${c.currency} ${Number(c.price).toLocaleString('en-US')}</span>
          </div>
        </a>
      `).join('');
      section.hidden = false;
    }
  }catch(err){
    console.error(err);
    state.textContent = "Something went wrong loading this car.";
  }
}

init();