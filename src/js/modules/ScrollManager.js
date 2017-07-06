import debounce from 'js-util/debounce';
import ScrollItem from './ScrollItem';
import ParallaxItem from './ParallaxItem'

export default class ScrollManager {
  constructor(opt) {
    this.elm = document.getElementsByClassName('js-scroll-item');
    this.elmParallax = document.getElementsByClassName('js-parallax-item');
    this.items = [];
    this.parallaxItems = [];
    this.scrollTop = window.pageYOffset;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.isWorking = (opt && opt.isWorking !== undefined) ? opt.isWorking : true;
    this.init();
  }
  init() {
    if (this.elm.length > 0) {
      for (var i = 0; i < this.elm.length; i++) {
        this.items[i] = new ScrollItem(this.elm[i]);
      }
    }
    if (this.elmParallax.length > 0) {
      for (var i = 0; i < this.elmParallax.length; i++) {
        this.parallaxItems[i] = new ParallaxItem(this.elmParallax[i]);
      }
    }
    this.resize();
    this.on();
  }
  scroll() {
    this.scrollTop = window.pageYOffset;
    if (this.isWorking === false) return;
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].show(this.scrollTop + this.resolution.y, this.scrollTop);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].scroll(this.scrollTop + this.resolution.y * 0.5);
    }
  }
  resize() {
    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].init(this.scrollTop, this.resolution);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].init(this.scrollTop, this.resolution);
    }
  }
  on() {
    window.addEventListener('scroll', () => {
      this.scroll();
    }, false);
    window.addEventListener('resize', debounce(() => {
      this.resize();
      this.scroll();
    }, 500), false);
  }
}
