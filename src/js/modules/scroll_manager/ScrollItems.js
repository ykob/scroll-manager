import ScrollItem from './ScrollItem';

export default class ScrollItems {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.scrollItems = [];
  }
  init(wrap) {
    this.scrollItems = [...wrap.querySelectorAll('.js-scroll-item')].map(o => {
      return new ScrollItem(o, this.scrollManager);
    });
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
