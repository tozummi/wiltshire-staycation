// ==========================================================
// LINKS — CHANGE THESE HERE IF A LINK EVER CHANGES
// ==========================================================

const FOOD_PLANNER_URL =
  "https://docs.google.com/spreadsheets/d/1T7MTUryTWQjqQAEylzt4Qo2AVFpkB7Q079tsSC-rMp4/edit?usp=drivesdk";

// ==========================================================
// HOLIDAY DATES
// Monday 17 August to Friday 21 August 2026
// ==========================================================

const HOLIDAY_START = new Date(2026, 7, 17);
const HOLIDAY_END = new Date(2026, 7, 21, 23, 59, 59);

// ==========================================================
// BREAKFAST MENU — EDIT THESE LISTS WHEN NEEDED
// ==========================================================

const breakfastMenu = [
  {
    title: "🥣 Breakfast Staples",
    items: ["Cereal", "Eggs", "Beans", "Hash browns", "Sausages", "Toast"]
  },
  {
    title: "🥯 Bakery",
    items: ["Bread", "Bagels", "Crumpets", "Croissants"]
  },
  {
    title: "🍓 Fruit & Extras",
    items: ["Fruit", "Yoghurts", "Pancakes", "Waffles"]
  },
  {
    title: "🥤 Drinks",
    items: ["Tea", "Coffee", "Juice", "Milk"]
  }
];

// ==========================================================
// MEAL PLAN — THIS IS THE MAIN SECTION YOU WILL EDIT
//
// Leave an array empty, for example children: [], and that
// section automatically stays hidden.
//
// items: general choices
// homePrepared: cooked at home and reheated at the farmhouse
// cookedFresh: cooked fresh at the farmhouse
// children: children's alternatives
// note: a short preparation or serving note
// ==========================================================

const mealPlan = {
  monday: {
    label: "Monday",
    dateLabel: "17 August",
    lunch: {
      preparedBy: "Yourself",
      items: ["Meal deal", "Packed lunch", "Drive-thru"],
      homePrepared: [],
      cookedFresh: [],
      children: [],
      note: "Check-in is after 3pm, so everyone can choose what suits them on the journey."
    },
    dinner: {
      preparedBy: "Ruji",
      items: [],
      homePrepared: ["Chicken Roast", "Sardine Biran"],
      cookedFresh: ["Rice"],
      children: [],
      note: ""
    }
  },

  tuesday: {
    label: "Tuesday",
    dateLabel: "18 August",
    lunch: {
      preparedBy: "Tanya",
      items: [],
      homePrepared: ["Naga Chicken Roll filling", "Chicken Tikka Roll filling"],
      cookedFresh: ["Chips"],
      children: [],
      note: "The fillings can be brought from home and the rolls assembled on the day."
    },
    dinner: {
      preparedBy: "Mina & Affa",
      items: [],
      homePrepared: [
        "Meat Curry — Mina",
        "Mackerel — Mina",
        "Fish Bhuna — Affa",
        "Small Egg Curry — Affa"
      ],
      cookedFresh: ["Rice"],
      children: [],
      note: ""
    }
  },

  wednesday: {
    label: "Wednesday",
    dateLabel: "19 August",
    lunch: {
      preparedBy: "Shumon & the girls",
      items: ["English breakfast brunch — to be confirmed"],
      homePrepared: [],
      cookedFresh: [],
      children: [],
      note: ""
    },
    dinner: {
      preparedBy: "Ruby & Naheda",
      items: [],
      homePrepared: ["Chicken Curry — Ruby", "Prawns with Lotha — Naheda"],
      cookedFresh: ["Rice"],
      children: [],
      note: ""
    }
  },

  thursday: {
    label: "Thursday",
    dateLabel: "20 August",
    lunch: {
      preparedBy: "",
      items: ["Leftover Curries"],
      homePrepared: [],
      cookedFresh: ["Rice"],
      children: [],
      note: ""
    },
    dinner: {
      preparedBy: "Tanya & the boys?",
      items: [],
      homePrepared: [],
      cookedFresh: ["Spaghetti Bolognese"],
      children: [],
      note: "Bring halal keema from home, as it may not be available nearby."
    }
  },

  friday: {
    label: "Friday",
    dateLabel: "21 August",
    departure: {
      intro: "Finish breakfast, pack up and be ready to leave the farmhouse by 10am.",
      items: [
        "Finish eating breakfast by 8:30–9:00am",
        "Check out by 10:00am",
        "Pack sandwiches or lunch for the journey if needed"
      ]
    }
  }
};

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const dayTabs = document.getElementById("dayTabs");
const dayPanel = document.getElementById("dayPanel");
const breakfastToggle = document.getElementById("breakfastToggle");
const breakfastPanel = document.getElementById("breakfastPanel");
const breakfastGrid = document.getElementById("breakfastGrid");

let activeDay = getSuggestedActiveDay();

function setPlannerLinks() {
  document.getElementById("foodPlannerTopLink").href = FOOD_PLANNER_URL;
  document.getElementById("foodPlannerNoticeLink").href = FOOD_PLANNER_URL;
}

