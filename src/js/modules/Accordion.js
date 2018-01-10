export default class Accordion {
  constructor(elm, scrollManager) {
    this.elm = elm;
    this.trigger = elm.querySelector('.js-accordion-trigger');
    this.body = elm.querySelector('.js-accordion-body');
    this.bodyIn = elm.querySelector('.js-accordion-body-in');
    this.scrollManager = scrollManager;
    this.on();
  }
  resize() {
    if (this.elm.classList.contains('is-opened')) {
      this.body.style.height = `${this.bodyIn.clientHeight}px`;
    }
  }
  on() {
    this.trigger.addEventListener('click', () => {
      if (this.elm.classList.contains('is-opened')) {
        this.elm.classList.remove('is-opened');
        this.body.style.height = `0`;
      } else {
        this.elm.classList.add('is-opened');
        this.body.style.height = `${this.bodyIn.clientHeight}px`;
      }
    });
    this.body.addEventListener('transitionend', () => {
      this.scrollManager.resize();
    });
  }
}
