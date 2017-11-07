var easeExponentialInOut = function(t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

module.exports = function() {
  var self = this;
  this.scrollTopBefore = 0;
  this.scrollTopAfter = 0;
  this.timeClick = 0;
  this.isScrolling = false;
  this.duration = 0;

  this.render = function() {
    var time = Date.now() - self.timeClick;
    window.scrollTo(0, self.scrollTopBefore + (self.scrollTopAfter - self.scrollTopBefore) * Math.min(easeExponentialInOut(time / self.duration, 1)));
    if (time < self.duration) {
      requestAnimationFrame(self.render);
    } else {
      self.isScrolling = false;
    }
  }
  this.start = function(anchorY, duration) {
    if (self.isScrolling) return;
    this.duration = (duration) ? duration : 1000;
    self.timeClick = Date.now();
    self.isScrolling = true;
    self.scrollTopBefore = window.pageYOffset;
    self.scrollTopAfter = anchorY;
    self.render();
  }
}
