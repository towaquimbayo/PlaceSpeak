import { SET_USER, SET_USER_LOCATION, CLEAR_SESSION } from "../Types";

export const setUser =
  (isLoggedIn, user_id, firstName, lastName, city, province, pfp_link) =>
  (dispatch) => {
    dispatch({
      type: SET_USER,
      payload: {
        isLoggedIn,
        user_id,
        firstName,
        lastName,
        city,
        province,
        pfp_link,
      },
    });
  };

export const setUserLocation = (city, province) => (dispatch) => {
  dispatch({
    type: SET_USER_LOCATION,
    payload: { city, province },
  });
};

export const clearSession = () => (dispatch) => {
  dispatch({
    type: CLEAR_SESSION,
  });
};
