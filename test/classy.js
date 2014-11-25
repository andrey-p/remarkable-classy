var should = require("should"),
  classy = require("../"),
  Remarkable = require("remarkable"),
  md;

describe("remarkable-classy", function () {
  before(function () {
    md = new Remarkable();
    md.use(classy);
  });
  it("should work with paragraphs", function () {
    md.render("foo\n{bar}").should.containEql("<p class=\"bar\">foo</p>");
  });
  it("should work with paragraphs if class is specified on the same line", function () {
    md.render("foo {bar}").should.containEql("<p class=\"bar\">foo</p>");
  });
});
