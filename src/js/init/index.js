const Hover = require('js-util/Hover.js');
const SmoothScrollManager = require('../modules/smooth_scroll_manager/SmoothScrollManager').default;
const AnchorLink = require('../modules/smooth_scroll_manager/AnchorLink').default;
const Renderer = require('../modules/common/Renderer').default;
const loadContentImgs = require('../modules/common/loadContentImgs').default;
const ContentsHeader = require('../modules/ContentsHeader').default;
const Accordion = require('../modules/Accordion').default;

const modules = {
  scrollManager: new SmoothScrollManager(),
  contentsHeader: new ContentsHeader(),
  renderer: new Renderer(),
}
const elmAnchorLink = document.querySelectorAll('.js-anchor-link');
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.js-accordion');
const elmOpenModal = document.querySelectorAll('.js-open-modal');
const accordions = [];

modules.scrollManager.modules = modules;
modules.contentsHeader.modules = modules;
modules.renderer.modules = modules;

export default async function() {
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
    modules.contentsHeader.scroll();
  }
  modules.scrollManager.resizeNext = () => {
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].resize();
    }
  }

  await loadContentImgs(document);
  await modules.scrollManager.start();
  modules.renderer.start();
}
