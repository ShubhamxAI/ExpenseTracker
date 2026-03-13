import { configureStore } from '@reduxjs/toolkit';

import starterReducer from '../features/starter/starterSlice';

const store = configureStore({
  reducer: {
    starter: starterReducer,
  },
});

export { store };
