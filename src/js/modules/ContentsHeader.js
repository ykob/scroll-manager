const MathEx = require('js-util/MathEx');

export default class ContentsHeaderBg {
  constructor() {
    this.modules = null;
    this.bg = document.querySelector('.p-contents-header-bg');
  }
  scroll() {
    if (this.modules.scrollManager.scrollTop > this.modules.scrollManager.resolution.y * 2) {
      if (!this.bg.classList.contains('is-hidden')) this.bg.classList.add('is-hidden');
    } else {
      if (this.bg.classList.contains('is-hidden')) this.bg.classList.remove('is-hidden');
    }
  }
  render() {
    var v = this.modules.scrollManager.hookes.contents.velocity[1] / this.modules.scrollManager.resolution.y * -0.5 + 1;
    v = MathEx.clamp(v, 1, 2)
    this.bg.style.transform = `scale(${v})`;
  }
}
