import { firestore } from '../firebase';

export const createUser = async (userAuth, additionalData) => {

    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();

    if (!snapShot.exists) {

        const { email } = userAuth;

        try {
            await userRef.set({
                email: email,
                isUser: true,
                isSupport: false,
                isHead: false,
                ...additionalData
            })
        } catch (error) {
            console.error(error)
        }
    }

    return userRef;
}