import loadImgs from './loadImgs';

export default async function(contents, addImgs = []) {
  return loadImgs([
    ...[...contents.querySelectorAll('img')].map(img => {
      return img.src;
    }),
    ...addImgs,
  ]);
}
