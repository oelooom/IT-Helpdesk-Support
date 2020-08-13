import { combineReducers } from 'redux';
import userReducer from './user/userReducer';
import ticketReducer from './ticket/ticketReducer';
import assetReducer from './asset/assetReducer';

const rootReducer = combineReducers({
    user: userReducer,
    ticket: ticketReducer,
    asset: assetReducer
})

export default rootReducer;