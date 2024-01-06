import { localStorage } from "@/utils/window";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SHOW_LOADING,
  CACHES,
  IS_MEMBER,
  BKUT_DATA,
  SETTINGS,
  DATA_LOADING,
  UPDATE_DATA,
  IS_ORGANIZATION,
} from "./actions";

const initialState = {
  isLoggedIn: !!localStorage.getItem("token") || false,
  showLoading: false,
  dataLoading: false,
  updateData: 0,
  isMember: false,
  isOrganization: false,
  caches: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
      };
    case SHOW_LOADING:
      return {
        ...state,
        showLoading: action.payload,
      };
    case CACHES:
      return {
        ...state,
        caches: action.payload,
      };
    case IS_MEMBER:
      return {
        ...state,
        isMember: action.payload,
      };
    case BKUT_DATA:
      return {
        ...state,
        bkutData: action.payload,
      };
    case SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
    case DATA_LOADING:
      return {
        ...state,
        dataLoading: action.payload,
      };
    case UPDATE_DATA:
      return {
        ...state,
        updateData: state.updateData + action.payload,
      };
    case IS_ORGANIZATION:
      return {
        ...state,
        isOrganization: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
