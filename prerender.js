const path = require("path");
const fs = require("fs-extra");
const Piscina = require("piscina");

const piscina = new Piscina({
  filename: path.resolve(__dirname, "worker.js"),
});

/**
 * This is just a demo.
 * In an actual implementation, you would probably want to:
 * - Get options from external source.
 *    - Command line
 *    - Environment variables
 *    - HTTP request
 *    - ...
 * - Create a custom Angular builder (instead of this script).
 * - Discover routes in another way
 *    - Get a list from a remote endpoint.
 *    - Expose a hook.
 *    - Communicate with another app through sockets.
 *    - Crawl the app.
 *    - ...
 * - Use a cache to avoid re-rendering the same route.
 * - Use a priority queue.
 * - Handle backpressure.
 * - Apply an abort strategy.
 * - Handle errors gracefully.
 * - Enable plugins.
 *    - Modify the rendered output.
 *    - Add optimizations.
 *    - Create a robots.txt file.
 *    - ...
 */
const DIST = path.join(__dirname, "dist");
const HTML_FILENAME = "404.html";

function render() {
  const routeFile = fs.readFileSync(path.join("routes.txt"), "utf8");
  const routes = routeFile.trim().split(/\r?\n/);
  routes.map((route) =>
    piscina
      .run({ route, dist: DIST, htmlFilename: HTML_FILENAME })
      .then(console.log)
  );
}

render();
