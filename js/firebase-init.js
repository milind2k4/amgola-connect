import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';


const firebaseConfig = {
    apiKey: "AIzaSyBnGB8rgZlW3ww4uwGFxSITUPfX9xztuYE",
    authDomain: "aamgola-connect-bce30.firebaseapp.com",
    projectId: "aamgola-connect-bce30",
    storageBucket: "aamgola-connect-bce30.firebasestorage.app",
    messagingSenderId: "285945818361",
    appId: "1:285945818361:web:cb765b5de59f24a614c628",
    measurementId: "G-KQ8G13RSR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
