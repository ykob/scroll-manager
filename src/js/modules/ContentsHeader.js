import MathEx from 'js-util/MathEx';

export default class ContentsHeaderBg {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.bg = document.querySelector('.p-contents-header-bg');
  }
  render() {
    var v = this.scrollManager.hookesContents.velocity[1] * -0.0005 + 1;
    v = MathEx.clamp(v, 1, 2)
    this.bg.style.transform = `scale(${v})`;
  }
}
