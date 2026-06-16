const FONT_FAMILY = '"Japan Daisuke", "JapanDaisuki", "Japan Daisuke Regular", serif !important';

// SVG-иконка YouTube в формате Data URI для обхода блокировок CSP на картинки
const PLAY_ICON_DATA_URI = "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28.6 20'%3E%3Cpath d='M27.9727 3.125C27.6435 1.8959 26.6786 0.930999 25.4495 0.601855C23.2183 0 14.285 0 14.285 0C14.285 0 5.35171 0 3.12053 0.601855C1.89143 0.930999 0.926528 1.8959 0.597384 3.125C0 5.35618 0 10 0 10C0 10 0 14.6438 0.597384 16.875C0.926528 18.1041 1.89143 19.069 3.12053 19.3981C5.35171 20 14.285 20 14.285 20C14.285 20 23.2183 20 25.4495 19.3981C26.6786 19.069 27.6435 18.1041 27.9727 16.875C28.5701 14.6438 28.5701 10 28.5701 10C28.5701 10 28.5701 5.35618 27.9727 3.125Z' fill='%23FF0000'/%3E%3Cpath d='M11.4253 14.2854L18.8477 10.0002L11.4253 5.71503V14.2854Z' fill='%23FFFFFF'/%3E%3C/svg%3E\") !important";

console.log('%c[Userscript] YouTube Premium Custom Font: Инициализация...', 'color: #3b82f6; font-weight: bold;');

// Стили, которые мы внедрим как глобально в head, так и локально внутри shadowRoot
const STYLES_CONTENT = `
  /* 1. Скрываем оригинальный контейнер иконки и SVG */
  yt-icon#logo-icon,
  #logo-icon.ytd-logo,
  ytd-topbar-logo-renderer #logo-icon,
  #logo-icon {
    display: none !important;
  }

  /* 2. Ссылочный контейнер логотипа */
  ytd-topbar-logo-renderer > a#logo,
  ytd-logo > a#logo,
  :host > a#logo {
    display: flex !important;
    align-items: center !important;
    gap: 2px !important;
    text-decoration: none !important;
  }

  /* 3. Отрисовываем иконку YouTube через ::before */
  ytd-topbar-logo-renderer > a#logo::before,
  ytd-logo > a#logo::before,
  :host > a#logo::before {
    content: "" !important;
    width: 30px !important;
    height: 25px !important;
    display: inline-block !important;
    margin-left: 20px !important;
    flex: 0 0 auto !important;
    background-image: ${PLAY_ICON_DATA_URI};
    background-repeat: no-repeat !important;
    background-position: center !important;
    background-size: contain !important;
  }

  /* 4. Отрисовываем текст premium через ::after */
  ytd-topbar-logo-renderer > a#logo::after,
  ytd-logo > a#logo::after,
  :host > a#logo::after {
    content: "premium" !important;
    color: var(--yt-spec-text-primary, #ffffff) !important;
    font-family: ${FONT_FAMILY};
    font-size: 25px !important;
    font-weight: 400 !important;
    line-height: 1 !important;
    margin-left: 8px !important;
  }

  /* 5. Стили для кода страны (KZ) */
  ytd-topbar-logo-renderer .country-code,
  ytd-logo .country-code,
  #country-code {
    margin: 0 !important;
    padding: 0 !important;
  }
`;

// 1. Внедряем глобальный шрифт в head документа (без визуальных стилей, чтобы избежать утечки в Light DOM)
if (!document.getElementById('yt-premium-font-global')) {
  const globalStyle = document.createElement('style');
  globalStyle.id = 'yt-premium-font-global';
  globalStyle.textContent = `
    @font-face {
      font-family: 'Japan Daisuke';
      src: local('Japan Daisuke'), local('JapanDaisuki'), local('Japan Daisuke Regular');
    }
  `;
  (document.head || document.documentElement).appendChild(globalStyle);
  console.log('[Userscript] Глобальный шрифт Japan Daisuke внедрен в head.');
}

function replaceLogo() {
  const hosts = document.querySelectorAll('ytd-topbar-logo-renderer, ytd-logo');
  
  // Отбираем хосты для стилизации. Если внутри ytd-topbar-logo-renderer
  // есть вложенный ytd-logo, мы пропускаем внешний контейнер.
  const activeHosts: Element[] = [];
  hosts.forEach(host => {
    if (host.tagName.toLowerCase() === 'ytd-topbar-logo-renderer') {
      const hasInnerLogo = host.querySelector('ytd-logo');
      if (hasInnerLogo) return; // Пропускаем внешний контейнер
    }
    activeHosts.push(host);
  });

  activeHosts.forEach(host => {
    if (!host || !host.shadowRoot) return;

    if (!host.shadowRoot.getElementById('custom-premium-styles')) {
      const shadowStyle = document.createElement('style');
      shadowStyle.id = 'custom-premium-styles';
      shadowStyle.textContent = STYLES_CONTENT;
      host.shadowRoot.appendChild(shadowStyle);
      console.log(`[Userscript] Стили кастомного логотипа успешно внедрены в shadowRoot элемента ${host.tagName}.`);
    }
  });
}

// Глобальный MutationObserver для отслеживания инициализации элементов в DOM и SPF-навигации
const observer = new MutationObserver(() => {
  replaceLogo();
});

// Наблюдаем за всем деревом документов
observer.observe(document.documentElement, { childList: true, subtree: true });

// Дополнительно запускаем интервал (каждые 500мс) на случай асинхронных Polymer-апгрейдов
setInterval(replaceLogo, 500);

// Первоначальный запуск
replaceLogo();
