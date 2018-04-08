const viewportUnitsBuggyfill = require('viewport-units-buggyfill');

const pageId = document.querySelector('.l-page').getAttribute('data-page-id');
const ua = window.navigator.userAgent;
const link = document.querySelector('link[as=style]');

const init = () => {
  switch (pageId) {
    case 'index':
      require ('./init/index.js').default();
      break;
    case 'index2':
      require ('./init/index2.js').default();
      break;
    default:
  }
}

// preload stylesheet other than Google Chrome browser.
if (ua.indexOf('Chrome') < 0) link.rel = 'stylesheet';

setTimeout(() => {
  // Making viewport units (vh|vw|vmin|vmax) work properly in Mobile Safari.
  viewportUnitsBuggyfill.init();

  // run initialize function.
  init();
}, 100);
