import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string = "";

export const linkSlice = createSlice({
  name: "link",
  initialState,
  reducers: {
    addLink: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

export const { addLink } = linkSlice.actions;

const store = configureStore({
  reducer: {
    links: linkSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

export const selectLinks = (state: RootState) => state;

export default store;
