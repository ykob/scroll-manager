export default class Renderer {
  constructor(modules) {
    this.modules = modules;
    this.isWorking = false;
  }
  start() {
    this.isWorking = true;
    this.renderLoop();
  }
  stop() {
    this.isWorking = false;
  }
  renderLoop() {
    // write original render events here.
    this.modules.scrollManager.render();

    // if working flag is on, loop to run render events.
    if (this.isWorking === false) return;
    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
