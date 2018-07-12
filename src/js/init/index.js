const Hover = require('js-util/Hover.js');
const SmoothScrollManager = require('../modules/smooth_scroll_manager/SmoothScrollManager').default;
const AnchorLink = require('../modules/smooth_scroll_manager/AnchorLink').default;
const Renderer = require('../modules/common/Renderer').default;
const loadContentImgs = require('../modules/common/loadContentImgs').default;
const ContentsHeader = require('../modules/ContentsHeader').default;
const Accordion = require('../modules/Accordion').default;

const modules = {
  scrollManager: new SmoothScrollManager(),
}
const renderer = new Renderer(modules);
const contentsHeader = new ContentsHeader(modules.scrollManager);
const elmAnchorLink = document.querySelectorAll('.js-anchor-link');
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.js-accordion');
const elmOpenModal = document.querySelectorAll('.js-open-modal');
const accordions = [];

export default function() {
  for (var i = 0; i < elmAnchorLink.length; i++) {
    new AnchorLink(elmAnchorLink[i], modules.scrollManager);
  }
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }
  for (var i = 0; i < elmAccordion.length; i++) {
    accordions[i] = new Accordion(elmAccordion[i], modules.scrollManager);
  }
  for (var i = 0; i < elmOpenModal.length; i++) {
    elmOpenModal[i].addEventListener('click', () => {
      if (scrollManager.isWorking) {
        modules.scrollManager.pause();
      } else {
        modules.scrollManager.play();
      }
    });
  }

  modules.scrollManager.scrollNext = () => {
    contentsHeader.scroll();
  }
  modules.scrollManager.resizeNext = () => {
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].resize();
    }
  }
  modules.scrollManager.renderNext = () => {
    contentsHeader.render();
  }
  loadContentImgs(document, () => {
    modules.scrollManager.start().then(() => {
      renderer.start();
    });
  });

}
