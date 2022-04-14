# Demo Spartacus - SSR/Prerender with Clover Engine

This demo shows how a Spartacus app can be rendered with the new Clover Engine for Angular Universal.

## Quickstart

- Clone the repo.
- Install the dependencies: `yarn install --frozen-lockfile`
- Build the app: `yarn build`
- Serve with SSR: `yarn serve:ssr`
- ...or prerender: `yarn prerender`
- ...and serve the static files: `yarn serve:prerender`
- You may see the result at [http://localhost:8080](http://localhost:8080).

## How it works

- _index.html_ is renamed as _404.html_ because:
  - We can then prerender an index.html without overwriting the original.
  - We will serve the prerendered app with `http-server` and _404.html_ is the default fallback.
- _angular.json_ is modified to use _404.html_ as index.
- The only changes to the application code is in the `AppModule`.
  - Clover does not need the `AppServerModule` or two separate transfer state modules.
  - The static `withServerTransition` method of the `BrowserModule` is called, but no transfer state modules are imported.
  - The `RendererModule` patches `SharedStylesHost` and `DomSharedStylesHost` injectables which are used by Angular for inlining styles. It also helps the engine transfer the state.
  - The `TransferHttpCacheModule` provides an interceptor that returns cached responses to requests, if they exist in the transferred state.
- _server.js_ is a very simple Express server which renders the requested views using the Clover engine.
- _prerender.js_ uses a worker thread pool to distribute a given list of routes to workers. For this demo, _routes.txt_ is used as the source for this list.
- _worker.js_ renders view for a given route with the Clover engine and writes the result in an HTML file.

## Notes

To make this work, two packages are patched:

- `jsdom`: Clover uses JSDOM to render the views and HTTP requests happen through its helpers. However, unlike Node.js, you cannot force JSDOM to ignore self-signed certificates and it throws an error. The patch changes request options to ignore them. This is for demo purposes only and not recommended in production.
- `critters`: Clover uses Critters to inline critical CSS, but Critters cannot recognize one of the pseudo selectors and logs a warning about 1 rule being ignored. The patch stops these warnings. Again, this is just for the demo and not recommended in production.
