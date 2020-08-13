import userActionType from './userType';
import { checkUser, removeUser } from './userUtils';

const INITIAL_STATE = {
    currentUser: null,
    support: []
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
        default:
            return state;
    }
}

export default userReducer;