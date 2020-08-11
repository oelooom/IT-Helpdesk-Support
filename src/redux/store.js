import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './rootReducer';

const midlewares = [logger];

const store = createStore(rootReducer, applyMiddleware(...midlewares));

export default store;