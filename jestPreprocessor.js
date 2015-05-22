var babel = require('babel-jest')

module.exports = {
  process: function (src, filename) {
    if (filename.match(/\.css$/)) {
      // jest will choke on css files otherwise
      return ''
    } else {
      return babel.process(src, filename)
    }
  }
};

