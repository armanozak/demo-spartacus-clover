const express = require("express");
const { Engine } = require("@nguniversal/common/clover/server");
const path = require("path");
const url = require("url");

const PORT = 8080;
const DIST = path.join(__dirname, "dist");

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
      htmlFilename: "404.html",
      url: url.format({
        protocol: req.protocol,
        host: `localhost:${PORT}`,
        pathname: req.path,
        query: req.query,
      }),
      headers: req.headers,
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
