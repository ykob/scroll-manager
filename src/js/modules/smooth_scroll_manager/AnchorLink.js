export default class AnchorLink {
  constructor(elm, scrollManager) {
    this.scrollManager = scrollManager;
    this.elm = elm;
    this.on();
  }
  move() {
    const hash = this.elm.getAttribute('href');
    const target = document.querySelector(hash);
    const targetRect = target.getBoundingClientRect();
    const anchorY = this.scrollManager.scrollTop + targetRect.top;
    window.scrollTo(0, anchorY);
  }
  on() {
    this.elm.addEventListener('click', (event) => {
      event.preventDefault();
      this.move();
    });
  }
}
