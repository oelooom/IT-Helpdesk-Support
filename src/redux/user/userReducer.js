import userActionType from './userType';
import { checkUser, removeUser } from './userUtils';

const INITIAL_STATE = {
    currentUser: null,
    support: [],
    user: []
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case userActionType.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        case userActionType.ADD_SUPPORT:
            return {
                ...state,
                support: checkUser(state.support, action.payload)
            }
        case userActionType.REMOVE_SUPPORT:
            return {
                ...state,
                support: removeUser(state.support, action.payload)
            }
        case userActionType.ADD_USER:
            return {
                ...state,
                user: checkUser(state.user, action.payload)
            }
        case userActionType.REMOVE_USER:
            return {
                ...state,
                user: removeUser(state.user, action.payload)
            }
        default:
            return state;
    }
}

export default userReducer;