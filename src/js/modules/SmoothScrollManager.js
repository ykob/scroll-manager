import debounce from 'js-util/debounce';
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
    this.renderPrev = null;
    this.renderNext = null;
    this.isWorking = (opt && opt.isWorking !== undefined) ? opt.isWorking : false;
    this.isWorkingSmooth = (opt && opt.isWorkingSmooth !== undefined) ? opt.isWorkingSmooth : false;
    this.isScrollOnLoad = false;
    this.init();
    this.on();
  }
  start() {
    this.isWorking = true;
    if (!isSmartphone()) {
      this.isWorkingSmooth = true;
      this.renderLoop();
    }
    this.resize(() => {
      this.scroll();
    });
  }
  stop() {
    this.isWorking = false;
    this.isWorkingSmooth = false;
  }
  init() {
    if (!isSmartphone()) this.elmContents.classList.add('is-fixed');
    this.resize();
    this.initDummyScroll();
    this.initScrollItems();
    this.initHookes();
  }
  initDummyScroll() {
    if (!isSmartphone()) this.elmDummyScroll.style.height = `${this.elmContents.clientHeight}px`;
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
      { k: 0.07, d: 0.7 }
    );
    this.hookesElements2 = new Hookes(
      this.elmContents.getElementsByClassName('js-parallax-2'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElementsR = new Hookes(
      this.elmContents.getElementsByClassName('js-parallax-r'),
      { k: 0.07, d: 0.7, unit: '%', min: -10, max: 10 }
    );
  }
  scrollBasis() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(this.scrollTop + this.resolution.y, this.scrollTop);
    }
    this.hookesContents.anchor[1] = this.scrollTop * -1;
    this.hookesElements1.velocity[1] += this.scrollFrame * 0.05;
    this.hookesElements2.velocity[1] += this.scrollFrame * 0.1;
    this.hookesElementsR.velocity[1] += this.scrollFrame * -0.01;
  }
  scroll(event) {
    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;
    if (!isSmartphone() && !this.isScrollOnLoad) {
      this.hookesContents.velocity[1] = -this.scrollTop;
      this.hookesContents.anchor[1] = -this.scrollTop;
      this.isScrollOnLoad = true;
    }
    if (this.isWorking === false) return;
    if (this.scrollPrev) this.scrollPrev();
    this.scrollBasis();
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].init(this.scrollTop, this.resolution);
    }
    this.initDummyScroll();
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
    if (this.renderPrev) this.renderPrev();
    this.hookesContents.render();
    this.hookesElements1.render();
    this.hookesElements2.render();
    this.hookesElementsR.render();
    if (this.renderNext) this.renderNext();
  }
  renderLoop() {
    this.render();
    if (this.isWorkingSmooth) {
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
