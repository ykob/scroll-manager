/**
* Preload images with Promise.all()
*/

const loadImg = (target) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(true, img);
    };
    img.onerror = () => {
      reject(false);
    };
    img.src = target;
  });
}

export default function(targets) {
  return Promise.all(targets.map((target) => {
    return loadImg(target);
  }));
}
