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
