// Wiltshire Staycation Website
// JavaScript will be added here as we build the site.

window.addEventListener("message", function (event) {
  if (event.origin !== "https://tozummi.github.io") {
    return;
  }

  if (
    event.data &&
    event.data.type === "photo-widget-height"
  ) {
    const iframe = document.getElementById(
      "photo-of-the-day-widget"
    );

    if (iframe) {
      iframe.style.height = `${event.data.height + 20}px`;
    }
  }
});

window.addEventListener("message", function (event) {
  if (event.origin !== "https://tozummi.github.io") {
    return;
  }

  if (
    event.data &&
    event.data.type === "prayer-widget-height"
  ) {
    const iframe = document.getElementById(
      "prayer-times-widget"
    );

    if (iframe) {
      iframe.style.height = `${event.data.height + 20}px`;
    }
  }
});

/* =========================================
   WILTSHIRE STAY WEATHER
========================================= */

const WILTSHIRE_STAY_DATES = [
  {
    date: "2026-08-17",
    day: "Mon",
    fullDay: "Monday",
    displayDate: "17 Aug"
  },
  {
    date: "2026-08-18",
    day: "Tue",
    fullDay: "Tuesday",
    displayDate: "18 Aug"
  },
  {
    date: "2026-08-19",
    day: "Wed",
    fullDay: "Wednesday",
    displayDate: "19 Aug"
  },
  {
    date: "2026-08-20",
    day: "Thu",
    fullDay: "Thursday",
    displayDate: "20 Aug"
  },
  {
    date: "2026-08-21",
    day: "Fri",
    fullDay: "Friday",
    displayDate: "21 Aug"
  }
];


/*
  Ratford Bridge Farmhouse
  Calne, Wiltshire
*/
const RATFORD_LATITUDE = 51.445518;
const RATFORD_LONGITUDE = -2.027169;


const stayDayLabel =
  document.getElementById("stay-day-label");

const stayDayTitle =
  document.getElementById("stay-day-title");

const stayWeatherDate =
  document.getElementById("stay-weather-date");

const stayForecastStrip =
  document.getElementById("stay-forecast-strip");

const stayWeatherNote =
  document.getElementById("stay-weather-note");


function getLocalDateString() {
  const parts = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).formatToParts(new Date());

  const year = parts.find(
    part => part.type === "year"
  ).value;

  const month = parts.find(
    part => part.type === "month"
  ).value;

  const day = parts.find(
    part => part.type === "day"
  ).value;

  return `${year}-${month}-${day}`;
}


function updateStayDayHeading() {
  if (
    !stayDayLabel ||
    !stayDayTitle ||
    !stayWeatherDate
  ) {
    return;
  }

  const today = getLocalDateString();

  const firstDate =
    WILTSHIRE_STAY_DATES[0].date;

  const finalDate =
    WILTSHIRE_STAY_DATES[
      WILTSHIRE_STAY_DATES.length - 1
    ].date;

  const currentDayIndex =
    WILTSHIRE_STAY_DATES.findIndex(
      item => item.date === today
    );


  if (currentDayIndex !== -1) {
    const currentDay =
      WILTSHIRE_STAY_DATES[currentDayIndex];

    stayDayLabel.textContent =
      `Day ${currentDayIndex + 1} of 5`;

    stayDayTitle.textContent =
      currentDay.fullDay;

    stayWeatherDate.textContent =
      `${currentDay.displayDate} 2026`;

    return;
  }


  if (today < firstDate) {
    stayDayLabel.textContent =
      "Our five-day stay";

    stayDayTitle.textContent =
      "Weather in Wiltshire";

    stayWeatherDate.textContent =
      "17–21 August 2026";

    return;
  }


  if (today > finalDate) {
    stayDayLabel.textContent =
      "Five lovely days";

    stayDayTitle.textContent =
      "Staycation complete";

    stayWeatherDate.textContent =
      "17–21 August 2026";
  }
}


