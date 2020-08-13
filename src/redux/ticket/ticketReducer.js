import ticketActionType from './ticketType';
import { checkTicket, removeTicket } from './ticketUtils';

const INITIAL_STATE = {
    ticket: [],
    commentary: [],
    selectedTicket: null
}

const ticketReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ticketActionType.ADD_TICKET:
            return {
                ...state,
                ticket: checkTicket(state.ticket, action.payload)
            }
        case ticketActionType.REMOVE_TICKET:
            return {
                ...state,
                ticket: removeTicket(state.ticket, action.payload)
            }
        case ticketActionType.ADD_SELECTED_TICKET:
            return {
                ...state,
                selectedTicket: action.payload
            }
        case ticketActionType.ADD_COMMENTARY:
            return {
                ...state,
                commentary: checkTicket(state.commentary, action.payload)
            }
        default:
            return state;
    }
}

export default ticketReducer;