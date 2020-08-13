export const checkAsset = (currentData, newData) => {
    const existingData = currentData.find(
        items => items.id === newData.id
    );

    if (existingData) {
        return currentData.map(data => (
            data.id === newData.id
                ? { ...data, ...newData }
                : data
        ))
    }

    return [...currentData, { ...newData }]
}

export const removeAsset = (currentData, newData) => {
    const existingData = currentData.find(
        data => data.id === newData.id
    )

    if (existingData) {
        return currentData.filter(data => data.id !== newData.id)
    }
}