/**
 * PRV Projects — FAQ accordion (un singur item deschis)
 */
(function () {
  const list = document.querySelector("[data-faq-list]");
  if (!list) return;

  list.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      list.querySelectorAll(".faq-item").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
