import userActionType from './userType';

export const setCurrentUser = user => ({
    type: userActionType.SET_CURRENT_USER,
    payload: user
})