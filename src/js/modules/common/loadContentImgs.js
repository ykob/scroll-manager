import loadImgs from './loadImgs';

export default async function(contents, addImgs = []) {
  const imgs = contents.querySelectorAll('img');
  const imgArr = [];

  for (var i = 0; i < imgs.length; i++) {
    imgArr[i] = imgs[i].src;
  }
  for (var j = 0; j < addImgs.length; j++) {
    imgArr.push(addImgs[j]);
  }
  return loadImgs(imgArr);
}
