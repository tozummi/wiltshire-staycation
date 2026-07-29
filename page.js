/* =========================================
   SHARED INFORMATION PAGE JAVASCRIPT
========================================= */

const scrollToTopButton =
  document.getElementById("scroll-to-top");

if (scrollToTopButton) {

  function updateScrollToTopButton() {
    const shouldShow = window.scrollY > 500;

    scrollToTopButton.classList.toggle(
      "is-visible",
      shouldShow
    );
  }

  scrollToTopButton.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );

  window.addEventListener(
    "scroll",
    updateScrollToTopButton,
    { passive: true }
  );

  updateScrollToTopButton();
}
