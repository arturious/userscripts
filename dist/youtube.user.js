// ==UserScript==
// @name         YouTube
// @namespace    my-userscripts
// @version      1.0.0
// @author       Artur Bakhtygereyev
// @description  Changes YouTube font to JetBrains Mono globally and inside shadow roots
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM_addStyle
// @inject-into  content
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_CONTENT = `
  :root, html, body, ytd-app {
    --yt-font-family: 'JetBrains Mono', monospace !important;
    --ytd-font-family: 'JetBrains Mono', monospace !important;
    --yt-spec-general-font: 'JetBrains Mono', monospace !important;
    --yt-spec-general-font-family: 'JetBrains Mono', monospace !important;
    font-family: 'JetBrains Mono', monospace !important;
  }
  * {
    font-family: 'JetBrains Mono', monospace !important;
  }

  /* yt-early New To You chip */
  #chips {
    display: flex !important;
  }

  #chips > yt-chip-cloud-chip-renderer:nth-last-child(1) {
    order: 1 !important;
    margin-right: 12px !important;
  }

  #chips > yt-chip-cloud-chip-renderer:not(:nth-last-child(1)) {
    order: 2 !important;
  }

  #chips > yt-chip-cloud-chip-renderer:nth-child(1) {
    order: 1 !important;
  }

  /* yt-Compact feed */
  ytd-rich-item-renderer {
    margin-bottom: 15px !important;
    [rendered-from-rich-grid] {
      --ytd-rich-item-row-usable-width: calc(100% - var(--ytd-rich-grid-gutter-margin) * 1) !important;
    }

    #metadata.ytd-video-meta-block {
      flex-direction: row !important;

      #metadata-line span:nth-child(3) {
        height: 1em !important;
        margin-left: 1em !important;
      }
    }
  }

  ytd-rich-grid-media {
    border-radius: 1.2em;
    height: 100% !important;

    ytd-menu-renderer #button {
      opacity: 0 !important;
      transition: opacity 0.3s ease-in-out !important;
    }
    :hover ytd-menu-renderer #button {
      opacity: 1 !important;
    }
  }

  /* yt-no distractions */
  #contents ytd-rich-section-renderer {
    display: none !important;
  }

  ytd-merch-shelf-renderer,
  .annotation {
    display: none !important;
  }

  /* yt-better captions */
  .caption-window {
    backdrop-filter: blur(10px) brightness(70%) !important;
    border-radius: 1em !important;
    padding: 1em !important;
    box-shadow: #0008 0 0 20px !important;
    width: fit-content !important;
  }

  .ytp-caption-segment {
    background: none !important;
  }

  /* yt-fix new feed layout */
  ytd-rich-item-renderer[rendered-from-rich-grid] {
    @media only screen and (min-width: 1400px) {
      --ytd-rich-grid-items-per-row: 4 !important;

      @media only screen and (min-width: 1700px) {
        --ytd-rich-grid-items-per-row: 5 !important;

        @media only screen and (min-width: 2180px) {
          --ytd-rich-grid-items-per-row: 6 !important;
        }
      }
    }
  }

  ytd-rich-item-renderer[is-in-first-column=""] {
    margin-left: calc(var(--ytd-rich-grid-item-margin) / 2) !important;
  }

  #contents {
    padding-left: calc(var(--ytd-rich-grid-item-margin) / 2 + var(--ytd-rich-grid-gutter-margin)) !important;
  }

  /* yt-New player blur */
  .ytp-left-controls {
    .ytp-play-button,
    .ytp-volume-area,
    .ytp-time-display.notranslate > span,
    .ytp-chapter-container > button,
    .ytp-prev-button,
    .ytp-next-button {
      backdrop-filter: blur(5px) !important;
      background-color: #0001 !important;
    }
  }

  .ytp-right-controls,
  .ytp-time-wrapper {
    backdrop-filter: blur(5px) !important;
    background-color: #0001 !important;
  }

  .ytp-popup {
    backdrop-filter: blur(10px) !important;
    background-color: #0007 !important;
  }
`;
  const globalStyle = document.createElement("style");
  globalStyle.id = "yt-font-jetbrains-global";
  globalStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
  ${STYLE_CONTENT}
`;
  (document.head || document.documentElement).appendChild(globalStyle);
  function injectShadowStyle(root) {
    root.querySelectorAll("*").forEach((el) => {
      if (el.shadowRoot) {
        if (!el.shadowRoot.getElementById("yt-font-verdana-shadow")) {
          const shadowStyle = document.createElement("style");
          shadowStyle.id = "yt-font-verdana-shadow";
          shadowStyle.textContent = STYLE_CONTENT;
          el.shadowRoot.appendChild(shadowStyle);
        }
        injectShadowStyle(el.shadowRoot);
      }
    });
  }
  const observer = new MutationObserver(() => {
    injectShadowStyle(document);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  injectShadowStyle(document);
  console.log("[Userscript] Весь шрифт на YouTube успешно изменен на JetBrains Mono.");

})();