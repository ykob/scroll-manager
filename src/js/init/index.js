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

modules.scrollManager.modules = modules;
modules.contentsHeader.modules = modules;

export default async function() {
  [...document.querySelectorAll('.js-anchor-link')].map(elm => {
    return new AnchorLink(elm, modules.scrollManager);
  });
  [...document.querySelectorAll('.js-hover')].map(elm => {
    return new Hover(elm);
  });
  const accordions = [...document.querySelectorAll('.js-accordion')].map(elm => {
    return new Accordion(elm, modules.scrollManager);
  });
  [...document.querySelectorAll('.js-open-modal')].map(elm => {
    return elm.addEventListener('click', () => {
      if (modules.scrollManager.isWorking) {
        modules.scrollManager.pause();
      } else {
        modules.scrollManager.play();
      }
    });
  });

  modules.scrollManager.scrollNext = () => {
    modules.contentsHeader.scroll();
  }
  modules.scrollManager.resizeNext = () => {
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].resize();
    }
  }
  modules.renderer.render = () => {
    modules.scrollManager.update();
    modules.contentsHeader.render();
  }

  await loadContentImgs(document);
  await modules.scrollManager.start();
  modules.renderer.start();
}
