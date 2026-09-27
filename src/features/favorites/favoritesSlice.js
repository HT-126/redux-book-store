import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apiService";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/favorites");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (book, { rejectWithValue }) => {
    try {
      const response = await api.post("/favorites", book);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (bookId, { rejectWithValue }) => {
    try {
      await api.delete(`/favorites/${bookId}`);
      return bookId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    status: "idle",
    mutationStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(addFavorite.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const exists = state.items.some((book) => book.id === action.payload.id);
        if (!exists) state.items.push(action.payload);
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(removeFavorite.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items = state.items.filter((book) => book.id !== action.payload);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesStatus = (state) => state.favorites.status;
export const selectFavoriteMutationStatus = (state) =>
  state.favorites.mutationStatus;

export default favoritesSlice.reducer;
