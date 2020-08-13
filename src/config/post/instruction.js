import { firestore } from '../firebase';

export const createIntsruction = async data => {
    console.log(data);
    const instructionRef = firestore.collection('instructions');

    const created = new Date();

    try {
        await instructionRef.add({
            keyword: data.keyword,
            file: data.file,
            created: created
        })
    } catch (e) {
        alert(e.message)
    }
}