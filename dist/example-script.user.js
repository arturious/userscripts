// ==UserScript==
// @name         Example Userscript
// @namespace    my-userscripts
// @version      1.0.0
// @author       Artur Bakhtygereyev
// @description  An example userscript using Vite and TypeScript
// @icon         https://www.google.com/s2/favicons?sz=64&domain=example.com
// @match        https://example.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  console.log("%c[Userscript] Example script is running!", "color: #00ff00; font-weight: bold;");
  if (location.hostname === "example.com") {
    const h1 = document.querySelector("h1");
    if (h1) {
      h1.textContent = "Hello from Tampermonkey + Vite!";
      h1.style.color = "#3b82f6";
      h1.style.transition = "all 0.3s ease";
      h1.addEventListener("mouseenter", () => {
        h1.style.transform = "scale(1.1)";
      });
      h1.addEventListener("mouseleave", () => {
        h1.style.transform = "scale(1.0)";
      });
    }
  }

})();