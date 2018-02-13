const loadImgs = require('./loadImgs').default;

export default function(contents, callback) {
  const imgs = contents.querySelectorAll('img');

  if (imgs.length > 0) {
    const imgArr = [];
    for (var i = 0; i < imgs.length; i++) {
      imgArr[i] = imgs[i].src;
    }
    loadImgs(imgArr, callback);
  } else {
    callback();
  }
}
