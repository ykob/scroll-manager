import ScrollItem from './ScrollItem';
import SmoothItem from './SmoothItem';
import ParallaxItem from './ParallaxItem';

export default class ScrollItems {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.scrollItems = [];
    this.smoothItems = [];
    this.parallaxItems = [];
  }
  start(contents) {
    this.scrollItems = [...contents.querySelectorAll('.js-scroll-item')].map(o => {
      return new ScrollItem(o, this.scrollManager);
    });
    this.smoothItems = [...contents.querySelectorAll('.js-smooth-item')].map(o => {
      return new SmoothItem(
        o,
        this.scrollManager,
        this.scrollManager.hookes.smooth,
        o.dataset
      );
    });
    this.parallaxItems = [...contents.querySelectorAll('.js-parallax-item')].map(o => {
      return new ParallaxItem(
        o,
        this.scrollManager,
        this.scrollManager.hookes.parallax,
        o.dataset
      );
    });
  }
  scroll() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(
        // The top of a range to judge that the element is view in a window or not.
        this.scrollManager.scrollTop + this.scrollManager.resolution.y * 0.9,
        // The bottom of a range to judge that the element is view in a window or not.
        this.scrollManager.scrollTop + this.scrollManager.resolution.y * 0.1
      );
    }
  }
  resize(isWorking) {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].init(this.scrollManager.scrollTop);
    }
    for (var i = 0; i < this.smoothItems.length; i++) {
      this.smoothItems[i].init(this.scrollManager.scrollTop);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].init(this.scrollManager.scrollTop, isWorking);
    }
  }
  update(isWorking) {
    for (var i = 0; i < this.smoothItems.length; i++) {
      this.smoothItems[i].update(isWorking);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].update(isWorking);
    }
  }
}
