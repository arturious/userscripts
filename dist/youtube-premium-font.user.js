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
    if (host.shadowRoot.querySelector(".custom-premium-container")) return;
    const logoLink = host.shadowRoot.querySelector("a#logo");
    if (!logoLink) return;
    const shadowStyle = document.createElement("style");
    shadowStyle.textContent = `
    .custom-premium-container {
      display: flex;
      align-items: center;
      height: 100%;
      user-select: none;
    }

    .custom-premium-container svg {
      height: 20px;
      color: var(--yt-spec-text-primary, #ffffff);
      fill: currentColor;
    }

    .custom-premium-text {
      font-family: ${CUSTOM_FONT};
      font-size: 14px;
      font-weight: 500;
      margin-left: 6px;
      color: var(--yt-spec-text-primary, #ffffff);
      letter-spacing: 0.5px;
      text-transform: capitalize;
    }

    /* Скрываем стандартные элементы внутри shadow root (код страны и другие плашки) */
    #country-code,
    ytd-badge-supported-renderer {
      display: none !important;
    }
  `;
    host.shadowRoot.appendChild(shadowStyle);
    logoLink.innerHTML = `
    <div class="custom-premium-container">
      <svg viewBox="0 0 90 20" style="width: 80px; height: 20px;">
        <g>
          <path d="M27.9727 3.125C27.6435 1.8959 26.6786 0.930999 25.4495 0.601855C23.2183 0 14.285 0 14.285 0C14.285 0 5.35171 0 3.12053 0.601855C1.89143 0.930999 0.926528 1.8959 0.597384 3.125C0 5.35618 0 10 0 10C0 10 0 14.6438 0.597384 16.875C0.926528 18.1041 1.89143 19.069 3.12053 19.3981C5.35171 20 14.285 20 14.285 20C14.285 20 23.2183 20 25.4495 19.3981C26.6786 19.069 27.6435 18.1041 27.9727 16.875C28.5701 14.6438 28.5701 10 28.5701 10C28.5701 10 28.5701 5.35618 27.9727 3.125Z" fill="#FF0000"></path>
          <path d="M11.4253 14.2854L18.8477 10.0002L11.4253 5.71503V14.2854Z" fill="#FFFFFF"></path>
        </g>
        <g fill="currentColor">
          <path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5019 11.2302 40.5019 7.79016C40.5019 4.35016 38.8019 2.10016 35.4519 2.10016H32.1819ZM34.7619 4.54016H35.3419C37.2019 4.54016 37.8919 5.33016 37.8919 7.79016C37.8919 10.2502 37.2019 11.0402 35.3419 11.0402H34.7619V4.54016Z"></path>
          <path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 46.992 9.05016C48.092 9.05016 48.422 9.87016 48.422 10.9702V18.9002H50.972V10.9702C50.972 8.79016 50.192 7.82016 48.532 7.82016C47.092 7.82016 45.712 8.52016 44.752 9.77016V8.02016H41.982V18.9002Z"></path>
          <path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7461 6.31016 48.0861 8.52016 48.0861 11.5002V13.8802C48.0861 16.7502 48.6961 18.9002 51.9661 18.9002C54.4961 18.9002 55.8061 17.6502 55.6761 14.8802H53.4061C53.3361 16.3202 52.8861 17.0702 52.0061 17.0702C50.8461 17.0702 50.6961 15.7902 50.6961 13.8802V13.3402H55.7461V11.5002ZM50.6961 11.4002C50.6961 9.54016 50.8361 8.14016 51.9861 8.14016C53.1161 8.14016 53.2761 9.51016 53.2761 11.4002V11.9402H50.6961V11.4002Z"></path>
          <path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.9445 8.07016C63.0445 8.07016 63.345 8.92016 63.345 10.0202V18.9002H65.895V10.0202C65.895 7.84016 65.115 6.87016 63.455 6.87016C62.015 6.87016 60.635 7.57016 59.675 8.82016V7.07016H56.905V18.9002H60.1945Z"></path>
          <path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.48016C75.4058 2.29016 74.9858 2.01016 74.0858 2.01016C73.1858 2.01016 72.7658 2.29016 72.7658 3.48016C72.7658 4.67016 73.1858 4.97016 74.0858 4.97016ZM71.2958 18.9002H73.8458V7.07016H71.2958V18.9002Z"></path>
          <path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.2302L83.1616 18.9002H85.8102V2.10016H83.2602V7.07016C82.4902 5.92016 81.5602 5.33016 80.1202 5.33016C77.4902 5.33016 76.4302 7.69016 76.4302 11.5502V13.8802C76.4302 17.5002 77.2916 19.0902 79.9516 19.0902ZM80.1816 17.0702C78.9616 17.0702 78.4316 15.8102 78.4316 13.8802V11.5502C78.4316 9.68016 78.9616 8.39016 80.1816 8.39016C81.4016 8.39016 81.9316 9.68016 81.9316 11.5502V13.8802C81.9316 15.8102 81.4016 17.0702 80.1816 17.0702Z"></path>
        </g>
      </svg>
      <span class="custom-premium-text">Premium</span>
    </div>
  `;
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