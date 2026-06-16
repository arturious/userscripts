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

// 1. Внедряем глобально в head документа с импортом шрифта
const globalStyle = document.createElement('style');
globalStyle.id = 'yt-font-jetbrains-global';
globalStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
  ${STYLE_CONTENT}
`;
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
console.log('[Userscript] Весь шрифт на YouTube успешно изменен на JetBrains Mono.');
