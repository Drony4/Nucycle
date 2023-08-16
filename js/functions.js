// Назначить .bg-i для родителю с изображением, которое используется как фон

function bgImage() {
  let bgParents = document.querySelectorAll(".bg-i");
  for (var i = 0; i < bgParents.length; i++) {
    if (bgParents[i].querySelector("img")) {
      bgParents[i].style.backgroundImage = "url(" + bgParents[i].querySelector("img").getAttribute("src") + ")";
    }
  }
}
bgImage();

//---------------------------------------------------------------------------------------------

//------------ Определение типа устройства для указания дальнейшего поведения страницы -------------------------
//+ добавление класса для <body>

let isMobile = {
  Android: function () {
    return navigator.userAgentData && navigator.userAgentData.mobile;
  },
  BlackBerry: function () {
    return navigator.userAgentData && navigator.userAgentData.platform === "blackberry";
  },
  iOS: function () {
    return navigator.userAgentData && navigator.userAgentData.platform === "ios";
  },
  Opera: function () {
    return navigator.userAgentData && navigator.userAgentData.platform === "opera";
  },
  Windows: function () {
    return navigator.userAgentData && navigator.userAgentData.platform === "windows";
  },
  any: function () {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
  },
};

if (isMobile.any()) {
  document.body.classList.add("_touchscreen");
} else {
  document.body.classList.add("_pc");
}
//--------------------------------------------------------------------------

// ----------------------- Определение, что страница загружена
showPageIsLoaded();
function showPageIsLoaded() {
  window.addEventListener(
    "load",
    () => {
      document.body.classList.add("_loaded");
    },
    { once: true }
  );
}

// ---------------------------------------------------------------------------

//------------------ Убрать класс у элементов коллекции  ------------------------------
function removeClasses(object, remoovingClass) {
  for (let elem of object) {
    elem.classList.remove(remoovingClass);
  }
}
//------------------------------------------------------------------------------------

// Перемещение логотипа при адаптации

