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

// 1. Внедряем глобально в head документа
const globalStyle = document.createElement('style');
globalStyle.id = 'yt-font-verdana-global';
globalStyle.textContent = STYLE_CONTENT;
(document.head || document.documentElement).appendChild(globalStyle);

// 2. Функция для рекурсивного инжекта во все shadowRoot
function injectShadowStyle(root: Document | ShadowRoot) {
  root.querySelectorAll('*').forEach(el => {
    if (el.shadowRoot) {
      if (!el.shadowRoot.getElementById('yt-font-verdana-shadow')) {
        const shadowStyle = document.createElement('style');
        shadowStyle.id = 'yt-font-verdana-shadow';
        shadowStyle.textContent = STYLE_CONTENT;
        el.shadowRoot.appendChild(shadowStyle);
      }
      injectShadowStyle(el.shadowRoot);
    }
  });
}

// Наблюдатель для динамически загружаемых элементов
const observer = new MutationObserver(() => {
  injectShadowStyle(document);
});
observer.observe(document.documentElement, { childList: true, subtree: true });

// Запуск при старте
injectShadowStyle(document);
console.log('[Userscript] Весь шрифт на YouTube успешно изменен на Verdana.');
