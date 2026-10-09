import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: "auth",

    initialState: {
        loading: false,
        error: null,
        message: null,
        user: null,
        isAuthenticated: false,
    },

    reducers: {
        registerRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        registerSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        registerFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        otpVerificationRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        otpVerificationSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },

        otpVerificationFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loginRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loginFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logoutRequest(state) {
            state.loading = true;
            state.message = null;
            state.error = null;
        },
        logoutSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        logoutFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },
        getUserRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        getUserSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        getUserFailed(state, action) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        forgotPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        forgotPasswordFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        resetPasswordFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updatePasswordRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        updatePasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        updatePasswordFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetAuthSlice(state) {
            state.loading = false;
            state.message = null;
            state.error = null;
        },
    },
});


const getErrorMessage = (error) => {
    return (
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
    );
};

export const resetAuthSlice = () => (dispatch) => {
    dispatch(authSlice.actions.resetAuthSlice());
};

export const register = (data) => async (dispatch) => {
    dispatch(authSlice.actions.registerRequest());
    try {
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/register",
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch(
            authSlice.actions.registerSuccess(res.data)
        );

    } catch (error) {
        dispatch(
            authSlice.actions.registerFailed(
                getErrorMessage(error)
            )
        );
    }
};

export const otpVerification = (email, otp) => async (dispatch) => {
    dispatch(authSlice.actions.otpVerificationRequest());

    try {
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/verify-otp",
            {
                email,
                otp,
            },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch(
            authSlice.actions.otpVerificationSuccess(res.data)
        );

    } catch (error) {
        dispatch(
            authSlice.actions.otpVerificationFailed(
                getErrorMessage(error)
            )
        );
    }
};

export const login = (data) => async (dispatch) => {
    dispatch(authSlice.actions.loginRequest());

    try {
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/login",
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch(
            authSlice.actions.loginSuccess(res.data)
        );

    } catch (error) {
        dispatch(
            authSlice.actions.loginFailed(
                getErrorMessage(error)
            )
        );
    }
};

export const logout = () => async (dispatch) => {
    dispatch(authSlice.actions.logoutRequest());

    try {
        const res = await axios.get(
            "http://localhost:4000/api/v1/auth/logout",
            {
                withCredentials: true,
            }
        );

        dispatch(
            authSlice.actions.logoutSuccess(res.data)
        );

    } catch (error) {
        dispatch(
            authSlice.actions.logoutFailed(
                getErrorMessage(error)
            )
        );
    }
};

export const getUser = () => async (dispatch) => {
    dispatch(authSlice.actions.getUserRequest());

    try {
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/me",
            {},
            {
                withCredentials: true,
            }
        );

        dispatch(
            authSlice.actions.getUserSuccess(res.data)
        );

    } catch (error) {
        dispatch(
            authSlice.actions.getUserFailed(
                getErrorMessage(error)
            )
        );
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    dispatch(authSlice.actions.forgotPasswordRequest());

    try {
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/password/forgot",
            {
                email,
            },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch(
            authSlice.actions.forgotPasswordSuccess(res.data)
        );

    } catch (error) {
        dispatch(
            authSlice.actions.forgotPasswordFailed(
                getErrorMessage(error)
            )
        );
    }
};

export const resetPassword = (data, token) => async (dispatch) => {
    dispatch(authSlice.actions.resetPasswordRequest());

    try {
        const res = await axios.put(
            `http://localhost:4000/api/v1/auth/password/reset/${token}`,
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch(
            authSlice.actions.resetPasswordSuccess(res.data)
        );

    } catch (error) {
        dispatch(
            authSlice.actions.resetPasswordFailed(
                getErrorMessage(error)
            )
        );
    }
};

export const updatePassword = (data) => async (dispatch) => {
    dispatch(authSlice.actions.updatePasswordRequest());

    try {
        const res = await axios.put(
            "http://localhost:4000/api/v1/auth/password/update",
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        dispatch(
            authSlice.actions.updatePasswordSuccess(res.data)
        );

    } catch (error) {
        dispatch(
            authSlice.actions.updatePasswordFailed(
                getErrorMessage(error)
            )
        );
    }
};


export default authSlice.reducer;