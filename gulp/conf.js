// 設定ファイル
// 対象パスやオプションを指定

const DOMAIN = module.exports.DOMAIN = 'http://ykob.github.io';
const DIR = module.exports.DIR =  {
  PATH: '/scroll-manager',
  SRC: 'src',
  DEST: 'dst',
  BUILD: 'docs'
};

module.exports.serve = {
  dest: {
    //tunnel: 'test',
    notify: false,
    startPath: `${DIR.PATH}/`,
    ghostMode: false,
    server: {
      baseDir: DIR.DEST,
      index: 'index.html',
      routes: {
        [DIR.PATH]: `${DIR.DEST}/`
      }
    }
  },
  build: {
    //tunnel: 'test',
    notify: false,
    startPath: `${DIR.PATH}/`,
    ghostMode: false,
    server: {
      baseDir: DIR.BUILD,
      index: 'index.html',
      routes: {
        [DIR.PATH]: `${DIR.BUILD}/`
      }
    }
  }
};

module.exports.scripts = {
  common: '',
  entryFiles: [
    `./${DIR.SRC}/js/main.js`,
  ],
  browserifyOpts: {
    transform: [
      ['babelify', {
        babelrc: false,
        presets: [
          ['env', {
            targets: {
              browsers: ['last 2 versions', 'ie >= 11']
            }
          }]
        ]
      }],
      'envify'
    ]
  },
  dest: `${DIR.DEST}/js`
};

module.exports.pug = {
  src: [
    `${DIR.SRC}/**/*.pug`,
    `!${DIR.SRC}/**/_**/*.pug`,
    `!${DIR.SRC}/**/_*.pug`
  ],
  dest: `${DIR.DEST}`,
  opts: {
    pretty: true
  },
  json: `${DIR.SRC}/data.json`,
  domain: `${DOMAIN}`,
  path: `${DIR.PATH}`,
};

module.exports.sass = {
  src: [
    `${DIR.SRC}/**/*.{sass,scss}`,
    `!${DIR.SRC}/**/_**/*.{sass,scss}`,
    `!${DIR.SRC}/**/_*.{sass,scss}`
  ],
  dest: `${DIR.DEST}/css`,
  browsers: [
    'last 2 versions',
    'ie >= 11',
    'Android >= 4',
    'ios_saf >= 9',
  ]
};

module.exports.replace = {
  html: {
    src: [
      `${DIR.DEST}/**/*.html`
    ],
    dest: `${DIR.BUILD}`,
    path: `${DIR.PATH}`
  }
};

module.exports.cleanCss = {
  src: `${DIR.DEST}/css/main.css`,
  dest: `${DIR.BUILD}/css`
};

module.exports.uglify = {
  src: [
    `./${DIR.DEST}/js/vendor.js`,
    `./${DIR.DEST}/js/main.js`,
  ],
  dest: `${DIR.BUILD}/js`,
  opts: {
  }
};

module.exports.copy = {
  dest: {
    src: [
      `${DIR.SRC}/img/**/*.*`,
      `${DIR.SRC}/font/**/*.*`,
    ],
    dest: `${DIR.DEST}`,
    opts: {
      base: `${DIR.SRC}`
    }
  },
  build: {
    src: [
      `${DIR.DEST}/img/**/*.ico`,
      `${DIR.DEST}/font/**/*.*`,
    ],
    dest: `${DIR.BUILD}`,
    opts: {
      base: `${DIR.DEST}`
    }
  }
};

module.exports.imagemin = {
  src: [
    `${DIR.DEST}/**/*.{jpg,jpeg,png,gif,svg}`
  ],
  dest: `${DIR.BUILD}/img`
};

module.exports.clean = {
  dest: {
    path: [`${DIR.DEST}`]
  },
  build: {
    path: [`${DIR.BUILD}`]
  }
};
