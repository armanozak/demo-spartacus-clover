const express = require("express");
const { Engine } = require("@nguniversal/common/clover/server");
const path = require("path");
const url = require("url");

/**
 * This is just a demo.
 * In an actual implementation, we would get some options from an external source.
 */
const DIST = path.join(__dirname, "dist");
const PORT = 8080;
const HOST = `localhost:${PORT}`;
const HTML_FILENAME = "404.html";

const app = express();

app.set("views", DIST);

app.get(
  "*.*",
  express.static(DIST, {
    maxAge: "1y",
    fallthrough: false,
  })
);

const ssr = new Engine();
app.get("*", (req, res, next) => {
  ssr
    .render({
      publicPath: DIST,
      htmlFilename: HTML_FILENAME,
      url: url.format({
        protocol: req.protocol,
        host: HOST,
        pathname: req.path,
        query: req.query,
      }),
      headers: req.headers,
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

app.listen(PORT, () => {
  console.log(`Node Express server listening on ${HOST}`);
});
