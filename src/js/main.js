import Hover from 'js-util/Hover.js';
import ScrollManager from './modules/SmoothScrollManager'
import ContentsHeader from './modules/ContentsHeader'

const init = () => {
  const elmHover = document.getElementsByClassName('js-hover');
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }

  const scrollManager = new ScrollManager();
  const contentsHeader = new ContentsHeader(scrollManager);

  scrollManager.renderNext = () => {
    contentsHeader.render();
  }
  scrollManager.start();
}
init();