function renderBreakfastMenu() {
  breakfastGrid.innerHTML = breakfastMenu
    .map(
      (group) => `
        <article class="breakfast-group">
          <h3>${escapeHTML(group.title)}</h3>
          <ul>
            ${group.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function setupBreakfastToggle() {
  breakfastToggle.addEventListener("click", () => {
    const isOpen = breakfastToggle.getAttribute("aria-expanded") === "true";
    breakfastToggle.setAttribute("aria-expanded", String(!isOpen));
    breakfastPanel.hidden = isOpen;
  });
}

function renderTabs() {
  dayTabs.innerHTML = dayOrder
    .map((dayKey) => {
      const day = mealPlan[dayKey];
      const selected = dayKey === activeDay;

      return `
        <button
          id="tab-${dayKey}"
          class="day-tab"
          type="button"
          role="tab"
          aria-selected="${selected}"
          aria-controls="dayPanel"
          data-day="${dayKey}"
        >
          ${escapeHTML(day.label.slice(0, 3))}
        </button>
      `;
    })
    .join("");

  dayTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-day]");
    if (!tab) return;

    activeDay = tab.dataset.day;
    updateSelectedTab();
    renderActiveDay();
  });
}

function updateSelectedTab() {
  document.querySelectorAll(".day-tab").forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.day === activeDay));
  });
}

function renderActiveDay() {
  const day = mealPlan[activeDay];

  if (day.departure) {
    dayPanel.innerHTML = `
      <div class="fade-in">
        <div class="day-heading">
          <h3>${escapeHTML(day.label)}</h3>
          <p>${escapeHTML(day.dateLabel)}</p>
        </div>

        <article class="departure-card">
          <h3>🚗 Heading Home</h3>
          <p>${escapeHTML(day.departure.intro)}</p>
          <ul class="departure-list">
            ${day.departure.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
          </ul>
        </article>
      </div>
    `;
    return;
  }

  dayPanel.innerHTML = `
    <div class="fade-in">
      <div class="day-heading">
        <h3>${escapeHTML(day.label)}</h3>
        <p>${escapeHTML(day.dateLabel)}</p>
      </div>

      <div class="meal-stack">
        ${renderMealCard("🥪", "Lunch", day.lunch)}
        ${renderMealCard("🍛", "Dinner", day.dinner)}
      </div>
    </div>
  `;
}

function renderMealCard(icon, title, meal) {
  return `
    <article class="meal-card">
      <header class="meal-card__header">
        <div class="meal-card__title-wrap">
          <h3>${icon} ${escapeHTML(title)}</h3>
          ${
            meal.preparedBy
              ? `<p class="prepared-by">Prepared by ${escapeHTML(meal.preparedBy)}</p>`
              : ""
          }
        </div>
      </header>

      ${renderMealSection("🍽️ Meal", meal.items)}
      ${renderMealSection("🏡 Prepared at Home", meal.homePrepared)}
      ${renderMealSection("🍳 Cooked Fresh", meal.cookedFresh)}
      ${renderMealSection("🧒 Children", meal.children)}

      ${
        meal.note
          ? `<p class="meal-note"><strong>Preparation note:</strong> ${escapeHTML(meal.note)}</p>`
          : ""
      }
    </article>
  `;
}

function renderMealSection(title, items) {
  if (!items || items.length === 0) return "";

  return `
    <section class="meal-section">
      <h4>${escapeHTML(title)}</h4>
      <ul>
        ${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderTodayCard() {
  const now = new Date();
  const todayTitle = document.getElementById("todayTitle");
  const todayContent = document.getElementById("todayContent");
  const todayIcon = document.querySelector(".today-card__icon");

  if (now < HOLIDAY_START) {
    todayIcon.textContent = "⏳";
    todayTitle.textContent = "The holiday hasn't started yet";
    todayContent.innerHTML =
      "<p>Browse the meal plan below and help us prepare by completing the Family Food Planner.</p>";
    return;
  }

  if (now > HOLIDAY_END) {
    todayIcon.textContent = "🌿";
    todayTitle.textContent = "Thanks for joining our Wiltshire staycation!";
    todayContent.innerHTML = "<p>The holiday meal plan has now finished.</p>";
    return;
  }

  const dayKey = getDayKeyFromDate(now);

  if (!dayKey || !mealPlan[dayKey]) {
    todayIcon.textContent = "🍽️";
    todayTitle.textContent = "Today's meals";
    todayContent.innerHTML = "<p>Choose a day below to view the full meal plan.</p>";
    return;
  }

  const day = mealPlan[dayKey];
  todayIcon.textContent = dayKey === "friday" ? "🚗" : "🍽️";
  todayTitle.textContent = dayKey === "friday" ? "Today's departure plan" : "Today's meals";

  if (day.departure) {
    todayContent.innerHTML = `<p>${escapeHTML(day.departure.intro)}</p>`;
    return;
  }

  todayContent.innerHTML = `
    <div class="today-meals">
      <div class="today-meal-row">
        <strong>Lunch</strong>
        <span>${escapeHTML(getMealSummary(day.lunch))}</span>
      </div>
      <div class="today-meal-row">
        <strong>Dinner</strong>
        <span>${escapeHTML(getMealSummary(day.dinner))}</span>
      </div>
    </div>
  `;
}

function getMealSummary(meal) {
  const allItems = [
    ...(meal.items || []),
    ...(meal.homePrepared || []),
    ...(meal.cookedFresh || [])
  ];

  return allItems.length ? allItems.join(" • ") : "To be confirmed";
}

function getSuggestedActiveDay() {
  const now = new Date();

  if (now >= HOLIDAY_START && now <= HOLIDAY_END) {
    const dayKey = getDayKeyFromDate(now);
    if (dayKey && mealPlan[dayKey]) return dayKey;
  }

  return "monday";
}

function getDayKeyFromDate(date) {
  const keysByDayNumber = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday"
  };

  return keysByDayNumber[date.getDay()] || null;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

setPlannerLinks();
renderBreakfastMenu();
setupBreakfastToggle();
renderTabs();
renderActiveDay();
renderTodayCard();
