import { SET_USER, CLEAR_SESSION } from "../Types";

export const setUser = (isLoggedIn, user_id) => (dispatch) => {
    dispatch({
        type: SET_USER,
        payload: { isLoggedIn, user_id },
    });
};

export const clearSession = () => (dispatch) => {
    dispatch({
        type: CLEAR_SESSION,
    });
};