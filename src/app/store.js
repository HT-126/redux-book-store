import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../features/books/booksSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
    favorites: favoritesReducer,
  },
});
