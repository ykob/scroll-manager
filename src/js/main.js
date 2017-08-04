import ScrollManager from './modules/SmoothScrollManager'
import Hover from 'js-util/Hover.js';

const init = () => {
  const elmHover = document.getElementsByClassName('js-hover');
  for (var i = 0; i < elmHover.length; i++) {
    new Hover(elmHover[i]);
  }

  const scrollManager = new ScrollManager();
  scrollManager.start();
}
init();
