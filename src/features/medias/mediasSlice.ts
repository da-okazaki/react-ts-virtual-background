import { createSlice } from '@reduxjs/toolkit';

export interface MediaState {
  virtualBgType: string;
  virtualBgImage: string;
  selectedId: string;
}

const initialState: MediaState = {
  virtualBgType: 'none',
  virtualBgImage: '',
  selectedId: '',
};

export const mediasSlice = createSlice({
  name: 'medias',
  initialState,
  reducers: {
    onClickToggleModeClear: (state) => {
      state.virtualBgType = 'none';
    },

    onClickToggleVirtualBokehMode: (state) => {
      state.virtualBgType = 'bokeh';
    },

    onClickToggleVirtualImageMode: (state, action) => {
      state.virtualBgType = 'image';
      state.virtualBgImage = action.payload;
    },

    onClickSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onClickToggleModeClear,
  onClickToggleVirtualBokehMode,
  onClickToggleVirtualImageMode,
  onClickSelectedId,
} = mediasSlice.actions;

export default mediasSlice.reducer;
