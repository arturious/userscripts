const FONT_FAMILY = '"Japan Daisuke", "JapanDaisuki", "Japan Daisuke Regular", serif !important';

// 1. Внедряем глобальный шрифт в head документа
if (!document.getElementById('yt-premium-font-global')) {
  const globalStyle = document.createElement('style');
  globalStyle.id = 'yt-premium-font-global';
  globalStyle.textContent = `
    @font-face {
      font-family: 'Japan Daisuke';
      src: local('Japan Daisuke'), local('JapanDaisuki'), local('Japan Daisuke Regular');
    }
  `;
  document.head.appendChild(globalStyle);
}

function replaceLogo() {
  const host = document.querySelector('ytd-topbar-logo-renderer');
  if (!host || !host.shadowRoot) return;

  const logoLink = host.shadowRoot.querySelector('a#logo');
  if (!logoLink) return;

  // Поиск SVG с учетом вложенных Shadow DOM (yt-icon, yt-icon-shape)
  let svg: SVGElement | null = null;
  
  // Вариант А: SVG находится непосредственно в ссылке
  svg = logoLink.querySelector('svg');
  
  // Вариант Б: SVG внутри shadowRoot элемента yt-icon
  const ytIcon = logoLink.querySelector('yt-icon') || logoLink.querySelector('#logo-icon');
  if (!svg && ytIcon && ytIcon.shadowRoot) {
    svg = ytIcon.shadowRoot.querySelector('svg');
  }

  // Вариант В: SVG внутри shadowRoot элемента yt-icon-shape
  const iconShape = logoLink.querySelector('yt-icon-shape');
  if (!svg && iconShape && iconShape.shadowRoot) {
    svg = iconShape.shadowRoot.querySelector('svg');
  }

  // Принудительное CSS-скрытие путей youtube-paths во внутренних shadowRoot иконок
  if (ytIcon && ytIcon.shadowRoot) {
    if (!ytIcon.shadowRoot.getElementById('force-hide-youtube-paths')) {
      const forceStyle = document.createElement('style');
      forceStyle.id = 'force-hide-youtube-paths';
      forceStyle.textContent = `
        [id^="youtube-paths"], g[id*="youtube-paths"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;
      ytIcon.shadowRoot.appendChild(forceStyle);
    }
  }

  if (iconShape && iconShape.shadowRoot) {
    if (!iconShape.shadowRoot.getElementById('force-hide-youtube-paths')) {
      const forceStyle = document.createElement('style');
      forceStyle.id = 'force-hide-youtube-paths';
      forceStyle.textContent = `
        [id^="youtube-paths"], g[id*="youtube-paths"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;
      iconShape.shadowRoot.appendChild(forceStyle);
    }
  }

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

    // Уменьшаем также ширину родительского контейнера yt-icon, чтобы убрать пустоту
    const parentIcon = svg.closest('yt-icon') || svg.closest('#logo-icon') || svg.parentElement;
    if (parentIcon) {
      parentIcon.style.width = `${width}px`;
    }
  }

  // 3. Внедряем стили (включая псевдоэлемент ::after) непосредственно внутрь shadow root ytd-topbar-logo-renderer
  if (!host.shadowRoot.getElementById('custom-premium-styles')) {
    const shadowStyle = document.createElement('style');
    shadowStyle.id = 'custom-premium-styles';
    shadowStyle.textContent = `
      #logo {
        display: flex !important;
        align-items: center !important;
      }

      #logo::after {
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
    
    // Также наблюдаем за внутренними изменениями в yt-icon, если он есть
    const ytIcon = target.shadowRoot.querySelector('yt-icon') || target.shadowRoot.querySelector('#logo-icon');
    if (ytIcon && ytIcon.shadowRoot) {
      observer.observe(ytIcon.shadowRoot, { childList: true, subtree: true });
    }
    
    replaceLogo();
  } else {
    // Ждем появления шапки в DOM
    setTimeout(setupObserver, 100);
  }
};

setupObserver();
