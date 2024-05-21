import { SET_USER, CLEAR_SESSION } from "../Types";

export const setUser =
  (isLoggedIn, user_id, firstName, lastName, city, province, pfp_link) => (dispatch) => {
    dispatch({
      type: SET_USER,
      payload: { isLoggedIn, user_id, firstName, lastName, city, province, pfp_link },
    });
  };

export const clearSession = () => (dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
