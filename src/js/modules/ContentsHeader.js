const MathEx = require('js-util/MathEx');

export default class ContentsHeaderBg {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.bg = document.querySelector('.p-contents-header-bg');
  }
  scroll() {
    if (this.scrollManager.scrollTop > this.scrollManager.resolution.y * 2) {
      if (!this.bg.classList.contains('is-hidden')) this.bg.classList.add('is-hidden');
    } else {
      if (this.bg.classList.contains('is-hidden')) this.bg.classList.remove('is-hidden');
    }
  }
  render() {
    var v = this.scrollManager.hookes.contents.velocity[1] / this.scrollManager.resolution.y * -0.5 + 1;
    v = MathEx.clamp(v, 1, 2)
    this.bg.style.transform = `scale(${v})`;
  }
}
