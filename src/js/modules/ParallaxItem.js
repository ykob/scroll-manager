import MathEx from 'js-util/MathEx';

export default class ParallaxItem {
  constructor(elm, scrollManager) {
    this.scrollManager = scrollManager;
    this.elm = elm;
    this.height = 0;
    this.top = 0;

    this.init();
  }
  init() {
    const rect = this.elm.getBoundingClientRect();
    this.height = rect.height;
    this.top = this.scrollManager.scrollTop + rect.top;
  }
  render() {
    this.elm.style.transform = `translate3D(0, ${
      MathEx.clamp(
        ((this.scrollManager.hookesForParallax.velocity[1] + this.scrollManager.resolution.y * 0.5)
         - (this.top + this.height * 0.5)) / this.scrollManager.resolution.y * 15,
        -10, 10
      )
    }%, 0)`;
  }
}
