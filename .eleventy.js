const svgContents = require("eleventy-plugin-svg-contents");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('src/favicon.png');
  eleventyConfig.addPassthroughCopy('src/scripts');
  eleventyConfig.addPassthroughCopy('src/styles');

  eleventyConfig.addPlugin(svgContents);

  eleventyConfig.addFilter("longDate", (date) => {
    return new Date(date).toDateString();
  });
  
  return {
    dir: {
        input: 'src',
        output: '_site',
        includes: '_includes',
    },

    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: "njk"
  };
}