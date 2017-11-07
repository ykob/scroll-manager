const Hover = require('js-util/Hover.js');
const SmoothScrollManager = require('../modules/smooth_scroll_manager/SmoothScrollManager').default;
const AnchorLink = require('../modules/smooth_scroll_manager/AnchorLink').default;
const ContentsHeader = require('../modules/ContentsHeader').default;
const AccordionItem = require('../modules/AccordionItem').default;

const scrollManager = new SmoothScrollManager();
const contentsHeader = new ContentsHeader(scrollManager);
const elmAnchorLink = document.querySelectorAll('.js-anchor-link');
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.c-accordion-item');

export default function() {
  for (var i = 0; i < elmAnchorLink.length; i++) {
    new AnchorLink(elmAnchorLink[i], scrollManager);
  }
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
