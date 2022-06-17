const { Engine } = require("@nguniversal/common/clover/server");
const path = require("path");
const fse = require("fs-extra");

const ssr = new Engine();

module.exports = (options) => {
  suppressWarnings("NODE_TLS_REJECT_UNAUTHORIZED");
  return render(ssr, options);
};

async function render(engine, { route, dist, htmlFilename }) {
  const dir = path.join(dist, new URL(route).pathname);
  const htmlFile = path.join(dir, "index.html");

  fse.ensureDirSync(dir);

  if (fse.existsSync(htmlFile)) {
    fse.removeSync(htmlFile);
  }

  const html = await engine.render({
    publicPath: dist,
    url: route,
    htmlFilename,
  });

  return fse.writeFile(htmlFile, html).then(() => route);
}

function suppressWarnings(...suppressed) {
  const originalEmitWarning = process.emitWarning;

  process.emitWarning = (warning, ...args) => {
    if (
      typeof warning === "string" &&
      suppressed.some((text) => warning.includes(text))
    ) {
      return;
    }

    return originalEmitWarning.call(process, warning, ...args);
  };
}
