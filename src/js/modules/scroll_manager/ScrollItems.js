const ScrollItem = require('./ScrollItem').default;

export default class ScrollItems {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.scrollItems = [];
  }
  init(wrap) {
    const elmScrollItems = wrap.querySelectorAll('.js-scroll-item');

    this.scrollItems = [];

    for (var i = 0; i < elmScrollItems.length; i++) {
      this.scrollItems[i] = new ScrollItem(
        elmScrollItems[i], this.scrollManager
      );
    }
  }
  scroll() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(
        this.scrollManager.scrollTop + this.scrollManager.resolution.y,
        this.scrollManager.scrollTop
      );
    }
  }
  resize() {
    const scrollTop = window.pageYOffset;
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].init(scrollTop);
    }
  }
}
