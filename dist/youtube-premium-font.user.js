// ==UserScript==
// @name         YouTube Premium Custom Font
// @namespace    my-userscripts
// @version      1.0.0
// @author       Artur Bakhtygereyev
// @description  Replaces YouTube Premium logo text with custom styled text using Japan Daisuke font
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const CUSTOM_FONT = "'Japan Daisuke', 'Japan Daisuke Font', sans-serif";
  if (!document.getElementById("yt-premium-font-global")) {
    const globalStyle = document.createElement("style");
    globalStyle.id = "yt-premium-font-global";
    globalStyle.textContent = `
    @font-face {
      font-family: 'Japan Daisuke';
      src: local('Japan Daisuke'), local('Japan Daisuke Font');
    }
  `;
    document.head.appendChild(globalStyle);
  }
  function replaceLogo() {
    const host = document.querySelector("ytd-topbar-logo-renderer");
    if (!host || !host.shadowRoot) return;
    const logoLink = host.shadowRoot.querySelector("a#logo");
    if (!logoLink) return;
    const svg = logoLink.querySelector("svg");
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
    }
    if (!host.shadowRoot.getElementById("custom-premium-styles")) {
      const shadowStyle = document.createElement("style");
      shadowStyle.id = "custom-premium-styles";
      shadowStyle.textContent = `
      #logo {
        display: flex !important;
        align-items: center !important;
      }

      .custom-premium-text {
        font-family: ${CUSTOM_FONT};
        font-size: 15px;
        font-weight: 500;
        margin-left: 8px;
        color: var(--yt-spec-text-primary, #ffffff);
        letter-spacing: 0.5px;
        line-height: 1;
        display: inline-block;
      }

      /* Скрываем стандартные элементы (код страны и другие плашки) */
      #country-code,
      ytd-badge-supported-renderer {
        display: none !important;
      }
    `;
      host.shadowRoot.appendChild(shadowStyle);
    }
    if (!logoLink.querySelector(".custom-premium-text")) {
      const span = document.createElement("span");
      span.className = "custom-premium-text";
      span.textContent = "Premium";
      logoLink.appendChild(span);
    }
  }
  const observer = new MutationObserver((mutations) => {
    replaceLogo();
  });
  const setupObserver = () => {
    const target = document.querySelector("ytd-topbar-logo-renderer");
    if (target && target.shadowRoot) {
      observer.observe(target.shadowRoot, { childList: true, subtree: true });
      replaceLogo();
    } else {
      setTimeout(setupObserver, 100);
    }
  };
  setupObserver();

})();