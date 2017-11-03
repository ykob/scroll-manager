const MathEx = require('js-util/MathEx');

export default class ParallaxItem {
  constructor(elm, scrollManager, hookes, opt) {
    this.scrollManager = scrollManager;
    this.hookes = hookes;
    this.elm = elm;
    this.height = 0;
    this.top = 0;
    this.maxX = (opt && opt.maxX) ? opt.maxX : 10000;
    this.minX = (opt && opt.minX) ? opt.minX : -10000;
    this.ratioX = (opt && opt.ratioX) ? opt.ratioX : 0;
    this.unitX = (opt && opt.unitX) ? opt.unitX : 'px';
    this.maxY = (opt && opt.maxY) ? opt.maxY : 10;
    this.minY = (opt && opt.minY) ? opt.minY : -10;
    this.ratioY = (opt && opt.ratioY) ? opt.ratioY : 0.012;
    this.unitY = (opt && opt.unitY) ? opt.unitY : '%';
  }
  init(scrollTop) {
    const rect = this.elm.getBoundingClientRect();
    this.height = rect.height;
    this.top = scrollTop + rect.top;
    this.elm.style.backfaceVisibility = 'hidden';
  }
  render(iwWorking) {
    const x = (iwWorking) ? MathEx.clamp(
      this.hookes.velocity[0] * this.ratioX,
      this.minX,
      this.maxX
    ) : 0;
    const y = (iwWorking) ? MathEx.clamp(
      (this.hookes.velocity[1] - (this.top + this.height * 0.5)) * this.ratioY,
      this.minY,
      this.maxY
    ) : 0;
    this.elm.style.transform = `translate3D(${x}${this.unitX}, ${y}${this.unitY}, 0)`;
  }
}
