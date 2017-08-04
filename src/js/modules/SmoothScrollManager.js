import debounce from 'js-util/debounce';
import MathEx from 'js-util/MathEx';
import ScrollItem from './ScrollItem';
import Hookes from './Hookes';

export default class SmoothScrollManager {
  constructor(opt) {
    this.elm = document.getElementsByClassName('js-scroll-item');
    this.elmParallax1 = document.getElementsByClassName('js-parallax-1');
    this.elmParallax2 = document.getElementsByClassName('js-parallax-2');
    this.elmParallaxR = document.getElementsByClassName('js-parallax-r');
    this.elmContents = document.querySelector('.l-contents');
    this.elmDummyScroll = document.querySelector('.l-dummy-scroll');
    this.items = [];
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

    this.hookesContents = new Hookes();
    this.hookesElements1 = new Hookes({ k: 0.05, d: 0.7 });
    this.hookesElements2 = new Hookes({ k: 0.05, d: 0.7 });
    this.hookesElementsR = new Hookes({ k: 0.05, d: 0.7 });

    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.isWorking = (opt && opt.isWorking !== undefined) ? opt.isWorking : true;
    this.isAnimate = true;
    this.init();
  }
  init() {
    if (this.elm.length > 0) {
      for (var i = 0; i < this.elm.length; i++) {
        this.items[i] = new ScrollItem(this.elm[i]);
      }
    }
    this.resize();
    this.on();
    this.renderLoop();
  }
  scrollBasis() {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].show(this.scrollTop + this.resolution.y, this.scrollTop);
    }
    this.hookesContents.anchor[1] = this.scrollTop * -1;
    this.hookesElements1.acceleration[1] += this.scrollFrame * 0.1;
    this.hookesElements2.acceleration[1] += this.scrollFrame * 0.2;
    this.hookesElementsR.acceleration[1] -= this.scrollFrame * 0.02;
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
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].init(this.scrollTop, this.resolution);
    }
    this.elmDummyScroll.style.height = `${this.elmContents.clientHeight}px`;
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
    this.elmContents.style.transform = `translate3D(0, ${this.hookesContents.velocity[1]}px, 0)`;
    for (var i = 0; i < this.elmParallax1.length; i++) {
      this.elmParallax1[i].style.transform = `translate3D(0, ${this.hookesElements1.velocity[1]}px, 0)`;
    }
    for (var i = 0; i < this.elmParallax2.length; i++) {
      this.elmParallax2[i].style.transform = `translate3D(0, ${this.hookesElements2.velocity[1]}px, 0)`;
    }
    for (var i = 0; i < this.elmParallaxR.length; i++) {
      this.elmParallaxR[i].style.transform = `translate3D(0, ${MathEx.clamp(this.hookesElementsR.velocity[1], -10, 10)}%, 0)`;
    }
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
    window.addEventListener('scroll', () => {
      this.scroll(event);
    }, false);
    window.addEventListener('resize', debounce(() => {
      this.resize();
      this.scroll(event);
    }, 400), false);
  }
}