function useDynamicAdapt(type = "max") {
  const className = "_replaced";
  const attrName = "data-da";

  /** @type {dNode[]} */
  const dNodes = getDNodes();

  /** @type {dMediaQuery[]} */
  const dMediaQueries = getDMediaQueries(dNodes);

  dMediaQueries.forEach((dMediaQuery) => {
    const matchMedia = window.matchMedia(dMediaQuery.query);
    // массив объектов с подходящим брейкпоинтом
    const filteredDNodes = dNodes.filter(({ breakpoint }) => breakpoint === dMediaQuery.breakpoint);
    const mediaHandler = getMediaHandler(matchMedia, filteredDNodes);
    matchMedia.addEventListener("change", mediaHandler);

    mediaHandler();
  });

  function getDNodes() {
    const result = [];
    const elements = [...document.querySelectorAll(`[${attrName}]`)];

    elements.forEach((element) => {
      const attr = element.getAttribute(attrName);
      const [toSelector, breakpoint, order] = attr.split(",").map((val) => val.trim());

      const to = document.querySelector(toSelector);

      if (to) {
        result.push({
          parent: element.parentElement,
          element,
          to,
          breakpoint: breakpoint ?? "767",
          order: order !== undefined ? (isNumber(order) ? Number(order) : order) : "last",
          index: -1,
        });
      }
    });

    return sortDNodes(result);
  }

  /**
   * @param {dNode} items
   * @returns {dMediaQuery[]}
   */
  function getDMediaQueries(items) {
    const uniqItems = [...new Set(items.map(({ breakpoint }) => `(${type}-width: ${breakpoint}px),${breakpoint}`))];

    return uniqItems.map((item) => {
      const [query, breakpoint] = item.split(",");

      return { query, breakpoint };
    });
  }

  /**
   * @param {MediaQueryList} matchMedia
   * @param {dNodes} items
   */
  function getMediaHandler(matchMedia, items) {
    return function mediaHandler() {
      if (matchMedia.matches) {
        items.forEach((item) => {
          moveTo(item);
        });

        items.reverse();
      } else {
        items.forEach((item) => {
          if (item.element.classList.contains(className)) {
            moveBack(item);
          }
        });

        items.reverse();
      }
    };
  }

  /**
   * @param {dNode} dNode
   */
  function moveTo(dNode) {
    const { to, element, order } = dNode;
    dNode.index = getIndexInParent(dNode.element, dNode.element.parentElement);
    element.classList.add(className);

    if (order === "last" || order >= to.children.length) {
      to.append(element);

      return;
    }

    if (order === "first") {
      to.prepend(element);

      return;
    }

    to.children[order].before(element);
  }

  /**
   * @param {dNode} dNode
   */
  function moveBack(dNode) {
    const { parent, element, index } = dNode;
    element.classList.remove(className);

    if (index >= 0 && parent.children[index]) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {HTMLElement} parent
   */
  function getIndexInParent(element, parent) {
    return [...parent.children].indexOf(element);
  }

  /**
   * Функция сортировки массива по breakpoint и order
   * по возрастанию для type = min
   * по убыванию для type = max
   *
   * @param {dNode[]} items
   */
  function sortDNodes(items) {
    const isMin = type === "min" ? 1 : 0;

    return [...items].sort((a, b) => {
      if (a.breakpoint === b.breakpoint) {
        if (a.order === b.order) {
          return 0;
        }

        if (a.order === "first" || b.order === "last") {
          return -1 * isMin;
        }

        if (a.order === "last" || b.order === "first") {
          return 1 * isMin;
        }

        return 0;
      }

      return (a.breakpoint - b.breakpoint) * isMin;
    });
  }

  function isNumber(value) {
    return !isNaN(value);
  }
}

//------------------------------------------------------------------------------------------------
//---------------------------   Анимация в поле зрения   --------------------------------------

function animateBlockSimple() {
  if (Array.prototype.forEach && "IntersectionObserver" in window) {
    animateBlockObserverSimple();
  } else {
    animateBlockScrollSimple();
  }
  //------------------------   IntersectionObserver  -----------------------
  function animateBlockObserverSimple() {
    const animClass = "animated"; //элемент анимирован
    const animAttr = "[data-animate]";
    const thrshholdDefault = 0; //[0..1]
    const onloadAnimDelay = 50; //ms
    const techClass = "_animation";
    const animBlocks = document.querySelectorAll(animAttr);
    const headerElement = document.querySelector("header");

    if (animBlocks.length > 0) {
      animBlocks.forEach((animBlock) => {
        animBlock.classList.add(techClass); //тех-класс для нерабочего JS
      });
      setTimeout(() => {
        animBlocks.forEach((animBlock) => {
          const onload = animBlock.dataset.animate.split(",")[1];
          let threshold = thresholdCalc(animBlock);
          if (onload) {
            animBlock.classList.add(animClass);
          } else {
            observering(animBlock, threshold);
          }
        });
      }, onloadAnimDelay);

      function observering(animBlock, threshold) {
        // слежка за объектами для их анимации
        let observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animBlock.classList.add(animClass);
                observer.unobserve(animBlock);
              }
            });
          },
          { threshold: threshold }
        );
        observer.observe(animBlock);
      }
    }
    function thresholdCalc(animBlock) {
      // коррекция порога появления объекта, если высота объекта больше высоты экрана
      let animBlockHeight = animBlock.offsetHeight;
      let screenHeight = window.innerHeight;
      let headerHeight = headerElement ? headerElement.offsetHeight : 20;
      let threshold = +animBlock.dataset.animate.split(",")[0] || thrshholdDefault;
      if (animBlockHeight > screenHeight - headerHeight) {
        threshold = Math.floor(threshold * ((screenHeight - headerHeight) / animBlockHeight) * 100) / 100;
      }
      return threshold;
    }
  }
  // ------------------------  Scroll  -----------------------------
  function animateBlockScrollSimple() {
    const animClass = "animated";
    const animAttr = "[data-animate]";
    const thresholdDefault = 0; //[0..1]
    const onloadAnimDelay = 50; //ms
    const techClass = "_animation";
    const animBlocks = document.querySelectorAll(animAttr);
    const headerElement = document.querySelector("header");

    if (animBlocks.length > 0) {
      let activeElems = animBlocks.length; // если = 0 выключается наблюдатель
      for (let index = 0; index < animBlocks.length; index++) {
        const animBlock = animBlocks[index];
        animBlock.classList.add(techClass);
      }

      function animate() {
        let headerHeight = headerElement ? headerElement.offsetHeight : 20;
        const screenHeight = window.innerHeight;
        for (let index = 0; index < animBlocks.length; index++) {
          const animBlock = animBlocks[index];
          if (!animBlock.classList.contains(animClass)) {
            const animBlockHeight = animBlock.offsetHeight;
            const [threshold = thresholdDefault, onload] = animBlock.dataset.animate.split(",");
            let visible = visibility(animBlock, threshold, screenHeight, animBlockHeight, headerHeight);

            if (onload) {
              animBlock.classList.add(animClass);
              activeElems--;
            }

            if (visible) {
              animBlock.classList.add(animClass);
              activeElems--;
            }
          }
        }
        if (activeElems === 0) {
          window.removeEventListener("scroll", animate);
        }
      }
      setTimeout(() => {
        animate();
        window.addEventListener("scroll", animate);
      }, onloadAnimDelay);
    }

    function visibility(animBlock, threshold, screenHeight, animBlockHeight, headerHeight) {
      let elemPosition = animBlock.getBoundingClientRect().top;
      if (animBlockHeight > screenHeight - headerHeight) {
        threshold = Math.floor(threshold * ((screenHeight - headerHeight) / animBlockHeight) * 100) / 100;
      }
      return elemPosition + animBlockHeight * threshold < screenHeight && elemPosition + animBlockHeight > animBlockHeight * threshold;
    }
  }
}
