(() => {
  "use strict";

  const accordions = document.querySelectorAll(".rule-card-accordion");

  accordions.forEach((card) => {
    const toggle = card.querySelector(".rule-accordion-toggle");
    const helper = card.querySelector(".rule-helper-text");

    if (!toggle || !helper) return;

    toggle.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");

      toggle.setAttribute("aria-expanded", String(isOpen));
      helper.textContent = isOpen
        ? "Tap to hide details"
        : "Tap to view details";
    });
  });

  requestAnimationFrame(() => {
    document.body.classList.add("rules-page-ready");
  });
})();
