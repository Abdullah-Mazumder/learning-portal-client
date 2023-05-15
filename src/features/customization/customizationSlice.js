import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentVideo: null,
  pageUrl: "",
};

const customizationSlice = createSlice({
  name: "customization",
  initialState,
  reducers: {
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },

    setPageUrl: (state, action) => {
      state.pageUrl = action.payload;
    },
  },
});

export const { setCurrentVideo, setPageUrl } = customizationSlice.actions;
export default customizationSlice.reducer;
