
const JOURNEY_PIN = "8576";
const ACCESS_KEY = "wiltshireJourneyAccessV1";

const COLLECTION_REFERENCE = "F3T454WN";

const JOURNEYS = {
  outbound: {
    stops: [
      { time: new Date("2026-08-17T13:23:00+01:00"), anchor: "outbound-stratford" },
      { time: new Date("2026-08-17T13:28:00+01:00"), anchor: "outbound-whitechapel" },
      { time: new Date("2026-08-17T13:31:00+01:00"), anchor: "outbound-liverpool" },
      { time: new Date("2026-08-17T13:34:00+01:00"), anchor: "outbound-farringdon" },
      { time: new Date("2026-08-17T13:37:00+01:00"), anchor: "outbound-tottenham" },
      { time: new Date("2026-08-17T13:39:00+01:00"), anchor: "outbound-bond" },
      { time: new Date("2026-08-17T13:43:00+01:00"), anchor: "outbound-pad-arrive" },
      { time: new Date("2026-08-17T14:00:00+01:00"), anchor: "outbound-pad-depart", holdFromPrevious: true },
      { time: new Date("2026-08-17T14:25:00+01:00"), anchor: "outbound-reading" },
      { time: new Date("2026-08-17T14:38:00+01:00"), anchor: "outbound-didcot" },
      { time: new Date("2026-08-17T14:58:00+01:00"), anchor: "outbound-swindon" },
      { time: new Date("2026-08-17T15:10:00+01:00"), anchor: "outbound-end" }
    ],
    start: new Date("2026-08-17T13:23:00+01:00"),
    padArrive: new Date("2026-08-17T13:43:00+01:00"),
    padDepart: new Date("2026-08-17T14:00:00+01:00"),
    end: new Date("2026-08-17T15:10:00+01:00")
  },

  return: {
    stops: [
      { time: new Date("2026-08-21T09:56:00+01:00"), anchor: "return-start" },
      { time: new Date("2026-08-21T10:10:00+01:00"), anchor: "return-swindon" },
      { time: new Date("2026-08-21T10:27:00+01:00"), anchor: "return-didcot" },
      { time: new Date("2026-08-21T10:43:00+01:00"), anchor: "return-reading" },
      { time: new Date("2026-08-21T11:07:00+01:00"), anchor: "return-pad-arrive" },
      { time: new Date("2026-08-21T11:22:00+01:00"), anchor: "return-pad-depart", holdFromPrevious: true },
      { time: new Date("2026-08-21T11:25:00+01:00"), anchor: "return-bond" },
      { time: new Date("2026-08-21T11:27:00+01:00"), anchor: "return-tottenham" },
      { time: new Date("2026-08-21T11:30:00+01:00"), anchor: "return-farringdon" },
      { time: new Date("2026-08-21T11:33:00+01:00"), anchor: "return-liverpool" },
      { time: new Date("2026-08-21T11:35:00+01:00"), anchor: "return-whitechapel" },
      { time: new Date("2026-08-21T11:41:00+01:00"), anchor: "return-end" }
    ],
    start: new Date("2026-08-21T09:56:00+01:00"),
    padArrive: new Date("2026-08-21T11:07:00+01:00"),
    padDepart: new Date("2026-08-21T11:22:00+01:00"),
    end: new Date("2026-08-21T11:41:00+01:00")
  }
};

const gate = document.getElementById("journey-gate");
const content = document.getElementById("journey-content");
const pinForm = document.getElementById("journey-pin-form");
const pinInput = document.getElementById("journey-pin");
const pinEye = document.getElementById("journey-pin-eye");
const pinMessage = document.getElementById("journey-pin-message");

const tabs = Array.from(
  document.querySelectorAll(".journey-tab")
);

const panels = Array.from(
  document.querySelectorAll(".journey-panel")
);

const statusIcon =
  document.getElementById("journey-status-icon");

const statusText =
  document.getElementById("journey-status-text");

const copyReferenceButton =
  document.getElementById("copy-reference");

const copyReferenceLabel =
  document.getElementById("copy-reference-label");

let activeJourney = "outbound";


/* =========================================
   PAGE READY
========================================= */

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("journey-page-ready");
  });

  if (
    sessionStorage.getItem(ACCESS_KEY) === "granted"
  ) {
    unlockJourney();
  }

  chooseInitialJourney();
  updateJourneyState();

  window.setInterval(
    updateJourneyState,
    30000
  );
});

