import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const requestNotificationPermission = async () => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers are not supported in this browser");
    return null;
  }

  if (!("Notification" in window)) {
    console.error("Notifications are not supported in this browser");
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const registration = await navigator.serviceWorker.register(
    `${import.meta.env.BASE_URL}firebase-messaging-sw.js`
  );

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  return token;
};

//"BNrfIXtnT1-UmJeVHDgkcvse2Ua9WoDjx8uJubhz9-zmdaK7qfjyTNuHXqsZWqJ66z01y6DIBNw9cNumNO6C0ZM",
