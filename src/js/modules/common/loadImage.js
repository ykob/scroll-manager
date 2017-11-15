export default function(imageArray, callback) {
  const length = imageArray.length;
  let count = 0;

  for (var i = 0; i < length; i++) {
    const img = new Image();
    img.onload = () => {
      count++;
      if (count >= length) callback();
    };
    img.src = imageArray[i];
  }
}
