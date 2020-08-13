import assetActionType from './assetType';


export const addAsset = asset => ({
    type: assetActionType.ADD_ASSET,
    payload: asset
})

export const removeAsset = asset => ({
    type: assetActionType.REMOVE_ASSET,
    payload: asset
})
