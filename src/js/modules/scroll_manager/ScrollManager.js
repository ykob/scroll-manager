/**
* Scroll Manager
*
* Copyright (c) 2018 Yoichi Kobayashi
* Released under the MIT license
* http://opensource.org/licenses/mit-license.php
*/

require("babel-polyfill");

const ConsoleSignature = require('../common/ConsoleSignature').default;
const consoleSignature = new ConsoleSignature('this content is rendered with scroll-manager', 'https://github.com/ykob/scroll-manager');

const debounce = require('js-util/debounce');
const isiOS = require('js-util/isiOS');
const isAndroid = require('js-util/isAndroid');
const ScrollItems = require('./ScrollItems').default;

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
  }
  async start() {
    this.isWorking = true;
    this.scrollItems.init(document);
    await this.resize();
    this.scroll();
    this.on();
  }
  scrollBasis() {
    // ScrollItems のスクロールメソッドを実行
    this.scrollItems.scroll();
  }
  scroll() {
    // フラグが立たない場合はスクロールイベント内の処理を実行しない。
    if (this.isWorking === false) return;

    // スクロール値の取得
    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;

    // 個別のスクロールイベントを実行（標準のスクロール処理前）
    if (this.scrollPrev) this.scrollPrev();

    // 標準のスクロール処理を実行
    this.scrollBasis();

    // 個別のスクロールイベントを実行（標準のスクロール処理後）
    if (this.scrollNext) this.scrollNext();
  }
  resizeBasis() {
    // 基礎的なリサイズイベントはここに記述する。

    // ScrollItems のリサイズメソッドを実行
    this.scrollItems.resize();
  }
  async resize() {
    // リサイズイベントに関する要素の一時リセット
    if (this.resizeReset) this.resizeReset();

    // 各値を取得
    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = document.body.clientWidth;
    this.bodyResolution.y = document.body.clientHeight;

    // 個別のリサイズイベントを実行（ページの高さ変更前）
    if (this.resizePrev) this.resizePrev();

    await new Promise((resolve) => {
      setTimeout(() => {
        // 標準のリサイズイベントを実行
        this.resizeBasis();

        // 個別のリサイズイベントを実行（ページの高さ変更後）
        if (this.resizeNext) this.resizeNext();

        resolve();
      }, 100);
    });

    return;
  }
  on() {
    const hookEventForResize = (isiOS() || isAndroid()) ? 'orientationchange' : 'resize';

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
