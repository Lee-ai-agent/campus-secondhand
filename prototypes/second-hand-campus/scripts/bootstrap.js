function render() {
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
  if (state.mode === "mini") {
    const sellPages = ["sell", "publish", "posts", "sellOrders", "ship", "refund", "consultReplies", "shop"];
    if (sellPages.includes(state.miniPage)) {
      renderSeller();
    } else {
      renderMini();
    }
  }
  if (state.mode === "admin") renderAdmin();
}

document.querySelectorAll(".mode-tab").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

if (typeof window.addEventListener === "function") {
  window.addEventListener("hashchange", () => {
    applyHash();
    render();
  });
}

applyHash();
render();
