import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDndUwZTHP5cyPIDH44hSed_1JdBFUOU0k",
    authDomain: "it-helpdesk-support.firebaseapp.com",
    databaseURL: "https://it-helpdesk-support.firebaseio.com",
    projectId: "it-helpdesk-support",
    storageBucket: "it-helpdesk-support.appspot.com",
    messagingSenderId: "609381797452",
    appId: "1:609381797452:web:107de62ae9fb2b9a232ee9",
    measurementId: "G-J08W3H0GTT"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export default firebase;
