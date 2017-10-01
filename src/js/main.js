const pageId = document.querySelector('.l-page').getAttribute('data-page-id');

const init = () => {
  switch (pageId) {
    case 'index':
      require ('./init/index.js').default();
      break;
    case 'index2':
      require ('./init/index2.js').default();
      break;
    default:
  }
}
init();
