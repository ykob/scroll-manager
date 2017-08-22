import Hover from 'js-util/Hover.js';
import ScrollManager from './modules/SmoothScrollManager';
import ContentsHeader from './modules/ContentsHeader';
import AccordionItem from './modules/AccordionItem';

const scrollManager = new ScrollManager();
const contentsHeader = new ContentsHeader(scrollManager);
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.c-accordion-item');

const init = () => {
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }

  for (var i = 0; i < elmAccordion.length; i++) {
    new AccordionItem(elmAccordion[i], scrollManager);
  }

  scrollManager.scrollNext = () => {
    contentsHeader.scroll();
  }
  scrollManager.renderNext = () => {
    contentsHeader.render();
  }

  scrollManager.start();
}
init();
