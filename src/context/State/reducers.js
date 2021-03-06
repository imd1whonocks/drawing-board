import { TOOLS } from '../../constants';
import actionTypes from './types';

export const initialState = {
    selectedTool: TOOLS.PEN,
    selectedColor: '#e66465', 
    selectedStrokeWidth: '1', 
}
const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_TOOL: {
            const { payload } = action;
            return {
                ...state,
                selectedTool: payload
            };
        }
        case actionTypes.SET_COLOR: {
            const { payload } = action;
            return {
                ...state,
                selectedColor: payload
            };
        }
        case actionTypes.SET_STROKE_WIDTH: {
            const { payload } = action;
            return {
                ...state,
                selectedStrokeWidth: payload
            };
        }
        default:
            return state;
    }
}
export default reducer;