import React, { useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDndUwZTHP5cyPIDH44hSed_1JdBFUOU0k",
    authDomain: "it-helpdesk-support.firebaseapp.com",
    databaseURL: "https://it-helpdesk-support.firebaseio.com",
    projectId: "it-helpdesk-support",
    storageBucket: "it-helpdesk-support.appspot.com",
    messagingSenderId: "609381797452",
    appId: "1:609381797452:web:107de62ae9fb2b9a232ee9",
    measurementId: "G-J08W3H0GTT"
}

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

const FirebaseContext = React.createContext();

export function useFirebase() {
    return useContext(FirebaseContext)
}

function FirebaseProvider(props) {

    const [user, loading, error] = useAuthState(auth);

    return (
        <FirebaseContext.Provider value={{
            auth,
            firestore,
            storage,
            user,
            loading,
            error
        }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}

export default FirebaseProvider; 