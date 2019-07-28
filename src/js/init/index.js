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
const elmOpenModal = document.querySelectorAll('.js-open-modal');

modules.scrollManager.modules = modules;
modules.contentsHeader.modules = modules;

export default async function() {
  [...document.querySelectorAll('.js-anchor-link')].map(elm => {
    new AnchorLink(elm, modules.scrollManager);
  });
  [...document.querySelectorAll('.js-hover')].map(elm => {
    new Hover(elm);
  });
  const accordions = [...document.querySelectorAll('.js-accordion')].map(elm => {
    new Accordion(elm, modules.scrollManager);
  });

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
