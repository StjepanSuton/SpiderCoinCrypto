import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
const storage = localStorage.getItem("watchList-coinSpider");
const initialState: string[] = storage === null ? [] : JSON.parse(storage);

export const coinSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {
    addCoinToWatchList: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existingItem = state.find((item) => item === id);
      if (existingItem) {
        localStorage.setItem(
          "watchList-coinSpider",
          JSON.stringify(state.filter((item) => item !== id))
        );
        return state.filter((item) => item !== id);
      } else {
        localStorage.setItem(
          "watchList-coinSpider",
          JSON.stringify([...state, id])
        );
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
