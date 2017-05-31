import MathEx from 'js-util/MathEx';

export default class ParallaxItem {
  constructor(elm) {
    this.elm = elm;
    this.elmIn = elm.getElementsByClassName('js-parallax-item-in')[0];
    this.dataset = this.elm.dataset;
    this.height = 0;
    this.top = 0;
    this.min = 0;
    this.max = 0;
    this.ratio = (this.dataset.parallaxRatio) ? this.dataset.parallaxRatio : 0.5;
    this.direction = (this.dataset.parallaxDirection) ? this.dataset.parallaxDirection : 1;
    this.fixed = (this.dataset.parallaxFixed) ? this.dataset.parallaxFixed : false;
  }
  init(scrollTop, resolution) {
    const rect = this.elm.getBoundingClientRect();
    this.height = rect.height;
    this.top = (this.fixed) ? 0 : scrollTop + rect.top;
    this.min = (this.dataset.parallaxMin) ? this.dataset.parallaxMin : -resolution.y;
    this.max = (this.dataset.parallaxMax) ? this.dataset.parallaxMax : resolution.y;
  }
  scroll(scrollTop) {
    this.elmIn.style.transform = `translate3D(0, ${
      MathEx.clamp(
        (scrollTop - this.top - this.height * 0.5) * this.ratio * this.direction,
        this.min, this.max
      )
    }px, 0)`;
  }
}
