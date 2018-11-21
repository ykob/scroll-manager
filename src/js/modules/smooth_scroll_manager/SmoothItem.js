import MathEx from 'js-util/MathEx';

export default class SmoothItem {
  constructor(elm, scrollManager, hookes, opt) {
    this.scrollManager = scrollManager;
    this.hookes = hookes;
    this.elm = elm;
    this.height = 0;
    this.top = 0;
    this.rangeX = (opt && opt.rangeX) ? opt.rangeX : null;
    this.ratioX = (opt && opt.ratioX) ? opt.ratioX : 0.0;
    this.unitX = (opt && opt.unitX) ? opt.unitX : 'px';
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
    if (isWorking === true) {
      x = this.hookes.velocity[1] * this.ratioX;
      y = this.hookes.velocity[1] * this.ratioY;
      if (this.rangeX) x = MathEx.clamp(x, -this.rangeX, this.rangeX);
      if (this.rangeY) y = MathEx.clamp(y, -this.rangeY, this.rangeY);
    }
    this.elm.style.transform = `translate3D(${x}${this.unitX}, ${y}${this.unitY}, 0)`;
  }
}
