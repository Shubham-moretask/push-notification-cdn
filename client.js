
console.log("client.js -----> I am")

const publicVapidKey = "BGdKZpLftO5LfmAIXGiYccQO9APYFJqMwn-42WgtATEBV7kuT2fUIyL8Ugv3oKbEZt21d7KTeUxog9dTqR9CKe4";

// Check for service worker support
if ('serviceWorker' in navigator) {
  // Register service worker dynamically
  console.log("first run ")
  
  registerServiceWorker().catch(err => console.error(err));
}

async function registerServiceWorker() {
  try {
    console.log('Registering Service Worker...');
    const registration = await navigator.serviceWorker.register('https://cdn.jsdelivr.net/gh/Shubham-moretask/push-notification-cdn/worker.js');
    console.log('Service Worker Registered:', registration);

    // Register for push notifications
    await registerPush(registration);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

async function registerPush(registration) {
  try {
    console.log('Registering for Push Notifications...');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log('Push Registration Successful:', subscription);

    // Send subscription details to server
    await sendSubscriptionToServer(subscription);
  } catch (error) {
    console.error('Push registration failed:', error);
  }
}

async function sendSubscriptionToServer(subscription) {
  try {
    console.log('Sending Push Subscription to Server...');
    await fetch('https://pushnotification-ktxn.onrender.com/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Push Subscription sent successfully.');
  } catch (error) {
    console.error('Error sending push subscription to server:', error);
  }
}

// Helper function to convert VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
