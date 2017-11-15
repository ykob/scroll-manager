const Hover = require('js-util/Hover.js');
const SmoothScrollManager = require('../modules/smooth_scroll_manager/SmoothScrollManager').default;
const AnchorLink = require('../modules/smooth_scroll_manager/AnchorLink').default;
const loadContentImgs = require('../modules/common/loadContentImgs').default;
const ContentsHeader = require('../modules/ContentsHeader').default;
const AccordionItem = require('../modules/AccordionItem').default;

const scrollManager = new SmoothScrollManager();
const contentsHeader = new ContentsHeader(scrollManager);
const elmAnchorLink = document.querySelectorAll('.js-anchor-link');
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.c-accordion-item');
const elmOpenModal = document.querySelectorAll('.js-open-modal');

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
  for (var i = 0; i < elmOpenModal.length; i++) {
    elmOpenModal[i].addEventListener('click', () => {
      if (scrollManager.isWorking) {
        scrollManager.pause();
      } else {
        scrollManager.play();
        console.log(scrollManager.isWorking);
      }
    });
  }

  scrollManager.scrollNext = () => {
    contentsHeader.scroll();
  }
  scrollManager.renderNext = () => {
    contentsHeader.render();
  }
  scrollManager.start(() => {
    loadContentImgs(() => {
      scrollManager.resize();
    });
  });
}
