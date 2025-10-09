import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        show: false,
        boundingRect: {
            width: "60%",
            left: "20%",
            top: "30%"
        }
    },
    reducers: {
        showLoading: state => {
            state.show = true;
        },
        hideLoading: state => {
            state.show = false;
        },
        setBoundingRect: (state, payload) => {
            state.boundingRect = { ...payload };
        }
    }
});

export const { show, hide } = loadingSlice.actions;
export default loadingSlice.reducer;