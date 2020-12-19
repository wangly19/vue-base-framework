
const compiler = require('vue-template-compiler')

exports.handlers = {
  beforeParse: function (e) {
    if (/\.vue$/.test(e.filename)) {
      var output = compiler.parseComponent(e.source)
      console.log(output.script)
      e.source = output.script ? output.script.content : ''
    }
  }
}
