import Hover from 'js-util/Hover.js';
import ScrollManager from '../modules/scroll_manager/ScrollManager';
import Accordion from '../modules/Accordion';

const scrollManager = new ScrollManager();
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.js-accordion');
const accordions = [];

export default function() {
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }
  for (var i = 0; i < elmAccordion.length; i++) {
    accordions[i] = new Accordion(elmAccordion[i], scrollManager);
  }

  scrollManager.resizeNext = () => {
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].resize();
    }
  }

  scrollManager.start();
}
