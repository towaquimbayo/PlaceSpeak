import { SET_USER, CLEAR_SESSION } from "../Types";

export const setUser = (isLoggedIn) => (dispatch) => {
    dispatch({
        type: SET_USER,
        payload: isLoggedIn,
    });
};

export const clearSession = () => (dispatch) => {
    dispatch({
        type: CLEAR_SESSION,
    });
};