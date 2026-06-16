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