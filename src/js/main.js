import Hover from 'js-util/Hover.js';
import ScrollManager from './modules/SmoothScrollManager';
import ContentsHeader from './modules/ContentsHeader';
import ParallaxItem from './modules/ParallaxItem';
import AccordionItem from './modules/AccordionItem';

const scrollManager = new ScrollManager();
const contentsHeader = new ContentsHeader(scrollManager);
const elmHover = document.querySelectorAll('.js-hover');
const elmParallaxItems = document.querySelectorAll('.js-parallax-item');
const elmAccordion = document.querySelectorAll('.c-accordion-item');

const parallaxItems = [];

const init = () => {
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }
  for (var i = 0; i < elmParallaxItems.length; i++) {
    parallaxItems[i] = new ParallaxItem(elmParallaxItems[i], scrollManager);
  }
  for (var i = 0; i < elmAccordion.length; i++) {
    new AccordionItem(elmAccordion[i], scrollManager);
  }

  scrollManager.scrollNext = () => {
    contentsHeader.scroll();
  }
  scrollManager.resizeNext = () => {
    for (var i = 0; i < parallaxItems.length; i++) {
      parallaxItems[i].init();
    }
  }
  scrollManager.renderNext = () => {
    contentsHeader.render();
    for (var i = 0; i < parallaxItems.length; i++) {
      parallaxItems[i].render(scrollManager.hookes.forParallax.velocity[1]);
    }
  }

  scrollManager.start();
}
init();
