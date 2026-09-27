import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import PaginationBar from "../components/PaginationBar";
import SearchForm from "../components/SearchForm";
import { FormProvider } from "../form";
import {
  fetchBooks,
  pageChanged,
  queryChanged,
  selectBooks,
  selectBooksListError,
  selectBooksListStatus,
  selectBooksPage,
  selectBooksQuery,
  selectTotalPages,
} from "../features/books/booksSlice";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const books = useSelector(selectBooks);
  const page = useSelector(selectBooksPage);
  const query = useSelector(selectBooksQuery);
  const totalPages = useSelector(selectTotalPages);
  const status = useSelector(selectBooksListStatus);
  const error = useSelector(selectBooksListError);
  const methods = useForm({ defaultValues: { searchQuery: query } });

  useEffect(() => {
    dispatch(fetchBooks({ page, query }));
  }, [dispatch, page, query]);

  const handleSearch = ({ searchQuery }) => {
    dispatch(queryChanged(searchQuery.trim()));
  };

  return (
    <Container>
      <Stack sx={{ display: "flex", alignItems: "center", m: "2rem" }}>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Book Store
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(handleSearch)}
        >
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            mb={2}
          >
            <SearchForm />
          </Stack>
        </FormProvider>
        <PaginationBar
          pageNum={page}
          setPageNum={(nextPage) => dispatch(pageChanged(nextPage))}
          totalPageNum={totalPages}
        />
      </Stack>
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
              onClick={() => navigate(`/books/${book.id}`)}
              sx={{ width: "12rem", height: "27rem", marginBottom: "2rem" }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={`${BACKEND_API}/${book.imageLink}`}
                  alt={book.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {book.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default HomePage;
