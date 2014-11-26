"use strict";

var classy,
  renderersToReplace = [
    { tagName: "p", methodName: "paragraph_open" },
    { tagName: "h\\d", methodName: "heading_open" }
  ],
  replacedMethods = {};

function isValidClassChar(code) {
  return (code >= 0x30 && code <= 0x39) || // 0-9
    (code >= 0x41 && code <= 0x5A) || // A-Z
    (code >= 0x61 && code <= 0x7A) || // a-z
    code === 0x5F || // _
    code === 0x2D || // -
    code === 0x20; //   <- space
}

function parse(state) {
  var pos = state.pos,
    posMax = state.posMax,
    classString = "";

  if (state.src.charCodeAt(pos) !== 0x7B) { // {
    return false;
  }

  if (state.src.charCodeAt(posMax - 1) !== 0x7D) { // }
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
}

// replace all rules that we want to enable classy on
function replaceRenderer(md, tagName, methodName) {
  replacedMethods[methodName] = md.renderer.rules[methodName];

  md.renderer.rules[methodName] = function (tokens, idx) {
    var classy, result, contents, lastToken;

    // first get the result as per the original method we replaced
    result = replacedMethods[methodName].apply(null, arguments).trim();

    // peer into contents and check if last element is "classy"
    contents = tokens[idx + 1].children;

    if (contents[contents.length - 1].type === "classy") {
      // if yes, add the class(es) to the tag
      classy = contents.pop();
      result = result.replace(new RegExp("<" + tagName), "$& class=\"" + classy.content + "\"");

      // might be some cleaning up to do...
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
}

classy = function (md) {
  md.inline.ruler.push("classy", parse);

  renderersToReplace.forEach(function (renderer) {
    replaceRenderer(md, renderer.tagName, renderer.methodName);
  });
};

module.exports = classy;
