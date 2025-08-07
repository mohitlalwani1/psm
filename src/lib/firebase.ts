@@ .. @@
 // Your web app's Firebase configuration
 const firebaseConfig = {
-  apiKey: "AIzaSyC3OcArDhpH8VkVhZEwFhfAvII7QR0UmLE",
-  authDomain: "psm1-2103f.firebaseapp.com",
-  projectId: "psm1-2103f",
-  storageBucket: "psm1-2103f.firebasestorage.app",
-  messagingSenderId: "548676111701",
-  appId: "1:548676111701:web:6e547f8093af5122ca33dc",
+  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
+  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
+  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
+  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
+  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
+  appId: import.meta.env.VITE_FIREBASE_APP_ID,
 };