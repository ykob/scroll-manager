/**
* Scroll Manager
*
* Copyright (c) 2018 Yoichi Kobayashi
* Released under the MIT license
* http://opensource.org/licenses/mit-license.php
*/

const debounce = require('js-util/debounce');
const isiOS = require('js-util/isiOS');
const isAndroid = require('js-util/isAndroid');
const ConsoleSignature = require('../common/ConsoleSignature').default;
const ScrollItems = require('./ScrollItems').default;

const consoleSignature = new ConsoleSignature('this content is rendered with scroll-manager', 'https://github.com/ykob/scroll-manager');

export default class ScrollManager {
  constructor() {
    this.scrollItems = new ScrollItems(this);
    this.scrollTop = window.pageYOffset;
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
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.isWorking = false;
  }
  start() {
    this.isWorking = true;
    this.scrollItems.init(document);
    this.resize(() => {
      this.scroll();
      this.on();
    });
  }
  scrollBasis() {
  }
  scroll() {
    this.scrollTop = window.pageYOffset;
    if (this.isWorking === false) return;
    if (this.scrollPrev) this.scrollPrev();
    this.scrollBasis();
    this.scrollItems.scroll();
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
  }
  resize(callback) {
    // リサイズイベントに関する要素の一時リセット
    if (this.resizeReset) this.resizeReset();
    // 各値を取得
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = document.body.clientWidth;
    this.bodyResolution.y = document.body.clientHeight;
    if (this.resizePrev) this.resizePrev();
    setTimeout(() => {
      this.scrollTop = window.pageYOffset;
      this.resizeBasis();
      this.scrollItems.resize();
      if (this.resizeNext) this.resizeNext();
      if (callback) callback();
    }, 100);
  }
  on() {
    const hookEventForResize = (isiOS() || isAndroid()) ? 'orientationchange' : 'resize';

    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);
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
