import Force3 from './Force3';

export default class Hookes {
  constructor(elm, opt) {
    this.elm = elm;
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.k = (opt && opt.k !== undefined) ? opt.k : 0.3;
    this.d = (opt && opt.d !== undefined) ? opt.d : 0.8;
    this.m = (opt && opt.m !== undefined) ? opt.m : 1;
    this.unit = (opt && opt.unit !== undefined) ? opt.unit : 'px';
    this.min = (opt && opt.min !== undefined) ? opt.min : undefined;
    this.max = (opt && opt.max !== undefined) ? opt.max : undefined;
  }
  render() {
    Force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, this.k);
    Force3.applyDrag(this.acceleration, this.d);
    Force3.updateVelocity(this.velocity, this.acceleration, this.m);
    if (this.elm === null) return;
    for (var i = 0; i < this.elm.length; i++) {
      var v = this.velocity[1];
      if (Math.abs(v) < 0.001) v = 0;
      if (this.min) v = Math.max(v, this.min);
      if (this.max) v = Math.min(v, this.max);
      this.elm[i].style.transform = `translate3D(0, ${v}${this.unit}, 0)`;
    }
  }
}
