import instructionActionType from './instructionType';
import { checkInstruction, removeInstruction } from './instructionUtils';

const INITIAL_STATE = {
    instruction: []
}

const instructionReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case instructionActionType.ADD_INSTRUCTION:
            return {
                ...state,
                instruction: checkInstruction(state.instruction, action.payload)
            }
        case instructionActionType.REMOVE_INSTRUCTION:
            return {
                ...state,
                instruction: removeInstruction(state.instruction, action.payload)
            }

        default:
            return state;
    }
}

export default instructionReducer;