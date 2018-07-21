export default class Renderer {
  constructor(modules) {
    this.modules = modules;
    this.isWorking = false;

    this.renderPrev = null;
    this.renderNext = null;
  }
  start() {
    this.isWorking = true;
    this.renderLoop();
  }
  stop() {
    this.isWorking = false;
  }
  render() {
    if (this.renderPrev) this.renderPrev();

    // write original render events here.
    this.modules.scrollManager.render();
    this.modules.contentsHeader.render();

    if (this.renderNext) this.renderNext();
  }
  renderLoop() {
    this.render();

    // if working flag is on, loop to run render events.
    if (this.isWorking === false) return;
    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
