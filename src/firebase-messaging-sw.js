
//FIREBASE PUSH OK*

// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here, other Firebase libraries
// // are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// firebase.initializeApp({
//   'messagingSenderId': '275347847684'
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();




//  ALTERNATIVE

importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');



var config = {
  apiKey: "AIzaSyBC9L-KXNevyYZnoIOCBhH6XsxaZhJxldk",
  authDomain: "snapside-push-a677e.firebaseapp.com",
  databaseURL: "https://snapside-push-a677e.firebaseio.com",
  projectId: "snapside-push-a677e",
  storageBucket: "snapside-push-a677e.appspot.com",
  messagingSenderId: "222097974773",
  appId: "1:222097974773:web:20ce9bb12f4467e15c2cbc",
  measurementId: "G-S40ZMWK97Y"
     };
 firebase.initializeApp(config);
 const messaging = firebase.messaging();

