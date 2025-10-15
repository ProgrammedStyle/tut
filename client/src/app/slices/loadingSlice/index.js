import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        show: false
    },
    reducers: {
        showLoading: (state) => {
            state.show = true;
        },
        hideLoading: (state) => {
            state.show = false;
        }
    }
});

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;