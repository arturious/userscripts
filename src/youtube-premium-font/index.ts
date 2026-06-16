const CUSTOM_FONT = "'Japan Daisuke', 'Japan Daisuke Font', sans-serif";

// 1. Внедряем глобальный шрифт в head документа
if (!document.getElementById('yt-premium-font-global')) {
  const globalStyle = document.createElement('style');
  globalStyle.id = 'yt-premium-font-global';
  globalStyle.textContent = `
    @font-face {
      font-family: 'Japan Daisuke';
      src: local('Japan Daisuke'), local('Japan Daisuke Font');
    }
  `;
  document.head.appendChild(globalStyle);
}

function replaceLogo() {
  const host = document.querySelector('ytd-topbar-logo-renderer');
  if (!host || !host.shadowRoot) return;

  const logoLink = host.shadowRoot.querySelector('a#logo');
  if (!logoLink) return;

  const svg = logoLink.querySelector('svg');
  if (!svg) return;

  // 2. Обрезаем SVG через viewBox, чтобы оставить только красную иконку (плей)
  const originalViewBox = svg.getAttribute('viewBox');
  if (originalViewBox && !svg.dataset.cropped) {
    const parts = originalViewBox.split(' ');
    const height = parseFloat(parts[3] || '20');
    const width = Math.round(1.43 * height); // Для высоты 20 это будет 29px (только иконка)
    
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = `${width}px`;
    svg.style.height = `${height}px`;
    svg.dataset.cropped = 'true';
  }

  // 3. Внедряем стили непосредственно внутрь shadow root компонента
  if (!host.shadowRoot.getElementById('custom-premium-styles')) {
    const shadowStyle = document.createElement('style');
    shadowStyle.id = 'custom-premium-styles';
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

  // 4. Добавляем слово Premium рядом с иконкой
  if (!logoLink.querySelector('.custom-premium-text')) {
    const span = document.createElement('span');
    span.className = 'custom-premium-text';
    span.textContent = 'Premium';
    logoLink.appendChild(span);
  }
}

// Запускаем MutationObserver, так как YouTube загружает контент динамически
const observer = new MutationObserver((mutations) => {
  replaceLogo();
});

// Наблюдаем за изменениями внутри shadowRoot шапки
const setupObserver = () => {
  const target = document.querySelector('ytd-topbar-logo-renderer');
  if (target && target.shadowRoot) {
    observer.observe(target.shadowRoot, { childList: true, subtree: true });
    replaceLogo();
  } else {
    // Ждем появления шапки в DOM
    setTimeout(setupObserver, 100);
  }
};

setupObserver();
