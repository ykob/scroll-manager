import Hover from 'js-util/Hover.js';
import SmoothScrollManager from './modules/smooth_scroll_manager/SmoothScrollManager';
import ScrollManager from './modules/scroll_manager/ScrollManager';
import ContentsHeader from './modules/ContentsHeader';
import AccordionItem from './modules/AccordionItem';

const smoothScrollManager = new SmoothScrollManager();
const scrollManager = new ScrollManager();
const contentsHeader = new ContentsHeader(smoothScrollManager);
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.c-accordion-item');

const init = () => {
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }

  for (var i = 0; i < elmAccordion.length; i++) {
    new AccordionItem(elmAccordion[i], smoothScrollManager);
  }

  smoothScrollManager.scrollNext = () => {
    contentsHeader.scroll();
  }
  smoothScrollManager.renderNext = () => {
    contentsHeader.render();
  }
  smoothScrollManager.start();
}
init();
