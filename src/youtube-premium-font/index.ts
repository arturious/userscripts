const FONT_FAMILY = '"Japan Daisuke", "JapanDaisuki", "Japan Daisuke Regular", serif !important';

console.log('%c[Userscript] YouTube Premium Custom Font: Инициализация...', 'color: #3b82f6; font-weight: bold;');

// 1. Внедряем глобальный шрифт и базовые стили скрытия в head документа
if (!document.getElementById('yt-premium-font-global')) {
  const globalStyle = document.createElement('style');
  globalStyle.id = 'yt-premium-font-global';
  globalStyle.textContent = `
    @font-face {
      font-family: 'Japan Daisuke';
      src: local('Japan Daisuke'), local('JapanDaisuki'), local('Japan Daisuke Regular');
    }

    /* Принудительное скрытие логотипа на глобальном уровне */
    yt-icon#logo-icon,
    #logo-icon.ytd-logo,
    ytd-topbar-logo-renderer #logo-icon {
      display: none !important;
    }

    /* Стили для кода страны (KZ) */
    ytd-topbar-logo-renderer .country-code,
    ytd-logo .country-code,
    #country-code {
      margin: 0 !important;
      padding: 0 !important;
    }
  `;
  (document.head || document.documentElement).appendChild(globalStyle);
  console.log('[Userscript] Глобальный шрифт и стили скрытия внедрены.');
}

function replaceLogo() {
  // Ищем хост-элемент логотипа (поддерживаем оба возможных варианта на YouTube)
  const host = document.querySelector('ytd-topbar-logo-renderer') || document.querySelector('ytd-logo');
  if (!host || !host.shadowRoot) return;

  // Внедряем стили непосредственно внутрь shadow root хоста логотипа
  if (!host.shadowRoot.getElementById('custom-premium-styles')) {
    const shadowStyle = document.createElement('style');
    shadowStyle.id = 'custom-premium-styles';
    shadowStyle.textContent = `
      /* Скрываем оригинальный контейнер иконки и SVG внутри shadowRoot */
      #logo-icon, yt-icon#logo-icon, #logo-icon.ytd-logo {
        display: none !important;
      }

      /* Ссылочный контейнер логотипа */
      #logo, a {
        display: flex !important;
        align-items: center !important;
        gap: 2px !important;
        text-decoration: none !important;
      }

      /* Отрисовываем иконку YouTube через ::before (как в вашем CSS) */
      #logo::before, a::before {
        content: "" !important;
        width: 30px !important;
        height: 25px !important;
        display: inline-block !important;
        margin-left: 20px !important;
        flex: 0 0 auto !important;
        background-image: url("https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg") !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: contain !important;
      }

      /* Отрисовываем текст premium через ::after с вашим шрифтом */
      #logo::after, a::after {
        content: "premium" !important;
        color: var(--yt-spec-text-primary, #ffffff) !important;
        font-family: ${FONT_FAMILY};
        font-size: 25px !important;
        font-weight: 400 !important;
        line-height: 1 !important;
        margin-left: 8px !important;
      }

      /* Стили для кода страны (KZ) и плашек внутри shadowRoot */
      ytd-topbar-logo-renderer .country-code,
      ytd-logo .country-code,
      #country-code {
        margin: 0 !important;
        padding: 0 !important;
      }
    `;
    host.shadowRoot.appendChild(shadowStyle);
    console.log('[Userscript] Стили кастомного логотипа успешно внедрены в shadowRoot.');
  }
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
