const loadImage = require('./loadImage').default;

export default function(callback) {
  const imgs = document.querySelectorAll('img');

  if (imgs.length > 0) {
    const imgArray = [];
    for (var i = 0; i < imgs.length; i++) {
      imgArray[i] = imgs[i].src;
    }
    loadImage(imgArray, callback);
  } else {
    callback();
  }
}
