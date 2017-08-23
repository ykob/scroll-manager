import debounce from 'js-util/debounce';
import isiOS from 'js-util/isiOS';
import isAndroid from 'js-util/isAndroid';
import Hookes from './Hookes';
import ScrollItems from './ScrollItems';

const X_SWITCH_SMOOTH = 768;
const contents = document.querySelector('.l-contents');
const dummyScroll = document.querySelector('.js-dummy-scroll');

export default class SmoothScrollManager {
  constructor() {
    this.scrollItems = new ScrollItems(this);
    this.scrollTop = 0;
    this.scrollTopOnResize = 0;
    this.scrollFrame = 0;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.bodyResolution = {
      x: 0,
      y: 0
    };
    this.hookes = {};
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.renderPrev = null;
    this.renderNext = null;
    this.isWorking = false;
    this.isWorkingSmooth = false;

    this.scrollItems.init(document);
    this.initHookes();
    this.on();
  }
  start(callback) {
    this.resize(() => {
      this.scrollTop = this.scrollTopOnResize;
      window.scrollTo(0, this.scrollTopOnResize);
      this.isWorking = true;
      this.isWorkingSmooth = true;
      this.renderLoop();
      this.scroll();
      if (callback) callback();
    });
  }
  initDummyScroll() {
    if (this.resolution.x <= X_SWITCH_SMOOTH) {
      contents.style.transform = '';
      contents.classList.remove('is-fixed');
      dummyScroll.style.height = `0`;
    } else {
      this.scrollTopOnResize = window.pageYOffset;
      this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = -this.scrollTopOnResize;
      this.hookes.forParallax.velocity[1] = this.hookes.forParallax.anchor[1] = this.scrollTopOnResize;
      contents.classList.add('is-fixed');
      dummyScroll.style.height = `${contents.clientHeight}px`;
    }
  }
  initHookes() {
    this.hookes = {
      contents: new Hookes([contents]),
      forParallax: new Hookes(null, { k: 0.07, d: 0.7 }),
      elements1: new Hookes(
        contents.querySelectorAll('.js-smooth-item-1'),
        { k: 0.07, d: 0.7 }
      ),
      elements2: new Hookes(
        contents.querySelectorAll('.js-smooth-item-2'),
        { k: 0.07, d: 0.7 }
      ),
      elements3: new Hookes(
        contents.querySelectorAll('.js-smooth-item-3'),
        { k: 0.07, d: 0.7 }
      ),
      elementsR1: new Hookes(
        contents.querySelectorAll('.js-smooth-item-r1'),
        { k: 0.07, d: 0.7 }
      ),
      elementsR2: new Hookes(
        contents.querySelectorAll('.js-smooth-item-r2'),
        { k: 0.07, d: 0.7 }
      ),
      elementsR3: new Hookes(
        contents.querySelectorAll('.js-smooth-item-r3'),
        { k: 0.07, d: 0.7 }
      ),
    }
  }
  scrollBasis() {
    if (this.resolution.x > X_SWITCH_SMOOTH) {
      this.hookes.contents.anchor[1] = this.scrollTop * -1;
      this.hookes.forParallax.anchor[1] = this.scrollTop;
      this.hookes.elements1.velocity[1] += this.scrollFrame * 0.05;
      this.hookes.elements2.velocity[1] += this.scrollFrame * 0.1;
      this.hookes.elements3.velocity[1] += this.scrollFrame * 0.15;
      this.hookes.elementsR1.velocity[1] += this.scrollFrame * -0.05;
      this.hookes.elementsR2.velocity[1] += this.scrollFrame * -0.1;
      this.hookes.elementsR3.velocity[1] += this.scrollFrame * -0.15;
    }
  }
  scroll(event) {
    if (this.isWorking === false) return;
    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;
    if (this.scrollPrev) this.scrollPrev();
    this.scrollBasis();
    this.scrollItems.scroll();
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
    if (this.resolution.x <= X_SWITCH_SMOOTH) {
      for (var key in this.hookes) {
        switch (key) {
          case 'contents':
          case 'forParallax':
            this.hookes[key].anchor[1] = this.hookes[key].velocity[1] = 0;
            break;
          default:
            this.hookes[key].velocity[1] = 0;
        }
      }
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
      this.scrollItems.resize();
      if (this.resizeNext) this.resizeNext();
      if (callback) callback();
    }, 100);
  }
  render() {
    if (this.renderPrev) this.renderPrev();
    for (var key in this.hookes) {
      this.hookes[key].render();
    }
    this.scrollItems.render();
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