function createStayWeatherIcon(type) {
  const stroke = `
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
  `;

  const icons = {
    sun: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle
          cx="20"
          cy="20"
          r="6.5"
          ${stroke}
        ></circle>

        <path
          d="
            M20 5v5
            M20 30v5
            M5 20h5
            M30 20h5
            M9.4 9.4l3.5 3.5
            M27.1 27.1l3.5 3.5
            M30.6 9.4l-3.5 3.5
            M12.9 27.1l-3.5 3.5
          "
          ${stroke}
        ></path>
      </svg>
    `,

    partly: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle
          cx="14"
          cy="13"
          r="5"
          ${stroke}
        ></circle>

        <path
          d="
            M14 4v3
            M5 13h3
            M7.5 6.5l2.2 2.2
            M20.5 6.5l-2.2 2.2
          "
          ${stroke}
        ></path>

        <path
          d="
            M11 29h18
            a5.5 5.5 0 0 0 .3-11
            a8.5 8.5 0 0 0 -15.9 2.2
            A4.5 4.5 0 0 0 11 29Z
          "
          ${stroke}
        ></path>
      </svg>
    `,

    cloud: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="
            M9 29h21
            a6 6 0 0 0 .3-12
            a9.8 9.8 0 0 0 -18.6 2.7
            A5 5 0 0 0 9 29Z
          "
          ${stroke}
        ></path>
      </svg>
    `,

    rain: `
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="
            M9 24h21
            a6 6 0 0 0 .3-12
            a9.8 9.8 0 0 0 -18.6 2.7
            A5 5 0 0 0 9 24Z
          "
          ${stroke}
        ></path>

        <path
          d="
            M13 29l-2 4
            M21 29l-2 4
            M29 29l-2 4
          "
          ${stroke}
        ></path>
      </svg>
    `
  };

  return icons[type] || icons.cloud;
}


function getStayWeatherDetails(code) {
  if (code === 0) {
    return {
      condition: "Sunny",
      icon: "sun"
    };
  }

  if (code === 1 || code === 2) {
    return {
      condition: "Partly cloudy",
      icon: "partly"
    };
  }

  if (
    code === 3 ||
    code === 45 ||
    code === 48
  ) {
    return {
      condition: "Cloudy",
      icon: "cloud"
    };
  }

  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  ) {
    return {
      condition: "Rain likely",
      icon: "rain"
    };
  }

  if (code >= 71 && code <= 77) {
    return {
      condition: "Snow",
      icon: "cloud"
    };
  }

  return {
    condition: "Mixed weather",
    icon: "partly"
  };
}


function createPendingStayForecast() {
  return WILTSHIRE_STAY_DATES.map(item => ({
    ...item,
    high: null,
    low: null,
    condition: "Pending",
    icon: "cloud"
  }));
}


function renderStayForecast(forecast) {
  if (!stayForecastStrip) {
    return;
  }

  const today = getLocalDateString();

  stayForecastStrip.innerHTML = forecast
    .map(day => {
      const high =
        day.high === null ||
        day.high === undefined
          ? "–"
          : `${Math.round(day.high)}°`;

      const low =
        day.low === null ||
        day.low === undefined
          ? "–"
          : `${Math.round(day.low)}°`;

      const currentClass =
        day.date === today
          ? " is-current"
          : "";

      return `
        <article
          class="stay-forecast-day${currentClass}"
          title="${day.condition}"
        >
          <div class="stay-forecast-name">
            ${day.day}
          </div>

          <div class="stay-forecast-date">
            ${day.displayDate}
          </div>

          <div
            class="stay-weather-icon"
            aria-label="${day.condition}"
          >
            ${createStayWeatherIcon(day.icon)}
          </div>

          <div class="stay-temperatures">
            <span class="stay-temperature-high">
              ${high}
            </span>

            <span class="stay-temperature-low">
              ${low}
            </span>
          </div>

          <div class="stay-weather-condition">
            ${day.condition}
          </div>
        </article>
      `;
    })
    .join("");
}


async function loadStayForecast() {
  renderStayForecast(
    createPendingStayForecast()
  );

  const apiUrl =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${RATFORD_LATITUDE}` +
    `&longitude=${RATFORD_LONGITUDE}` +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
    "&temperature_unit=celsius" +
    "&timezone=Europe%2FLondon" +
    "&forecast_days=16";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        "Weather request failed"
      );
    }

    const data = await response.json();

    const availableForecast = new Map();

    data.daily.time.forEach(
      (date, index) => {
        const details =
          getStayWeatherDetails(
            data.daily.weather_code[index]
          );

        availableForecast.set(date, {
          high:
            data.daily
              .temperature_2m_max[index],

          low:
            data.daily
              .temperature_2m_min[index],

          condition:
            details.condition,

          icon:
            details.icon
        });
      }
    );

    const forecast =
      WILTSHIRE_STAY_DATES.map(item => {
        const result =
          availableForecast.get(item.date);

        if (!result) {
          return {
            ...item,
            high: null,
            low: null,
            condition: "Pending",
            icon: "cloud"
          };
        }

        return {
          ...item,
          ...result
        };
      });

    renderStayForecast(forecast);

    const hasLiveForecast =
      forecast.some(
        day => day.high !== null
      );

    if (stayWeatherNote) {
      stayWeatherNote.textContent =
        hasLiveForecast
          ? "Forecast for Ratford Bridge Farmhouse · High / low"
          : "The live forecast will appear closer to our stay.";
    }

  } catch (error) {
    console.error(
      "Could not load stay forecast:",
      error
    );

    if (stayWeatherNote) {
      stayWeatherNote.textContent =
        "The forecast is temporarily unavailable.";
    }
  }
}


updateStayDayHeading();
loadStayForecast();
