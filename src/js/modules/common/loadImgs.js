export default function(imgArr) {
  const length = imgArr.length;
  const ps = [];

  for (var i = 0; i < length; i++) {
    const index = i;
    ps[index] = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve();
      };
      img.onerror = () => {
        reject();
      };
      img.src = imgArr[index];
    });
  }

  return Promise.all(ps);
}
