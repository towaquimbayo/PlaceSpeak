import { SET_USER, CLEAR_SESSION } from "../Types";

export const initialState = {
    isLoggedIn: false,
    user_id: "",
};

export default function UserReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn,
                user_id: action.payload.user_id,
            };
        case CLEAR_SESSION:
            return initialState;
        default:
            return state;
    }
}
