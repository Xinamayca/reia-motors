// car.js
const WHATSAPP_NUMBER = "2975927663";

function toTitleCase(str){
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

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
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.cars)) return data.cars;
  return [];
}

function findCar(cars, id){
  let car = cars.find(c => String(c.id) === String(id));
  if (car) return car;
  const idLower = String(id || "").toLowerCase();
  car = cars.find(c => String(c.title || "").toLowerCase().replace(/\s+/g, "-") === idLower);
  return car || null;
}

function specItem(label, value){
  return `<div class="ms"><div class="ms-l">${label}</div><div class="ms-v">${value || "—"}</div></div>`;
}

function renderCar(car){
  document.title = `${toTitleCase(car.title || "Car")} — REIA Motors`;

  const img        = document.getElementById("carImage");
  const titleEl    = document.getElementById("carTitle");
  const metaEl     = document.getElementById("carMeta");
  const priceEl    = document.getElementById("carPrice");
  const specsEl    = document.getElementById("carSpecs");
  const tagsEl     = document.getElementById("carTags");
  const counterEl  = document.getElementById("imgCounter");
  const btnWa      = document.getElementById("btnWhatsapp");

  const allImages = (car.images && car.images.length) ? car.images : [car.image || ""].filter(Boolean);

  img.src = allImages[0] || "";
  img.alt = car.title || "Vehicle";

  // Counter
  function updateCounter(i) {
    if (counterEl && allImages.length > 1) {
      counterEl.textContent = `${i + 1} / ${allImages.length}`;
      counterEl.hidden = false;
    }
  }
  updateCounter(0);

  // Thumbnails
  const thumbsContainer = document.getElementById("carThumbs");
  let currentIndex = 0;

  function goToImage(index) {
    currentIndex = (index + allImages.length) % allImages.length;
    img.src = allImages[currentIndex];
    updateCounter(currentIndex);
    if (thumbsContainer) {
      thumbsContainer.querySelectorAll(".thumb").forEach((t, i) => {
        t.classList.toggle("active", i === currentIndex);
      });
    }
  }

  if (thumbsContainer && allImages.length > 1) {
    thumbsContainer.innerHTML = allImages.map((src, i) => `
      <div class="thumb${i === 0 ? " active" : ""}" data-index="${i}">
        <img src="${src}" alt="${car.title} photo ${i + 1}" loading="lazy">
      </div>
    `).join("");
    thumbsContainer.hidden = false;
    thumbsContainer.querySelectorAll(".thumb").forEach(thumb => {
      thumb.addEventListener("click", () => goToImage(Number(thumb.dataset.index)));
    });
  }

  // Click main image to advance
  document.getElementById("mainWrap")?.addEventListener("click", () => {
    if (allImages.length > 1) goToImage(currentIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") goToImage(currentIndex + 1);
    if (e.key === "ArrowLeft")  goToImage(currentIndex - 1);
  });

  // Badges
  if (tagsEl) {
    const tags = ["Used"];
    if (car.body) tags.push(car.body);
    tagsEl.innerHTML = tags.map(t => `<span class="badge">${t}</span>`).join("");
  }

  titleEl.textContent = toTitleCase(car.title || "Vehicle");

  if (metaEl) metaEl.textContent = `${car.year || ""} · Oranjestad, Aruba`;

  priceEl.textContent = formatMoney(car.currency, car.price);

  specsEl.innerHTML = [
    specItem("Body", car.body),
    specItem("Fuel", car.fuel),
    specItem("Transmission", car.trans),
    specItem("Mileage", formatKm(car.km)),
    specItem("Year", car.year),
    specItem("Listing ID", `#${car.id}`),
  ].join("");

  btnWa.href = waLink(`Hi REIA Motors, I'm interested in the ${toTitleCase(car.title)}. Is it still available?`);
}

async function init(){
  const state = document.getElementById("state");
  const wrap  = document.getElementById("carWrap");

  const id = getParam("id");
  if (!id){
    state.textContent = "No car selected. Go back to Browse and open a car.";
    return;
  }

  try{
    const data = await fetchCars();
    const cars = normalizeCars(data);
    const car  = findCar(cars, id);

    if (!car){
      state.textContent = "Car not found. It may have been removed.";
      return;
    }

    state.hidden = true;
    wrap.hidden  = false;
    renderCar(car);

    const others = cars.filter(c => String(c.id) !== String(id)).slice(0, 3);
    if (others.length) {
      const section = document.getElementById("otherCars");
      const grid    = document.getElementById("otherGrid");
      grid.innerHTML = others.map(c => `
        <a href="car.html?id=${c.id}" class="other-card">
          <div class="other-img"><img src="${c.images && c.images.length ? c.images[0] : c.image}" alt="${toTitleCase(c.title)}" loading="lazy"></div>
          <div class="other-info">
            <span class="other-name">${c.year} ${toTitleCase(c.title.trim())}</span>
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
