import { SET_USER, SET_USER_LOCATION, CLEAR_SESSION } from "../Types";

export const initialState = {
  isLoggedIn: false,
  user_id: "",
  firstName: "",
  lastName: "",
  city: "",
  province: "",
  pfp_link: "",
};

export default function UserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user_id: action.payload.user_id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        city: action.payload.city,
        province: action.payload.province,
        pfp_link: action.payload.pfp_link,
      };
    case SET_USER_LOCATION:
      return {
        ...state,
        city: action.payload.city,
        province: action.payload.province,
      };
    case CLEAR_SESSION:
      return initialState;
    default:
      return state;
  }
}
