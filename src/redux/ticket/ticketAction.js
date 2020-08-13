import ticketActionType from './ticketType';

export const addTicket = ticket => ({
    type: ticketActionType.ADD_TICKET,
    payload: ticket
})


export const removeTicket = ticket => ({
    type: ticketActionType.REMOVE_TICKET,
    payload: ticket
})

export const addSelectedTicket = ticket => ({
    type: ticketActionType.ADD_SELECTED_TICKET,
    payload: ticket
})

export const addCommentary = commentary => ({
    type: ticketActionType.ADD_COMMENTARY,
    payload: commentary
})