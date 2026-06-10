self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "BlueTrail";
  const options = {
    body: data.body || "You have a new notification.",
    icon: "/logo.png",
    badge: "/logo.png",
    data: {
      url: data.url || "/notifications",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url || "/notifications";

  event.waitUntil(clients.openWindow(url));
});