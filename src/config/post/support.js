import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const otherConfig = {
    apiKey: "AIzaSyDndUwZTHP5cyPIDH44hSed_1JdBFUOU0k",
    authDomain: "it-helpdesk-support.firebaseapp.com",
    databaseURL: "https://it-helpdesk-support.firebaseio.com",
    projectId: "it-helpdesk-support",
    storageBucket: "it-helpdesk-support.appspot.com",
    messagingSenderId: "609381797452",
    appId: "1:609381797452:web:107de62ae9fb2b9a232ee9",
    measurementId: "G-J08W3H0GTT"
}

const secondaryApp = firebase.initializeApp(otherConfig, "Secondary");
export const auth2 = secondaryApp.auth();
export const firestore2 = secondaryApp.firestore();

export const createSupport = async (userAuth, additionalData) => {

    if (!userAuth) return;

    const userRef = firestore2.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {

        const { email } = userAuth;

        try {
            await userRef.set({
                email: email,
                isUser: false,
                isSupport: true,
                isHead: false,
                ...additionalData
            })
        } catch (error) {
            console.error(error)
        }
    }

    return userRef;
}