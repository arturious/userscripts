// ==UserScript==
// @name         YouTube Premium Custom Font
// @namespace    my-userscripts
// @version      1.0.0
// @author       Artur Bakhtygereyev
// @description  Replaces YouTube Premium logo text with custom styled text using Japan Daisuke font
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM_addStyle
// @inject-into  content
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const FONT_FAMILY = '"Japan Daisuke", "JapanDaisuki", "Japan Daisuke Regular", serif !important';
  console.log("%c[Userscript] YouTube Premium Custom Font: Инициализация...", "color: #3b82f6; font-weight: bold;");
  if (!document.getElementById("yt-premium-font-global")) {
    const globalStyle = document.createElement("style");
    globalStyle.id = "yt-premium-font-global";
    globalStyle.textContent = `
    @font-face {
      font-family: 'Japan Daisuke';
      src: local('Japan Daisuke'), local('JapanDaisuki'), local('Japan Daisuke Regular');
    }
  `;
    document.head.appendChild(globalStyle);
    console.log("[Userscript] Глобальный шрифт Japan Daisuke внедрен в head.");
  }
  const observedRoots = /* @__PURE__ */ new Set();
  function observeShadow(root) {
    if (observedRoots.has(root)) return;
    observedRoots.add(root);
    observer.observe(root, { childList: true, subtree: true });
    console.log("[Userscript] Добавлен MutationObserver на shadowRoot:", root.host.tagName);
  }
  function replaceLogo() {
    const host = document.querySelector("ytd-topbar-logo-renderer") || document.querySelector("ytd-logo");
    if (!host) {
      return;
    }
    if (!host.shadowRoot) {
      return;
    }
    observeShadow(host.shadowRoot);
    const logoLink = host.shadowRoot.querySelector("a#logo") || host.shadowRoot.querySelector("a");
    if (!logoLink) {
      return;
    }
    let svg = null;
    svg = logoLink.querySelector("svg");
    const ytIcon = logoLink.querySelector("yt-icon") || logoLink.querySelector("#logo-icon");
    if (!svg && ytIcon && ytIcon.shadowRoot) {
      observeShadow(ytIcon.shadowRoot);
      svg = ytIcon.shadowRoot.querySelector("svg");
    }
    const iconShape = logoLink.querySelector("yt-icon-shape") || ytIcon && ytIcon.shadowRoot && ytIcon.shadowRoot.querySelector("yt-icon-shape");
    if (iconShape && iconShape.shadowRoot) {
      observeShadow(iconShape.shadowRoot);
      if (!svg) {
        svg = iconShape.shadowRoot.querySelector("svg");
      }
    }
    if (ytIcon && ytIcon.shadowRoot) {
      if (!ytIcon.shadowRoot.getElementById("force-hide-youtube-paths")) {
        const forceStyle = document.createElement("style");
        forceStyle.id = "force-hide-youtube-paths";
        forceStyle.textContent = `
        [id^="youtube-paths"], g[id*="youtube-paths"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;
        ytIcon.shadowRoot.appendChild(forceStyle);
        console.log("[Userscript] Внедрено скрытие путей в shadowRoot yt-icon.");
      }
    }
    if (iconShape && iconShape.shadowRoot) {
      if (!iconShape.shadowRoot.getElementById("force-hide-youtube-paths")) {
        const forceStyle = document.createElement("style");
        forceStyle.id = "force-hide-youtube-paths";
        forceStyle.textContent = `
        [id^="youtube-paths"], g[id*="youtube-paths"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;
        iconShape.shadowRoot.appendChild(forceStyle);
        console.log("[Userscript] Внедрено скрытие путей в shadowRoot yt-icon-shape.");
      }
    }
    if (!host.shadowRoot.getElementById("custom-premium-styles")) {
      const shadowStyle = document.createElement("style");
      shadowStyle.id = "custom-premium-styles";
      shadowStyle.textContent = `
      #logo, a {
        display: flex !important;
        align-items: center !important;
      }

      #logo::after, a::after {
        content: "premium" !important;
        color: var(--yt-spec-text-primary, #ffffff) !important;
        font-family: ${FONT_FAMILY};
        font-size: 25px !important;
        font-weight: 400 !important;
        line-height: 1 !important;
        margin-left: 8px !important;
      }

      /* Скрываем стандартные элементы (код страны и другие плашки) */
      #country-code,
      ytd-badge-supported-renderer {
        display: none !important;
      }
    `;
      host.shadowRoot.appendChild(shadowStyle);
      console.log("[Userscript] Стили ::after успешно внедрены в shadowRoot логотипа.");
    }
    if (!svg) return;
    const originalViewBox = svg.getAttribute("viewBox");
    if (originalViewBox && !svg.dataset.cropped) {
      const parts = originalViewBox.split(" ");
      const height = parseFloat(parts[3] || "20");
      const width = Math.round(1.43 * height);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;
      svg.dataset.cropped = "true";
      const parentIcon = svg.closest("yt-icon") || svg.closest("#logo-icon") || svg.parentElement;
      if (parentIcon) {
        parentIcon.style.width = `${width}px`;
      }
      console.log("[Userscript] SVG логотипа успешно обрезано до иконки плей.");
    }
  }
  const observer = new MutationObserver(() => {
    replaceLogo();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(replaceLogo, 500);
  replaceLogo();

})();