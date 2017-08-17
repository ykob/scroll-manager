import debounce from 'js-util/debounce';
import ScrollItem from './ScrollItem';
import Hookes from './Hookes';

const X_SWITCH_SMOOTH = 768;
const contents = document.querySelector('.l-contents');
const dummyScroll = document.querySelector('.l-dummy-scroll');

export default class SmoothScrollManager {
  constructor(opt) {
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
    this.initScrollItems();
    this.initHookes();
    this.on();
  }
  start() {
    this.isWorking = true;
    this.isWorkingSmooth = true;
    this.renderLoop();
    this.resize(() => {
      this.scroll();
    });
  }
  initDummyScroll() {
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
    this.elmScrollItems = contents.getElementsByClassName('js-scroll-item');
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
    this.hookesElements1 = new Hookes(
      contents.getElementsByClassName('js-parallax-1'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElements2 = new Hookes(
      contents.getElementsByClassName('js-parallax-2'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElements3 = new Hookes(
      contents.getElementsByClassName('js-parallax-3'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElementsR1 = new Hookes(
      contents.getElementsByClassName('js-parallax-r1'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElementsR2 = new Hookes(
      contents.getElementsByClassName('js-parallax-r2'),
      { k: 0.07, d: 0.7 }
    );
    this.hookesElementsR10p = new Hookes(
      contents.getElementsByClassName('js-parallax-r10p'),
      { k: 0.07, d: 0.7, unit: '%', min: -10, max: 10 }
    );
  }
  scrollBasis() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(this.scrollTop + this.resolution.y, this.scrollTop);
    }
    if (this.resolution.x > X_SWITCH_SMOOTH) {
      this.hookesContents.anchor[1] = this.scrollTop * -1;
      this.hookesElements1.velocity[1] += this.scrollFrame * 0.05;
      this.hookesElements2.velocity[1] += this.scrollFrame * 0.1;
      this.hookesElements3.velocity[1] += this.scrollFrame * 0.15;
      this.hookesElementsR1.velocity[1] += this.scrollFrame * 0.05;
      this.hookesElementsR2.velocity[1] += this.scrollFrame * 0.1;
      this.hookesElementsR10p.velocity[1] += this.scrollFrame * -0.01;
    }
  }
  scroll(event) {
    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;
    if (!this.isScrollOnLoad) {
      this.hookesContents.velocity[1] = (this.resolution.x > X_SWITCH_SMOOTH) ? -this.scrollTop : 0;
      this.hookesContents.anchor[1] = (this.resolution.x > X_SWITCH_SMOOTH) ? -this.scrollTop : 0;
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
    if (this.resolution.x <= X_SWITCH_SMOOTH) {
      this.hookesContents.anchor[1] = 0;
      this.hookesContents.velocity[1] = 0;
      this.hookesElements1.velocity[1] = 0;
      this.hookesElements2.velocity[1] = 0;
      this.hookesElements3.velocity[1] = 0;
      this.hookesElementsR1.velocity[1] = 0;
      this.hookesElementsR2.velocity[1] = 0;
      this.hookesElementsR10p.velocity[1] = 0;
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
    this.hookesElements3.render();
    this.hookesElementsR1.render();
    this.hookesElementsR2.render();
    this.hookesElementsR10p.render();
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
