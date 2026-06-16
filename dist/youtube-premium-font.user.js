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

  const STYLE_CONTENT = `
  :root, html, body, ytd-app {
    --yt-font-family: Verdana, Geneva, sans-serif !important;
    --ytd-font-family: Verdana, Geneva, sans-serif !important;
    --yt-spec-general-font: Verdana, Geneva, sans-serif !important;
    --yt-spec-general-font-family: Verdana, Geneva, sans-serif !important;
    font-family: Verdana, Geneva, sans-serif !important;
  }
  * {
    font-family: Verdana, Geneva, sans-serif !important;
  }
`;
  const globalStyle = document.createElement("style");
  globalStyle.id = "yt-font-verdana-global";
  globalStyle.textContent = STYLE_CONTENT;
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
  console.log("[Userscript] Весь шрифт на YouTube успешно изменен на Verdana.");

})();