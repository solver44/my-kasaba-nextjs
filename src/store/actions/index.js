export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const SHOW_LOADING = "SHOW_LOADING";
export const CACHES = "CACHES";
export const IS_MEMBER = "IS_MEMBER";
export const BKUT_DATA = "BKUT_DATA";

const loginSuccess = () => {
  return {
    type: LOGIN_SUCCESS,
  };
};

const loginFailure = () => {
  return {
    type: LOGIN_FAILURE,
  };
};

const showLoading = (payload) => {
  return {
    type: SHOW_LOADING,
    payload,
  };
};

const caches = (payload) => {
  return {
    type: CACHES,
    payload,
  };
};

const isMember = (payload) => {
  return {
    type: IS_MEMBER,
    payload,
  };
};

const bkutData = (payload) => {
  return {
    type: BKUT_DATA,
    payload,
  };
};

export default {
  showLoading,
  loginFailure,
  loginSuccess,
  caches,
  isMember,
  bkutData,
};
