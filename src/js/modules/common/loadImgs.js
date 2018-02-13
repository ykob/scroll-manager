export default function(imgArr, callback) {
  const length = imgArr.length;
  const loadedImgArr = [];
  let count = 0;

  for (var i = 0; i < length; i++) {
    const index = i;
    const img = new Image();
    img.onload = () => {
      loadedImgArr[index] = img;
      count++;
      if (count >= length) callback(loadedImgArr);
    };
    img.onerror = () => {
      console.error(`Failed to load image in loadImgs function.`)
      count++;
      if (count >= length) callback(loadedImgArr);
    };
    img.src = imgArr[index];
  }
}
