// redux/ownedGigsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiConnector } from "../services/apiConnector";
import { ORDER_API } from "../services/apis";
import toast from "react-hot-toast";

// ✅ Async thunk to fetch owned gigs
export const fetchOwnedGigs = createAsyncThunk(
  "ownedGigs/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiConnector("GET", ORDER_API.MY_ORDERS);
      const ownedGigs = response?.orders?.map((order) => order.gigId) || [];
      return ownedGigs;
    } catch (error) {
      toast.error("Failed to load owned gigs");
      return rejectWithValue(error.message);
    }
  }
);

const ownedGigsSlice = createSlice({
  name: "ownedGigs",
  initialState: {
    gigs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOwnedGigs: (state) => {
      state.gigs = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnedGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnedGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchOwnedGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOwnedGigs } = ownedGigsSlice.actions;
export default ownedGigsSlice.reducer;
