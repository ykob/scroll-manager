import * as glMatrix from 'gl-matrix';
import Force3 from '../common/Force3';

export default class Hookes {
  constructor(opt) {
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.k = (opt && opt.k !== undefined) ? opt.k : 0.3;
    this.d = (opt && opt.d !== undefined) ? opt.d : 0.7;
    this.m = (opt && opt.m !== undefined) ? opt.m : 1;
  }
  render() {
    Force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, this.k);
    Force3.applyDrag(this.acceleration, this.d);
    Force3.updateVelocity(this.velocity, this.acceleration, this.m);

    const sub = [0, 0, 0];
    glMatrix.vec3.sub(sub, this.anchor, this.velocity);
    if (glMatrix.vec3.length(this.acceleration) < 0.01 && glMatrix.vec3.length(sub) < 0.01) {
      this.acceleration = [0, 0, 0];
      this.velocity[1] = this.anchor[1];
    }
  }
}
