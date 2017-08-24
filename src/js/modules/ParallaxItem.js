import MathEx from 'js-util/MathEx';

export default class ParallaxItem {
  constructor(elm, scrollManager) {
    this.scrollManager = scrollManager;
    this.elm = elm;
    this.height = 0;
    this.top = 0;
    this.max = (elm.dataset.max) ? elm.dataset.max : 10;
    this.min = (elm.dataset.min) ? elm.dataset.min : -10;
    this.ratio = (elm.dataset.ratio) ? elm.dataset.ratio : 10;
  }
  init(scrollTop) {
    const rect = this.elm.getBoundingClientRect();
    this.height = rect.height;
    this.top = scrollTop + rect.top;
  }
  render(iwWorking) {
    const y = (iwWorking) ? MathEx.clamp(
      ((this.scrollManager.hookes.forParallax.velocity[1] + this.scrollManager.resolution.y * 0.5)
       - (this.top + this.height * 0.5)) / this.scrollManager.resolution.y * this.ratio,
      this.min, this.max
    ) : 0;
    this.elm.style.transform = `translate3D(0, ${y}%, 0)`;
  }
}
