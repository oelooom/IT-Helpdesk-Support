import assetActionType from './assetType';
import { checkAsset, removeAsset } from './assetUtils';

const INITIAL_STATE = {
    asset: []
}

const assetReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case assetActionType.ADD_ASSET:
            return {
                ...state,
                asset: checkAsset(state.asset, action.payload)
            }
        case assetActionType.REMOVE_ASSET:
            return {
                ...state,
                asset: removeAsset(state.asset, action.payload)
            }

        default:
            return state;
    }
}

export default assetReducer;