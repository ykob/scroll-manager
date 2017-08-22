import MathEx from 'js-util/MathEx';

export default class ParallaxItem {
  constructor(elm, scrollManager) {
    this.scrollManager = scrollManager;
    this.elm = elm;
    this.height = 0;
    this.top = 0;
  }
  init() {
    const rect = this.elm.getBoundingClientRect();
    this.height = rect.height;
    this.top = this.scrollManager.scrollTop + rect.top;
  }
  render() {
    this.elm.style.transform = `translate3D(0, ${
      MathEx.clamp(
        ((this.scrollManager.hookes.forParallax.velocity[1] + this.scrollManager.resolution.y * 0.5)
         - (this.top + this.height * 0.5)) / this.scrollManager.resolution.y * 10,
        -10, 10
      )
    }%, 0)`;
  }
}
