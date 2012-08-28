#!/usr/bin/env node
// Generated by CoffeeScript 1.3.3
(function() {
  var args, global, pimatch;

  global = (function() {
    return this;
  })();

  pimatch = /\{\{\{?([\w\W]*?)\}\}\}?/g;

  exports.compile = function(source) {
    return require('coffee-script')["eval"](exports.parse(source));
  };

  exports.parse = function(source) {
    var array, dent, escape, fixIndent, getIndent, indent, lastIndex, match, pi, push, template, writeText;
    array = [];
    indent = 1;
    getIndent = function() {
      var i, value, _i;
      value = "";
      for (i = _i = 0; 0 <= indent ? _i < indent : _i > indent; i = 0 <= indent ? ++_i : --_i) {
        value += '\t';
      }
      return value;
    };
    push = function(text, dent) {
      if (dent == null) {
        dent = 0;
      }
      array.push(getIndent());
      array.push(text, '\n');
      return indent += dent;
    };
    lastIndex = 0;
    writeText = function(match) {
      var text, _ref;
      text = source.substring(lastIndex, (_ref = match != null ? match.index : void 0) != null ? _ref : source.length);
      lastIndex = pimatch.lastIndex;
      return push("write " + (JSON.stringify(text)));
    };
    fixIndent = function(pi, match) {
      var currentIndent, index, line, lineIndent, lines, smallest, _i, _len, _ref;
      smallest = Number.MAX_VALUE;
      lines = pi.split(/\r\n|\r|\n/);
      for (index = _i = 0, _len = lines.length; _i < _len; index = ++_i) {
        line = lines[index];
        if (!(line.trim().length > 0)) {
          continue;
        }
        if (index === 0) {
          throw new Error("Multiline script cannot start on same line as opening brace:\n" + match[0]);
        }
        lineIndent = (_ref = line.match(/^\s*/)) != null ? _ref[0].length : void 0;
        if (lineIndent != null) {
          smallest = Math.min(smallest, lineIndent);
        }
      }
      currentIndent = getIndent();
      return lines.map(function(x) {
        return currentIndent + x.substring(smallest);
      }).join('\n');
    };
    while (match = pimatch.exec(source)) {
      writeText(match);
      pi = match[1];
      dent = 0;
      if (/^\s*(else|catch)\b\s*([\w\W]+)/.test(pi)) {
        indent--;
        dent = 1;
        pi = pi.trim();
      } else if (/^\s*(if|for|while|unless|try)\s*([\w\W]+)/.test(pi)) {
        dent = 1;
        pi = pi.trim();
      } else if (/^\s*end\s*$/.test(pi)) {
        indent--;
        pi = null;
      } else if (!/\r|\n/.test(pi)) {
        escape = match[0].substring(0, 3) !== '{{{';
        pi = "write (" + pi + "), " + escape;
      } else {
        pi = fixIndent(pi, match);
      }
      if (pi != null) {
        push(pi, dent);
      }
    }
    writeText(match);
    source = array.join('');
    template = "template = (write) ->\n" + source + "\n	return\n\n(context, write) ->\n	buffer = null\n	if not write\n		buffer = []\n		write = (text) -> buffer.push text if text?\n	template.call context, write\n	buffer?.join ''";
    return template;
  };

  if (require.main === module) {
    args = process.argv.slice(2);
    if (args.length === 0) {
      console.log("Usage: coffeebars template");
    } else {
      console.log(exports.parse(require('fs').readFileSync(args[0], 'utf8')));
    }
  }

}).call(this);
