import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apiService";

const BOOKS_PER_PAGE = 10;

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({ page, query }, { rejectWithValue }) => {
    try {
      const response = await api.get("/books", {
        params: {
          _page: page,
          _limit: BOOKS_PER_PAGE,
          ...(query ? { q: query } : {}),
        },
      });

      return {
        books: response.data,
        totalCount:
          Number(response.headers["x-total-count"]) || response.data.length,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  selectedBook: null,
  page: 1,
  query: "",
  totalCount: 0,
  listStatus: "idle",
  detailStatus: "idle",
  listError: null,
  detailError: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    pageChanged(state, action) {
      state.page = action.payload;
    },
    queryChanged(state, action) {
      state.query = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload.books;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || action.error.message;
      })
      .addCase(fetchBookById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.selectedBook = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || action.error.message;
      });
  },
});

export const { pageChanged, queryChanged } = booksSlice.actions;

export const selectBooks = (state) => state.books.items;
export const selectSelectedBook = (state) => state.books.selectedBook;
export const selectBooksPage = (state) => state.books.page;
export const selectBooksQuery = (state) => state.books.query;
export const selectBooksListStatus = (state) => state.books.listStatus;
export const selectBookDetailStatus = (state) => state.books.detailStatus;
export const selectBooksListError = (state) => state.books.listError;
export const selectBookDetailError = (state) => state.books.detailError;
export const selectTotalPages = (state) =>
  Math.max(1, Math.ceil(state.books.totalCount / BOOKS_PER_PAGE));

export default booksSlice.reducer;
