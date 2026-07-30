(() => {
  "use strict";

const IMAGE_ROOT = "../images/attractions";
const TRANSITION_MS = 200;

const attractions = [
  {
    id: "castlefields",
    tab: "Castlefields",
    name: "Castlefields Canal & River Park",
    category: "Canal • Riverside Park • Nature",
    description: "A peaceful local green space where the River Marden meets the historic canal. Follow the waterside paths, watch the ducks, enjoy a picnic or choose it for an easy outing close to the farmhouse.",
    rating: "4.6 ★",
    facts: [
      ["Distance", "Approx. 1.7 miles"],
      ["Drive", "Around 5 minutes"],
      ["Walk", "Around 35–40 minutes"],
      ["Entry", "Free"],
      ["Parking", "Local public parking"],
      ["Visit length", "1–2 hours"]
    ],
    facilities: ["Walking paths", "Picnic spots", "Play area nearby", "Town facilities nearby"],
    perfectFor: "A relaxed first afternoon, a short family walk, feeding the ducks and getting some fresh air without a long journey.",
    goodToKnow: "This is the easiest attraction to visit spontaneously. Take suitable food for the ducks rather than bread, and check nearby café or toilet opening times on the day.",
    opening: "Open-access public park; accessible throughout the day.",
    website: "https://www.castlefieldscarp.org/",
    websiteLabel: "Park Information",
    directions: "https://www.google.com/maps/dir/?api=1&origin=Ratford+Bridge+Farmhouse,+Calne+SN11+9JX&destination=Castlefields+Canal+and+River+Park,+Calne",
    imagePrefix: "castlefields",
    imagePositions: ["center", "center", "center", "center", "center"]
  },
  {
    id: "bowood",
    tab: "Bowood",
    name: "Bowood House & Gardens",
    category: "Historic House • Gardens • Adventure Playground",
    description: "A grand country estate with elegant rooms, sweeping landscaped grounds, lakeside walks and an adventure playground. It offers enough variety for adults, children and babies to enjoy a full family day out together.",
    rating: "4.6 ★",
    facts: [
      ["Distance", "Approx. 3.8 miles"],
      ["Drive", "Around 8 minutes"],
      ["Walk", "Not recommended"],
      ["Entry", "Adults £18.20; ages 2–16 £10.90–£13.50"],
      ["Parking", "Free on-site parking"],
      ["Under 2s", "Free"]
    ],
    facilities: ["Toilets", "Baby changing", "Cafés", "Picnic areas", "Adventure playground", "Gift shop"],
    perfectFor: "A full family day with something for every age, especially children who want space to play while adults enjoy the house and gardens.",
    goodToKnow: "Your group is large enough for Bowood’s discounted group rates for 15 or more visitors. Arrange the visit in advance to confirm eligibility and booking requirements.",
    opening: "10:30am–5:30pm; last admission 4:30pm. Open 27 March–1 November 2026.",
    website: "https://bowood.org/house-gardens/plan-your-visit/",
    websiteLabel: "Official Website",
    directions: "https://www.google.com/maps/dir/?api=1&origin=Ratford+Bridge+Farmhouse,+Calne+SN11+9JX&destination=Bowood+House+and+Gardens,+Calne",
    imagePrefix: "bowood",
    imagePositions: ["center", "center", "center", "center", "center"]
  },
  {
    id: "motor-museum",
    tab: "Motor Museum",
    name: "Atwell-Wilson Motor Museum",
    category: "Classic Cars • Museum",
    description: "A friendly independent museum filled with classic cars, motorcycles, motoring memorabilia and vehicles from different eras. Its compact indoor layout makes it a convenient choice when the weather is uncertain.",
    rating: "4.7 ★",
    facts: [
      ["Distance", "Approx. 1.6 miles"],
      ["Drive", "Around 5 minutes"],
      ["Walk", "Around 30–35 minutes"],
      ["Entry", "Adults £12; ages 5–16 £5"],
      ["Parking", "Free on-site parking"],
      ["Under 5s", "Free"]
    ],
    facilities: ["Toilets", "Café", "Indoor displays", "Gift shop", "Free parking"],
    perfectFor: "Car enthusiasts, grandparents, older children and a manageable indoor outing on a rainy or cooler day.",
    goodToKnow: "The museum is closed on Mondays, including Monday 17 August. Visit from Tuesday to Friday during the stay; final admission is one hour before closing.",
    opening: "Tuesday–Sunday, 10am–4pm; final admission 3pm. Also open on Bank Holiday Mondays.",
    website: "https://atwellwilson.org.uk/",
    websiteLabel: "Official Website",
    directions: "https://www.google.com/maps/dir/?api=1&origin=Ratford+Bridge+Farmhouse,+Calne+SN11+9JX&destination=Atwell-Wilson+Motor+Museum,+Calne",
    imagePrefix: "motor-museum",
    imagePositions: ["center", "center", "center", "center", "center"]
  },
  {
    id: "lacock",
    tab: "Lacock",
    name: "Lacock Abbey",
    category: "Abbey • Historic Village • Film Location",
    description: "Explore the atmospheric abbey, medieval cloisters, country-house rooms, Fox Talbot Museum and the beautifully preserved village of Lacock. Film fans may recognise settings used in Harry Potter and other productions.",
    rating: "4.6 ★",
    facts: [
      ["Distance", "Approx. 7 miles"],
      ["Drive", "Around 14 minutes"],
      ["Walk", "Not recommended"],
      ["Entry", "Adults £21; ages 5–17 £10.50"],
      ["Parking", "National Trust car park"],
      ["Under 5s", "Free"]
    ],
    facilities: ["Toilets", "Baby changing", "Café", "Picnic areas", "Museum", "Gift shop"],
    perfectFor: "Harry Potter fans, history lovers, photographers and families who enjoy combining an indoor attraction with a pretty village walk.",
    goodToKnow: "Arrive before mid-afternoon because the Abbey rooms close earlier than the wider grounds. Pokémon Summer of Play is scheduled during the August stay and normal admission applies.",
    opening: "Grounds and museum generally 10am–5pm; Abbey rooms open later and close earlier. Check the day’s detailed times.",
    website: "https://www.nationaltrust.org.uk/visit/wiltshire/lacock",
    websiteLabel: "Official Website",
    directions: "https://www.google.com/maps/dir/?api=1&origin=Ratford+Bridge+Farmhouse,+Calne+SN11+9JX&destination=Lacock+Abbey,+Chippenham",
    imagePrefix: "lacock",
    imagePositions: ["center", "center", "center", "center", "center"]
  },
  {
    id: "caen-hill",
    tab: "Caen Hill",
    name: "Caen Hill Locks",
    category: "Canal • Landmark • Scenic Walk",
    description: "One of Britain’s most impressive canal sights, with a dramatic staircase of locks climbing the hillside above Devizes. You can take a gentle waterside stroll, watch boats pass through or continue further for sweeping views.",
    rating: "4.7 ★",
    facts: [
      ["Distance", "Approx. 8 miles"],
      ["Drive", "Around 15 minutes"],
      ["Walk", "Not recommended"],
      ["Entry", "Free"],
      ["Parking", "Pay-and-display"],
      ["Visit length", "1–3 hours"]
    ],
    facilities: ["Towpath", "Café nearby", "Customer toilets nearby", "Picnic spots", "Canal views"],
    perfectFor: "A scenic family walk, photography, watching boats and an inexpensive outing that can be as short or as active as you choose.",
    goodToKnow: "The towpath slopes along the lock flight. Start near the café for an easier short visit, or continue uphill for wider views. Parking charges are usually around £3–£4 for the day.",
    opening: "The towpath is always open. Boating through the flight operates during controlled daytime hours.",
    website: "https://canalrivertrust.org.uk/canals-and-rivers/places-to-visit/caen-hill",
    websiteLabel: "Visitor Information",
    directions: "https://www.google.com/maps/dir/?api=1&origin=Ratford+Bridge+Farmhouse,+Calne+SN11+9JX&destination=Caen+Hill+Locks,+Devizes",
    imagePrefix: "caen-hill",
    imagePositions: ["center", "center", "center", "center", "center"]
  },
  {
    id: "courts",
    tab: "The Courts",
    name: "The Courts Garden",
    category: "National Trust • Arts & Crafts Garden",
    description: "A charming seven-acre Arts and Crafts garden arranged as a series of intimate garden rooms. Colourful borders, ponds, topiary and quiet corners make it a gentle, picturesque half-day visit.",
    rating: "4.6 ★",
    facts: [
      ["Distance", "Approx. 10 miles"],
      ["Drive", "Around 20 minutes"],
      ["Walk", "Not recommended"],
      ["Entry", "Adults £14; ages 5–17 £7"],
      ["Parking", "Free on-site parking"],
      ["Under 5s", "Free"]
    ],
    facilities: ["Toilets", "Refreshments", "Picnic area", "Garden seating", "National Trust shop"],
    perfectFor: "Garden lovers, grandparents, quiet family time, photography and a slower half-day outing without an overwhelming amount of walking.",
    goodToKnow: "Refreshments close at 4pm, one hour before the garden, so plan the café stop before finishing your walk. National Trust members enter free.",
    opening: "Garden 10:30am–5pm; refreshments 11am–4pm.",
    website: "https://www.nationaltrust.org.uk/visit/wiltshire/the-courts-garden",
    websiteLabel: "Official Website",
    directions: "https://www.google.com/maps/dir/?api=1&origin=Ratford+Bridge+Farmhouse,+Calne+SN11+9JX&destination=The+Courts+Garden,+Holt,+Wiltshire",
    imagePrefix: "courts",
    imagePositions: ["center", "center", "center", "center", "center"]
  },
  {
    id: "castle-combe",
    tab: "Castle Combe",
    name: "Castle Combe",
    category: "Historic Village • Cotswolds • Scenic Walk",
    description: "Often described as one of England’s prettiest villages, Castle Combe is known for honey-coloured cottages, a medieval market cross, riverside views and timeless streets that feel made for a leisurely wander.",
    rating: "4.7 ★",
    facts: [
      ["Distance", "Approx. 16 miles"],
      ["Drive", "Around 27 minutes"],
      ["Walk", "Not recommended"],
      ["Entry", "Free"],
      ["Parking", "Main visitor car park; charges apply"],
      ["Visit length", "2–3 hours"]
    ],
    facilities: ["Public toilets", "Tearooms", "Cafés", "Places to eat", "Village walks"],
    perfectFor: "A scenic drive, beautiful family photographs, a relaxed village stroll and anyone who loves historic architecture and countryside views.",
    goodToKnow: "Use the main visitor car park in Upper Castle Combe. The historic village is reached by a fairly steep ten-minute walk downhill, followed by the climb back up.",
    opening: "The village is freely accessible throughout the day; the visitor car park is open 24 hours.",
    website: "https://www.visitwiltshire.co.uk/towns-and-villages/castle-combe-p462723",
    websiteLabel: "Visitor Information",
    directions: "https://www.google.com/maps/dir/?api=1&origin=Ratford+Bridge+Farmhouse,+Calne+SN11+9JX&destination=Castle+Combe,+Wiltshire",
    imagePrefix: "castle-combe",
    imagePositions: ["center", "center", "center", "center", "center"]
  }
];

const elements = {
  tabs: document.getElementById("attraction-tabs"),
  panel: document.getElementById("attraction-panel"),
  gallery: document.getElementById("gallery"),
  galleryEmpty: document.getElementById("gallery-empty"),
  galleryEmptyCopy: document.getElementById("gallery-empty-copy"),
  category: document.getElementById("attraction-category"),
  name: document.getElementById("attraction-name"),
  rating: document.getElementById("attraction-rating"),
  description: document.getElementById("attraction-description"),
  facts: document.getElementById("facts-grid"),
  facilities: document.getElementById("facilities-list"),
  perfectFor: document.getElementById("perfect-for"),
  goodToKnow: document.getElementById("good-to-know"),
  opening: document.getElementById("opening-hours"),
  directions: document.getElementById("directions-link"),
  website: document.getElementById("website-link"),
  websiteLabel: document.getElementById("website-label"),
};

let swiper = null;
let activeAttractionId = "bowood";
let transitionTimer = null;
let renderToken = 0;

function createTabs() {
  const fragment = document.createDocumentFragment();

  attractions.forEach((attraction) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "attraction-tab";
    button.id = `tab-${attraction.id}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "attraction-panel");
    button.setAttribute("aria-selected", String(attraction.id === activeAttractionId));
    button.dataset.attractionId = attraction.id;
    button.textContent = attraction.tab;

    button.addEventListener("click", () => selectAttraction(attraction.id));
    button.addEventListener("keydown", handleTabKeydown);

    fragment.appendChild(button);
  });

  elements.tabs.appendChild(fragment);
}

function handleTabKeydown(event) {
  const tabs = [...elements.tabs.querySelectorAll("[role='tab']")];
  const currentIndex = tabs.indexOf(event.currentTarget);
  let nextIndex = null;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  }

  if (nextIndex === null) return;

  event.preventDefault();
  tabs[nextIndex].focus();
  selectAttraction(tabs[nextIndex].dataset.attractionId);
}

function selectAttraction(id) {
  if (id === activeAttractionId || !attractions.some((item) => item.id === id)) return;

  activeAttractionId = id;
  updateSelectedTab();

  window.clearTimeout(transitionTimer);
  elements.panel.classList.add("is-changing");

  transitionTimer = window.setTimeout(() => {
    renderAttraction(id);
    requestAnimationFrame(() => elements.panel.classList.remove("is-changing"));
  }, TRANSITION_MS);
}

function updateSelectedTab() {
  elements.tabs.querySelectorAll("[role='tab']").forEach((tab) => {
    const isSelected = tab.dataset.attractionId === activeAttractionId;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });
}

function renderAttraction(id) {
  const attraction = attractions.find((item) => item.id === id);
  if (!attraction) return;

  elements.category.textContent = attraction.category;
  elements.name.textContent = attraction.name;
  elements.rating.textContent = attraction.rating;
  elements.description.textContent = attraction.description;
  elements.perfectFor.textContent = attraction.perfectFor;
  elements.goodToKnow.textContent = attraction.goodToKnow;
  elements.opening.textContent = attraction.opening;
  elements.directions.href = attraction.directions;
  elements.website.href = attraction.website;
  elements.websiteLabel.textContent = attraction.websiteLabel;

  renderFacts(attraction.facts);
  renderFacilities(attraction.facilities);
  renderGallery(attraction);

  document.title = `${attraction.name} · Attractions · Wiltshire Staycation`;
}

function renderFacts(facts) {
  elements.facts.replaceChildren();
  const fragment = document.createDocumentFragment();

  facts.forEach(([label, value]) => {
    const wrapper = document.createElement("div");
    wrapper.className = "fact-card";

    const term = document.createElement("dt");
    term.textContent = label;

    const detail = document.createElement("dd");
    detail.textContent = value;

    wrapper.append(term, detail);
    fragment.appendChild(wrapper);
  });

  elements.facts.appendChild(fragment);
}

function renderFacilities(facilities) {
  elements.facilities.replaceChildren();
  const fragment = document.createDocumentFragment();

  facilities.forEach((facility) => {
    const badge = document.createElement("span");
    badge.className = "facility-badge";
    badge.textContent = facility;
    fragment.appendChild(badge);
  });

  elements.facilities.appendChild(fragment);
}

function renderGallery(attraction) {
  renderToken += 1;
  const currentToken = renderToken;

  if (swiper) {
    swiper.destroy(true, true);
    swiper = null;
  }

  elements.gallery.replaceChildren();
  elements.galleryEmpty.hidden = true;
  document.querySelector(".attraction-swiper").hidden = false;

  const expectedFiles = Array.from({ length: 5 }, (_, index) =>
    `${IMAGE_ROOT}/${attraction.imagePrefix}-${index + 1}.jpg`
  );

  const successfulSlides = [];
  let completedChecks = 0;

  expectedFiles.forEach((src, index) => {
    const image = new Image();
    image.alt = `${attraction.name} photo ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    image.src = src;
    image.style.objectPosition = attraction.imagePositions[index] || "center";

    image.addEventListener("load", () => {
      successfulSlides[index] = image;
      completeImageCheck();
    }, { once: true });

    image.addEventListener("error", () => {
      successfulSlides[index] = null;
      completeImageCheck();
    }, { once: true });
  });

  function completeImageCheck() {
    completedChecks += 1;
    if (completedChecks !== expectedFiles.length || currentToken !== renderToken) return;

    const availableImages = successfulSlides.filter(Boolean);

    if (availableImages.length === 0) {
      showEmptyGallery(attraction, expectedFiles);
      return;
    }

    const fragment = document.createDocumentFragment();

    availableImages.forEach((image) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.appendChild(image);
      fragment.appendChild(slide);
    });

    elements.gallery.appendChild(fragment);
    initialiseSwiper(availableImages.length);
  }
}

function showEmptyGallery(attraction, expectedFiles) {
  document.querySelector(".attraction-swiper").hidden = true;
  elements.galleryEmpty.hidden = false;
  elements.galleryEmptyCopy.textContent = `Add ${expectedFiles.map((path) => path.split("/").pop()).join(", ")} to images/attractions/.`;
  elements.galleryEmpty.setAttribute("aria-label", `No photos have been added for ${attraction.name} yet.`);
}

function initialiseSwiper(imageCount) {
  document.querySelector(".attraction-swiper").hidden = false;

  swiper = new Swiper(".attraction-swiper", {
    slidesPerView: 1,
    speed: 420,
    grabCursor: imageCount > 1,
    allowTouchMove: imageCount > 1,
    rewind: imageCount > 1,
    keyboard: {
      enabled: imageCount > 1,
      onlyInViewport: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    }
  });
}

function setInitialState() {
  createTabs();
  updateSelectedTab();
  renderAttraction(activeAttractionId);
}

setInitialState();

})();
