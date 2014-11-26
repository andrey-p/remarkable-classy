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
  it("shouldn't interpret curly braces in the middle of a paragraph as a class string", function () {
    md.render("foo {bar} baz").should.containEql("<p>foo {bar} baz</p>");
  });
  it("should work with atx-style headings", function () {
    md.render("# foo {bar}\n\n baz").should.containEql("<h1 class=\"bar\">foo</h1>");
  });
  it("should work with setext-style headings", function () {
    md.render("foo {bar}\n====\n baz").should.containEql("<h1 class=\"bar\">foo</h1>");
  });
  it("should work with em and strong tags");
  it("should work with li tags and ul tags");
  it("should work with blockquotes");
});
