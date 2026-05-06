(function () {
  "use strict";

  // ---- sync init ----
  // Runs at document_start, before <body> exists. Adds .ih-active to
  // <html> immediately so CSS hides the inbox from the very first paint
  // (no white flash before Gmail renders).
  function _isInboxNow() {
    const h = location.hash.replace(/^#/, "");
    return (
      h === "" ||
      h === "inbox" ||
      /^inbox\/p\d+$/.test(h) ||
      /^inbox\?/.test(h)
    );
  }
  if (_isInboxNow() && document.documentElement) {
    document.documentElement.classList.add("ih-active");
  }

  // ---- state ----
  let revealed = false;
  let lastBg = null;
  let lastFg = null;
  let lastDark = null;

  function isInboxListView() { return _isInboxNow(); }

  function isInboxArea() {
    const h = location.hash.replace(/^#/, "");
    return h === "" || h === "inbox" || h.startsWith("inbox/") || h.startsWith("inbox?");
  }

  function shouldHide() { return isInboxListView() && !revealed; }

  // ---- theme detection ----
  function probeBg() {
    const main = document.querySelector('[role="main"]');
    if (main) {
      let el = main;
      while (el && el !== document.documentElement) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
        el = el.parentElement;
      }
    }
    for (const sel of [".bkK", ".aeF", ".nH", "body"]) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
    }
    return null;
  }

  function isDarkColor(rgb) {
    if (!rgb) return false;
    const m = rgb.match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return false;
    const [r, g, b] = m.slice(0, 3).map(Number);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
  }

  function osPrefersDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function applyTheme(overlay) {
    // Use the probe ONLY to decide light vs dark. Always paint with solid
    // known-good colors so semi-transparent Gmail layers don't blend with
    // body-underneath (which might be the opposite theme).
    const probed = probeBg();
    const reference = probed || (osPrefersDark() ? "rgb(32, 33, 36)" : "rgb(255, 255, 255)");
    const dark = isDarkColor(reference);
    const bg = dark ? "rgb(32, 33, 36)" : "rgb(255, 255, 255)";
    const fg = dark ? "rgb(232, 234, 237)" : "rgb(32, 33, 36)";
    if (bg !== lastBg) { overlay.style.backgroundColor = bg; lastBg = bg; }
    if (fg !== lastFg) { overlay.style.color = fg; lastFg = fg; }
    if (dark !== lastDark) {
      overlay.classList.toggle("ih-dark", dark);
      document.documentElement.classList.toggle("ih-dark", dark);
      lastDark = dark;
    }
  }

  window.__inboxHiddenDebug = function () {
    const main = document.querySelector('[role="main"]');
    return {
      revealed,
      shouldHide: shouldHide(),
      isInboxListView: isInboxListView(),
      probedBg: probeBg(),
      osPrefersDark: osPrefersDark(),
      lastBg, lastFg, lastDark,
      bodyBg: document.body ? getComputedStyle(document.body).backgroundColor : null,
      mainBg: main ? getComputedStyle(main).backgroundColor : null,
      htmlClass: document.documentElement.className,
      overlayPresent: !!document.querySelector(".ih-overlay"),
      hideChipPresent: !!document.querySelector(".ih-hide-chip"),
    };
  };

  // ---- DOM nodes ----
  function buildOverlay() {
    const ov = document.createElement("div");
    ov.className = "ih-overlay";
    ov.innerHTML =
      '<button class="ih-show" type="button" data-ih="reveal">Show Inbox</button>' +
      '<div class="ih-foot"><span class="ih-kbd">⌘⇧I</span> to toggle</div>';
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

  // Hide chip is appended to <body> with position:fixed so it survives
  // Gmail re-rendering the main pane and floats above all Gmail UI.
  function ensureHideChip() {
    if (!document.body) return;
    if (document.body.querySelector(":scope > .ih-hide-chip")) return;
    document.body.appendChild(buildHideChip());
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
      if (revealed && isInboxListView()) ensureHideChip();
      else removeHideChips();
    }
  }

  // ---- listeners ----
  let prevInArea = isInboxArea();
  window.addEventListener("hashchange", function () {
    const nowInArea = isInboxArea();
    if (prevInArea !== nowInArea) revealed = false;
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

  // Fast re-probe during first 2s to catch Gmail's theme as soon as it paints.
  let fastTicks = 0;
  const fastTimer = setInterval(function () {
    update();
    if (++fastTicks >= 20) clearInterval(fastTimer);
  }, 100);
  setInterval(update, 400);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }
})();
