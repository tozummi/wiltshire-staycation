(() => {
  "use strict";

  const houseImages = [
  { file: "Front of farmhouse.jpg", caption: "Front of farmhouse", position: "center" },
  { file: "Patio behind farmhouse.jpg", caption: "Patio behind farmhouse", position: "center" },
  { file: "Patio area left of farmhouse.jpg", caption: "Patio area left of farmhouse", position: "center" },
  { file: "Fountain behind farmhouse.jpg", caption: "Fountain behind farmhouse", position: "center" },

  { file: "Main hallway.jpg", caption: "Main hallway", position: "center" },
  { file: "Main staircase in foyer.jpg", caption: "Main staircase in foyer", position: "center" },

  { file: "Main kitchen.jpg", caption: "Main kitchen", position: "center" },
  { file: "Dining space in main kitchen.jpg", caption: "Dining space in main kitchen", position: "center" },
  { file: "Butler's kitchen.jpg", caption: "Butler's kitchen", position: "center" },
  { file: "Dining room (seats 14).jpg", caption: "Dining room (seats 14)", position: "center" },

  { file: "Living room with cinema projector.jpg", caption: "Living room with cinema projector", position: "center" },
  { file: "Games room with pool table.jpg", caption: "Games room with pool table", position: "center" },

  { file: "Main shared balcony (dual access).jpg", caption: "Main shared balcony", position: "center" },
  { file: "Seating on main balcony.jpg", caption: "Seating on main balcony", position: "center" },
  { file: "Workspace and access to main balcony.jpg", caption: "Workspace and access to main balcony", position: "center" },
  { file: "Round balcony views.jpg", caption: "Round balcony views", position: "center" },

  { file: "Bedroom 10.jpg", caption: "Bedroom 10", position: "center" },
  { file: "Bedroom 9.jpg", caption: "Bedroom 9", position: "center" },
  { file: "Bedroom 7.jpg", caption: "Bedroom 7", position: "center" },
  { file: "Bedroom 6.jpg", caption: "Bedroom 6", position: "center" },
  { file: "Bedroom 5.jpg", caption: "Bedroom 5", position: "center" },
  { file: "Bedroom 4.jpg", caption: "Bedroom 4", position: "center" },
  { file: "Bedroom 2.jpg", caption: "Bedroom 2", position: "center" },
  { file: "Bedroom 1.jpg", caption: "Bedroom 1", position: "center" },

  { file: "Ground floor washroom.jpg", caption: "Ground floor washroom", position: "center" },
  { file: "Laundry room and boiler.jpg", caption: "Laundry room and boiler", position: "center" },

  { file: "Patio.jpg", caption: "Patio", position: "center" }
];

  const amenities = [
    {
      title: "Bathroom",
      icon: "🛁",
      items: [
        "Bath",
        "Hairdryer",
        "Cleaning products",
        "Shampoo",
        "Conditioner",
        "Body soap",
        "Hot water",
        "Shower gel"
      ]
    },
    {
      title: "Bedroom & Laundry",
      icon: "🛏️",
      items: [
        "Washing machine",
        "Free dryer",
        "Essentials (Towels, Bedsheets, Soap, Toilet paper)",
        "Cot",
        "Hangers",
        "Bed linen",
        "Room darkening blinds",
        "Iron",
        "Clothes drying rack",
        "Clothes storage"
      ]
    },
    {
      title: "Entertainment",
      icon: "🎬",
      items: [
        "Wi-Fi",
        "TV",
        "Treadmill",
        "Pool table",
        "Cinema",
        "Board games",
        "Children’s books and toys for ages 0–2, 2–5, 5–10 and 10+"
      ]
    },
    {
      title: "Home Safety",
      icon: "🛡️",
      items: [
        "Exterior security cameras",
        "Smoke alarm",
        "Carbon monoxide alarm",
        "Fire extinguisher",
        "First aid kit"
      ]
    },
    {
      title: "Kitchen & Dining",
      icon: "🍽️",
      items: [
        "Fridge",
        "Freezer",
        "Microwave",
        "Cooking basics (Pots, Pans, Oil, Salt, Pepper)",
        "Crockery & Cutlery (Bowls, Chopsticks, Plates, Cups, etc.)",
        "Dishwasher",
        "Oven",
        "Kettle",
        "Coffee",
        "Coffee maker",
        "Wine glasses",
        "Toaster",
        "Baking sheet",
        "Blender",
        "BBQ utensils (Grill, Charcoal, Bamboo skewers/Iron skewers, etc.)"
      ]
    },
    {
      title: "Location Features",
      icon: "📍",
      items: [
        "Riverfront",
        "Private entrance",
        "Patio and balconies",
        "BBQ grill",
        "Free parking",
        "Self check-in",
        "Lockbox"
      ]
    }
  ];

  const nearbyPlaces = [
    {
      name: "Ratford Bridge Farmhouse",
      icon: "🏡",
      lat: 51.44796,
      lng: -2.02888,
      query: "Ratford Bridge Farmhouse Calne SN11 9JX"
    },
    {
      name: "Tesco Superstore",
      icon: "🛒",
      lat: 51.4422,
      lng: -2.0142,
      query: "Tesco Superstore Beversbrook Road Calne SN11 9FQ"
    },
    {
      name: "Tesco Petrol Station",
      icon: "⛽",
      lat: 51.4418,
      lng: -2.0136,
      query: "Tesco Petrol Station Beversbrook Road Calne SN11 9FQ"
    },
    {
      name: "Tesco Café",
      icon: "☕",
      lat: 51.4425,
      lng: -2.0140,
      query: "Tesco Cafe Beversbrook Road Calne SN11 9FQ"
    },
    {
      name: "Calne Pharmacy Area",
      icon: "💊",
      lat: 51.4380,
      lng: -2.0052,
      query: "Pharmacy Calne Wiltshire"
    },
    {
      name: "Town Hall Bus Stop",
      icon: "🚌",
      lat: 51.43772,
      lng: -2.00503,
      query: "Town Hall bus stop New Road Calne"
    }
  ];

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function initialiseGallery() {
  const gallery = document.getElementById("house-gallery");
  const empty = document.getElementById("house-gallery-empty");
  const swiperElement = document.querySelector(".house-swiper");

  if (!gallery || !empty || !swiperElement) return;

  gallery.replaceChildren();

  const fragment = document.createDocumentFragment();

  houseImages.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const image = document.createElement("img");
    image.src = `images/house/${item.file}`;
    image.alt = item.caption;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    image.style.objectPosition = item.position || "center";

    const counter = document.createElement("div");
    counter.className = "house-slide-counter";
    counter.textContent = `${index + 1} / ${houseImages.length}`;

    const caption = document.createElement("div");
    caption.className = "house-slide-caption";
    caption.textContent = item.caption;

    image.addEventListener(
      "error",
      () => {
        console.error(`Could not load house image: ${item.file}`);
        slide.remove();
      },
      { once: true }
    );

    slide.append(image, counter, caption);
    fragment.appendChild(slide);
  });

  gallery.appendChild(fragment);
  swiperElement.hidden = false;
  empty.hidden = true;

  new Swiper(".house-swiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 15,
    grabCursor: true,
    effect: "coverflow",
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 120,
      modifier: 1,
      slideShadows: false
    }
  });
}

  function createAccordion({ title, icon, items }) {
    const article = document.createElement("article");
    article.className = "house-accordion";

    const panelId = `amenity-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    article.innerHTML = `
      <button class="house-accordion-toggle" type="button" aria-expanded="false" aria-controls="${panelId}">
        <span class="house-accordion-title">
          <span class="house-accordion-icon" aria-hidden="true">${escapeHTML(icon)}</span>
          <span>${escapeHTML(title)}</span>
        </span>

        <span class="house-accordion-helper">
          <span class="house-helper-text">Tap to view amenities</span>
          <span class="house-accordion-arrow" aria-hidden="true">⌄</span>
        </span>
      </button>

      <div class="house-accordion-panel" id="${panelId}">
        <div class="house-accordion-content">
          <div class="amenity-tags">
            ${items.map(item => `<span class="amenity-tag">${escapeHTML(item)}</span>`).join("")}
          </div>
        </div>
      </div>
    `;

    return article;
  }

  function setupAccordions() {
    const amenitiesList = document.getElementById("amenities-list");

    amenities.forEach(amenity => {
      amenitiesList.appendChild(createAccordion(amenity));
    });

    document.addEventListener("click", event => {
      const toggle = event.target.closest(".house-accordion-toggle");
      if (!toggle) return;

      const accordion = toggle.closest(".house-accordion");
      const isOpen = accordion.classList.toggle("is-open");
      const helper = toggle.querySelector(".house-helper-text");
      const isMap = toggle.getAttribute("aria-controls") === "nearby-essentials-panel";

      toggle.setAttribute("aria-expanded", String(isOpen));

      if (helper) {
        helper.textContent = isOpen
          ? (isMap ? "Tap to hide map" : "Tap to hide details")
          : (isMap ? "Tap to view map" : toggle.closest(".amenities-section")
              ? "Tap to view amenities"
              : "Tap to view details");
      }

      if (isOpen && isMap) {
        window.setTimeout(() => {
          window.nearbyMap?.invalidateSize();
        }, 290);
      }
    });
  }

  function setupViewer() {
    const iframe = document.getElementById("house-viewer");
    const wrapper = iframe.closest(".viewer-frame-wrap");

    iframe.addEventListener("load", () => {
      wrapper.classList.add("is-loaded");
    }, { once: true });
  }

  function createMarkerIcon(emoji) {
    return L.divIcon({
      className: "",
      html: `<div class="emoji-map-marker"><span>${escapeHTML(emoji)}</span></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 32],
      popupAnchor: [0, -28]
    });
  }

  function setupMap() {
    if (!window.L) return;

    const map = L.map("nearby-map", {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView([51.4440, -2.0170], 14);

    window.nearbyMap = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const bounds = [];

    nearbyPlaces.forEach(place => {
      const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`;

      L.marker([place.lat, place.lng], {
        icon: createMarkerIcon(place.icon)
      })
        .addTo(map)
        .bindPopup(`
          <strong>${escapeHTML(place.icon)} ${escapeHTML(place.name)}</strong>
          <a href="${directions}" target="_blank" rel="noopener noreferrer">Open directions ↗</a>
        `);

      bounds.push([place.lat, place.lng]);
    });

    map.fitBounds(bounds, {
      padding: [28, 28],
      maxZoom: 14
    });
  }

  initialiseGallery();
  setupAccordions();
  setupViewer();
  setupMap();

  requestAnimationFrame(() => {
    document.body.classList.add("about-house-page-ready");
  });
})();
