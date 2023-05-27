export const ar_loginUser = (details) => {
    return {
        type: "AR_LOGIN_USER",
        payload: details,
    };
};

export const ar_logoutUser = () => {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("LoginStatus");
    return {
        type: "AR_LOGOUT_USER",
    };
};
