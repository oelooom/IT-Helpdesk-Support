import instructionActionType from './instructionType';


export const addInstruction = instruction => ({
    type: instructionActionType.ADD_INSTRUCTION,
    payload: instruction
})

export const removeInstruction = instruction => ({
    type: instructionActionType.REMOVE_INSTRUCTION,
    payload: instruction
})
