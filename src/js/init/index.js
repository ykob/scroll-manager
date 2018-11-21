import Hover from 'js-util/Hover.js';
import Renderer from '../modules/common/Renderer';
import loadContentImgs from '../modules/common/loadContentImgs';
import SmoothScrollManager from '../modules/smooth_scroll_manager/SmoothScrollManager';
import AnchorLink from '../modules/smooth_scroll_manager/AnchorLink';
import ContentsHeader from '../modules/ContentsHeader';
import Accordion from '../modules/Accordion';

const modules = {
  renderer: new Renderer(),
  scrollManager: new SmoothScrollManager(),
  contentsHeader: new ContentsHeader(),
}
const elmAnchorLink = document.querySelectorAll('.js-anchor-link');
const elmHover = document.querySelectorAll('.js-hover');
const elmAccordion = document.querySelectorAll('.js-accordion');
const elmOpenModal = document.querySelectorAll('.js-open-modal');
const accordions = [];

modules.scrollManager.modules = modules;
modules.contentsHeader.modules = modules;

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
      if (modules.scrollManager.isWorking) {
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
  modules.renderer.render = () => {
    modules.scrollManager.render();
    modules.contentsHeader.render();
  }

  await loadContentImgs(document);
  await modules.scrollManager.start();
  modules.renderer.start();
}
