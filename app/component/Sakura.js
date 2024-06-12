(function () {
  'use strict';

  // Helper functions
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let lastTime = 0;
  const vendors = ['webkit', 'moz', 'ms', 'o'];

  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

  function prefixedEvent(element, type, callback) {
    for (let p = 0; p < vendors.length; p++) {
      if (!vendors[p]) type = type.toLowerCase();
      element.addEventListener(vendors[p] + type, callback, false);
    }
  }

  function sakura(selector, options) {
    const defaults = {
      blowAnimations: ['blow-soft-left', 'blow-medium-left', 'blow-soft-right', 'blow-medium-right'],
      className: 'sakura',
      fallSpeed: 1,
      maxSize: 14,
      minSize: 10,
      newOn: 300,
      swayAnimations: ['sway-0', 'sway-1', 'sway-2', 'sway-3', 'sway-4', 'sway-5', 'sway-6', 'sway-7', 'sway-8'],
    };

    const settings = Object.assign({}, defaults, options);
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      element.style.overflowX = 'hidden';

      const animation = function () {
        if (element.dataset.sakuraAnimId) {
          setTimeout(function () {
            requestAnimationFrame(animation);
          }, settings.newOn);
        }

        const blowAnimation = randomChoice(settings.blowAnimations);
        const swayAnimation = randomChoice(settings.swayAnimations);
        const fallTime = (document.documentElement.clientHeight * 0.007 + Math.round(Math.random() * 5)) * settings.fallSpeed;
        const animations = `fall ${fallTime}s linear 0s 1, ${blowAnimation} ${Math.max(fallTime, 30) - 20 + randomInt(0, 20)}s linear 0s infinite, ${swayAnimation} ${randomInt(
          2,
          4
        )}s linear 0s infinite`;

        const sakura = document.createElement('div');
        sakura.className = settings.className;

        const size = randomInt(settings.minSize, settings.maxSize);
        const borderRadius = `${randomInt(settings.maxSize, settings.maxSize + Math.floor(Math.random() * 10))}px ${randomInt(1, Math.floor(size / 4))}px`;

        sakura.style.cssText = `
          -webkit-animation: ${animations};
          animation: ${animations};
          border-radius: ${borderRadius};
          height: ${size}px;
          left: ${Math.random() * document.documentElement.clientWidth - 100}px;
          margin-top: ${-(Math.floor(Math.random() * 20) + 15)}px;
          width: ${size - Math.floor(randomInt(0, settings.minSize) / 3)}px;
        `;

        prefixedEvent(sakura, 'AnimationEnd', function () {
          if (!isElementInViewport(sakura)) {
            sakura.remove();
          }
        });

        prefixedEvent(sakura, 'AnimationIteration', function (event) {
          if ((settings.blowAnimations.includes(event.animationName) || settings.swayAnimations.includes(event.animationName)) && !isElementInViewport(sakura)) {
            sakura.remove();
          }
        });

        element.appendChild(sakura);
      };

      element.dataset.sakuraAnimId = requestAnimationFrame(animation);

      if (options === 'stop') {
        const animId = element.dataset.sakuraAnimId;
        if (animId) {
          cancelAnimationFrame(animId);
          element.dataset.sakuraAnimId = null;
        }
        setTimeout(function () {
          document.querySelectorAll(`.${settings.className}`).forEach((e) => e.remove());
        }, settings.newOn + 50);
      }
    });
  }

  window.sakura = sakura;
})();
