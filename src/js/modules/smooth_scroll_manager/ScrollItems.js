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
  init(contents) {
    const elmScrollItems = contents.querySelectorAll('.js-scroll-item');
    const elmSmoothItems = contents.querySelectorAll('.js-smooth-item');
    const elmParallaxItems = contents.querySelectorAll('.js-parallax-item');

    this.scrollItems = [];
    this.smoothItems = [];
    this.parallaxItems = [];

    for (var i = 0; i < elmScrollItems.length; i++) {
      this.scrollItems[i] = new ScrollItem(
        elmScrollItems[i], this.scrollManager
      );
    }
    for (var i = 0; i < elmSmoothItems.length; i++) {
      this.smoothItems[i] = new SmoothItem(
        elmSmoothItems[i],
        this.scrollManager,
        this.scrollManager.hookes.smooth,
        elmSmoothItems[i].dataset
      );
    }
    for (var i = 0; i < elmParallaxItems.length; i++) {
      this.parallaxItems[i] = new ParallaxItem(
        elmParallaxItems[i],
        this.scrollManager,
        this.scrollManager.hookes.parallax,
        elmParallaxItems[i].dataset
      );
    }
  }
  scroll() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(
        this.scrollManager.scrollTop + this.scrollManager.resolution.y * 0.9,
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
  render(isWorking) {
    for (var i = 0; i < this.smoothItems.length; i++) {
      this.smoothItems[i].render(isWorking);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].render(isWorking);
    }
  }
}
