import { firestore } from '../firebase';

export const createAsset = async data => {
    console.log(data);
    const assetRef = firestore.collection('assets');

    const created = new Date();


    try {
        await assetRef.add({
            displayName: data.displayName,
            quantity: data.quantity,
            created: created
        })
    } catch (e) {
        alert(e.message)
    }
}