window.addEventListener("resize", () => {
  updateTrack(activeJourney);
});


/* =========================================
   PIN
========================================= */

pinForm.addEventListener("submit", event => {
  event.preventDefault();

  const enteredPin =
    pinInput.value.trim();

  if (enteredPin === JOURNEY_PIN) {
    sessionStorage.setItem(
      ACCESS_KEY,
      "granted"
    );

    pinMessage.textContent = "";
    unlockJourney();
    return;
  }

  pinMessage.textContent =
    "That code isn't quite right.";

  pinInput.value = "";
  pinInput.focus();
});

pinEye.addEventListener("click", () => {
  const showing =
    pinInput.type === "text";

  pinInput.type =
    showing ? "password" : "text";

  pinEye.setAttribute(
    "aria-label",
    showing
      ? "Show access code"
      : "Hide access code"
  );
});

function unlockJourney() {
  gate.hidden = true;
  content.hidden = false;

  requestAnimationFrame(() => {
    updateJourneyState();
    updateTrack(activeJourney);
  });
}


/* =========================================
   TABS
========================================= */

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    setActiveJourney(
      tab.dataset.journey
    );
  });
});

function setActiveJourney(journeyKey) {
  activeJourney = journeyKey;

  tabs.forEach(tab => {
    const active =
      tab.dataset.journey === journeyKey;

    tab.classList.toggle(
      "is-active",
      active
    );

    tab.setAttribute(
      "aria-selected",
      String(active)
    );
  });

  panels.forEach(panel => {
    panel.hidden =
      panel.dataset.panel !== journeyKey;
  });

  requestAnimationFrame(() => {
    updateTrack(journeyKey);
    updateNextStep(journeyKey);
  });
}

function chooseInitialJourney() {
  const now = new Date();

  if (
    now >= new Date("2026-08-21T00:00:00+01:00")
  ) {
    setActiveJourney("return");
  } else {
    setActiveJourney("outbound");
  }
}


/* =========================================
   OVERALL STATUS
========================================= */

function updateJourneyState() {
  const now = new Date();
  const outbound = JOURNEYS.outbound;
  const returnJourney = JOURNEYS.return;

  if (now < outbound.start) {
    const days =
      Math.max(
        0,
        Math.ceil(
          (outbound.start - now) /
          (1000 * 60 * 60 * 24)
        )
      );

    statusIcon.textContent = "🌿";

    statusText.textContent =
      days === 0
        ? "Outbound journey is today"
        : `Outbound journey in ${days} ${days === 1 ? "day" : "days"}`;
  } else if (now <= outbound.end) {
    statusIcon.textContent = "🚆";
    statusText.textContent =
      "Outbound journey in progress";
  } else if (now < new Date("2026-08-21T00:00:00+01:00")) {
    statusIcon.textContent = "🏡";
    statusText.textContent =
      "You're in Wiltshire";
  } else if (now < returnJourney.start) {
    statusIcon.textContent = "🚆";
    statusText.textContent =
      "Return journey is today";
  } else if (now <= returnJourney.end) {
    statusIcon.textContent = "🚆";
    statusText.textContent =
      "Return journey in progress";
  } else {
    statusIcon.textContent = "✓";
    statusText.textContent =
      "Journey complete";
  }

  updateTrack("outbound");
  updateTrack("return");
  updateNextStep("outbound");
  updateNextStep("return");
}


/* =========================================
   NEXT STEP
========================================= */

function updateNextStep(journeyKey) {
  const card =
    document.querySelector(
      `[data-next-step="${journeyKey}"] strong`
    );

  if (!card) {
    return;
  }

  const now = new Date();
  const journey = JOURNEYS[journeyKey];

  if (journeyKey === "outbound") {
    if (now < journey.start) {
      card.textContent =
        "Collect your tickets before travelling";
      return;
    }

    if (now < journey.padArrive) {
      card.textContent =
        "Elizabeth line to London Paddington";
      return;
    }

    if (now < journey.padDepart) {
      card.textContent =
        "Change at Paddington · GWR next";
      return;
    }

    if (now < journey.end) {
      card.textContent =
        "GWR to Chippenham";
      return;
    }

    card.textContent =
      "Arrived · choose your onward journey to the farmhouse";
    return;
  }

  if (now < journey.start) {
    card.textContent =
      "Arrange your journey to Chippenham station";
    return;
  }

  if (now < journey.padArrive) {
    card.textContent =
      "GWR to London Paddington";
    return;
  }

  if (now < journey.padDepart) {
    card.textContent =
      "Change at Paddington · Elizabeth line next";
    return;
  }

  if (now < journey.end) {
    card.textContent =
      "Elizabeth line to Stratford";
    return;
  }

  card.textContent =
    "Arrived at Stratford";
}


