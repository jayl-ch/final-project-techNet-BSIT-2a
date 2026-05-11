import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import {
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(
  ({ url }) => url.pathname.startsWith("/api"),
  new NetworkOnly(),
);

registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages",
    networkTimeoutSeconds: 3,
  }),
);

registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker",
  new StaleWhileRevalidate({
    cacheName: "assets",
  }),
);

registerRoute(
  ({ request }) =>
    request.destination === "image" || request.destination === "font",
  new StaleWhileRevalidate({
    cacheName: "assets",
  }),
);

setCatchHandler(async ({ event }) => {
  if (event.request && event.request.mode === "navigate") {
    return caches.match("/offline.html", { ignoreSearch: true });
  }

  return Response.error();
});
