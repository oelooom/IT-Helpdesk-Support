import { combineReducers } from 'redux';
import userReducer from './user/userReducer';
import ticketReducer from './ticket/ticketReducer';
import assetReducer from './asset/assetReducer';
import instructionReducer from './instruction/instructionReducer';

const rootReducer = combineReducers({
    user: userReducer,
    ticket: ticketReducer,
    asset: assetReducer,
    instruction: instructionReducer
})

export default rootReducer;