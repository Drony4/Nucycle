"use strict";
useDynamicAdapt("max");

window.addEventListener("load", function () {
  animateBlockSimple();
  document.addEventListener("click", menuActions);
  function menuActions(e) {
    const targetElement = e.target;
    //--- Меню-бургер
    const burgerIcon = document.querySelector(".icon-burger"); // сам бургер
    const menuBody = document.querySelector(".menu__body");
    if (burgerIcon && targetElement == burgerIcon) {
      if (window.matchMedia("(max-width: 320px)").matches) {
        document.body.classList.toggle("_lock"); //для запрета прокрутки когда меню активное
      }
      burgerIcon.classList.toggle("_active"); //для превращения бургера
      menuBody.classList.toggle("_active"); // открыть/закрыть меню
    }
    // при открытом меню(размер - не на всю страницу) при клике на страницу меню сворачивается
    if (burgerIcon.classList.contains("_active") && targetElement.closest(".page")) {
      burgerIcon.classList.remove("_active");
      menuBody.classList.remove("_active");
      document.body.classList.remove("_lock");
    }
    // Для случаев, когда меню не на всю страницу делается проверка видимо ли меню, если часть меню выпадает, назначается класс
    let menuIsVisible = function () {
      let viewHeight = document.documentElement.clientHeight;
      let viewWidth = document.documentElement.clientWidth;
      let menuXVisibility = menuBody.getBoundingClientRect().left + menuBody.getBoundingClientRect().width;
      let menuYVisibility = menuBody.getBoundingClientRect().top + menuBody.getBoundingClientRect().height;
      return menuXVisibility < viewWidth && menuYVisibility < viewHeight;
    };

    if (menuBody.classList.contains("_active") && !menuIsVisible()) {
      menuBody.classList.add("_fullscreen");
    } else {
      menuBody.classList.remove("_fullscreen");
    }

    // Скролл на блок при клике на ссылку.Ссылке - data-goto="target-selector"
    if (targetElement.dataset.goto && document.querySelector(targetElement.dataset.goto)) {
      const gotoBlock = document.querySelector(targetElement.dataset.goto);
      //... положение обьекта !!Обязательно!! с учетом высоты шапки
      const gotoBlockValue = gotoBlock.getBoundingClientRect().top + window.pageYOffset - document.querySelector(".header__wrapper").offsetHeight;
      //... акрываем меню, когда оно открыто на весь экран на тачскрине
      if (burgerIcon.classList.contains("_active")) {
        document.body.classList.remove("_lock");
        burgerIcon.classList.remove("_active"); //для превращения
        menuBody.classList.remove("_active");
      }

      // --- скролл за время
      const scrollDuration = 500;
      const steps = (scrollDuration / 1000) * 60;
      const currentPosition = window.pageYOffset || window.scrollY;
      const distance = gotoBlockValue - currentPosition;
      const stepValue = distance / steps;
      const timeStep = scrollDuration / steps;
      let stepCount = 0;
      const scrollInterval = setInterval(() => {
        stepCount++;
        window.scrollTo(0, currentPosition + stepCount * stepValue);
        if (stepCount >= steps) {
          clearInterval(scrollInterval);
        }
      }, timeStep);

      //откл работу ссылки
      e.preventDefault();
    }
  }
});

// Подсветка ссылки, при блоке в зоне видимости
const backlightLinks = document.querySelectorAll("[data-goto]");
if (backlightLinks.length > 0) {
  backlightLinks.forEach((link) => {
    const section = document.querySelector(`${link.dataset.goto}`);
    const baseThreshold = 0.75;
    const viewHeight = window.innerHeight;
    let sectionObserver;
    observering();

    function observering() {
      const blockHeight = section.offsetHeight;
      let threshold = viewHeight / blockHeight <= 1 ? (baseThreshold * viewHeight) / blockHeight : baseThreshold;
      const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
          link.classList.add("_active");
        } else {
          link.classList.remove("_active");
        }
      };
      sectionObserver = new IntersectionObserver(callback, { threshold: threshold });
      sectionObserver.observe(section);
    }
    // ...для случаев, когда в блоке содержатся изображения с ленивой загрузкой
    const lazyImages = section.querySelectorAll('[loading="lazy"]');
    if (lazyImages.length > 0) {
      for (let i = 0; i < lazyImages.length; i++) {
        lazyImages[i].addEventListener(
          "load",
          () => {
            sectionObserver.unobserve(section);
            observering();
          },
          { once: true }
        );
      }
    }
  });
}

// --------------------   При выходе блока из зоны видимости к нему добавляется тех. класс
const headerElement = document.querySelector(".header");
const callback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    headerElement.classList.remove("_scroll");
  } else {
    headerElement.classList.add("_scroll");
  }
};
const headerObserver = new IntersectionObserver(callback);
headerObserver.observe(headerElement);

//------------------------------
