import {
    initializeApp
} from "firebase/app";

import {
    getAnalytics
} from "firebase/analytics";

import {
    getAuth
} from "firebase/auth";

import {
    getFirestore
} from "firebase/firestore";

import {
    getStorage
} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

    apiKey: "AIzaSyDhDAfH_IdqreANS6peUW42uxXK4hP-vN4",

    authDomain: "family-recipes-eef0c.firebaseapp.com",

    projectId: "family-recipes-eef0c",

    storageBucket: "family-recipes-eef0c.appspot.com",

    messagingSenderId: "610391016480",

    appId: "1:610391016480:web:3c6df1cdf90a5304d9e845",

    measurementId: "G-1QLMVBQ9LX"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("initialezed firebase");
export default app;