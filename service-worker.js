// sw.js
self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.text() : 'No payload';
  event.waitUntil(
    self.registration.showNotification('Game Notification', {
      body: payload,
    })
  );
});