/**
* Smooth Scroll Manager
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
const Hookes = require('./Hookes').default;
const ScrollItems = require('./ScrollItems').default;

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
    this.mousemove = {
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
    this.renderPrev = null;
    this.renderNext = null;
    this.isWorkingScroll = false;
    this.isWorkingRender = false;
    this.isWorkingTransform = false;
    this.isPaused = false;

    this.on();
  }
  async start() {
    // 動作用のフラグを一旦すべてオフ
    this.isWorkingScroll = false;
    this.isWorkingRender = false;
    this.isWorkingTransform = false;

    // スムーススクロールさせる対象のラッパーDOMを取得
    this.elm.contents = document.querySelector(`.${CLASSNAME_CONTENTS}`);

    // It returns Promise with setTimeout to get a scroll top value accurately when a hash is included.
    await new Promise((resolve) => {
      setTimeout(() => {
        // 初期スクロール値を取得する。(pjax遷移の際は不要)
        this.scrollTop = window.pageYOffset;
        this.resolution.x = window.innerWidth;
        this.resolution.y = window.innerHeight;

        // Hookes と ScrollItems を初期化
        this.initHookes();
        this.scrollItems.init();

        // hash があった場合は指定の箇所にスクロール位置を調整する
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

        // Scroll Manager の動作を開始する
        this.isWorkingScroll = true;
        this.isWorkingRender = true;
        this.isWorkingTransform = true;
        this.renderLoop();

        resolve();
      }, 100);
    });
    await this.resize();
    this.scroll();
    return;
  }
  pause() {
    // if it is paused, this methods doesn't run.
    if (this.isPaused === true) return;

    // スムーススクロールの一時停止
    this.isWorkingScroll = false;
    this.isPaused = true;

    // 一時停止時の位置を記憶
    this.scrollTopPause = this.scrollTop;
    window.scrollTo(0, this.scrollTop);
  }
  play() {
    // if it is not paused, this methods doesn't run.
    if (this.isPaused === false) return;

    // スムーススクロールの再生
    this.isWorkingScroll = true;
    this.isPaused = false;

    // 一時停止時の位置に移動（pause後に標準のスクロールがされても元の位置から動いていないように見せるため）
    this.scrollTop = this.scrollTopPause;
    window.scrollTo(0, this.scrollTop);
  }
  initDummyScroll() {
    // ダミースクロールの初期化
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      // PCの場合
      this.elm.contents.classList.add('is-fixed');
      this.elm.dummyScroll.style.height = `${this.elm.contents.clientHeight}px`;
    } else {
      // スマホの場合
      this.elm.contents.style.transform = '';
      this.elm.contents.classList.remove('is-fixed');
      this.elm.dummyScroll.style.height = `0`;
    }
    this.render();
  }
  initHookes() {
    // Hookesオブジェクトの初期化
    this.hookes = {
      contents: new Hookes({ k: 0.625, d: 0.8 }),
      smooth:   new Hookes({ k: 0.2, d: 0.7 }),
      parallax: new Hookes({ k: 0.28, d: 0.7 }),
      mouse:    new Hookes({ k: 0.625, d: 0.8 }),
    }
  }
  scrollBasis() {
    // 基礎的なスクロールイベントはここに記述する。

    // スクロール値を元に各Hookesオブジェクトを更新
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      this.hookes.contents.anchor[1] = this.scrollTop * -1;
      this.hookes.smooth.velocity[1] += this.scrollFrame;
      this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    }

    // ScrollItems のスクロールメソッドを実行
    this.scrollItems.scroll();
  }
  scroll(event) {
    // スクロールイベントの一連の流れ

    // フラグが立たない場合はスクロールイベント内の処理を実行しない。
    if (this.isWorkingScroll === false) return;

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
    this.scrollItems.resize(this.isValidSmooth());
  }
  async resize() {
    // リサイズイベントの一連の流れ

    // リサイズ中にスクロールイベントが勝手に叩かれるのをキャンセル
    this.isWorkingScroll = false;

    // リサイズイベントに関する要素の一時リセット
    if (this.resizeReset) this.resizeReset();

    // 各値を取得
    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = this.elm.contents.clientWidth;
    this.bodyResolution.y = this.elm.contents.clientHeight;

    // window幅によってHookesオブジェクトの値を再設定する
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      // PCの場合
      this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = -this.scrollTop;
      this.hookes.parallax.velocity[1] = this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    } else {
      // スマホの場合
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

    // 個別のリサイズイベントを実行（ページの高さ変更前）
    if (this.resizePrev) this.resizePrev();

    await new Promise((resolve) => {
      setTimeout(() => {
        // 本文やダミースクロールのレイアウトを再設定
        this.initDummyScroll();
        this.render();
        window.scrollTo(0, this.scrollTop);

        // 標準のリサイズイベントを実行
        this.resizeBasis();

        // 個別のリサイズイベントを実行（ページの高さ変更後）
        if (this.resizeNext) this.resizeNext();

        // スクロールイベントを再開（一時停止中は再開しない）
        if (this.isPaused === false) this.isWorkingScroll = true;

        resolve();
      }, 100);
    });

    return;
  }
  renderBasis() {
    // It is the basic rendering.

  }
  render() {
    // run before the basic rendering.
    if (this.renderPrev) this.renderPrev();

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

    // run the basic rendering.
    this.renderBasis();

    // run after the basic rendering.
    if (this.renderNext) this.renderNext();
  }
  renderLoop() {
    this.render();
    if (this.isWorkingRender) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
  }
  on() {
    // モバイルOSでは orientationchange でリサイズイベントを着火させる。
    // ステータスバーのtoggleでresizeは着火してしまうのを避ける目的。
    const hookEventForResize = (isiOS() || isAndroid()) ? 'orientationchange' : 'resize';

    // スクロール
    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);

    // リサイズ（debounceで連発を防ぐ）
    window.addEventListener(hookEventForResize, debounce((event) => {
      this.resize();
    }, 400), false);

    // マウス座標の取得
    window.addEventListener('mousemove', (event) => {
      if (this.isWorkingScroll === false) return;
      this.hookes.mouse.anchor[0] = event.clientX / this.resolution.x * 2.0 - 1.0;
      this.hookes.mouse.anchor[1] = -(event.clientY / this.resolution.y * 2.0 - 1.0);
    }, false);

    window.addEventListener('mouseout', () => {
      if (this.isWorkingScroll === false) return;
      this.hookes.mouse.anchor[0] = 0;
      this.hookes.mouse.anchor[1] = 0;
    }, false);
  }
  off() {
    // Reset all individual events.
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.renderPrev = null;
    this.renderNext = null;
  }
  isValidSmooth() {
    // Returns whether or not smooth scroll is valid.
    return this.isWorkingRender && this.resolution.x > this.X_SWITCH_SMOOTH;
  }
}
