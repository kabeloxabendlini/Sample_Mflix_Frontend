import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import MovieDataService from "../services/movies";

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450">
      <rect width="100%" height="100%" fill="#ddd"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="20" fill="#555">No Image</text>
    </svg>
  `);

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState(["All Ratings"]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchRating, setSearchRating] = useState("All Ratings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    retrieveMovies();
    retrieveRatings();
  }, []);

  const retrieveMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await MovieDataService.getAll();
      setMovies(res?.movies?.filter(m => m?._id) || []);
    } catch (e) {
      setError("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  const retrieveRatings = async () => {
    try {
      const res = await MovieDataService.getRatings();
      setRatings(["All Ratings", ...(res || [])]);
    } catch (e) {
      setError("Failed to fetch ratings.");
    }
  };

  const find = async (query, by) => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const res = await MovieDataService.find(query, by);
      setMovies(res?.movies?.filter(m => m?._id) || []);
    } catch (e) {
      setError(`Failed to search movies by ${by}.`);
    } finally {
      setLoading(false);
    }
  };

  const findByTitle = () => find(searchTitle, "title");
  const findByRating = () => {
    searchRating === "All Ratings" ? retrieveMovies() : find(searchRating, "rated");
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <Container>
      <h2 className="mt-4">Movies</h2>

      <Form className="mb-3">
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <Button className="mt-2" onClick={findByTitle} disabled={loading}>
              Search by Title
            </Button>
          </Col>
          <Col>
            <Form.Select value={searchRating} onChange={(e) => setSearchRating(e.target.value)}>
              {ratings.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </Form.Select>
            <Button className="mt-2" onClick={findByRating} disabled={loading}>
              Filter by Rating
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" variant="primary" />}

      <Row>
        {movies.length > 0 ? (
          movies.map(movie => (
            <Col key={movie._id} md={3} className="mb-4">
              <Card className="h-100">
                {/* Image wrapper to control cropping */}
                <div style={{ height: "400px", overflow: "hidden" }}>
                  <Card.Img
                    src={movie.poster && movie.poster.startsWith("http") ? movie.poster : FALLBACK_IMAGE}
                    onError={handleImageError}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>Rating: {movie.rated || "N/A"}</Card.Text>
                  {movie._id ? (
                    <Link to={`/movies/${movie._id}`} className="mt-auto">View Reviews</Link>
                  ) : (
                    <span>No ID</span>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : !loading ? (
          <p>No movies found.</p>
        ) : null}
      </Row>
    </Container>
  );
};

export default MoviesList;