import { combineReducers } from '@reduxjs/toolkit';
import mediasSlice from '../features/medias/mediasSlice';

const rootReducer = combineReducers({
  medias: mediasSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
