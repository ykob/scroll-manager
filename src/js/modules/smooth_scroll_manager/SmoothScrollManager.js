/**
* Smooth Scroll Manager
*
* Copyright (c) 2019 Yoichi Kobayashi
* Released under the MIT license
* http://opensource.org/licenses/mit-license.php
*/

import UaParser from 'ua-parser-js';
import debounce from 'js-util/debounce';
import sleep from 'js-util/sleep';
import Hookes from './Hookes';
import ScrollItems from './ScrollItems';
import ConsoleSignature from '../common/ConsoleSignature';

const uaParser = new UaParser();
const os = uaParser.getOS().name;
const consoleSignature = new ConsoleSignature('this content is rendered with scroll-manager', 'https://github.com/ykob/scroll-manager');

const CLASSNAME_DUMMY_SCROLL = 'js-dummy-scroll';
const CLASSNAME_CONTENTS = 'js-contents';

export default class SmoothScrollManager {
  constructor() {
    this.elm = {
      dummyScroll: document.querySelector(`.${CLASSNAME_DUMMY_SCROLL}`),
      contents: null,
    };
    this.modules = null;
    this.scrollItems = new ScrollItems(this);
    this.scrollTop = 0;
    this.scrollFrame = 0;
    this.scrollTopPause = 0;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.bodyResolution = {
      x: 0,
      y: 0
    };
    this.X_SWITCH_SMOOTH = 1024;
    this.hookes = {};
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.isWorkingScroll = false;
    this.isWorkingRender = false;
    this.isWorkingTransform = false;
    this.isPaused = false;

    this.on();
  }
  async start() {
    // Temporary turn off flags that are to run Scroll Manager.
    this.isWorkingScroll = false;
    this.isWorkingRender = false;
    this.isWorkingTransform = false;

    // Get the DOM that is the target of the smooth scroll.
    this.elm.contents = document.querySelector(`.${CLASSNAME_CONTENTS}`);

    // It returns Promise with setTimeout to get a scroll top value accurately when a hash is included.
    await sleep(100);

    // Get the initial scroll value. (it's unnecessary if it has Pjax)
    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;

    // Initialize Hookes and ScrollItems.
    this.initHookes();
    this.scrollItems.init(this.elm.contents);

    // If it has a hash in location, it adjusts the scroll position to the appropriate place.
    const { hash } = location;
    const target = (hash) ? document.querySelector(hash) : null;
    if (target) {
      this.scrollTop += target.getBoundingClientRect().top;
      window.scrollTo(0, this.scrollTop);
    }
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      this.hookes.contents.anchor[1] = this.hookes.contents.velocity[1] = this.scrollTop * -1;
      this.hookes.parallax.anchor[1] = this.hookes.parallax.velocity[1] = this.scrollTop + this.resolution.y * 0.5;
    }
    this.elm.contents.style.transform = `translate3D(0, ${this.hookes.contents.velocity[1]}px, 0)`;

    // Turn off flags that are to run Scroll Manager.
    this.isWorkingScroll = false;
    this.isWorkingScroll = true;
    this.isWorkingRender = true;
    this.isWorkingTransform = true;

