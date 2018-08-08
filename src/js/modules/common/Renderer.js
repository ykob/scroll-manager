export default class Renderer {
  constructor() {
    this.isWorking = false;

    this.renderPrev = null;
    this.render = null;
    this.renderNext = null;
  }
  start() {
    this.isWorking = true;
    this.renderLoop();
  }
  stop() {
    this.isWorking = false;
  }
  off() {
    this.renderPrev = null;
    this.renderNext = null;
  }
  renderLoop() {
    if (this.renderPrev) this.renderPrev();
    if (this.render) this.render();
    if (this.renderNext) this.renderNext();

    // if working flag is on, loop to run render events.
    if (this.isWorking === false) return;
    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
