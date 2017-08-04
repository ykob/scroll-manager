import ScrollManager from './modules/SmoothScrollManager'

const init = () => {
  const scrollManager = new ScrollManager();

  scrollManager.isWorking = true;
  scrollManager.isAnimate = true;
  scrollManager.renderLoop();
  scrollManager.resize(() => {
    scrollManager.scroll();
  });
}
init();
