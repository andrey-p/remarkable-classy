function isValidClassChar(code) {
  return (code >= 0x30 /* 0 */ && code <= 0x39 /* 9 */) ||
    (code >= 0x41 /* A */ && code <= 0x5A /* Z */) ||
    (code >= 0x61 /* a */ && code <= 0x7A /* z */) ||
    code === 0x5F /* _ */ ||
    code === 0x2D /* - */ ||
    code === 0x20 /*   <- space */;
}

var classy = function (md, options) {
  md.inline.ruler.push("classy", function (state, silent) {
    var pos = state.pos,
      posMax = state.posMax,
      classString = "";

    if (state.src.charCodeAt(pos) !== 0x7B /* { */) {
      console.log("no, opening char is not right");
      return false;
    }

    if (state.src.charCodeAt(posMax - 1) !== 0x7D /* } */) {
      return false;
    }

    // advance to account for opening brace
    pos += 1;

    while (pos < posMax - 1) {
      if (!isValidClassChar(state.src.charCodeAt(pos))) {
        return false;
      }

      classString += state.src.charAt(pos);
      pos += 1;
    }

    state.pos = posMax;

    state.push({
      type: "classy",
      level: state.level,
      content: classString
    });

    return true;
  });

  var paragraph_open = md.renderer.rules.paragraph_open;

  md.renderer.rules.paragraph_open = function (tokens, idx) {
    var classy, result, contents, lastToken;

    result = paragraph_open.apply(null, arguments).trim();

    // peer into contents and check if last element is "classy"
    contents = tokens[idx + 1].children;

    if (contents[contents.length - 1].type === "classy") {
      classy = contents.pop();
      result = result.replace("<p", "<p class=\"" + classy.content + "\"");

      lastToken = contents[contents.length - 1];
      if (lastToken.type === "softbreak") {
        // if the class was added via a newline,
        // there'll be a rampant \n left
        contents.pop();
      } else if (lastToken.type === "text") {
        // else there might be some whitespace to trim
        lastToken.content = lastToken.content.trim();
      }
    }

    return result;
  };
};

module.exports = classy;
