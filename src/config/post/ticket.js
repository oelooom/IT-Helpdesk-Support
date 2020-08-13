import { firestore } from '../firebase';

export const createTicket = async data => {



    const userRef = firestore.collection(`ticket`);
    let additionalData;

    if (data.category === 'Copy Data') {
        additionalData = {
            source: data.source,
            destinantion: data.dest
        }
    } else if (data.category === 'Software Install' || data.category === 'Software Install') {
        additionalData = {
            software: data.software,
            ip: data.ip
        }
    } else if (data.category === 'Printer Repair') {
        additionalData = {
            printer: data.printer,
            ip: data.ip
        }
    } else {
        additionalData = {
            ip: data.ip
        }
    }

    const created = new Date();

    try {
        await userRef.add({
            title: data.title,
            category: data.category,
            detail: data.detail,
            status: data.status,
            supportId: null,
            userId: data.userId,
            created: created,
            userdata: data.userdata,
            ...additionalData
        })
    } catch (error) {
        console.error(error)
    }

    return userRef;
}

export const createCommentary = async data => {



    const userRef = firestore.collection(`ticket`).doc(data.ticketId).collection('commentary');

    const created = new Date();

    try {
        await userRef.add({
            ticketId: data.ticketId,
            userId: data.userId,
            displayName: data.displayName,
            created: created,
            photoUrl: data.photoUrl,
            commentary: data.commentary
        })
    } catch (error) {
        console.error(error)
    }

    return userRef;
}

