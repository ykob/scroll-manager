const Hover = require('js-util/Hover.js');
const ScrollManager = require('../modules/scroll_manager/ScrollManager').default;
const ContentsHeader = require('../modules/ContentsHeader').default;
const AccordionItem = require('../modules/AccordionItem').default;

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
  scrollManager.start();
}
