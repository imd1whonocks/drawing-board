import actionTypes from './types';

export function setTool(payload) {
    return {
        type: actionTypes.SET_TOOL,
        payload,
    }
}
export function setColor(payload) {
    return {
        type: actionTypes.SET_COLOR,
        payload,
    }
}
export function setStrokeWidth(payload) {
    return {
        type: actionTypes.SET_STROKE_WIDTH,
        payload,
    }
}