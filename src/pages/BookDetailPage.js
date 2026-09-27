import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  fetchBookById,
  selectBookDetailError,
  selectBookDetailStatus,
  selectSelectedBook,
} from "../features/books/booksSlice";
import {
  addFavorite,
  selectFavoriteMutationStatus,
} from "../features/favorites/favoritesSlice";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const BookDetailPage = () => {
  const dispatch = useDispatch();
  const { id: bookId } = useParams();
  const book = useSelector(selectSelectedBook);
  const status = useSelector(selectBookDetailStatus);
  const error = useSelector(selectBookDetailError);
  const mutationStatus = useSelector(selectFavoriteMutationStatus);

  useEffect(() => {
    dispatch(fetchBookById(bookId));
  }, [bookId, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleAddToReadingList = async () => {
    try {
      await dispatch(addFavorite(book)).unwrap();
      toast.success("The book has been added to the reading list!");
    } catch (requestError) {
      toast.error(requestError);
    }
  };

  if (status === "loading") {
    return (
      <Box sx={{ textAlign: "center", color: "primary.main" }}>
        <ClipLoader color="inherit" size={150} loading />
      </Box>
    );
  }

  return (
    <Container>
      {book && (
        <Grid
          container
          spacing={2}
          p={4}
          mt={5}
          sx={{ border: "1px solid black" }}
        >
          <Grid item md={4}>
            <img
              width="100%"
              src={`${BACKEND_API}/${book.imageLink}`}
              alt={book.title}
            />
          </Grid>
          <Grid item md={8}>
            <Stack>
              <h2>{book.title}</h2>
              <Typography><strong>Author:</strong> {book.author}</Typography>
              <Typography><strong>Year:</strong> {book.year}</Typography>
              <Typography><strong>Country:</strong> {book.country}</Typography>
              <Typography><strong>Pages:</strong> {book.pages}</Typography>
              <Typography><strong>Language:</strong> {book.language}</Typography>
              <Button
                variant="outlined"
                sx={{ width: "fit-content" }}
                onClick={handleAddToReadingList}
                disabled={mutationStatus === "loading"}
              >
                Add to Reading List
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default BookDetailPage;
