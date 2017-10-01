import Hover from 'js-util/Hover.js';
import ScrollManager from '../modules/scroll_manager/ScrollManager';
import ContentsHeader from '../modules/ContentsHeader';
import AccordionItem from '../modules/AccordionItem';

const scrollManager = new ScrollManager();
const contentsHeader = new ContentsHeader(scrollManager);
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.c-accordion-item');

export default function() {
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }
  for (var i = 0; i < elmAccordion.length; i++) {
    new AccordionItem(elmAccordion[i], scrollManager);
  }

  scrollManager.scrollNext = () => {
    contentsHeader.scroll();
  }
  scrollManager.init();
}