    await this.resize();
    this.scroll();
    return;
  }
  pause() {
    // If it's paused, this methods doesn't run.
    if (this.isPaused === true) return;

    // Pause smooth scroll.
    this.isWorkingScroll = false;
    this.isPaused = true;

    //  Memorize the position ran pause.
    this.scrollTopPause = this.scrollTop;
    window.scrollTo(0, this.scrollTop);
  }
  play() {
    // If it is not paused, this methods doesn't run.
    if (this.isPaused === false) return;

    // Run smooth scroll.
    this.isWorkingScroll = true;
    this.isPaused = false;

    // Move to the position that paused.
    this.scrollTop = this.scrollTopPause;
    window.scrollTo(0, this.scrollTop);
  }
  initDummyScroll() {
    // Initialize dummy scroll.
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      // In case of PC.
      this.elm.contents.classList.add('is-fixed');
      this.elm.dummyScroll.style.height = `${this.elm.contents.clientHeight}px`;
    } else {
      // In case of Smartphone.
      this.elm.contents.style.transform = '';
      this.elm.contents.classList.remove('is-fixed');
      this.elm.dummyScroll.style.height = `0`;
    }
    this.render();
  }
  initHookes() {
    // Initialize Hookes object.
    this.hookes = {
      contents: new Hookes({ k: 0.625, d: 0.8 }),
      smooth:   new Hookes({ k: 0.2, d: 0.7 }),
      parallax: new Hookes({ k: 0.28, d: 0.7 }),
    }
  }
  scrollBasis() {
    // Update each Hookes instances based on scrollTop value.
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      this.hookes.contents.anchor[1] = this.scrollTop * -1;
      this.hookes.smooth.velocity[1] += this.scrollFrame;
      this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    }

    // Run the scroll method of ScrollItems.
    this.scrollItems.scroll();
  }
  scroll(event) {
    // In the case of the flag to work smooth scroll is disabled, it doesn't run the processing in scroll event.
    if (this.isWorkingScroll === false) return;

    // Get scroll top value.
    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;

    // Run the individual scroll events. (Previous to the basic scroll event)
    if (this.scrollPrev) this.scrollPrev();

    // Run the basic scroll process.
    this.scrollBasis();

    // Run the individual scroll events. (Next to the basic scroll event)
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
    // Run the resize method of ScrollItems.
    this.scrollItems.resize(this.isValidSmooth());
  }
  async resize() {
    // Sequence of resize event.

    // Cancel the scroll event while resizing.
    this.isWorkingScroll = false;

    // Reset elements related resize event temporary.
    if (this.resizeReset) this.resizeReset();

    // Get each value.
    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = this.elm.contents.clientWidth;
    this.bodyResolution.y = this.elm.contents.clientHeight;

    // Reset the value of Hookes instance properties based on window width.
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      // In case of PC.
      this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = -this.scrollTop;
      this.hookes.parallax.velocity[1] = this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    } else {
      // In case of Smartphone.
      for (var key in this.hookes) {
        switch (key) {
          case 'contents':
          case 'parallax':
            this.hookes[key].anchor[1] = this.hookes[key].velocity[1] = 0;
            break;
          default:
            this.hookes[key].velocity[1] = 0;
        }
      }
    }

    // Run unique resize event before page height is changed.
    if (this.resizePrev) this.resizePrev();

    await sleep(100);

    // Reset the layout of the content and dummy scroll element.
    this.initDummyScroll();
    this.render();
    window.scrollTo(0, this.scrollTop);

    // Run basic resize event.
    this.resizeBasis();

    // Run unique resize event after page height is changed.
    if (this.resizeNext) this.resizeNext();

    // Restart the scroll events. (it doesn't restart during a pause.)
    if (this.isPaused === false) this.isWorkingScroll = true;

    return;
  }
  render() {
    if (this.isWorkingRender === false) return;

    // render the content wrapper.
    if (this.isWorkingTransform === true && this.resolution.x > this.X_SWITCH_SMOOTH) {
      const y = Math.floor(this.hookes.contents.velocity[1] * 1000) / 1000;
      this.elm.contents.style.transform = `translate3D(0, ${y}px, 0)`;
    }

    // render Hookes objects.
    for (var key in this.hookes) {
      this.hookes[key].render();
    }

    // render Scroll Items.
    this.scrollItems.render(this.isValidSmooth());
  }
  on() {
    // In the case of to browse with iOS or Android, running the resize event by orientationchange.
    // It's a purpose of preventing to run the resize event when status bar toggles.
    const hookEventForResize = (os === 'iOS' || os === 'Android')
      ? 'orientationchange'
      : 'resize';

    // Bind the scroll event
    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);

    // Bind the esize event
    window.addEventListener(hookEventForResize, debounce((event) => {
      this.resize();
    }, 400), false);
  }
  off() {
    // Reset all individual events.
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
  }
  isValidSmooth() {
    // Returns whether or not smooth scroll is valid.
    return this.isWorkingRender && this.resolution.x > this.X_SWITCH_SMOOTH;
  }
}
