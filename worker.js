const { Engine } = require("@nguniversal/common/clover/server");
const path = require("path");
const fse = require("fs-extra");

const dist = path.join(__dirname, "dist");
const ssr = new Engine();

module.exports = (route) => {
  suppressWarnings("NODE_TLS_REJECT_UNAUTHORIZED");
  return render(ssr, route);
};

async function render(engine, url) {
  const dir = path.join(dist, new URL(url).pathname);
  const htmlFile = path.join(dir, "index.html");

  fse.ensureDirSync(dir);

  if (fse.existsSync(htmlFile)) {
    fse.removeSync(htmlFile);
  }

  const html = await engine.render({
    publicPath: dist,
    htmlFilename: "404.html",
    url,
  });

  return fse.writeFile(htmlFile, html).then(() => url);
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
