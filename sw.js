const staticCache = "static-cache";
const dynamicCache = "dynamic-cache";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/materialize.min.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "/pages/fallback.html",
];
const limitNumCache = (cacheName, number) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > number) {
        cache.delete(keys[0]).then(limitNumCache(cacheName, number));
      }
    });
  });
};
// Install process
self.addEventListener("install", (e) => {
  /* console.log("sw is installed"); */
  // Cache
  caches.open(staticCache).then((cache) => {
    cache.addAll(assets);
  });
});

// Activate process
self.addEventListener("activate", (e) => {
  console.log("sw is activated");
});

self.addEventListener("fetch", (e) => {
  if (e.request.url.indexOf("firestore.googleapis.com") === -1) {
    /* console.log("sw fetch event", e); */
    //cache
    e.respondWith(
      caches
        .match(e.request)
        .then((staticRes) => {
          return (
            staticRes ||
            fetch(e.request).then((dynamicRes) => {
              // ima problem sa imenom cache-a
              return caches.open(dynamicCache).then((cache) => {
                cache.put(e.request.url, dynamicRes.clone());
                limitNumCache(dynamicCache, 3);
                return dynamicRes;
              });
            })
          );
        })
        .catch(() => caches.match("/pages/fallback.html"))
    );
  }
});

/*
self.addEventListener("fetch", (event) => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method != "GET") {
    console.log("one");
    return;
  }

  // Prevent the default, and handle the request ourselves.
  event.respondWith(
    (async function () {
      // Try to get the response from a cache.
      const cache = await caches.open("dynamic-v1");
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        // If we found a match in the cache, return it, but also
        // update the entry in the cache in the background.
        event.waitUntil(cache.add(event.request));
        console.log("two");
        return cachedResponse;
      }
      console.log("three");
      // If we didn't find a match in the cache, use the network.
      return fetch(event.request);
    })()
  );
});
*/
