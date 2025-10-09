import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import loadingReducer from "../slices/loadingSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        loading: loadingReducer
    }
});