/* =========================================
   MOVING TRAIN TRACKER
========================================= */

function updateTrack(journeyKey) {
  const track =
    document.querySelector(
      `[data-track="${journeyKey}"]`
    );

  if (!track || track.offsetParent === null) {
    return;
  }

  const marker =
    track.querySelector(".moving-train");

  const fill =
    track.querySelector(".track-line-fill");

  const journey =
    JOURNEYS[journeyKey];

  const now =
    new Date();

  const targetY =
    calculateMarkerY(
      track,
      journey,
      now
    );

  if (targetY === null) {
    return;
  }

  const lineTop =
    getLineTop(track);

  const markerHeight =
    marker.offsetHeight || 31;

  marker.style.top =
    `${targetY - markerHeight / 2}px`;

  fill.style.height =
    `${Math.max(0, targetY - lineTop)}px`;
}

function calculateMarkerY(
  track,
  journey,
  now
) {
  const stops = journey.stops;

  if (!stops || stops.length === 0) {
    return null;
  }

  const firstY =
    getAnchorY(
      track,
      stops[0].anchor
    );

  const lastY =
    getAnchorY(
      track,
      stops[stops.length - 1].anchor
    );

  if (firstY === null || lastY === null) {
    return null;
  }

  if (now <= stops[0].time) {
    return firstY;
  }

  if (now >= stops[stops.length - 1].time) {
    return lastY;
  }

  for (
    let index = 0;
    index < stops.length - 1;
    index += 1
  ) {
    const currentStop =
      stops[index];

    const nextStop =
      stops[index + 1];

    if (
      now >= currentStop.time &&
      now < nextStop.time
    ) {
      const currentY =
        getAnchorY(
          track,
          currentStop.anchor
        );

      const nextY =
        getAnchorY(
          track,
          nextStop.anchor
        );

      if (
        currentY === null ||
        nextY === null
      ) {
        return null;
      }

      /*
        Paddington connection:
        keep the train parked at the arrival
        station until the next train departs.
      */

      if (nextStop.holdFromPrevious) {
        return currentY;
      }

      return interpolateY(
        currentY,
        nextY,
        currentStop.time,
        nextStop.time,
        now
      );
    }
  }

  return lastY;
}

function getAnchorY(
  track,
  anchorName
) {
  const row =
    track.querySelector(
      `[data-anchor="${anchorName}"]`
    );

  if (!row) {
    return null;
  }

  const dot =
    row.querySelector(".station-dot");

  const trackRect =
    track.getBoundingClientRect();

  const dotRect =
    dot.getBoundingClientRect();

  return (
    dotRect.top -
    trackRect.top +
    dotRect.height / 2
  );
}

function getLineTop(track) {
  const line =
    track.querySelector(".track-line");

  return (
    parseFloat(
      window.getComputedStyle(line).top
    ) || 0
  );
}

function interpolateY(
  fromY,
  toY,
  fromTime,
  toTime,
  now
) {
  const duration =
    toTime - fromTime;

  const elapsed =
    now - fromTime;

  const ratio =
    Math.min(
      1,
      Math.max(
        0,
        elapsed / duration
      )
    );

  return (
    fromY +
    (toY - fromY) * ratio
  );
}


/* =========================================
   COPY COLLECTION REFERENCE
========================================= */

copyReferenceButton.addEventListener(
  "click",
  async () => {
    let copied = false;

    try {
      await navigator.clipboard.writeText(
        COLLECTION_REFERENCE
      );

      copied = true;
    } catch (error) {
      copied =
        fallbackCopy(
          COLLECTION_REFERENCE
        );
    }

    copyReferenceLabel.textContent =
      copied ? "Copied" : "F3T454WN";

    window.setTimeout(() => {
      copyReferenceLabel.textContent =
        "Copy";
    }, 1600);
  }
);

function fallbackCopy(text) {
  const input =
    document.createElement("textarea");

  input.value = text;
  input.setAttribute(
    "readonly",
    ""
  );

  input.style.position = "fixed";
  input.style.opacity = "0";

  document.body.appendChild(input);

  input.select();

  let success = false;

  try {
    success =
      document.execCommand("copy");
  } catch (error) {
    success = false;
  }

  input.remove();

  return success;
}
