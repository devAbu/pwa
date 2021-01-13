if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((req) => console.log("sw registered ", req))
    .catch((err) => console.log("sw register err: ", err));
}
