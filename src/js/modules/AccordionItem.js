export default class AccordionItem {
  constructor(elm, scrollManager) {
    this.elm = elm;
    this.head = elm.querySelector('.c-accordion-item__head');
    this.body = elm.querySelector('.c-accordion-item__body');
    this.bodyIn = elm.querySelector('.c-accordion-item__body-in');
    this.scrollManager = scrollManager;
    this.isAnimate = false;
    this.on();
  }
  on() {
    this.head.addEventListener('click', () => {
      if (this.isAnimate) return;
      this.isAnimate = true;
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
      this.isAnimate = false;
    });
  }
}
