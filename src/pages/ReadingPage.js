import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import {
  fetchFavorites,
  removeFavorite,
  selectFavorites,
  selectFavoritesStatus,
} from "../features/favorites/favoritesSlice";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const ReadingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const books = useSelector(selectFavorites);
  const status = useSelector(selectFavoritesStatus);

  useEffect(() => {
    dispatch(fetchFavorites())
      .unwrap()
      .catch((error) => toast.error(error));
  }, [dispatch]);

  const handleRemoveBook = async (event, bookId) => {
    event.stopPropagation();
    try {
      await dispatch(removeFavorite(bookId)).unwrap();
      toast.success("The book has been removed");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h3" sx={{ textAlign: "center" }} m={3}>
        Book Store
      </Typography>
      {status === "loading" ? (
        <Box sx={{ textAlign: "center", color: "primary.main" }}>
          <ClipLoader color="inherit" size={150} loading />
        </Box>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-around"
          flexWrap="wrap"
        >
          {books.map((book) => (
            <Card
              key={book.id}
              sx={{ width: "12rem", height: "27rem", marginBottom: "2rem" }}
            >
              <CardActionArea onClick={() => navigate(`/books/${book.id}`)}>
                <CardMedia
                  component="img"
                  image={`${BACKEND_API}/${book.imageLink}`}
                  alt={book.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {book.title}
                  </Typography>
                  <Typography gutterBottom variant="body1" component="div">
                    {book.author}
                  </Typography>
                  <Button
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "secondary.light",
                      color: "secondary.contrastText",
                      padding: 0,
                      minWidth: "1.5rem",
                    }}
                    size="small"
                    onClick={(event) => handleRemoveBook(event, book.id)}
                  >
                    &times;
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ReadingPage;
