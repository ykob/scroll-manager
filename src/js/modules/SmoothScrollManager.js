import debounce from 'js-util/debounce';
import MathEx from 'js-util/MathEx';
import isSmartphone from 'js-util/isSmartphone';
import ScrollItem from './ScrollItem';
import Hookes from './Hookes';

export default class SmoothScrollManager {
  constructor(opt) {
    this.elmContents = document.querySelector('.l-contents');
    this.elmDummyScroll = document.querySelector('.l-dummy-scroll');
    this.elmScrollItems = null;
    this.scrollItems = [];
    this.scrollTop = window.pageYOffset;
    this.scrollFrame = 0;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.bodyResolution = {
      x: 0,
      y: 0
    };
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.isWorking = (opt && opt.isWorking !== undefined) ? opt.isWorking : false;
    this.isAnimate = false;
    this.init();
  }
  start() {
    this.isWorking = true;
    if (!isSmartphone()) {
      this.isAnimate = true;
      this.renderLoop();
    }
    this.resize(() => {
      this.scroll();
    });
  }
  init() {
    if (!isSmartphone()) this.elmContents.classList.add('is-fixed');
    this.initScrollItems();
    this.initHookes();
    this.on();
  }
  initScrollItems() {
    this.scrollItems = [];
    this.elmScrollItems = this.elmContents.getElementsByClassName('js-scroll-item');
    if (this.elmScrollItems.length > 0) {
      for (var i = 0; i < this.elmScrollItems.length; i++) {
        this.scrollItems[i] = new ScrollItem(this.elmScrollItems[i]);
      }
    }
  }
  initHookes() {
    if (isSmartphone()) return;
    this.hookesContents = new Hookes(
      [this.elmContents]
    );
    this.hookesElements1 = new Hookes(
      this.elmContents.getElementsByClassName('js-parallax-1'),
      { k: 0.05, d: 0.7 }
    );
    this.hookesElements2 = new Hookes(
      this.elmContents.getElementsByClassName('js-parallax-2'),
      { k: 0.05, d: 0.7 }
    );
    this.hookesElementsR = new Hookes(
      this.elmContents.getElementsByClassName('js-parallax-r'),
      { k: 0.05, d: 0.7, unit: '%', min: -10, max: 10 }
    );
  }
  scrollBasis() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(this.scrollTop + this.resolution.y, this.scrollTop);
    }
    if (this.hookesContents) this.hookesContents.anchor[1] = this.scrollTop * -1;
    if (this.hookesElements1) this.hookesElements1.acceleration[1] += this.scrollFrame * 0.1;
    if (this.hookesElements2) this.hookesElements2.acceleration[1] += this.scrollFrame * 0.2;
    if (this.hookesElementsR) this.hookesElementsR.acceleration[1] += this.scrollFrame * -0.02;
  }
  scroll(event) {
    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;
    if (this.isWorking === false) return;
    if (this.scrollPrev) this.scrollPrev();
    this.scrollBasis();
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].init(this.scrollTop, this.resolution);
    }
    if (!isSmartphone()) this.elmDummyScroll.style.height = `${this.elmContents.clientHeight}px`;
  }
  resize(callback) {
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = document.body.clientWidth;
    this.bodyResolution.y = document.body.clientHeight;
    if (this.resizePrev) this.resizePrev();
    setTimeout(() => {
      this.scrollTop = window.pageYOffset;
      this.resizeBasis();
      if (this.resizeNext) this.resizeNext();
      if (callback) callback();
    }, 100);
  }
  render() {
    this.hookesContents.render();
    this.hookesElements1.render();
    this.hookesElements2.render();
    this.hookesElementsR.render();
  }
  renderLoop() {
    this.render();
    if (this.isAnimate) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
  }
  on() {
    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);
    window.addEventListener('resize', debounce((event) => {
      this.resize();
      this.scroll(event);
    }, 400), false);
  }
}
