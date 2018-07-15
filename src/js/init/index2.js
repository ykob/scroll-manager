const Hover = require('js-util/Hover.js');
const ScrollManager = require('../modules/scroll_manager/ScrollManager').default;
const ContentsHeader = require('../modules/ContentsHeader').default;
const Accordion = require('../modules/Accordion').default;

const scrollManager = new ScrollManager();
const contentsHeader = new ContentsHeader(scrollManager);
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

  scrollManager.scrollNext = () => {
    contentsHeader.scroll();
  }
  scrollManager.resizeNext = () => {
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].resize()
    }
  }

  scrollManager.start();
}
