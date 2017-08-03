import Force3 from './Force3';

export default class Hookes {
  constructor(k = 0.02, d = 0.3, m = 1) {
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.k = k;
    this.d = d;
    this.m = m;
  }
  render() {
    Force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, this.k);
    Force3.applyDrag(this.acceleration, this.d);
    Force3.updateVelocity(this.velocity, this.acceleration, this.m);
  }
}
