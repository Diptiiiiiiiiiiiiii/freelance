import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

import authReducer from "./authSlice";
import ownedGigsReducer from "./ownedGigsSlice"; // ✅ Add this import

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ownedGigs: ownedGigsReducer, // ✅ Add the new reducer
});

// Persist config (only auth is persisted)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // ✅ Only persist auth, not ownedGigs
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Export store and persistor
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // allow redux-persist to work without warnings
    }),
});

export const persistor = persistStore(store);
