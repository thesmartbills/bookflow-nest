const tsJest = require('ts-jest').default;

const transformer = tsJest.createTransformer({
  tsconfig: {
    module: 'commonjs',
    moduleResolution: 'node',
    resolvePackageJsonExports: false,
    allowJs: true,
  },
});

module.exports = {
  ...transformer,
  getCacheKey(sourceText, sourcePath, options) {
    return transformer.getCacheKey(sourceText, sourcePath, options) + '-esm2';
  },
  process(sourceText, sourcePath, options) {
    const patched = sourceText.includes('import.meta.')
      ? sourceText
          .replace(
            /import\.meta\.url/g,
            "require('node:url').pathToFileURL(__filename).href",
          )
          .replace(/import\.meta\.dirname/g, '__dirname')
          .replace(/import\.meta\.filename/g, '__filename')
      : sourceText;
    return transformer.process(patched, sourcePath, options);
  },
};
