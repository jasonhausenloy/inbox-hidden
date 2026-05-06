(function () {
  "use strict";

  let revealed = false;
  let lastBg = null;
  let lastFg = null;
  let lastDark = null;

  function hashPath() {
    return location.hash.replace(/^#/, "");
  }

  function isInboxListView() {
    const h = hashPath();
    if (h === "" || h === "inbox") return true;
    if (/^inbox\/p\d+$/.test(h)) return true;
    if (/^inbox\?/.test(h)) return true;
    return false;
  }

  function isInboxArea() {
    const h = hashPath();
    return h === "" || h === "inbox" || h.startsWith("inbox/") || h.startsWith("inbox?");
  }

  function shouldHide() {
    return isInboxListView() && !revealed;
  }

  // Probe Gmail's actual themed container so we follow user's theme
  // (light, dark, or any of Gmail's custom themes).
  function probeColor(prop) {
    const probes = [
      ".bkK", ".aeF", ".nH[role=main]", ".nH", '[role="main"]', "body"
    ];
    for (const sel of probes) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const v = getComputedStyle(el)[prop];
      if (!v) continue;
      if (v === "rgba(0, 0, 0, 0)" || v === "transparent") continue;
      return v;
    }
    return null;
  }

  function isDarkColor(rgb) {
    if (!rgb) return false;
    const m = rgb.match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return false;
    const [r, g, b] = m.slice(0, 3).map(Number);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128;
  }

  function applyTheme(overlay) {
    const bg = probeColor("backgroundColor") || "#ffffff";
    const fg = probeColor("color") || (isDarkColor(bg) ? "#e3e3e3" : "#202124");
    const dark = isDarkColor(bg);
    if (bg !== lastBg) {
      overlay.style.backgroundColor = bg;
      lastBg = bg;
    }
    if (fg !== lastFg) {
      overlay.style.color = fg;
      lastFg = fg;
    }
    if (dark !== lastDark) {
      overlay.classList.toggle("ih-dark", dark);
      lastDark = dark;
    }
  }

  function buildOverlay() {
    const ov = document.createElement("div");
    ov.className = "ih-overlay";
    ov.innerHTML = `
      <button class="ih-show" type="button" data-ih="reveal">Show Inbox</button>
      <div class="ih-foot"><span class="ih-kbd">⌘⇧I</span> to toggle</div>
    `;
    ov.querySelector('[data-ih="reveal"]').addEventListener("click", function (e) {
      e.preventDefault();
      revealed = true;
      update();
    });
    return ov;
  }

  function buildHideChip() {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "ih-hide-chip";
    chip.textContent = "Hide Inbox";
    chip.addEventListener("click", function (e) {
      e.preventDefault();
      revealed = false;
      update();
    });
    return chip;
  }

  function ensureOverlay() {
    const main = document.querySelector('div[role="main"]');
    if (!main) return;
    let ov = main.querySelector(":scope > .ih-overlay");
    if (!ov) {
      if (!main.style.position) main.style.position = "relative";
      ov = buildOverlay();
      main.appendChild(ov);
    }
    applyTheme(ov);
  }

  function ensureHideChip() {
    const main = document.querySelector('div[role="main"]');
    if (!main) return;
    if (main.querySelector(":scope > .ih-hide-chip")) return;
    if (!main.style.position) main.style.position = "relative";
    main.appendChild(buildHideChip());
  }

  function removeOverlays() {
    document.querySelectorAll(".ih-overlay").forEach((n) => n.remove());
  }

  function removeHideChips() {
    document.querySelectorAll(".ih-hide-chip").forEach((n) => n.remove());
  }

  function update() {
    const root = document.documentElement;
    if (shouldHide()) {
      root.classList.add("ih-active");
      ensureOverlay();
      removeHideChips();
    } else {
      root.classList.remove("ih-active");
      removeOverlays();
      if (revealed && isInboxListView()) {
        ensureHideChip();
      } else {
        removeHideChips();
      }
    }
  }

  let prevInArea = isInboxArea();
  window.addEventListener("hashchange", function () {
    const nowInArea = isInboxArea();
    if (prevInArea && !nowInArea) revealed = false;
    if (!prevInArea && nowInArea) revealed = false;
    prevInArea = nowInArea;
    update();
  });

  document.addEventListener(
    "keydown",
    function (e) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "I" || e.key === "i")) {
        if (!isInboxArea()) return;
        e.preventDefault();
        e.stopPropagation();
        revealed = !revealed;
        update();
      }
    },
    true
  );

  setInterval(update, 400);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }
})();
