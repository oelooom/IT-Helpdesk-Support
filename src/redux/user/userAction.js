import userActionType from './userType';

export const setCurrentUser = user => ({
    type: userActionType.SET_CURRENT_USER,
    payload: user
})

export const addSupport = support => ({
    type: userActionType.ADD_SUPPORT,
    payload: support
})

export const removeSupport = support => ({
    type: userActionType.REMOVE_SUPPORT,
    payload: support
})

export const addUser = user => ({
    type: userActionType.ADD_USER,
    payload: user
})

export const removeUser = user => ({
    type: userActionType.REMOVE_USER,
    payload: user
})