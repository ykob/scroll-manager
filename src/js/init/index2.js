import Hover from 'js-util/Hover.js';
import ScrollManager from '../modules/scroll_manager/ScrollManager';
import Accordion from '../modules/Accordion';

const scrollManager = new ScrollManager();

export default function() {
  [...document.querySelectorAll('.js-hover')].map(elm => {
    return new Hover(elm);
  });
  const accordions = [...document.querySelectorAll('.js-accordion')].map(elm => {
    return new Accordion(elm, scrollManager);
  });

  scrollManager.resizeNext = () => {
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].resize();
    }
  }

  scrollManager.start();
}
