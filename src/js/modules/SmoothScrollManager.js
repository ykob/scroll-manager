import debounce from 'js-util/debounce';
import isiOS from 'js-util/isiOS';
import isAndroid from 'js-util/isAndroid';
import ScrollItem from './ScrollItem';
import Hookes from './Hookes';

const X_SWITCH_SMOOTH = 768;
const contents = document.querySelector('.l-contents');
const dummyScroll = document.querySelector('.js-dummy-scroll');

export default class SmoothScrollManager {
  constructor() {
    this.elmScrollItems = null;
    this.scrollItems = [];
    this.scrollTop = 0;
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
    this.isWorking = false;
    this.isWorkingSmooth = false;

    this.initScrollItems();
    this.initHookes();
    this.on();
  }
  start(callback) {
    this.resize(() => {
      window.scrollTo(0, this.scrollTop);
      this.isWorking = true;
      this.isWorkingSmooth = true;
      this.renderLoop();
      this.scroll();
      if (callback) callback();
    });
  }
  initDummyScroll() {
    this.scrollTop = window.pageYOffset;
    this.hookesContents.velocity[1] = -this.scrollTop;
    this.hookesContents.anchor[1] = -this.scrollTop;
    this.hookesForParallax.velocity[1] = this.scrollTop;
    this.hookesForParallax.anchor[1] = this.scrollTop;
    if (this.resolution.x <= X_SWITCH_SMOOTH) {
      contents.style.transform = '';
      contents.classList.remove('is-fixed');
      dummyScroll.style.height = `0`;
    } else {
      contents.classList.add('is-fixed');
      dummyScroll.style.height = `${contents.clientHeight}px`;
    }
  }
  initScrollItems() {
    this.scrollItems = [];
    this.elmScrollItems = contents.querySelectorAll('.js-scroll-item');
    if (this.elmScrollItems.length > 0) {
      for (var i = 0; i < this.elmScrollItems.length; i++) {
        this.scrollItems[i] = new ScrollItem(this.elmScrollItems[i]);
      }
    }
  }
  initHookes() {
    this.hookesContents = new Hookes(
      [contents]
    );
    this.hookesForParallax = new Hookes(
      null, { k: 0.07, d: 0.7 }
    );
    this.hookesElements1 = new Hookes(
      contents.querySelectorAll('.js-smooth-item-1'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElements2 = new Hookes(
      contents.querySelectorAll('.js-smooth-item-2'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElements3 = new Hookes(
      contents.querySelectorAll('.js-smooth-item-3'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElementsR1 = new Hookes(
      contents.querySelectorAll('.js-smooth-item-r1'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElementsR2 = new Hookes(
      contents.querySelectorAll('.js-smooth-item-r2'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElementsR3 = new Hookes(
      contents.querySelectorAll('.js-smooth-item-r3'),
      { k: 0.07, d: 0.7 }
    );
  }
  scrollBasis() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(this.scrollTop + this.resolution.y, this.scrollTop);
    }
    if (this.resolution.x > X_SWITCH_SMOOTH) {
      this.hookesContents.anchor[1] = this.scrollTop * -1;
      this.hookesForParallax.anchor[1] = this.scrollTop;
      this.hookesElements1.velocity[1] += this.scrollFrame * 0.05;
      this.hookesElements2.velocity[1] += this.scrollFrame * 0.1;
      this.hookesElements3.velocity[1] += this.scrollFrame * 0.15;
      this.hookesElementsR1.velocity[1] += this.scrollFrame * -0.05;
      this.hookesElementsR2.velocity[1] += this.scrollFrame * -0.1;
      this.hookesElementsR3.velocity[1] += this.scrollFrame * -0.15;
    }
  }
  scroll(event) {
    if (this.isWorking === false) return;
    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;
    if (this.scrollPrev) this.scrollPrev();
    this.scrollBasis();
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].init(this.scrollTop, this.resolution);
    }
    if (this.resolution.x <= X_SWITCH_SMOOTH) {
      this.hookesContents.anchor[1] = 0;
      this.hookesContents.velocity[1] = 0;
      this.hookesForParallax.anchor[1] = 0;
      this.hookesForParallax.velocity[1] = 0;
      this.hookesElements1.velocity[1] = 0;
      this.hookesElements2.velocity[1] = 0;
      this.hookesElements3.velocity[1] = 0;
      this.hookesElementsR1.velocity[1] = 0;
      this.hookesElementsR2.velocity[1] = 0;
      this.hookesElementsR3.velocity[1] = 0;
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
      this.resizeBasis();
      if (this.resizeNext) this.resizeNext();
      if (callback) callback();
    }, 100);
  }
  render() {
    if (this.renderPrev) this.renderPrev();
    this.hookesContents.render();
    this.hookesForParallax.render();
    this.hookesElements1.render();
    this.hookesElements2.render();
    this.hookesElements3.render();
    this.hookesElementsR1.render();
    this.hookesElementsR2.render();
    this.hookesElementsR3.render();
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
    const hookEventForResize = (isiOS() || isAndroid()) ? 'orientationchange' : 'resize';

    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);
    window.addEventListener(hookEventForResize, debounce((event) => {
      this.resize();
    }, 400), false);
  }
}
