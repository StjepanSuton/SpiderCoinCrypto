import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

export const coinSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {
    addCoinToWatchList: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.find((item) => item === id);
      if (existingItem) {
        return state.filter((item) => item !== id);
      } else {
        return (state = [...state, id]);
      }
    },
  },
});

export const { addCoinToWatchList } = coinSlice.actions;

const store = configureStore({
  reducer: {
    coins: coinSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const selectCoins = (state: RootState) => state;

export default store;
