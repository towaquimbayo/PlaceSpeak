import { SET_USER, CLEAR_SESSION } from "../Types";

export const setUser =
  (isLoggedIn, user_id, firstName, lastName, city, province) => (dispatch) => {
    dispatch({
      type: SET_USER,
      payload: { isLoggedIn, user_id, firstName, lastName, city, province },
    });
  };

export const clearSession = () => (dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
