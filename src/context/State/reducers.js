import actionTypes from './types';

export const initialState = {
    count: 0,
}
const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.INCREMENT:
            return state.count++;
        default:
            return state;
    }
}
export default reducer;