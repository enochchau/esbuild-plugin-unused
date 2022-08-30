/**
 * Esbuild Plugin Unused
 * @param {import("./index").Options} opts
 * @returns {import('esbuild').Plugin}
 */
function plugin(opts) {
  const { src = "src/**/*" } = opts;
  return {
    name: "unused",
    async setup(build) {
      const path = require("path");
      const fg = require("fast-glob");

      let globbed = await fg(src);
      let resolvedFiles = globbed.map((file) => path.resolve(file));
      const files = new Set(resolvedFiles);

      build.onResolve({ filter: /.*/ }, async (args) => {
        files.delete(path.resolve(args.path));
      });

      build.onEnd(() => {
        console.log(`Found ${files.size} Unused Files`);
        for (const file of files) {
          console.log(`- ${file}`);
        }
      });
    },
  };
}

module.exports = plugin;
