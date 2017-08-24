import ScrollItem from './ScrollItem';
import ParallaxItem from './ParallaxItem';

export default class ScrollItems {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.elmScrollItems = null;
    this.elmParallaxItems = null;
    this.scrollItems = [];
    this.parallaxItems = [];
  }
  init(contents) {
    this.elmScrollItems = contents.querySelectorAll('.js-scroll-item');
    this.scrollItems = [];
    for (var i = 0; i < this.elmScrollItems.length; i++) {
      this.scrollItems[i] = new ScrollItem(this.elmScrollItems[i], this.scrollManager);
    }
    this.elmParallaxItems = contents.querySelectorAll('.js-parallax-item');
    this.parallaxItems = [];
    for (var i = 0; i < this.elmParallaxItems.length; i++) {
      this.parallaxItems[i] = new ParallaxItem(this.elmParallaxItems[i], this.scrollManager);
    }
  }
  scroll() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(
        this.scrollManager.scrollTop + this.scrollManager.resolution.y,
        this.scrollManager.scrollTop
      );
    }
  }
  resize() {
    const scrollTop = window.pageYOffset;
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].init(scrollTop);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].init(scrollTop);
    }
  }
  render(isWorking) {
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].render(isWorking);
    }
  }
}
