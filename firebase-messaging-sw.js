importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCwtmwogAFAGgI7fPZZr6w51YOfrVWmzuE",
  authDomain: "onlineshop-b913b.firebaseapp.com",
  projectId: "onlineshop-b913b",
  messagingSenderId: "964911509840",
  appId: "1:964911509840:web:4c660c1694a7e8e12abc55"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});
