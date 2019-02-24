import ScrollItem from './ScrollItem';

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
        // The top of a range to judge that the element is view in a window or not.
        this.scrollManager.scrollTop + this.scrollManager.resolution.y * 0.9,
        // The bottom of a range to judge that the element is view in a window or not.
        this.scrollManager.scrollTop + this.scrollManager.resolution.y * 0.1
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
