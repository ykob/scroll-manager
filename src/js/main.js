import Hover from 'js-util/Hover.js';
import ScrollManager from './modules/SmoothScrollManager';
import ContentsHeader from './modules/ContentsHeader';
import ScrollItem from './modules/ScrollItem';
import ParallaxItem from './modules/ParallaxItem';
import AccordionItem from './modules/AccordionItem';

const scrollManager = new ScrollManager();
const contentsHeader = new ContentsHeader(scrollManager);
const elmHover = document.querySelectorAll('.js-hover');
const elmScrollItems = document.querySelectorAll('.js-scroll-item');
const elmParallaxItems = document.querySelectorAll('.js-parallax-item');
const elmAccordion = document.querySelectorAll('.c-accordion-item');

const scrollItems = [];
const parallaxItems = [];

const init = () => {
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }
  for (var i = 0; i < elmScrollItems.length; i++) {
    scrollItems[i] = new ScrollItem(elmScrollItems[i], scrollManager);
  }
  for (var i = 0; i < elmParallaxItems.length; i++) {
    parallaxItems[i] = new ParallaxItem(elmParallaxItems[i], scrollManager);
  }
  for (var i = 0; i < elmAccordion.length; i++) {
    new AccordionItem(elmAccordion[i], scrollManager);
  }

  scrollManager.scrollNext = () => {
    contentsHeader.scroll();
    for (var i = 0; i < scrollItems.length; i++) {
      scrollItems[i].show(scrollManager.scrollTop + scrollManager.resolution.y, scrollManager.scrollTop);
    }
  }
  scrollManager.resizeNext = () => {
    for (var i = 0; i < scrollItems.length; i++) {
      scrollItems[i].init(scrollManager.scrollTop, scrollManager.resolution);
    }
    for (var i = 0; i < parallaxItems.length; i++) {
      parallaxItems[i].init();
    }
  }
  scrollManager.renderNext = () => {
    contentsHeader.render();
    for (var i = 0; i < parallaxItems.length; i++) {
      parallaxItems[i].render();
    }
  }

  scrollManager.start();
}
init();
