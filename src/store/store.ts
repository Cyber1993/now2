import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { AuthReducer } from "./reducers/AuthReducer.ts";
import { IsLoadingReducer } from "./reducers/IsLoadingState.ts";
import { comparisonReducer } from "./reducers/comparisonReducer .tsx";

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  auth: AuthReducer,
  loading: IsLoadingReducer,
  comparison:comparisonReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});
