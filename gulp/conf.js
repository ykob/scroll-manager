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
  src: [
    `./${DIR.SRC}/**/*.js`,
  ],
  dest: {
    development: `./${DIR.DEST}/js/`,
    production: `./${DIR.BUILD}/js/`,
  },
  webpack: {
    entry: `./${DIR.SRC}/js/main.js`,
    output: {
      filename: `main.js`
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
        }
      ]
    }
  },
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
    'Android >= 5',
    'ios_saf >= 10',
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
