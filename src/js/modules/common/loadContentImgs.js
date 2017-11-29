const loadImage = require('./loadImage').default;

export default function(callback) {
  const imgs = document.querySelectorAll('img');

  if (imgs.length > 0) {
    const imgArr = [];
    for (var i = 0; i < imgs.length; i++) {
      imgArr[i] = imgs[i].src;
    }
    loadImage(imgArr, callback);
  } else {
    callback();
  }
}
