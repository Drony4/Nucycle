if (document.querySelector(".shop__swiper")) {
  new Swiper(".shop__swiper", {
    //----------------------------   ИНИЦИАЛИЗАЦИЯ   ----------------------------------------

    pagination: {
      el: ".swiper-pagination",
      // bulletClass: "bullet", //               переназначение стандартных классов (выдумать)
      // bulletActiveClass: "bullet-active", //  переназначение стандартных классов (выдумать)
      clickable: true, //                        для возможности кликать на булиты
      type: "bullets", //       (по ум.) стандартные окружности
    },
    //----------------------------  УПРАВЛЕНИЕ НАВИГАЦИЕЙ  --------------------------------------
    watchOverflow: true, //   при включении слайдер скрывает кнопки навигации,если мало слайдов
    simulateTouch: true, //    возможность перетаскивания на ПК (по ум. - true)
    grabCursor: true, //       курсор поинтер для ПК
    touchRatio: 1, //          чувствительность свайпа.Чем больше тем чувствительней. 0 - откл

    //-----------------------  ВЫВОД И ПОВЕДЕНИЕ СЛАЙДОВ ------------------------------

    slidesPerView: 1,
    spaceBetween: 0,
    initialSlide: 0, //           Стартовый слайд  (не работает при centeredSlides: true)
    speed: 800,
    loop: true,
    autoplay: {
      delay: 7000, //                    пауза между прокруткой
      stopOnLastSlide: false, //          закончить на последнем кадре
      disableOnInteraction: true, //    отключить после ручного переключения
    },
    //Обновить свайпер при изменении элементов свайпера
    observer: true,
    observeParents: true, //обновить свайпер при изменении родительских элементов
    observeSlideChildren: true, //...дочерних эллементов
  });
}
