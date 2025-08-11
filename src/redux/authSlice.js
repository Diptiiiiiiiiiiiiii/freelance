import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  ownedGigs: [], 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // ❌ No need for localStorage.setItem()
    },
     setOwnedGigs: (state, action) => {
      state.ownedGigs = action.payload; // ✅ store array of gigIds
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.ownedGigs = [];
      // ❌ No need for localStorage.removeItem()
    },
    authError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, loginSuccess, logout, authError, setOwnedGigs } = authSlice.actions;
export default authSlice.reducer;
