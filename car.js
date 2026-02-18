// car.js
const WHATSAPP_NUMBER = "2970000000";

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");
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

  const imagePath = car.image || car.photo || car.cover || "";
  img.src = imagePath || "img/hero.png";
  img.alt = car.title || "Vehicle";

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
  }catch(err){
    console.error(err);
    state.textContent = "Something went wrong loading this car.";
  }
}

init();