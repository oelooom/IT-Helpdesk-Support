export const checkTicket = (currentData, newData) => {
    const existingTicketItem = currentData.find(
        ticketItem => ticketItem.id === newData.id
    );

    if (existingTicketItem) {
        return currentData.map(data => (
            data.id === newData.id
                ? { ...data, ...newData }
                : data
        ))
    }

    return [...currentData, { ...newData }]
}

export const removeTicket = (currentData, newData) => {
    const existingData = currentData.find(
        data => data.id === newData.id
    )

    if (existingData) {
        return currentData.filter(data => data.id !== newData.id)
    }
}