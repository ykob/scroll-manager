/**
* Scroll Manager
*
* Copyright (c) 2018 Yoichi Kobayashi
* Released under the MIT license
* http://opensource.org/licenses/mit-license.php
*/

import UaParser from 'ua-parser-js';
import debounce from 'js-util/debounce';
import sleep from 'js-util/sleep';
import ScrollItems from './ScrollItems';
import ConsoleSignature from '../common/ConsoleSignature';

const uaParser = new UaParser();
const os = uaParser.getOS().name;
const consoleSignature = new ConsoleSignature('this content is rendered with scroll-manager', 'https://github.com/ykob/scroll-manager');

export default class ScrollManager {
  constructor() {
    this.scrollItems = new ScrollItems(this);
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
    this.mousemove = {
      x: 0,
      y: 0
    };
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.isWorking = false;

    this.on();
  }
  async start() {
    this.scrollItems.init(document);
    this.isWorking = true;
    await this.resize();
    this.scroll();
  }
  scrollBasis() {
    // Run the resize method of ScrollItems.
    this.scrollItems.scroll();
  }
  scroll() {
    // In the case of the flag to work smooth scroll is disabled, it doesn't run the processing in scroll event.
    if (this.isWorking === false) return;

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
    this.scrollItems.resize();
  }
  async resize() {
    // Sequence of resize event.

    // Reset elements related resize event temporary.
    if (this.resizeReset) this.resizeReset();

    // Get each value.
    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = document.body.clientWidth;
    this.bodyResolution.y = document.body.clientHeight;

    // Run unique resize event before page height is changed.
    if (this.resizePrev) this.resizePrev();

    await sleep(100);

    // Run basic resize event.
    this.resizeBasis();

    // Run unique resize event after page height is changed.
    if (this.resizeNext) this.resizeNext();

    return;
  }
  on() {
    const hookEventForResize = (os === 'iOS' || os === 'Android')
      ? 'orientationchange'
      : 'resize';

    // Bind the scroll event
    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);

    window.addEventListener('mousemove', (event) => {
      this.mousemove.x = event.clientX / this.resolution.x * 2.0 - 1.0;
      this.mousemove.y = -(event.clientY / this.resolution.y * 2.0 - 1.0);
    }, false);

    window.addEventListener('mouseout', () => {
      this.mousemove.x = 0;
      this.mousemove.y = 0;
    }, false);

    // Bind the esize event
    window.addEventListener(hookEventForResize, debounce((event) => {
      this.resize();
      this.scroll(event);
    }, 400), false);
  }
  off() {
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
  }
}
