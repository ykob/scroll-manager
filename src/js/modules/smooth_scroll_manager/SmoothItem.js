const MathEx = require('js-util/MathEx');

export default class SmoothItem {
  constructor(elm, scrollManager, hookes, opt) {
    this.scrollManager = scrollManager;
    this.hookes = hookes;
    this.elm = elm;
    this.height = 0;
    this.top = 0;
    this.rangeY = (opt && opt.rangeY) ? opt.rangeY : null;
    this.ratioY = (opt && opt.ratioY) ? opt.ratioY : 0.1;
    this.unitY = (opt && opt.unitY) ? opt.unitY : 'px';
  }
  init(scrollTop) {
    const rect = this.elm.getBoundingClientRect();
    this.height = rect.height;
    this.top = scrollTop + rect.top;
    this.elm.style.backfaceVisibility = 'hidden';
  }
  render(isWorking) {
    let x = 0;
    let y = 0;
    if (isWorking) {
      y = this.hookes.velocity[1] * this.ratioY;
      if (Math.abs(this.hookes.acceleration[1]) < 0.01) this.hookes.velocity[1] = this.hookes.anchor[1];
      if (this.rangeY) y = MathEx.clamp(y, -this.rangeY, this.rangeY);
    }
    this.elm.style.transform = `translate3D(0, ${y}${this.unitY}, 0)`;
  }
}
