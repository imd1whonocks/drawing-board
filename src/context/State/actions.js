import actionTypes from './types';

export function increment(payload) {
    return {
        type: actionTypes.INCREMENT,
        payload,
    }
}