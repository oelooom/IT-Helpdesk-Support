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
    } else if (data.category === 'Asset Lending') {
        additionalData = {
            isLending: true
        }
    }
    else {
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
            supportData: null,
            userId: data.userId,
            isLending: false,
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

    const ticketRef = firestore.collection(`ticket`).doc(data.ticketId).collection('commentary');

    const created = new Date();

    try {
        await ticketRef.add({
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

    return ticketRef;
}

export const assignTicket = async (data) => {
    const ticketRef = firestore.collection('ticket').doc(data.ticketId);

    try {
        await ticketRef.update({
            supportId: data.supportId,
            status: '2',
            supportData: { displayName: data.displayName }
        })
    } catch (e) {
        alert(e.message)
    }

    return ticketRef;
}

export const confirmLending = async (data) => {
    const ticketRef = firestore.collection('ticket').doc(data.ticketId);

    const dataNew = data.status.toString();

    try {
        await ticketRef.update({
            status: dataNew,
        })
    } catch (e) {
        alert(e.message)
    }

    return ticketRef;
}

export const returnLending = async (data) => {

    const ticketRef = firestore.collection('ticket').doc(data);

    try {
        await ticketRef.update({
            status: '6',
        })
    } catch (e) {
        alert(e.message)
    }

    return ticketRef;
}

export const updateStatus = async data => {
    console.log(data);
    const ticketRef = firestore.collection('ticket').doc(data.ticketId);
    const status = data.status.toString();

    try {
        await ticketRef.update({
            status: status
        })
    } catch (e) {
        alert(e.message)
    }
}